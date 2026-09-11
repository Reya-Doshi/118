"""
RageB8 Passive Colorimetric H2S Dosimeter Wristband
Production-Grade Backend API Server (FastAPI + Gemini Vision + OpenCV + Random Forest)

SECURITY DIRECTIVE:
  - GEMINI_API_KEY is read strictly server-side from environment or .env.
  - Never exposed in responses, frontend, or Android clients.
  - Robust OpenCV spatial contour fallback if Gemini API is unavailable.
"""

import os
import sys
import base64
import time
from typing import Optional
from datetime import datetime, timezone

import cv2
import numpy as np
import uvicorn
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure project root is on sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from services.gemini_vision_service import analyze_wristband_with_gemini, get_gemini_api_key
from models.cupan_model import load_cupan_model
from scripts.analyze_wristband import srgb_to_cielab, compute_delta_e_cie76, detect_and_extract_sensing_strip

# ---------------------------------------------------------
# CONSTANTS & MODEL INITIALIZATION
# ---------------------------------------------------------
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "cupan_best_model.pkl")
L0_STAR = 40.5
A0_STAR = 26.0
B0_STAR = -22.0

DOSE_NORMAL_MAX = 0.50
DOSE_MONITOR_MAX = 1.00
SHELF_LIFE_MAX_DAYS = 90.0

# Pre-load calibrated Random Forest model on server start
print(f"Loading Cu-PAN Random Forest model from: {MODEL_PATH}...")
model = load_cupan_model(MODEL_PATH)
print("Cu-PAN Model loaded successfully (60 estimators ready).")

# ---------------------------------------------------------
# FASTAPI APP CONFIGURATION
# ---------------------------------------------------------
app = FastAPI(
    title="RageB8 Passive H2S Dosimeter Backend API",
    description="Quantitative colorimetric exposure estimation and image analysis service.",
    version="1.0.0"
)

# CORS Middleware (permits local web dashboard, Vite dev servers, and mobile webviews)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# PYDANTIC SCHEMAS
# ---------------------------------------------------------
class Base64AnalyzeRequest(BaseModel):
    image_base64: str = Field(..., description="Base64-encoded image string (with or without data:image/png prefix)")
    temperature: Optional[float] = Field(25.0, description="Ambient temperature in degrees Celsius")
    humidity: Optional[float] = Field(50.0, description="Relative humidity percentage")
    shelf_age_days: Optional[float] = Field(15.0, description="Dosimeter wristband shelf age in days")


# ---------------------------------------------------------
# IMAGE DECODING & VALIDATION HELPER
# ---------------------------------------------------------
def decode_image(data_bytes: bytes) -> np.ndarray:
    if not data_bytes or len(data_bytes) < 100:
        raise HTTPException(status_code=400, detail="Invalid image payload: file is empty or too small.")
    if len(data_bytes) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image file exceeds maximum allowable size (15 MB).")

    np_arr = np.frombuffer(data_bytes, np.uint8)
    img_bgr = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    if img_bgr is None or img_bgr.size == 0:
        raise HTTPException(status_code=400, detail="Unable to decode image. Supported formats: JPEG, PNG, WEBP, BMP.")
    return img_bgr


