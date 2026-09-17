#!/usr/bin/env python3
"""
Official Verification Script for User Requested Prototype Scenarios:
Scenario A: Purple simulated prototype colour (State 1)
Scenario B: Pink/red simulated prototype colour (State 3)
Scenario C: Orange/yellow simulated prototype colour (State 4 & 5)
Scenario D: Deliberately invalid / background image

Evaluates the complete backend analysis pipeline:
- OpenCV / Gemini ROI localization
- Color conversion (sRGB -> CIE L*a*b* under D65)
- Delta E relative to baseline (40.5, 26.0, -22.0)
- Random Forest model inference (without retraining or modification)
- Operational safety classification (NORMAL, MONITOR, REVIEW)
- Prototype Review Alert generation (Safety Officer: Mira Patel)
"""

import os
import sys
import json
import cv2
import numpy as np

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.main import process_wristband_analysis
from scripts.diagnose_and_generate_debug_images import render_prototype_wristband_card, draw_debug_inspection_image

TEST_OUT_DIR = os.path.join(PROJECT_ROOT, "test_images", "user_scenarios")
os.makedirs(TEST_OUT_DIR, exist_ok=True)

scenarios = [
    {
        "id": "A",
        "title": "A. Purple simulated prototype colour",
        "bgr": (122, 58, 92), # RGB: (92, 58, 122) Deep Violet / Purple
        "stage_id": "STAGE-1-VIOLET",
        "is_invalid": False
    },
    {
        "id": "B",
        "title": "B. Pink/red simulated prototype colour",
        "bgr": (105, 85, 175), # RGB: (175, 85, 105) Reddish-Pink / 'New York pink'
        "stage_id": "STAGE-3-PINK",
        "is_invalid": False
    },
    {
        "id": "C1",
        "title": "C1. Orange simulated prototype colour",
        "bgr": (68, 110, 205), # RGB: (205, 110, 68) Orange / Amber
        "stage_id": "STAGE-4-ORANGE",
        "is_invalid": False
    },
    {
        "id": "C2",
        "title": "C2. Yellow simulated prototype colour",
        "bgr": (42, 185, 235), # RGB: (235, 185, 42) Yellow / Yellow-Orange
        "stage_id": "STAGE-5-YELLOW",
        "is_invalid": False
    },
    {
        "id": "D",
        "title": "D. Deliberately invalid / background image",
        "bgr": None,
        "stage_id": "INVALID-DESK",
        "is_invalid": True
    }
]

print("\n" + "=" * 115)
print("USER REQUESTED PROTOTYPE TEST EVALUATION (A, B, C, D)")
print("Model: cupan_best_model.pkl (Unmodified Random Forest Regressor)")
print("Baseline: L0*=40.5, a0*=26.0, b0*=-22.0 | Safety Officer: Mira Patel")
print("=" * 115)

scenario_results = []

for sc in scenarios:
    if sc["is_invalid"]:
        # Render invalid table surface
        img = np.full((480, 800, 3), (35, 45, 55), dtype=np.uint8)
        cv2.putText(img, "WORK BENCH SURFACE - NO DOSIMETER DETECTED", (80, 240),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.65, (160, 170, 180), 2, cv2.LINE_AA)
        img_path = os.path.join(TEST_OUT_DIR, "scenario_d_invalid_desk.png")
        cv2.imwrite(img_path, img)
    else:
        img = render_prototype_wristband_card(sc["bgr"], sc["title"], sc["stage_id"])
        img_path = os.path.join(TEST_OUT_DIR, f"scenario_{sc['id'].lower()}_{sc['stage_id'].lower()}.png")
        cv2.imwrite(img_path, img)

    # Run through backend analysis pipeline
    res = process_wristband_analysis(
        img_bgr=img,
        temperature=25.0,
        humidity=50.0,
        shelf_age_days=15.0,
        temp_image_path=img_path
    )

    r = res["rgb"]["r"]
    g = res["rgb"]["g"]
    b = res["rgb"]["b"]
    L = res["lab"]["L"]
    a = res["lab"]["a"]
    b_val = res["lab"]["b"]
    dE = res["delta_e"]
    dose = res["estimated_exposure_ppm_h"]
    status = res["status"]
    
    alert_meta = res.get("safety_officer_alert", {})
    alert_gen = alert_meta.get("alert_generated", False)
    officer = alert_meta.get("safety_officer", "Mira Patel")
    alert_label = alert_meta.get("alert_label", "Prototype Review Alert")
    
    strip_roi = res["localizations"]["sensing_strip_roi"]
    ref_roi = res["localizations"].get("reference_scale_roi")
    
    alert_str = f"YES ({alert_label} -> {officer})" if alert_gen else "NO (Within Safe Shift Limits)"

    # Draw and save annotated inspection image
    s_bbox = (strip_roi["x"], strip_roi["y"], strip_roi["w"], strip_roi["h"]) if strip_roi else (0, 0, 0, 0)
    r_bbox = (ref_roi["x"], ref_roi["y"], ref_roi["w"], ref_roi["h"]) if ref_roi else None
    
    dbg_img = draw_debug_inspection_image(
        img, s_bbox, r_bbox, None, (r, g, b), L, a, b_val, dE, dose, status, alert_str, sc["title"]
    )
    dbg_save_path = os.path.join(TEST_OUT_DIR, f"debug_annotated_scenario_{sc['id'].lower()}.png")
    cv2.imwrite(dbg_save_path, dbg_img)

    scenario_results.append({
        "scenario": sc["title"],
        "rgb": (r, g, b),
        "lab": (L, a, b_val),
        "delta_e": dE,
        "dose": dose,
        "status": status,
        "alert_generated": alert_str,
        "detected_strip_roi": s_bbox,
        "detected_ref_roi": r_bbox,
        "debug_image": dbg_save_path
    })

print(f"{'Scenario':42s} | {'RGB':14s} | {'CIE L*a*b*':22s} | {'Delta E':7s} | {'Est ppm·h':9s} | {'Status':8s} | {'Alert Generated'}")
print("-" * 125)
for sr in scenario_results:
    r, g, b = sr["rgb"]
    L, a, bv = sr["lab"]
    print(f"{sr['scenario']:42s} | ({r:3d},{g:3d},{b:3d})   | L*={L:5.1f} a*={a:5.1f} b*={bv:5.1f} | {sr['delta_e']:6.1f}  | {sr['dose']:6.2f}   | {sr['status']:8s} | {sr['alert_generated']}")

print("=" * 125)
print(f"\nDetailed ROI report:")
for sr in scenario_results:
    print(f"  • {sr['scenario']}:")
    print(f"      Detected Sensing-Strip ROI: {sr['detected_strip_roi']}")
    print(f"      Detected Reference-Scale ROI: {sr['detected_ref_roi']}")
    print(f"      Annotated Debug Image Saved: {sr['debug_image']}")

print()
