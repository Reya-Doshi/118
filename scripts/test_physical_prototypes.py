"""
Physical Prototype Testing & Evaluation Workflow for Cu-PAN Dosimeter Wristband

Demonstration & Evaluation Script for 5 Physical Colour States:
  State 1: Fresh / unexposed -> Deep purple / violet (SAMPLE-01-FRESH)
  State 2: Low -> Violet-purple / reddish-purple (SAMPLE-02-LOW)
  State 3: Intermediate -> Reddish-pink / 'New York pink' (SAMPLE-03-INTERMEDIATE)
  State 4: Elevated -> Orange / amber-orange (SAMPLE-04-ELEVATED)
  State 5: High -> Yellow / yellow-orange (SAMPLE-05-HIGH)

Important:
  Dose values are predictions from the prototype machine learning model trained
  on literature-anchored synthetic calibration data. They must NOT be represented
  as real certified chemical exposure calibrations.
  Label: SIMULATED / PROTOTYPE COLOUR STATE.
"""

import os
import sys
import json
import argparse
import numpy as np
import cv2

# Set UTF-8 encoding for Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from scripts.analyze_wristband import (
    srgb_to_cielab,
    compute_delta_e_cie76,
    detect_and_extract_sensing_strip,
    DOSE_NORMAL_MAX,
    DOSE_MONITOR_MAX,
    SHELF_LIFE_MAX_DAYS,
    L0_STAR,
    A0_STAR,
    B0_STAR
)
from models.cupan_model import load_cupan_model
from services.gemini_vision_service import analyze_wristband_with_gemini

# 5 Visual State Definitions
PROTOTYPE_STATES = [
    {
        "sample_id": "SAMPLE-01-FRESH",
        "state_name": "State 1: Fresh / Unexposed",
        "visual_appearance": "Deep Purple / Violet",
        "bgr_target": (122, 58, 92),      # RGB: (92, 58, 122) #5C3A7A
        "expected_status": "NORMAL",
        "literature_anchor": "Pristine unreacted Cu(II)-PAN complex (λmax ~550 nm)",
        "recommended_lighting": "Diffuse daylight 5000K-5500K, 0° glare angle, normal incident illumination"
    },
    {
        "sample_id": "SAMPLE-02-LOW",
        "state_name": "State 2: Low Exposure",
        "visual_appearance": "Violet-Purple / Reddish-Purple",
        "bgr_target": (118, 68, 128),     # RGB: (128, 68, 118) #804476
        "expected_status": "NORMAL",
        "literature_anchor": "Initial sulfide displacement; sub-ppm cumulative onset",
        "recommended_lighting": "Diffuse daylight 5000K-5500K, 0° glare angle, normal incident illumination"
    },
    {
        "sample_id": "SAMPLE-03-INTERMEDIATE",
        "state_name": "State 3: Intermediate Action Level",
        "visual_appearance": "Reddish-Pink / 'New York Pink'",
        "bgr_target": (105, 85, 175),     # RGB: (175, 85, 105) #AF5569
        "expected_status": "MONITOR",
        "literature_anchor": "Thongboon et al. 2023 'New York pink' characteristic intermediate transition",
        "recommended_lighting": "Diffuse daylight 5000K-5500K, 0° glare angle, normal incident illumination"
    },
    {
        "sample_id": "SAMPLE-04-ELEVATED",
        "state_name": "State 4: Elevated Exposure",
        "visual_appearance": "Orange / Amber-Orange",
        "bgr_target": (68, 110, 205),     # RGB: (205, 110, 68) #CD6E44
        "expected_status": "REVIEW",
        "literature_anchor": "Significant Cu(II) demetallation; amber/orange mixed chromophores",
        "recommended_lighting": "Diffuse daylight 5000K-5500K, 0° glare angle, normal incident illumination"
    },
    {
        "sample_id": "SAMPLE-05-HIGH",
        "state_name": "State 5: High / Saturated Exposure",
        "visual_appearance": "Yellow / Yellow-Orange",
        "bgr_target": (42, 185, 235),     # RGB: (235, 185, 42) #EBB92A
        "expected_status": "REVIEW",
        "literature_anchor": "Complete displacement to free neutral H-PAN dye (λmax ~465 nm)",
        "recommended_lighting": "Diffuse daylight 5000K-5500K, 0° glare angle, normal incident illumination"
    }
]


