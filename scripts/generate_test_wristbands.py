"""
Generate realistic synthetic Cu-PAN wristband test images for image-analysis pipeline testing.
Simulates:
  1. Wristband strap & dosimeter housing
  2. Active Cu-PAN colorimetric sensing strip
  3. Printed reference color scale (Purple, Pink, Yellow-Orange, White Balance)
  4. Expiry / shelf-life indicator dot
  5. Band ID and QR code area
"""

import os
import cv2
import numpy as np

def draw_test_wristband(
    strip_bgr,
    band_id="DS-1088",
    is_expired=False,
    lighting_factor=1.0,
    blur=True
):
    # Canvas: 800 x 480 (Width x Height)
    W, H = 800, 480
    img = np.full((H, W, 3), 42, dtype=np.uint8) # Dark background workbench / lab surface

    # 1. Wristband Strap (Silicone strap horizontally across the middle)
    strap_y1, strap_y2 = 140, 340
    # Charcoal-blue silicone strap
    cv2.rectangle(img, (0, strap_y1), (W, strap_y2), (55, 48, 42), -1)
    # Strap texture lines
    for x in range(0, W, 25):
        cv2.line(img, (x, strap_y1 + 5), (x, strap_y1 + 25), (45, 40, 35), 2)
        cv2.line(img, (x, strap_y2 - 25), (x, strap_y2 - 5), (45, 40, 35), 2)

    # 2. Central Dosimeter Housing (Rigid white/off-white plastic cartridge)
    housing_x1, housing_y1 = 180, 110
    housing_x2, housing_y2 = 620, 370
    cv2.rectangle(img, (housing_x1, housing_y1), (housing_x2, housing_y2), (238, 240, 242), -1)
    cv2.rectangle(img, (housing_x1, housing_y1), (housing_x2, housing_y2), (180, 185, 190), 3)

    # Bevel shadow inside housing
    cv2.rectangle(img, (housing_x1 + 4, housing_y1 + 4), (housing_x2 - 4, housing_y2 - 4), (220, 225, 230), 1)

    # Header Text on Housing
    cv2.putText(img, "RAGE-B8 H2S DOSIMETER", (housing_x1 + 25, housing_y1 + 32),
                cv2.FONT_HERSHEY_SIMPLEX, 0.65, (30, 35, 40), 2, cv2.LINE_AA)
    cv2.putText(img, f"ID: {band_id}", (housing_x2 - 130, housing_y1 + 32),
                cv2.FONT_HERSHEY_SIMPLEX, 0.55, (70, 75, 80), 1, cv2.LINE_AA)

    # 3. Active Cu-PAN Sensing Strip Window (Center)
    # Physical window: ~120px wide, ~150px tall
    strip_x1, strip_y1 = 340, 160
    strip_x2, strip_y2 = 460, 320
    
    # Recessed frame
    cv2.rectangle(img, (strip_x1 - 4, strip_y1 - 4), (strip_x2 + 4, strip_y2 + 4), (160, 165, 170), 2)
    # Sensing strip porous paper texture & color
    strip_roi = np.zeros((strip_y2 - strip_y1, strip_x2 - strip_x1, 3), dtype=np.uint8)
    strip_roi[:] = strip_bgr
    # Add subtle microscopic grain/paper texture
    noise = np.random.normal(0, 3.5, strip_roi.shape).astype(np.int16)
    noisy_strip = np.clip(strip_roi.astype(np.int16) + noise, 0, 255).astype(np.uint8)
    img[strip_y1:strip_y2, strip_x1:strip_x2] = noisy_strip

    # Label for sensing strip
    cv2.putText(img, "Cu-PAN SENSOR", (strip_x1 - 5, strip_y2 + 22),
                cv2.FONT_HERSHEY_SIMPLEX, 0.42, (50, 55, 60), 1, cv2.LINE_AA)

    # 4. Printed Reference Scale (Left side of strip)
    ref_x = housing_x1 + 25
    ref_y_start = 160
    patch_w = 32
    patch_h = 32
    
    # Scale: Safe (Purple), Low Action (Pink/Salmon), High (Yellow-Orange), White Calibration
    patches = [
        ("0.0", (128, 50, 98), "0.00 ppm-h (Purple)"),       # BGR for Purple
        ("0.5", (105, 85, 175), "0.50 ppm-h (Pink)"),        # BGR for Pink
        ("1.0", (60, 165, 215), "1.00+ ppm-h (Orange)"),     # BGR for Orange
        ("REF", (248, 248, 250), "White Reference")           # BGR for White reference
    ]

    cv2.putText(img, "REF SCALE", (ref_x, ref_y_start - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.45, (60, 65, 70), 1, cv2.LINE_AA)

    for i, (label, col, desc) in enumerate(patches):
        py = ref_y_start + i * 40
        cv2.rectangle(img, (ref_x, py), (ref_x + patch_w, py + patch_h), col, -1)
        cv2.rectangle(img, (ref_x, py), (ref_x + patch_w, py + patch_h), (140, 145, 150), 1)
        cv2.putText(img, label, (ref_x + patch_w + 8, py + 22),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.45, (40, 45, 50), 1, cv2.LINE_AA)

    # 5. Expiry Indicator & QR Mockup (Right side of strip)
    exp_x = housing_x2 - 120
    exp_y = 165
    
    # Expiry dot
    dot_color = (40, 40, 220) if is_expired else (80, 190, 80) # BGR Red if expired, Green if fresh
    cv2.circle(img, (exp_x + 15, exp_y + 15), 14, dot_color, -1)
    cv2.circle(img, (exp_x + 15, exp_y + 15), 14, (120, 120, 120), 1)
    exp_label = "EXPIRED" if is_expired else "VALID 90D"
    cv2.putText(img, exp_label, (exp_x + 36, exp_y + 20),
                cv2.FONT_HERSHEY_SIMPLEX, 0.42, (40, 40, 40), 1, cv2.LINE_AA)
    cv2.putText(img, "SHELF-LIFE", (exp_x + 5, exp_y + 45),
                cv2.FONT_HERSHEY_SIMPLEX, 0.38, (80, 85, 90), 1, cv2.LINE_AA)

    # QR Code placeholder box
    qr_x, qr_y = exp_x, 230
    cv2.rectangle(img, (qr_x, qr_y), (qr_x + 75, qr_y + 75), (255, 255, 255), -1)
    cv2.rectangle(img, (qr_x, qr_y), (qr_x + 75, qr_y + 75), (0, 0, 0), 1)
    # Draw simple mock QR finder patterns
    for fx, fy in [(qr_x + 5, qr_y + 5), (qr_x + 50, qr_y + 5), (qr_x + 5, qr_y + 50)]:
        cv2.rectangle(img, (fx, fy), (fx + 20, fy + 20), (0, 0, 0), -1)
        cv2.rectangle(img, (fx + 4, fy + 4), (fx + 16, fy + 16), (255, 255, 255), -1)
        cv2.rectangle(img, (fx + 8, fy + 8), (fx + 12, fy + 12), (0, 0, 0), -1)
    cv2.putText(img, "QR SYNC", (qr_x + 8, qr_y + 90),
                cv2.FONT_HERSHEY_SIMPLEX, 0.38, (60, 65, 70), 1, cv2.LINE_AA)

    # Lighting / exposure adjustment
    if lighting_factor != 1.0:
        img = np.clip(img.astype(np.float32) * lighting_factor, 0, 255).astype(np.uint8)

    # Camera lens blur simulation
    if blur:
        img = cv2.GaussianBlur(img, (3, 3), 0.5)

    return img


def main():
    out_dir = os.path.join(os.path.dirname(__file__), "..", "test_images")
    os.makedirs(out_dir, exist_ok=True)

    # 1. Unexposed Baseline (Purple) - Safe, ~0.00 - 0.10 ppm·h
    # sRGB: (100, 50, 130) -> BGR: (130, 50, 100)
    img_baseline = draw_test_wristband(
        strip_bgr=(130, 50, 100),
        band_id="DS-1088",
        is_expired=False
    )
    cv2.imwrite(os.path.join(out_dir, "wristband_baseline_safe.png"), img_baseline)

    # 2. Low-to-Moderate Exposure (Intermediate Pink / Salmon) - Action level ~0.72 ppm·h
    # sRGB: (175, 85, 105) -> BGR: (105, 85, 175)
    img_monitor = draw_test_wristband(
        strip_bgr=(105, 85, 175),
        band_id="DS-1091",
        is_expired=False
    )
    cv2.imwrite(os.path.join(out_dir, "wristband_low_monitor.png"), img_monitor)

    # 3. High Exposure (Yellow-Orange) - Exceeded threshold ~2.80 ppm·h
    # sRGB: (218, 162, 55) -> BGR: (55, 162, 218)
    img_review = draw_test_wristband(
        strip_bgr=(55, 162, 218),
        band_id="DS-1042",
        is_expired=False
    )
    cv2.imwrite(os.path.join(out_dir, "wristband_high_review.png"), img_review)

    # 4. Expired Band (Degraded Matrix, Red Dot)
    img_expired = draw_test_wristband(
        strip_bgr=(125, 60, 95),
        band_id="DS-1077",
        is_expired=True
    )
    cv2.imwrite(os.path.join(out_dir, "wristband_expired_band.png"), img_expired)

    print(f"Generated 4 test wristband images in: {os.path.abspath(out_dir)}")
    for f in sorted(os.listdir(out_dir)):
        p = os.path.join(out_dir, f)
        print(f" - {f} ({os.path.getsize(p):,} bytes)")

if __name__ == "__main__":
    main()
