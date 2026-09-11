#!/usr/bin/env python3
"""
Comprehensive ROI, Asset & Color Progression Diagnostic Tool
Saves visual debug inspection images showing:
1. Original image
2. Detected sensing-strip ROI (Green)
3. Detected reference-scale ROI (Cyan)
4. Sampled pixel/colour core region (Magenta)
5. Magnified extracted color swatch & quantitative metrics
"""

import os
import sys
import numpy as np
import cv2

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from models.cupan_model import load_cupan_model
from scripts.analyze_wristband import (
    srgb_to_cielab,
    compute_delta_e_cie76,
    detect_and_extract_sensing_strip,
    L0_STAR,
    A0_STAR,
    B0_STAR
)

# Load calibrated Random Forest model
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "cupan_best_model.pkl")
model = load_cupan_model(MODEL_PATH)

DEBUG_DIR = os.path.join(PROJECT_ROOT, "test_images", "debug")
os.makedirs(DEBUG_DIR, exist_ok=True)

# 5 Intended Cu-PAN Chemical Prototype States
CU_PAN_STAGES = [
    {
        "stage_id": "STAGE-1-VIOLET",
        "name": "Stage 1: Deep Violet / Purple (Fresh Baseline)",
        "intended_rgb": (92, 58, 122),     # #5C3A7A
        "bgr": (122, 58, 92),
        "expected_dose_range": "< 0.50 ppm·h",
        "expected_status": "NORMAL",
        "description": "Unreacted Cu(II)-PAN complex baseline."
    },
    {
        "stage_id": "STAGE-2-PURPLE",
        "name": "Stage 2: Violet-Purple / Reddish-Purple (Low)",
        "intended_rgb": (128, 68, 118),   # #804476
        "bgr": (118, 68, 128),
        "expected_dose_range": "< 0.50 ppm·h",
        "expected_status": "NORMAL",
        "description": "Onset of sulfide displacement."
    },
    {
        "stage_id": "STAGE-3-PINK",
        "name": "Stage 3: Reddish-Pink / 'New York Pink' (Intermediate)",
        "intended_rgb": (175, 85, 105),   # #AF5569
        "bgr": (105, 85, 175),
        "expected_dose_range": "0.50 - 1.00 ppm·h",
        "expected_status": "MONITOR",
        "description": "Characteristic intermediate 'New York pink' transition."
    },
    {
        "stage_id": "STAGE-4-ORANGE",
        "name": "Stage 4: Orange / Amber-Orange (Elevated)",
        "intended_rgb": (205, 110, 68),   # #CD6E44
        "bgr": (68, 110, 205),
        "expected_dose_range": "> 1.00 ppm·h",
        "expected_status": "REVIEW",
        "description": "Substantial demetallation; mixed chromophores."
    },
    {
        "stage_id": "STAGE-5-YELLOW",
        "name": "Stage 5: Yellow / Yellow-Orange (High Saturated)",
        "intended_rgb": (235, 185, 42),   # #EBB92A
        "bgr": (42, 185, 235),
        "expected_dose_range": "> 1.00 ppm·h",
        "expected_status": "REVIEW",
        "description": "Complete transition to free neutral H-PAN dye."
    }
]


