#!/usr/bin/env python3
"""
Comprehensive Prototype Color & Model Diagnostic Script
Evaluates:
- Intended Cu-PAN progression vs. Model Predictions
- Presets vs. Actual pixel sampling in band design.png
- Safety status and Review Alert Generation
"""

import os
import sys
import numpy as np
import cv2

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from models.cupan_model import load_cupan_model
from scripts.analyze_wristband import srgb_to_cielab, compute_delta_e_cie76

model_path = os.path.join(PROJECT_ROOT, "models", "cupan_best_model.pkl")
model = load_cupan_model(model_path)

test_cases = [
    ("Stage 1: Deep Violet (Fresh)", (92, 58, 122)),
    ("Stage 2: Violet-Purple (Low)", (128, 68, 118)),
    ("Stage 3: Reddish-Pink (Intermediate)", (175, 85, 105)),
    ("Stage 4: Orange/Amber (Elevated)", (205, 110, 68)),
    ("Stage 5: Yellow/Yellow-Orange (High)", (235, 185, 42)),
    ("Old Preset ROI in band design.png", (193, 174, 145)),
    ("Old Dark Brown Asset", (58, 46, 43)),
    ("Deliberately Invalid (White/Glare)", (255, 255, 255)),
    ("Deliberately Invalid (Dark Desk)", (30, 25, 22)),
]

print("=" * 110)
print("Cu-PAN MACHINE LEARNING MODEL INFERENCE ON SIMULATED PROTOTYPE COLOR STATES")
print("Baseline Anchors: L0*=40.5, a0*=26.0, b0*=-22.0 (Deep Violet)")
print("Safety Thresholds: NORMAL < 0.50 ppm·h | MONITOR 0.50-1.00 ppm·h | REVIEW > 1.00 ppm·h")
print("=" * 110)
print(f"{'Test Case':38s} | {'RGB':16s} | {'CIE L*a*b*':22s} | {'Delta E':7s} | {'Dose':8s} | {'Status':8s} | {'Alert'}")
print("-" * 110)

for name, (r, g, b) in test_cases:
    L, a, b_val = srgb_to_cielab(r, g, b)
    dE = compute_delta_e_cie76(L, a, b_val)
    feat = np.array([[L, a, b_val, dE, 25.0, 50.0, 15.0]], dtype=np.float64)
    pred, std = model.predict_with_uncertainty(feat)
    dose = max(0.0, float(pred[0]))
    
    if dose < 0.50:
        status = "NORMAL"
        alert = "NO"
    elif dose <= 1.00:
        status = "MONITOR"
        alert = "NO"
    else:
        status = "REVIEW"
        alert = "YES (Safety Officer Alert: Mira Patel)"
        
    print(f"{name:38s} | ({r:3d},{g:3d},{b:3d})     | L*={L:5.1f} a*={a:5.1f} b*={b_val:5.1f} | {dE:6.1f}  | {dose:5.2f}   | {status:8s} | {alert}")

print("=" * 110)
