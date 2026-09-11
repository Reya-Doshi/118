#!/usr/bin/env python3
"""
Test Gemini Vision Integration for RageB8 H2S Dosimeter Wristband

STRICT SAFETY CONSTRAINTS:
  - Gemini does NOT predict H2S exposure or ppm·h.
  - Gemini ONLY:
      1. Detects whether a valid wristband is present
      2. Identifies the sensing strip region
      3. Identifies the printed reference colour scale
      4. Checks image quality (dark, overexposed, blurry, strip missing, ref scale missing)
      5. Returns structured JSON containing detected regions and quality result
  - OpenCV extracts strip color from the Gemini-identified region
  - RGB -> CIE L*a*b* -> Delta E (vs Cu-PAN unexposed baseline)
  - Features -> cupan_best_model.pkl (Random Forest) -> cumulative exposure ppm·h -> NORMAL / MONITOR / REVIEW
  - Server-side only: no credentials in frontend or Android app.
  - If Gemini fails or key is missing, OpenCV ROI fallback takes over automatically.
"""

import os
import sys
import subprocess

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PYTHON_BIN = sys.executable

def main():
    test_image = os.path.join(PROJECT_ROOT, "test_images", "wristband_low_monitor.png")
    annotated_out = os.path.join(PROJECT_ROOT, "test_images", "gemini_e2e_verified.png")

    print("\n" + "=" * 70)
    print("  GEMINI VISION + RANDOM FOREST END-TO-END PIPELINE TEST")
    print("=" * 70)
    print(f"Target Image:     {os.path.basename(test_image)}")
    print(f"Server-Side Only: Gemini credentials restricted to backend services")
    print(f"Model File:       models/cupan_best_model.pkl (Random Forest Regressor)")
    print("-" * 70 + "\n")

    cmd = [
        PYTHON_BIN,
        os.path.join(PROJECT_ROOT, "scripts", "analyze_wristband.py"),
        test_image,
        "--temp", "26.5",
        "--humidity", "52.0",
        "--shelf-age", "18.0",
        "--save-annotated", annotated_out
    ]

    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.stdout:
        print(res.stdout)
    if res.stderr:
        print(res.stderr, file=sys.stderr)

if __name__ == "__main__":
    main()
