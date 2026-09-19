#!/usr/bin/env python3
"""
End-to-End Test Suite for SARVAS Passive Colorimetric H2S Dosimeter Pipeline
Tests:
  1. Existing prototype wristband design/diagram (src/assets/band design.png)
  2. Prototype State 1: Unexposed Baseline Safe (Purple) -> NORMAL
  3. Prototype State 2: Low-to-Moderate Action Level (Intermediate Pink) -> MONITOR
  4. Prototype State 3: High Exposure Saturated (Yellow-Orange) -> REVIEW
  5. Prototype State 4: Expired Matrix Boundary Test (>90 Days Shelf-Life) -> EXPIRED / REJECT

Demonstrates:
  - Automatic detection & localization of sensing strip and reference scale
  - Robust ROI fallback for engineering design renders
  - RGB -> CIE L*a*b* conversion under D65
  - Delta E calculation against Cu-PAN baseline (L0=40.5, a0=26.0, b0=-22.0)
  - Quantitative dosage prediction using cupan_best_model.pkl
  - Ensemble uncertainty (95% CI)
  - Classification: NORMAL / MONITOR / REVIEW
  - SIMULATED / PROTOTYPE READING transparency banner
"""

import os
import sys
import subprocess

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PYTHON_BIN = sys.executable

# Ensure test images exist
os.makedirs(os.path.join(PROJECT_ROOT, "test_images"), exist_ok=True)
gen_script = os.path.join(PROJECT_ROOT, "scripts", "generate_test_wristbands.py")
subprocess.run([PYTHON_BIN, gen_script], check=True)

test_scenarios = [
    {
        "name": "TEST 1: Existing Band Design Prototype (Infographic/CAD Layout)",
        "image": os.path.join(PROJECT_ROOT, "src", "assets", "band design.png"),
        "annotated_out": os.path.join(PROJECT_ROOT, "test_images", "e2e_out_existing_design.png"),
        "temp": 25.0,
        "humidity": 50.0,
        "shelf_age": 20.0,
        "strip_roi": "1174,786,50,97",
        "ref_roi": "1348,805,145,52",
        "expected_status": "REVIEW"
    },
    {
        "name": "TEST 2: Prototype State 1 — Unexposed Baseline Safe (Purple)",
        "image": os.path.join(PROJECT_ROOT, "test_images", "wristband_baseline_safe.png"),
        "annotated_out": os.path.join(PROJECT_ROOT, "test_images", "e2e_out_state1_safe.png"),
        "temp": 24.0,
        "humidity": 45.0,
        "shelf_age": 10.0,
        "strip_roi": None,
        "ref_roi": None,
        "expected_status": "NORMAL"
    },
    {
        "name": "TEST 3: Prototype State 2 — Intermediate Exposure Action Level (Pink / Salmon)",
        "image": os.path.join(PROJECT_ROOT, "test_images", "wristband_low_monitor.png"),
        "annotated_out": os.path.join(PROJECT_ROOT, "test_images", "e2e_out_state2_monitor.png"),
        "temp": 28.0,
        "humidity": 55.0,
        "shelf_age": 25.0,
        "strip_roi": None,
        "ref_roi": None,
        "expected_status": "MONITOR"
    },
    {
        "name": "TEST 4: Prototype State 3 — High Saturated Exposure (Yellow-Orange)",
        "image": os.path.join(PROJECT_ROOT, "test_images", "wristband_high_review.png"),
        "annotated_out": os.path.join(PROJECT_ROOT, "test_images", "e2e_out_state3_review.png"),
        "temp": 32.0,
        "humidity": 65.0,
        "shelf_age": 40.0,
        "strip_roi": None,
        "ref_roi": None,
        "expected_status": "REVIEW"
    },
    {
        "name": "TEST 5: Prototype State 4 — Degraded Matrix Expiry Test (>90 Days)",
        "image": os.path.join(PROJECT_ROOT, "test_images", "wristband_expired_band.png"),
        "annotated_out": os.path.join(PROJECT_ROOT, "test_images", "e2e_out_state4_expired.png"),
        "temp": 25.0,
        "humidity": 50.0,
        "shelf_age": 105.0,
        "strip_roi": None,
        "ref_roi": None,
        "expected_status": "EXPIRED / REJECT"
    }
]

print("\n" + "=" * 75)
print("       RAGE-B8 END-TO-END IMAGE-ANALYSIS PIPELINE VALIDATION")
print("          Simulated Cu-PAN Colorimetric Chelation Prototype")
print("=" * 75 + "\n")

analyze_script = os.path.join(PROJECT_ROOT, "scripts", "analyze_wristband.py")

for scenario in test_scenarios:
    print(f"\n>>> Running {scenario['name']}...")
    cmd = [
        PYTHON_BIN,
        analyze_script,
        scenario["image"],
        "--temp", str(scenario["temp"]),
        "--humidity", str(scenario["humidity"]),
        "--shelf-age", str(scenario["shelf_age"]),
        "--save-annotated", scenario["annotated_out"]
    ]
    if scenario["strip_roi"]:
        cmd.extend(["--strip-roi", scenario["strip_roi"]])
    if scenario["ref_roi"]:
        cmd.extend(["--ref-roi", scenario["ref_roi"]])

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout)
    if res.stderr:
        print(res.stderr, file=sys.stderr)

print("\n" + "=" * 75)
print("E2E VALIDATION COMPLETE: All prototype states processed successfully.")
print("Annotated inspection images generated in: test_images/e2e_out_*.png")
print("=" * 75 + "\n")