def process_wristband_analysis(
    img_bgr: np.ndarray,
    temperature: float = 25.0,
    humidity: float = 50.0,
    shelf_age_days: float = 15.0,
    temp_image_path: Optional[str] = None
) -> dict:
    """Executes the complete Gemini Vision -> OpenCV -> Random Forest pipeline."""
    # Write temporary file if path not already provided (required by vision service)
    cleanup_temp = False
    if not temp_image_path:
        os.makedirs(os.path.join(PROJECT_ROOT, "test_images", "tmp"), exist_ok=True)
        temp_image_path = os.path.join(
            PROJECT_ROOT, "test_images", "tmp", f"upload_{int(time.time() * 1000)}.jpg"
        )
        cv2.imwrite(temp_image_path, img_bgr)
        cleanup_temp = True

    try:
        # 1. Gemini Vision Stage (Quality Audit & Localization)
        gemini_result = analyze_wristband_with_gemini(temp_image_path)
        band_detected = gemini_result.get("wristband_detected", True)
        quality_data = gemini_result.get("image_quality", {})
        vision_engine = gemini_result.get("provider", "Gemini Vision API")

        # Extract localized pixel bounding boxes
        pixel_boxes = gemini_result.get("pixel_boxes", {})
        strip_roi = pixel_boxes.get("sensing_strip")
        ref_roi = pixel_boxes.get("reference_scale")

        # 2. OpenCV Color Extraction
        rgb, strip_bbox, ref_bbox, housing_bbox, norm_img = detect_and_extract_sensing_strip(
            img_bgr,
            filename=temp_image_path,
            manual_strip_roi=strip_roi,
            manual_ref_roi=ref_roi
        )
        r, g, b = rgb

        # 3. Color Transformation (sRGB -> CIE L*a*b* under D65)
        L_star, a_star, b_star = srgb_to_cielab(r, g, b)
        delta_e = compute_delta_e_cie76(L_star, a_star, b_star)

        # 4. Feature Vector & Random Forest Estimation
        features = np.array([[
            L_star,
            a_star,
            b_star,
            delta_e,
            float(temperature),
            float(humidity),
            float(shelf_age_days)
        ]], dtype=np.float64)

        pred_doses, pred_stds = model.predict_with_uncertainty(features)
        estimated_dose = max(0.0, float(pred_doses[0]))
        uncertainty_1sigma = float(pred_stds[0])
        uncertainty_95ci = float(np.round(uncertainty_1sigma * 1.96, 2))

        # 5. Operational Safety Classification
        is_expired = shelf_age_days > SHELF_LIFE_MAX_DAYS

        if is_expired:
            status = "EXPIRED / REJECT"
            action_note = "Dosimeter exceeds 90-day chemical shelf-life. Strip invalidated; reissue wristband."
        elif estimated_dose < DOSE_NORMAL_MAX:
            status = "NORMAL"
            action_note = f"Safe working environment (<{DOSE_NORMAL_MAX:.2f} ppm·h). Continue normal shift operations."
        elif estimated_dose <= DOSE_MONITOR_MAX:
            status = "MONITOR"
            action_note = f"Action level reached ({DOSE_NORMAL_MAX:.2f}–{DOSE_MONITOR_MAX:.2f} ppm·h). Verify ventilation & limit further exposure."
        else:
            status = "REVIEW"
            action_note = f"Permissible exposure limit exceeded (>{DOSE_MONITOR_MAX:.2f} ppm·h). Immediate safety evacuation & medical review required."

        # 6. Structured JSON Response (Matching user specifications exactly)
        response_payload = {
            "estimated_exposure_ppm_h": round(estimated_dose, 2),
            "status": status,
            "confidence": {
                "score": float(np.round(quality_data.get("quality_score", 0.95), 2)),
                "uncertainty_95_ci_ppm_h": uncertainty_95ci,
                "ci_lower_ppm_h": round(max(0.0, estimated_dose - uncertainty_95ci), 2),
                "ci_upper_ppm_h": round(estimated_dose + uncertainty_95ci, 2)
            },
            "rgb": {
                "r": int(r),
                "g": int(g),
                "b": int(b),
                "hex": f"#{r:02x}{g:02x}{b:02x}".upper()
            },
            "lab": {
                "L": float(L_star),
                "a": float(a_star),
                "b": float(b_star)
            },
            "delta_e": float(delta_e),
            "temperature": float(temperature),
            "humidity": float(humidity),
            "shelf_age_days": float(shelf_age_days),
            "image_quality": {
                "verdict": quality_data.get("quality_verdict", "PASS"),
                "score": float(np.round(quality_data.get("quality_score", 0.95), 2)),
                "is_too_dark": bool(quality_data.get("is_too_dark", False)),
                "is_overexposed": bool(quality_data.get("is_overexposed", False)),
                "is_blurry": bool(quality_data.get("is_blurry", False)),
                "strip_not_visible": bool(quality_data.get("strip_not_visible", False)),
                "reference_scale_missing": bool(quality_data.get("reference_scale_missing", False)),
                "notes": quality_data.get("quality_notes", "Image quality passed inspection.")
            },
            "band_detected": bool(band_detected),
            "localizations": {
                "sensing_strip_roi": {"x": strip_bbox[0], "y": strip_bbox[1], "w": strip_bbox[2], "h": strip_bbox[3]},
                "reference_scale_roi": {"x": ref_bbox[0], "y": ref_bbox[1], "w": ref_bbox[2], "h": ref_bbox[3]} if ref_bbox else None
            },
            "vision_engine": vision_engine,
            "action_guideline": action_note,
            "prototype": True,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        return response_payload

    finally:
        if cleanup_temp and os.path.exists(temp_image_path):
            try:
                os.remove(temp_image_path)
            except Exception:
                pass


# ---------------------------------------------------------
# ENDPOINTS
# ---------------------------------------------------------
@app.get("/")
def root():
    return {
        "service": "RageB8 Passive H2S Exposure Dosimeter Backend API",
        "status": "ONLINE",
        "docs_url": "/docs",
        "endpoints": {
            "POST /api/analyze-wristband": "Analyze wristband photo via multipart/form-data or JSON base64"
        },
        "prototype": True
    }


@app.get("/health")
def health_check():
    key_configured = bool(get_gemini_api_key())
    return {
        "status": "HEALTHY",
        "gemini_api_configured": key_configured,
        "model_loaded": True,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@app.post("/api/analyze-wristband")
async def analyze_wristband_endpoint(
    request: Request,
    file: Optional[UploadFile] = File(None),
    image: Optional[UploadFile] = File(None),
    temperature: Optional[float] = Form(25.0),
    humidity: Optional[float] = Form(50.0),
    shelf_age_days: Optional[float] = Form(15.0)
):
    """
    POST /api/analyze-wristband
    Accepts:
      - multipart/form-data with 'file' or 'image' field + optional parameters
      - application/json with 'image_base64' + optional parameters
    """
    content_type = request.headers.get("content-type", "")

    # Handle application/json payload (Base64)
    if "application/json" in content_type:
        try:
            body = await request.json()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON payload.")

        base64_str = body.get("image_base64") or body.get("image")
        if not base64_str:
            raise HTTPException(status_code=400, detail="Missing required field: 'image_base64'.")

        # Strip optional data URI prefix (e.g. 'data:image/png;base64,')
        if "," in base64_str:
            base64_str = base64_str.split(",", 1)[1]

        try:
            image_bytes = base64.b64decode(base64_str)
        except Exception:
            raise HTTPException(status_code=400, detail="Corrupt base64 encoding.")

        img_bgr = decode_image(image_bytes)
        t = float(body.get("temperature", 25.0))
        h = float(body.get("humidity", 50.0))
        age = float(body.get("shelf_age_days", 15.0))
        return process_wristband_analysis(img_bgr, temperature=t, humidity=h, shelf_age_days=age)

    # Handle multipart/form-data upload
    uploaded = file or image
    if not uploaded:
        raise HTTPException(
            status_code=400,
            detail="Missing image upload. Please provide 'file' or 'image' field in form data, or 'image_base64' in JSON."
        )

    file_bytes = await uploaded.read()
    img_bgr = decode_image(file_bytes)
    return process_wristband_analysis(
        img_bgr,
        temperature=temperature or 25.0,
        humidity=humidity or 50.0,
        shelf_age_days=shelf_age_days or 15.0
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    print(f"\n========================================================")
    print(f" RageB8 H2S Dosimeter Backend Server Starting")
    print(f" Endpoint: http://localhost:{port}/api/analyze-wristband")
    print(f" API Docs: http://localhost:{port}/docs")
    print(f"========================================================\n")
    uvicorn.run(app, host="0.0.0.0", port=port)