def render_prototype_wristband_card(bgr_color, sample_name, stage_id):
    """
    Renders a realistic physical prototype wristband card image
    with strap, white housing, 4-step reference scale, and sensing window.
    """
    W, H = 800, 480
    img = np.full((H, W, 3), 48, dtype=np.uint8) # Dark inspection table

    # Strap
    cv2.rectangle(img, (0, 140), (W, 340), (45, 40, 36), -1)

    # Dosimeter Housing
    hx1, hy1, hx2, hy2 = 180, 110, 620, 370
    cv2.rectangle(img, (hx1, hy1), (hx2, hy2), (242, 244, 245), -1)
    cv2.rectangle(img, (hx1, hy1), (hx2, hy2), (180, 185, 190), 2)

    # Label
    cv2.putText(img, "RAGE-B8 Cu-PAN DOSIMETER", (hx1 + 20, hy1 + 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.60, (30, 35, 40), 2, cv2.LINE_AA)
    cv2.putText(img, stage_id, (hx2 - 180, hy1 + 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (80, 50, 40), 1, cv2.LINE_AA)

    # Reference Scale (4 calibrated steps)
    rx1, ry1 = 210, 160
    rw, rh = 40, 150
    cv2.rectangle(img, (rx1 - 2, ry1 - 2), (rx1 + rw + 2, ry1 + rh + 2), (130, 135, 140), 2)
    ref_steps = [(122, 58, 92), (105, 85, 175), (68, 110, 205), (42, 185, 235)]
    step_h = rh // 4
    for idx, c in enumerate(ref_steps):
        sy1 = ry1 + idx * step_h
        sy2 = ry1 + (idx + 1) * step_h if idx < 3 else ry1 + rh
        cv2.rectangle(img, (rx1, sy1), (rx1 + rw, sy2), c, -1)
    cv2.putText(img, "REF SCALE", (rx1 - 8, ry1 + rh + 16),
                cv2.FONT_HERSHEY_SIMPLEX, 0.35, (80, 85, 90), 1, cv2.LINE_AA)

    # Sensing Strip Window (Active chemical matrix)
    sx1, sy1 = 340, 160
    sx2, sy2 = 460, 310
    cv2.rectangle(img, (sx1 - 2, sy1 - 2), (sx2 + 2, sy2 + 2), (150, 155, 160), 2)
    
    strip = np.zeros((sy2 - sy1, sx2 - sx1, 3), dtype=np.uint8)
    strip[:] = bgr_color
    # Add realistic sensor surface micro-texture
    noise = np.random.normal(0, 1.8, strip.shape).astype(np.int16)
    img[sy1:sy2, sx1:sx2] = np.clip(strip.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    
    cv2.putText(img, "Cu-PAN SENSING STRIP", (sx1 - 15, sy2 + 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.40, (60, 65, 70), 1, cv2.LINE_AA)

    # Prototype Disclaimer
    cv2.putText(img, "*** SIMULATED / PROTOTYPE COLOUR STATE ***", (hx1 + 30, hy2 - 12),
                cv2.FONT_HERSHEY_SIMPLEX, 0.40, (110, 75, 35), 1, cv2.LINE_AA)

    return img


def draw_debug_inspection_image(original_img, strip_bbox, ref_bbox, housing_bbox, rgb, L, a, b_val, dE, dose, status, alert_info, test_label):
    """
    Creates a comprehensive debug inspection image with:
    - Detected ROIs outlined
    - Sampled core region highlighted
    - Large side-panel showing swatch, RGB, Lab, DeltaE, Dose, and Alert status
    """
    H, W = original_img.shape[:2]
    # Canvas with right-side metadata HUD panel
    hud_w = 400
    debug_canvas = np.zeros((H, W + hud_w, 3), dtype=np.uint8)
    debug_canvas[:, :W] = original_img.copy()
    debug_canvas[:, W:] = (32, 32, 30) # Dark charcoal HUD

    # 1. Draw Housing Box (Yellow)
    if housing_bbox:
        hx, hy, hw, hh = housing_bbox
        cv2.rectangle(debug_canvas, (hx, hy), (hx + hw, hy + hh), (0, 215, 255), 2)
        cv2.putText(debug_canvas, "HOUSING ROI", (hx + 6, max(20, hy - 6)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 215, 255), 1, cv2.LINE_AA)

    # 2. Draw Reference Scale ROI (Cyan)
    if ref_bbox:
        rx, ry, rw, rh = ref_bbox
        cv2.rectangle(debug_canvas, (rx, ry), (rx + rw, ry + rh), (255, 255, 0), 2)
        cv2.putText(debug_canvas, "REF SCALE ROI", (rx + 2, max(20, ry - 6)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.38, (255, 255, 0), 1, cv2.LINE_AA)

    # 3. Draw Sensing Strip ROI (Bright Green)
    if strip_bbox:
        sx, sy, sw, sh = strip_bbox
        cv2.rectangle(debug_canvas, (sx, sy), (sx + sw, sy + sh), (0, 255, 0), 2)
        cv2.putText(debug_canvas, "SENSING STRIP ROI", (sx + 2, max(20, sy - 6)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.42, (0, 255, 0), 1, cv2.LINE_AA)

        # 4. Draw Sampled Core Region (Magenta - inner core to avoid edge shadows)
        core_x = sx + int(sw * 0.20)
        core_y = sy + int(sh * 0.20)
        core_w = sw - int(sw * 0.40)
        core_h = sh - int(sh * 0.40)
        cv2.rectangle(debug_canvas, (core_x, core_y), (core_x + core_w, core_y + core_h), (255, 0, 255), 2)
        cv2.putText(debug_canvas, "SAMPLED CORE", (core_x + 2, core_y + 14),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.35, (255, 0, 255), 1, cv2.LINE_AA)

    # HUD PANEL METRICS (Right side)
    x0 = W + 20
    y = 35
    cv2.putText(debug_canvas, "DEBUG ROI INSPECTION", (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.60, (246, 241, 231), 2, cv2.LINE_AA)
    y += 22
    cv2.putText(debug_canvas, test_label, (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (176, 138, 85), 1, cv2.LINE_AA)

    # Color Swatch Inset
    y += 20
    cv2.putText(debug_canvas, "EXTRACTED COLOR SWATCH:", (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.40, (180, 180, 175), 1, cv2.LINE_AA)
    y += 10
    swatch_bgr = (rgb[2], rgb[1], rgb[0])
    cv2.rectangle(debug_canvas, (x0, y), (x0 + 120, y + 45), swatch_bgr, -1)
    cv2.rectangle(debug_canvas, (x0, y), (x0 + 120, y + 45), (200, 200, 200), 1)
    
    hex_str = f"#{rgb[0]:02X}{rgb[1]:02X}{rgb[2]:02X}"
    cv2.putText(debug_canvas, hex_str, (x0 + 130, y + 28),
                cv2.FONT_HERSHEY_SIMPLEX, 0.50, (246, 241, 231), 1, cv2.LINE_AA)

    # Color Metrics
    y += 65
    cv2.putText(debug_canvas, f"sRGB: ({rgb[0]}, {rgb[1]}, {rgb[2]})", (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (230, 230, 230), 1, cv2.LINE_AA)
    y += 22
    cv2.putText(debug_canvas, f"CIE L*a*b*: L*={L:.1f}, a*={a:.1f}, b*={b_val:.1f}", (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (230, 230, 230), 1, cv2.LINE_AA)
    y += 22
    cv2.putText(debug_canvas, f"Baseline Anchor: (40.5, 26.0, -22.0)", (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.40, (140, 140, 135), 1, cv2.LINE_AA)
    y += 22
    cv2.putText(debug_canvas, f"Delta E (CIE76): {dE:.1f}", (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.50, (113, 128, 107), 2, cv2.LINE_AA)

    # Model Inferred Dose & Safety Classification
    y += 35
    cv2.putText(debug_canvas, "-" * 32, (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.40, (80, 80, 75), 1)
    y += 20
    cv2.putText(debug_canvas, f"ESTIMATED DOSE: {dose:.2f} ppm.h", (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55, (246, 241, 231), 2, cv2.LINE_AA)
    y += 25
    status_color = (90, 180, 90) if status == "NORMAL" else ((60, 170, 230) if status == "MONITOR" else (80, 80, 220))
    cv2.putText(debug_canvas, f"STATUS: {status}", (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55, status_color, 2, cv2.LINE_AA)

    # Safety Officer Alert Section
    y += 35
    cv2.putText(debug_canvas, "-" * 32, (x0, y),
                cv2.FONT_HERSHEY_SIMPLEX, 0.40, (80, 80, 75), 1)
    y += 20
    if status == "REVIEW":
        cv2.putText(debug_canvas, "[!] PROTOTYPE REVIEW ALERT", (x0, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (80, 80, 235), 2, cv2.LINE_AA)
        y += 20
        cv2.putText(debug_canvas, "Safety Officer: Mira Patel", (x0, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.42, (200, 200, 200), 1, cv2.LINE_AA)
        y += 18
        cv2.putText(debug_canvas, "Threshold: > 1.00 ppm.h breached", (x0, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.38, (160, 160, 160), 1, cv2.LINE_AA)
        y += 18
        cv2.putText(debug_canvas, "Action: Review exposure & verify", (x0, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.38, (160, 160, 160), 1, cv2.LINE_AA)
        y += 16
        cv2.putText(debug_canvas, "workplace conditions.", (x0, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.38, (160, 160, 160), 1, cv2.LINE_AA)
    else:
        cv2.putText(debug_canvas, "[OK] NO ALERT REQUIRED", (x0, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (90, 180, 90), 1, cv2.LINE_AA)
        y += 20
        cv2.putText(debug_canvas, f"Within shift limits (< 1.00 ppm.h)", (x0, y),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.38, (160, 160, 160), 1, cv2.LINE_AA)

    return debug_canvas


def run_full_diagnosis():
    print("=" * 115)
    print("PHYSICAL PROTOTYPE TESTING & ROI DIAGNOSIS")
    print("Cu-PAN Chemical Progression: Deep Violet -> Violet-Purple -> Reddish-Pink -> Orange/Amber -> Yellow")
    print("Thresholds: NORMAL < 0.50 ppm·h | MONITOR 0.50 - 1.00 ppm·h | REVIEW > 1.00 ppm·h")
    print("Safety Officer: Mira Patel | Alert Label: Prototype Review Alert")
    print("=" * 115)

    results = []

    # -------------------------------------------------------------
    # 1. DIAGNOSE EXISTING PROTOTYPE ASSET: 'src/assets/band design.png'
    # -------------------------------------------------------------
    asset_path = os.path.join(PROJECT_ROOT, "src", "assets", "band design.png")
    if os.path.exists(asset_path):
        img_asset = cv2.imread(asset_path)
        # Using filename to test preset
        rgb, strip_bbox, ref_bbox, housing_bbox, norm_img = detect_and_extract_sensing_strip(
            img_asset, filename=asset_path
        )
        L, a, b_val = srgb_to_cielab(*rgb)
        dE = compute_delta_e_cie76(L, a, b_val)
        feat = np.array([[L, a, b_val, dE, 25.0, 50.0, 15.0]], dtype=np.float64)
        pred, _ = model.predict_with_uncertainty(feat)
        dose = max(0.0, float(pred[0]))
        status = "NORMAL" if dose < 0.50 else ("MONITOR" if dose <= 1.00 else "REVIEW")
        alert_gen = "YES (Mira Patel Alerted)" if status == "REVIEW" else "NO"

        out_img = draw_debug_inspection_image(
            img_asset, strip_bbox, ref_bbox, housing_bbox, rgb, L, a, b_val, dE, dose, status, alert_gen,
            "Existing Prototype Asset: band design.png"
        )
        save_path = os.path.join(DEBUG_DIR, "debug_roi_band_design_asset.png")
        cv2.imwrite(save_path, out_img)

        results.append({
            "name": "Existing Asset (band design.png)",
            "rgb": rgb,
            "lab": (L, a, b_val),
            "delta_e": dE,
            "dose": dose,
            "status": status,
            "alert": alert_gen,
            "roi": strip_bbox,
            "image_saved": save_path
        })

    # -------------------------------------------------------------
    # 2. EVALUATE ALL 5 INTENDED Cu-PAN PROTOTYPE STAGES
    # -------------------------------------------------------------
    for stage in CU_PAN_STAGES:
        card_img = render_prototype_wristband_card(stage["bgr"], stage["name"], stage["stage_id"])
        
        # Test detection on this card (manual strip bbox known: (340, 160, 120, 150))
        known_strip = (340, 160, 120, 150)
        known_ref = (210, 160, 40, 150)
        known_housing = (180, 110, 440, 260)

        rgb, strip_bbox, ref_bbox, housing_bbox, _ = detect_and_extract_sensing_strip(
            card_img, manual_strip_roi=known_strip, manual_ref_roi=known_ref
        )
        L, a, b_val = srgb_to_cielab(*rgb)
        dE = compute_delta_e_cie76(L, a, b_val)
        feat = np.array([[L, a, b_val, dE, 25.0, 50.0, 15.0]], dtype=np.float64)
        pred, _ = model.predict_with_uncertainty(feat)
        dose = max(0.0, float(pred[0]))
        status = "NORMAL" if dose < 0.50 else ("MONITOR" if dose <= 1.00 else "REVIEW")
        alert_gen = "YES (Mira Patel Alerted)" if status == "REVIEW" else "NO"

        out_img = draw_debug_inspection_image(
            card_img, strip_bbox, ref_bbox, known_housing, rgb, L, a, b_val, dE, dose, status, alert_gen,
            stage["name"]
        )
        filename_id = stage["stage_id"].lower().replace("-", "_")
        save_path = os.path.join(DEBUG_DIR, f"debug_roi_{filename_id}.png")
        cv2.imwrite(save_path, out_img)

        results.append({
            "name": stage["name"],
            "rgb": rgb,
            "lab": (L, a, b_val),
            "delta_e": dE,
            "dose": dose,
            "status": status,
            "alert": alert_gen,
            "roi": strip_bbox,
            "image_saved": save_path
        })

    # -------------------------------------------------------------
    # 3. TEST DELIBERATELY INVALID / BACKGROUND IMAGE
    # -------------------------------------------------------------
    invalid_img = np.full((480, 800, 3), (35, 45, 60), dtype=np.uint8) # Dark wooden desk surface
    cv2.putText(invalid_img, "INVALID BACKGROUND / NO WRISTBAND IN FRAME", (60, 240),
                cv2.FONT_HERSHEY_SIMPLEX, 0.70, (180, 190, 200), 2, cv2.LINE_AA)

    rgb_inv, s_inv, r_inv, h_inv, _ = detect_and_extract_sensing_strip(invalid_img)
    L_inv, a_inv, b_inv = srgb_to_cielab(*rgb_inv)
    dE_inv = compute_delta_e_cie76(L_inv, a_inv, b_inv)
    feat_inv = np.array([[L_inv, a_inv, b_inv, dE_inv, 25.0, 50.0, 15.0]], dtype=np.float64)
    pred_inv, _ = model.predict_with_uncertainty(feat_inv)
    dose_inv = max(0.0, float(pred_inv[0]))
    status_inv = "NORMAL" if dose_inv < 0.50 else ("MONITOR" if dose_inv <= 1.00 else "REVIEW")
    alert_inv = "YES (Mira Patel Alerted)" if status_inv == "REVIEW" else "NO"

    out_inv = draw_debug_inspection_image(
        invalid_img, s_inv, r_inv, h_inv, rgb_inv, L_inv, a_inv, b_inv, dE_inv, dose_inv, status_inv, alert_inv,
        "Deliberately Invalid / Background Desk Surface"
    )
    save_inv_path = os.path.join(DEBUG_DIR, "debug_roi_invalid_desk_background.png")
    cv2.imwrite(save_inv_path, out_inv)

    results.append({
        "name": "Deliberately Invalid (Desk Surface)",
        "rgb": rgb_inv,
        "lab": (L_inv, a_inv, b_inv),
        "delta_e": dE_inv,
        "dose": dose_inv,
        "status": status_inv,
        "alert": alert_inv,
        "roi": s_inv,
        "image_saved": save_inv_path
    })

    # Print Summary Table
    print(f"{'Test Condition':44s} | {'Extracted RGB':16s} | {'CIE L*a*b*':22s} | {'Delta E':7s} | {'Est ppm·h':10s} | {'Status':8s} | {'Alert Generated'}")
    print("-" * 125)
    for res in results:
        r, g, b = res["rgb"]
        L, a, b_v = res["lab"]
        print(f"{res['name']:44s} | ({r:3d},{g:3d},{b:3d})     | L*={L:5.1f} a*={a:5.1f} b*={b_v:5.1f} | {res['delta_e']:6.1f}  | {res['dose']:6.2f}    | {res['status']:8s} | {res['alert']}")

    print("=" * 125)
    print(f"\nAll {len(results)} visual debug inspection images successfully saved to:\n  {DEBUG_DIR}\n")


if __name__ == "__main__":
    run_full_diagnosis()