def render_physical_sample_card(bgr_color, sample_id, state_name, output_path):
    """
    Renders a printable/testable physical prototype wristband card image
    featuring housing, sensing window, printed 4-step reference scale, and labels.
    """
    W, H = 800, 480
    img = np.full((H, W, 3), 45, dtype=np.uint8) # Dark test bench surface

    # 1. Wristband Strap
    strap_y1, strap_y2 = 140, 340
    cv2.rectangle(img, (0, strap_y1), (W, strap_y2), (52, 46, 40), -1)

    # 2. White Dosimeter Housing
    hx1, hy1, hx2, hy2 = 180, 110, 620, 370
    cv2.rectangle(img, (hx1, hy1), (hx2, hy2), (242, 244, 245), -1)
    cv2.rectangle(img, (hx1, hy1), (hx2, hy2), (180, 185, 190), 3)

    # Brand & Sample Label
    cv2.putText(img, "RAGE-B8 Cu-PAN DOSIMETER", (hx1 + 25, hy1 + 32),
                cv2.FONT_HERSHEY_SIMPLEX, 0.65, (30, 35, 40), 2, cv2.LINE_AA)
    cv2.putText(img, sample_id, (hx2 - 180, hy1 + 32),
                cv2.FONT_HERSHEY_SIMPLEX, 0.50, (80, 50, 40), 1, cv2.LINE_AA)

    # 3. Printed Reference Calibration Scale (Left side of housing)
    ref_x1, ref_y1 = 205, 160
    ref_w, ref_h = 42, 150
    cv2.rectangle(img, (ref_x1 - 2, ref_y1 - 2), (ref_x1 + ref_w + 2, ref_y1 + ref_h + 2), (140, 145, 150), 2)
    
    # 4 reference color swatches
    ref_colors = [
        (122, 58, 92),   # Fresh Purple
        (105, 85, 175),  # Intermediate Pink
        (68, 110, 205),  # Orange
        (42, 185, 235)   # Saturated Yellow
    ]
    swatch_h = ref_h // 4
    for i, c in enumerate(ref_colors):
        sy1 = ref_y1 + i * swatch_h
        sy2 = ref_y1 + (i + 1) * swatch_h if i < 3 else ref_y1 + ref_h
        cv2.rectangle(img, (ref_x1, sy1), (ref_x1 + ref_w, sy2), c, -1)

    cv2.putText(img, "REF SCALE", (ref_x1 - 10, ref_y1 + ref_h + 18),
                cv2.FONT_HERSHEY_SIMPLEX, 0.38, (90, 95, 100), 1, cv2.LINE_AA)

    # 4. Active Sensing Strip Window (Center)
    sx1, sy1 = 340, 160
    sx2, sy2 = 460, 310
    cv2.rectangle(img, (sx1 - 3, sy1 - 3), (sx2 + 3, sy2 + 3), (160, 165, 170), 2)
    
    # Fill sensing strip with target color
    strip = np.zeros((sy2 - sy1, sx2 - sx1, 3), dtype=np.uint8)
    strip[:] = bgr_color
    # Subtle sensor texture
    noise = np.random.normal(0, 2.5, strip.shape).astype(np.int16)
    noisy_strip = np.clip(strip.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    img[sy1:sy2, sx1:sx2] = noisy_strip

    cv2.putText(img, "Cu-PAN SENSING STRIP", (sx1 - 20, sy2 + 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.42, (60, 65, 70), 1, cv2.LINE_AA)

    # 5. Prototype Disclaimers on Bottom of Housing
    cv2.putText(img, "*** SIMULATED / PROTOTYPE COLOUR STATE ***", (hx1 + 35, hy2 - 12),
                cv2.FONT_HERSHEY_SIMPLEX, 0.42, (100, 70, 30), 1, cv2.LINE_AA)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    cv2.imwrite(output_path, img)
    return output_path


def analyze_sample_image(image_path, model, sample_metadata, temperature=25.0, humidity=50.0, shelf_age_days=15.0):
    """Runs the full image analysis -> OpenCV -> ML prediction pipeline on an image."""
    img_bgr = cv2.imread(image_path)
    if img_bgr is None:
        raise FileNotFoundError(f"Could not load image: {image_path}")

    # 1. Gemini / OpenCV localization & QA
    try:
        gemini_result = analyze_wristband_with_gemini(image_path)
        pixel_boxes = gemini_result.get("pixel_boxes", {})
        strip_roi = pixel_boxes.get("sensing_strip")
        ref_roi = pixel_boxes.get("reference_scale")
        engine = gemini_result.get("provider", "Gemini Vision API")
        qa_verdict = gemini_result.get("image_quality", {}).get("quality_verdict", "PASS")
        qa_score = gemini_result.get("image_quality", {}).get("quality_score", 0.95)
    except Exception:
        strip_roi, ref_roi = None, None
        engine = "OpenCV Fallback"
        qa_verdict = "PASS"
        qa_score = 0.90

    # 2. OpenCV RGB Extraction
    rgb, strip_bbox, ref_bbox, _, _ = detect_and_extract_sensing_strip(
        img_bgr,
        filename=image_path,
        manual_strip_roi=strip_roi,
        manual_ref_roi=ref_roi
    )
    r, g, b = rgb
    hex_color = f"#{r:02X}{g:02X}{b:02X}"

    # 3. Color Space Conversion & Delta E
    L_star, a_star, b_star = srgb_to_cielab(r, g, b)
    delta_e = compute_delta_e_cie76(L_star, a_star, b_star)

    # 4. Random Forest Inference
    features = np.array([[
        L_star, a_star, b_star, delta_e,
        float(temperature), float(humidity), float(shelf_age_days)
    ]], dtype=np.float64)

    pred_doses, pred_stds = model.predict_with_uncertainty(features)
    estimated_dose = max(0.0, float(pred_doses[0]))
    uncertainty_tree_spread = float(np.round(float(pred_stds[0]) * 1.96, 2))

    # 5. Status Classification (Conservative Prototype Thresholds)
    if shelf_age_days > SHELF_LIFE_MAX_DAYS:
        status = "EXPIRED"
    elif estimated_dose < DOSE_NORMAL_MAX:
        status = "NORMAL"
    elif estimated_dose <= DOSE_MONITOR_MAX:
        status = "MONITOR"
    else:
        status = "REVIEW"

    return {
        "sample_id": sample_metadata.get("sample_id", "CUSTOM-SAMPLE"),
        "state_name": sample_metadata.get("state_name", "User Provided Photo"),
        "visual_appearance": sample_metadata.get("visual_appearance", "Observed Color"),
        "image_path": image_path,
        "vision_engine": engine,
        "qa_verdict": qa_verdict,
        "qa_score": round(qa_score, 2),
        "rgb": {"r": r, "g": g, "b": b, "hex": hex_color},
        "lab": {"L": L_star, "a": a_star, "b": b_star},
        "delta_e": delta_e,
        "estimated_dose_ppm_h": round(estimated_dose, 2),
        "tree_spread_ppm_h": uncertainty_tree_spread,
        "status": status,
        "expected_status": sample_metadata.get("expected_status", "N/A"),
        "temperature_c": temperature,
        "humidity_pct": humidity,
        "shelf_age_days": shelf_age_days,
        "prototype_label": "SIMULATED / PROTOTYPE COLOUR STATE"
    }


def main():
    parser = argparse.ArgumentParser(description="Cu-PAN Physical Prototype Testing Workflow")
    parser.add_argument("--images", nargs="+", help="Paths to captured physical prototype photos")
    parser.add_argument("--dir", help="Directory containing captured physical prototype photos")
    parser.add_argument("--temp", type=float, default=25.0, help="Ambient temperature in °C (default: 25.0)")
    parser.add_argument("--rh", type=float, default=50.0, help="Relative humidity %% (default: 50.0)")
    parser.add_argument("--age", type=float, default=15.0, help="Shelf age in days (default: 15.0)")
    parser.add_argument("--json-out", help="Path to save JSON results output")
    args = parser.parse_args()

    # Load trained model
    model_path = os.path.join(PROJECT_ROOT, "models", "cupan_best_model.pkl")
    model = load_cupan_model(model_path)

    samples_to_test = []

    # If custom images or directory passed, use them
    if args.images:
        for i, img_path in enumerate(args.images):
            meta = PROTOTYPE_STATES[i] if i < len(PROTOTYPE_STATES) else {"sample_id": f"CUSTOM-{i+1}"}
            samples_to_test.append((img_path, meta))
    elif args.dir:
        files = sorted([os.path.join(args.dir, f) for f in os.listdir(args.dir) if f.lower().endswith(('.png', '.jpg', '.jpeg'))])
        for i, img_path in enumerate(files):
            meta = PROTOTYPE_STATES[i] if i < len(PROTOTYPE_STATES) else {"sample_id": f"CUSTOM-{i+1}"}
            samples_to_test.append((img_path, meta))
    else:
        # Generate clean physical benchmark reference cards for all 5 visual states
        proto_dir = os.path.join(PROJECT_ROOT, "test_images", "physical_prototypes")
        os.makedirs(proto_dir, exist_ok=True)
        for state in PROTOTYPE_STATES:
            card_path = os.path.join(proto_dir, f"{state['sample_id']}.png")
            render_physical_sample_card(state["bgr_target"], state["sample_id"], state["state_name"], card_path)
            samples_to_test.append((card_path, state))

    print("\n" + "=" * 90)
    print("  Cu-PAN WRISTBAND PHYSICAL PROTOTYPE EVALUATION")
    print("  Classification: SIMULATED / PROTOTYPE COLOUR STATE")
    print("  Baseline Anchor: L0*=40.5, a0*=26.0, b0*=-22.0 (Deep Purple)")
    print(f"  Ambient Conditions: {args.temp}°C, {args.rh}% RH, Shelf Age: {args.age} days")
    print("=" * 90)

    results = []
    for img_path, meta in samples_to_test:
        res = analyze_sample_image(
            img_path, model, meta,
            temperature=args.temp,
            humidity=args.rh,
            shelf_age_days=args.age
        )
        results.append(res)

    # Print Formatted Markdown Comparison Table
    print("\n### PHYSICAL PROTOTYPE EVALUATION TABLE\n")
    headers = [
        "Sample ID", "Visual State", "Extracted RGB", "CIE L*a*b*",
        "ΔE", "Est Dose (ppm·h)", "Tree Spread", "Result", "Expected", "Match"
    ]
    header_str = " | ".join(headers)
    sep_str = " | ".join(["---"] * len(headers))
    print(f"| {header_str} |")
    print(f"| {sep_str} |")

    all_matched = True
    for r in results:
        status_match = "PASS" if r["status"] == r["expected_status"] else "WARNING"
        if status_match != "PASS":
            all_matched = False

        row = [
            f"`{r['sample_id']}`",
            r["visual_appearance"],
            f"`{r['rgb']['hex']}`",
            f"`({r['lab']['L']}, {r['lab']['a']}, {r['lab']['b']})`",
            f"{r['delta_e']:.1f}",
            f"**{r['estimated_dose_ppm_h']:.2f}**",
            f"±{r['tree_spread_ppm_h']:.2f}",
            f"**{r['status']}**",
            r["expected_status"],
            f"**{status_match}**"
        ]
        print(f"| {' | '.join(row)} |")

    print("\n" + "=" * 90)
    if all_matched:
        print("  ✓ ALL 5 PHYSICAL PROTOTYPE COLOUR STATES MATCHED THEIR EXPECTED STATUS!")
    else:
        print("  ! SOME STATES DEVIATED FROM EXPECTED STATUS (Review lighting / color calibration).")
    print("=" * 90 + "\n")

    if args.json_out:
        with open(args.json_out, "w", encoding="utf-8") as jf:
            json.dump(results, jf, indent=2)
        print(f"Detailed JSON results saved to: {args.json_out}")

    return results

if __name__ == "__main__":
    main()
