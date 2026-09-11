#!/usr/bin/env python3
"""
Passive Colorimetric H2S Dosimeter Wristband (Cu-PAN)
Prototype Image-Analysis Pipeline (OpenCV + Machine Learning)

Pipeline Steps:
  1. Load wristband photograph
  2. Detect wristband housing / reference area (or apply user ROI)
  3. Perform white balance / lighting normalization from reference scale
  4. Crop & isolate Cu-PAN colorimetric sensing strip
  5. Extract trimmed mean RGB color
  6. Convert RGB to CIE L*a*b* (D65 standard illuminant)
  7. Compute Delta E (CIE76) relative to baseline Cu-PAN (L0=40.5, a0=26.0, b0=-22.0)
  8. Assemble feature vector [L*, a*, b*, Delta_E, Temp, Humidity, Shelf_Age]
  9. Run inference with serialized Random Forest Regressor (cupan_best_model.pkl)
 10. Compute ensemble prediction and tree uncertainty (+/- std)
 11. Classify safety status: NORMAL / MONITOR / REVIEW (or EXPIRED)
 12. Output detailed report with SIMULATED / PROTOTYPE READING banner
"""

import os
import sys
import json
import argparse
import numpy as np
import cv2

# Set UTF-8 encoding for standard output on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Add workspace to path for model imports
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from models.cupan_model import load_cupan_model

# ---------------------------------------------------------
# CONSTANTS & Cu-PAN CALIBRATION ANCHORS
# ---------------------------------------------------------
# Baseline unexposed Cu-PAN color coordinates (Deep Purple)
L0_STAR = 40.5
A0_STAR = 26.0
B0_STAR = -22.0

# 8-hour Shift Thresholds (ppm·h)
DOSE_NORMAL_MAX = 0.50      # Safe baseline
DOSE_MONITOR_MAX = 1.00     # Action level
SHELF_LIFE_MAX_DAYS = 90.0  # Matrix stability limit

# ---------------------------------------------------------
# COLOR CONVERSION UTILITIES
# ---------------------------------------------------------
def srgb_to_cielab(r, g, b):
    """
    Convert sRGB (0-255) to CIE L*a*b* under standard D65 illuminant.
    Ensures exact scientific coordinates matching literature and calibration dataset.
    """
    # 1. Linearize sRGB
    def linearize(val):
        v = val / 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4

    r_lin = linearize(r)
    g_lin = linearize(g)
    b_lin = linearize(b)

    # 2. Convert to CIE XYZ (D65 observer matrix)
    X = r_lin * 0.4124564 + g_lin * 0.3575761 + b_lin * 0.1804375
    Y = r_lin * 0.2126729 + g_lin * 0.7151522 + b_lin * 0.0721750
    Z = r_lin * 0.0193339 + g_lin * 0.1191920 + b_lin * 0.9503041

    # 3. D65 reference white
    Xn, Yn, Zn = 0.95047, 1.00000, 1.08883
    xr = X / Xn
    yr = Y / Yn
    zr = Z / Zn

    # 4. Standard CIE non-linear transfer function
    delta = 6.0 / 29.0
    def f(t):
        return t ** (1.0 / 3.0) if t > (delta ** 3) else (t / (3.0 * delta ** 2) + 4.0 / 29.0)

    fx = f(xr)
    fy = f(yr)
    fz = f(zr)

    L_star = 116.0 * fy - 16.0
    a_star = 500.0 * (fx - fy)
    b_star = 200.0 * (fy - fz)

    return float(np.round(L_star, 2)), float(np.round(a_star, 2)), float(np.round(b_star, 2))


def compute_delta_e_cie76(L, a, b):
    """Calculate CIE76 Euclidean color difference from unexposed Cu-PAN baseline."""
    return float(np.round(np.sqrt((L - L0_STAR) ** 2 + (a - A0_STAR) ** 2 + (b - B0_STAR) ** 2), 2))


# ---------------------------------------------------------
# IMAGE DETECTION & COLOR EXTRACTION PIPELINE
# ---------------------------------------------------------
def detect_and_extract_sensing_strip(img_bgr, manual_roi=None):
    """
    Locates dosimeter housing, applies white-balance normalization if reference
    patch is found, and extracts the sensing strip color.
    
    Returns:
      rgb_tuple: (R, G, B)
      strip_bbox: (x, y, w, h)
      housing_bbox: (x, y, w, h) or None
      normalized_img: bgr image after white balance
    """
    H, W = img_bgr.shape[:2]

    # Manual ROI override
    if manual_roi is not None:
        mx, my, mw, mh = manual_roi
        # Ensure within bounds
        mx = max(0, min(mx, W - 1))
        my = max(0, min(my, H - 1))
        mw = max(1, min(mw, W - mx))
        mh = max(1, min(mh, H - my))
        strip_roi = img_bgr[my:my+mh, mx:mx+mw]
        median_bgr = np.median(strip_roi.reshape(-1, 3), axis=0)
        rgb = (int(round(median_bgr[2])), int(round(median_bgr[1])), int(round(median_bgr[0])))
        return rgb, (mx, my, mw, mh), None, img_bgr

    # Auto-detection using contours
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Adaptive threshold to isolate housing
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 25, 4
    )
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    housing_bbox = None
    best_area = 0
    min_housing_area = (W * H) * 0.10

    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        area = w * h
        aspect_ratio = float(w) / h
        # Housing has aspect ratio ~ 1.2 to 2.5 and covers a significant area
        if area > min_housing_area and 1.1 <= aspect_ratio <= 3.0:
            if area > best_area:
                best_area = area
                housing_bbox = (x, y, w, h)

    # If no distinct housing contour was found, fallback to central 75% of image
    if housing_bbox is None:
        hx, hy = int(W * 0.15), int(H * 0.15)
        hw, hh = int(W * 0.70), int(H * 0.70)
        housing_bbox = (hx, hy, hw, hh)

    hx, hy, hw, hh = housing_bbox

    # Sensing strip is located in central column of the housing
    # strip: center horizontal (35% to 65% of housing width), mid vertical (25% to 75% of housing height)
    strip_x = int(hx + hw * 0.36)
    strip_y = int(hy + hh * 0.20)
    strip_w = int(hw * 0.28)
    strip_h = int(hh * 0.60)

    # Reference White patch search (look on left side of housing)
    ref_x = int(hx + hw * 0.05)
    ref_y = int(hy + hh * 0.65)
    ref_w = int(hw * 0.10)
    ref_h = int(hh * 0.15)

    ref_roi = img_bgr[ref_y:ref_y+ref_h, ref_x:ref_x+ref_w]
    normalized_img = img_bgr.copy()

    if ref_roi.size > 0:
        mean_ref_bgr = np.mean(ref_roi, axis=(0, 1))
        # If white patch is bright enough (R, G, B > 160), apply white balance scaling
        if np.all(mean_ref_bgr > 160):
            scale = 245.0 / np.maximum(mean_ref_bgr, 1.0)
            # Clip scaling factor to reasonable range [0.8, 1.3]
            scale = np.clip(scale, 0.8, 1.3)
            normalized_img = np.clip(img_bgr.astype(np.float32) * scale, 0, 255).astype(np.uint8)

    # Extract central core of strip (inner 60% to discard edge shadows)
    core_margin_x = int(strip_w * 0.20)
    core_margin_y = int(strip_h * 0.20)
    cx1 = strip_x + core_margin_x
    cy1 = strip_y + core_margin_y
    cx2 = strip_x + strip_w - core_margin_x
    cy2 = strip_y + strip_h - core_margin_y

    strip_core = normalized_img[cy1:cy2, cx1:cx2]
    
    # Calculate robust median BGR across core pixels
    median_bgr = np.median(strip_core.reshape(-1, 3), axis=0)
    rgb = (int(round(median_bgr[2])), int(round(median_bgr[1])), int(round(median_bgr[0])))

    return rgb, (strip_x, strip_y, strip_w, strip_h), housing_bbox, normalized_img


# ---------------------------------------------------------
# ANNOTATION OVERLAY (FOR DEBUG / INSPECTION)
# ---------------------------------------------------------
def create_annotated_image(img, strip_bbox, housing_bbox, rgb, dose, status, uncertainty):
    annotated = img.copy()
    sx, sy, sw, sh = strip_bbox

    # Draw housing bounding box if available
    if housing_bbox:
        hx, hy, hw, hh = housing_bbox
        cv2.rectangle(annotated, (hx, hy), (hx + hw, hy + hh), (0, 255, 255), 2)
        cv2.putText(annotated, "DOSIMETER HOUSING", (hx + 8, hy - 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1, cv2.LINE_AA)

    # Draw sensing strip bounding box
    cv2.rectangle(annotated, (sx, sy), (sx + sw, sy + sh), (0, 255, 0), 2)
    cv2.putText(annotated, "SENSING STRIP (Cu-PAN)", (sx, sy - 8),
                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 1, cv2.LINE_AA)

    # Color patch swatch overlay
    bgr_patch = (rgb[2], rgb[1], rgb[0])
    cv2.rectangle(annotated, (20, 20), (80, 80), bgr_patch, -1)
    cv2.rectangle(annotated, (20, 20), (80, 80), (255, 255, 255), 2)

    # Status color
    status_color = (0, 200, 0) if status == "NORMAL" else ((0, 165, 255) if status == "MONITOR" else (0, 0, 230))
    if "EXPIRED" in status:
        status_color = (0, 0, 255)

    # Text overlay
    cv2.putText(annotated, f"STATUS: {status}", (95, 42),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, status_color, 2, cv2.LINE_AA)
    cv2.putText(annotated, f"Dose: {dose:.2f} ppm-h (+/- {uncertainty:.2f})", (95, 72),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (240, 240, 240), 1, cv2.LINE_AA)

    # Prototype Watermark
    cv2.putText(annotated, "SIMULATED / PROTOTYPE READING", (annotated.shape[1] - 380, annotated.shape[0] - 18),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 220, 255), 1, cv2.LINE_AA)

    return annotated


# ---------------------------------------------------------
# MAIN INFERENCE & CLI RUNNER
# ---------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(
        description="RageB8 Cu-PAN Wristband Image-Analysis Pipeline (OpenCV + ML)"
    )
    parser.add_argument("image_path", help="Path to photograph of wristband dosimeter")
    parser.add_argument("--temp", type=float, default=25.0, help="Ambient temperature in deg C (default: 25.0)")
    parser.add_argument("--humidity", type=float, default=50.0, help="Relative humidity in %% (default: 50.0)")
    parser.add_argument("--shelf-age", type=float, default=15.0, help="Dosimeter shelf age in days (default: 15.0)")
    parser.add_argument("--model-path", default=os.path.join(PROJECT_ROOT, "models", "cupan_best_model.pkl"),
                        help="Path to serialized Random Forest model")
    parser.add_argument("--roi", type=str, default=None,
                        help="Manual sensing-strip ROI as 'x,y,w,h' (optional)")
    parser.add_argument("--save-annotated", type=str, default=None,
                        help="Path to save annotated debug visualization image")
    parser.add_argument("--json", action="store_true", help="Output results in JSON format")

    args = parser.parse_args()

    # Verify input image exists
    if not os.path.exists(args.image_path):
        print(f"Error: Image file not found: {args.image_path}", file=sys.stderr)
        sys.exit(1)

    img_bgr = cv2.imread(args.image_path)
    if img_bgr is None:
        print(f"Error: Unable to decode image with OpenCV: {args.image_path}", file=sys.stderr)
        sys.exit(1)

    # Parse manual ROI if specified
    manual_roi = None
    if args.roi:
        try:
            parts = [int(p.strip()) for p in args.roi.split(",")]
            if len(parts) == 4:
                manual_roi = tuple(parts)
        except Exception:
            print("Warning: Invalid ROI format. Expected 'x,y,w,h'. Proceeding with auto-detection.", file=sys.stderr)

    # 1. Image Processing & Feature Extraction
    rgb, strip_bbox, housing_bbox, norm_img = detect_and_extract_sensing_strip(img_bgr, manual_roi)
    r, g, b = rgb

    # 2. CIE L*a*b* & Delta E Calculation
    L_star, a_star, b_star = srgb_to_cielab(r, g, b)
    delta_e = compute_delta_e_cie76(L_star, a_star, b_star)

    # 3. Model Loading & Inference
    if not os.path.exists(args.model_path):
        print(f"Error: Model file not found: {args.model_path}", file=sys.stderr)
        sys.exit(1)

    model = load_cupan_model(args.model_path)

    # Feature array: [L*, a*, b*, Delta_E, Temp, Humidity, Shelf_Age]
    features = np.array([[
        L_star,
        a_star,
        b_star,
        delta_e,
        float(args.temp),
        float(args.humidity),
        float(args.shelf_age)
    ]], dtype=np.float64)

    # Predict cumulative exposure and ensemble variance
    pred_doses, pred_stds = model.predict_with_uncertainty(features)
    estimated_dose = max(0.0, float(pred_doses[0]))
    uncertainty_1sigma = float(pred_stds[0])
    uncertainty_95ci = float(np.round(uncertainty_1sigma * 1.96, 2))

    # 4. Status Classification & Operational Decision
    is_expired = args.shelf_age > SHELF_LIFE_MAX_DAYS

    if is_expired:
        status = "EXPIRED / REJECT"
        action_note = "Band exceeds 90-day chemical shelf-life. Discard and reissue."
    elif estimated_dose < DOSE_NORMAL_MAX:
        status = "NORMAL"
        action_note = f"Safe working level (<{DOSE_NORMAL_MAX:.2f} ppm·h). Continue normal shift monitoring."
    elif estimated_dose <= DOSE_MONITOR_MAX:
        status = "MONITOR"
        action_note = f"Action level reached ({DOSE_NORMAL_MAX:.2f}–{DOSE_MONITOR_MAX:.2f} ppm·h). Limit further exposure & inspect ventilation."
    else:
        status = "REVIEW"
        action_note = f"Permissible limit exceeded (>{DOSE_MONITOR_MAX:.2f} ppm·h). Prompt medical triage & safety evacuation."

    # 5. Optional Annotated Image Output
    if args.save_annotated:
        annotated_img = create_annotated_image(
            norm_img, strip_bbox, housing_bbox, rgb, estimated_dose, status, uncertainty_95ci
        )
        out_dir = os.path.dirname(os.path.abspath(args.save_annotated))
        if out_dir:
            os.makedirs(out_dir, exist_ok=True)
        cv2.imwrite(args.save_annotated, annotated_img)

    # 6. Structured Output
    results = {
        "analysis_banner": "SIMULATED / PROTOTYPE READING",
        "image_file": os.path.basename(args.image_path),
        "extracted_rgb": {
            "r": r,
            "g": g,
            "b": b,
            "hex": f"#{r:02x}{g:02x}{b:02x}".upper()
        },
        "color_coordinates": {
            "L_star": L_star,
            "a_star": a_star,
            "b_star": b_star,
            "delta_e_cie76": delta_e,
            "reference_baseline": {"L0": L0_STAR, "a0": A0_STAR, "b0": B0_STAR}
        },
        "environmental_conditions": {
            "temperature_C": args.temp,
            "relative_humidity_pct": args.humidity,
            "shelf_age_days": args.shelf_age,
            "shelf_life_status": "EXPIRED" if is_expired else "ACTIVE"
        },
        "exposure_estimation": {
            "predicted_dose_ppm_h": round(estimated_dose, 3),
            "uncertainty_95_ci_ppm_h": round(uncertainty_95ci, 3),
            "dose_range_95_ci": [
                round(max(0.0, estimated_dose - uncertainty_95ci), 3),
                round(estimated_dose + uncertainty_95ci, 3)
            ],
            "model_architecture": "Random Forest Regressor (60 trees)"
        },
        "safety_evaluation": {
            "status": status,
            "action_guideline": action_note
        }
    }

    if args.json:
        print(json.dumps(results, indent=2))
        return

    # User-Friendly Formatted Terminal Report
    print("\n" + "=" * 65)
    print("      *** SIMULATED / PROTOTYPE READING ***")
    print("  RageB8 Passive Colorimetric H2S Dosimeter Pipeline")
    print("=" * 65)
    print(f"Target Image:      {os.path.basename(args.image_path)}")
    print(f"Sensing Chemistry: Cu-PAN Chelation Dye (Porous Matrix)")
    print("-" * 65)
    print("1. EXTRACTED COLOR METRICS")
    print(f"   • Extracted RGB:     ({r}, {g}, {b}) [Hex: #{r:02x}{g:02x}{b:02x}]")
    print(f"   • CIE L*a*b*:        L*={L_star:.2f}, a*={a_star:.2f}, b*={b_star:.2f}")
    print(f"   • Color Diff (ΔE):   {delta_e:.2f} (vs baseline unexposed Cu-PAN)")
    print("-" * 65)
    print("2. ENVIRONMENTAL PARAMETERS")
    print(f"   • Temperature:       {args.temp:.1f} °C")
    print(f"   • Relative Humidity: {args.humidity:.1f} %")
    print(f"   • Band Shelf Age:    {args.shelf_age:.1f} days ({'EXPIRED' if is_expired else 'ACTIVE'})")
    print("-" * 65)
    print("3. MACHINE LEARNING QUANTITATIVE INFERENCE")
    print(f"   • Estimated Dose:    {estimated_dose:.2f} ppm·h")
    print(f"   • 95% Confidence CI: ±{uncertainty_95ci:.2f} ppm·h  [{max(0.0, estimated_dose - uncertainty_95ci):.2f} – {estimated_dose + uncertainty_95ci:.2f} ppm·h]")
    print(f"   • Inference Model:   Random Forest Regressor (60 estimators)")
    print("-" * 65)
    print(f"4. SAFETY CLASSIFICATION:  >> {status} <<")
    print(f"   • Action Directive:   {action_note}")
    print("=" * 65)
    if args.save_annotated:
        print(f"[Saved annotated verification image to: {args.save_annotated}]")
    print()

if __name__ == "__main__":
    main()
