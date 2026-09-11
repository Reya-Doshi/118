# Cu-PAN Dosimeter Wristband — Physical Prototype Testing Protocol

> [!CAUTION]
> ### STRICT SAFETY MANDATE: NO CHEMICAL H₂S EXPOSURE
> * **DO NOT** generate, handle, or release toxic hydrogen sulfide ($H_2S$) gas in any laboratory, classroom, or demonstration setting.
> * Hydrogen sulfide is an acute neurotoxin and chemical asphyxiant (OSHA IDLH = 100 ppm).
> * All physical prototype testing is conducted using **safe, non-toxic physical color mockups** (calibrated matte color cards, printed spectrophotometric targets, or food-grade colorants).
> * All outputs are labeled: **`SIMULATED / PROTOTYPE COLOUR STATE`**.

---

## 1. The 5 Physical Prototype Visual States

The prototype demonstration tests 5 distinct visual stages representing the continuous transition from pristine Cu(II)-PAN chelate complex to sulfide-displaced free H-PAN dye:

| State # | Sample Identifier | Visual Stage Description | Literature Reference Anchor | Target Hex | CIE $L^*, a^*, b^*$ (approx) | Prototype Status |
| :---: | :--- | :--- | :--- | :---: | :---: | :---: |
| **1** | `SAMPLE-01-FRESH` | Fresh Unexposed (Deep Purple / Violet) | Pristine unreacted Cu(II)-PAN complex ($\lambda_{\max} \sim 550\text{ nm}$) | `#5C3A7A` | $(31.1, 28.4, -30.9)$ | **`NORMAL`** |
| **2** | `SAMPLE-02-LOW` | Low Exposure (Violet-Purple / Reddish-Purple) | Initial sulfide cleavage; sub-ppm onset | `#804476` | $(37.9, 33.2, -17.5)$ | **`NORMAL`** |
| **3** | `SAMPLE-03-INTERMEDIATE` | Action Level (Reddish-Pink / *"New York Pink"*) | Thongboon et al. 2023 characteristic intermediate phase | `#AF5569` | $(47.8, 38.8, 5.9)$ | **`MONITOR`** |
| **4** | `SAMPLE-04-ELEVATED` | Elevated Exposure (Orange / Amber-Orange) | High copper displacement; mixed chromophores | `#CD6E44` | $(56.6, 34.0, 39.7)$ | **`REVIEW`** |
| **5** | `SAMPLE-05-HIGH` | High / Saturated (Yellow / Yellow-Orange) | Complete demetallation to free H-PAN ($\lambda_{\max} \sim 465\text{ nm}$) | `#EBB92A` | $(77.6, 5.6, 72.4)$ | **`REVIEW`** |

---

## 2. Safe Physical Sample Preparation

To fabricate physical prototype testing cards without chemical hazards:

1. **Option A: High-Fidelity Colorimetric Test Cards (Recommended)**
   * Print the 5 reference sample images in [`test_images/physical_prototypes/`](./test_images/physical_prototypes/) onto **high-grade matte photo paper** (or vinyl sticker paper).
   * Do NOT use glossy paper (gloss produces specular flash glare that disrupts optical extraction).
   * Cut out each dosimeter housing card and mount it onto a 3D-printed or silicone wristband strap.

2. **Option B: Interchangeable Sensing Strip Swatches**
   * Fabricate a single 3D-printed dosimeter wristband housing with an open optical window ($15\text{ mm} \times 20\text{ mm}$) and adjacent printed 4-step reference scale.
   * Cut 5 interchangeable cellulosic paper strips printed with the exact hex swatches above.
   * Slide each strip into the housing to demonstrate real-time color change in the mobile app.

---

## 3. Photography Protocol & Rigorous Checklist

Follow this standardized protocol for repeatable optical measurements:

### Pre-Capture Checklist
- [ ] **Fixed Diffuse Lighting**: Use a 5000K–5500K neutral daylight LED (desk lamp or ring light with a diffuser sheet). Avoid warm tungsten bulbs or direct sunlight.
- [ ] **Fixed Camera Distance**: Hold phone / camera at a perpendicular distance of **15 to 20 cm** directly above the wristband.
- [ ] **Zero Specular Glare**: Tilt light source at $45^\circ$ to the surface so direct glare does not reflect into the camera lens.
- [ ] **Reference Scale Visible**: Ensure the printed 4-step reference scale on the left of the dosimeter window is completely unoccluded.
- [ ] **Sensing Strip Unobstructed**: Keep fingers, thumbs, and straps clear of the central sensing aperture.
- [ ] **Consistent Orientation**: Position wristband horizontally with the header text right-side up.
- [ ] **Triplicate Shots**: Take 3 photos per color state to demonstrate lighting normalization stability.

---

## 4. How to Run the Physical Test Workflow

### Method 1: Automated Script (Batch Evaluation)
```bash
# Run benchmark evaluation across all 5 physical prototype states:
python scripts/test_physical_prototypes.py
# Or using npm:
npm run prototype:test

# Run evaluation on photos you have taken with your smartphone:
python scripts/test_physical_prototypes.py --images photo1.jpg photo2.jpg photo3.jpg photo4.jpg photo5.jpg

# Run on an entire directory of captured prototype photos:
python scripts/test_physical_prototypes.py --dir path/to/captured_photos/
```

### Method 2: Live Mobile Companion App
1. Launch the backend: `npm run backend:dev` (or `python backend/main.py`).
2. Open the mobile app at `http://localhost:5174` (or on your smartphone connected to Wi-Fi).
3. Tap **"Scan Wristband"** $\to$ **"Take Photo"** (or **"Upload Photo"**).
4. Photograph your physical sample card.
5. Watch the 5-step analysis animation $\to$ View real ML-estimated dose and safety classification.
6. Tap **"Save Reading"** to log the measurement into **History**.

---

## 5. Outputs to Record

For each physical test, log the following parameters in your demonstration log sheet:

1. **Sample ID & Visual State** (e.g. `SAMPLE-03-INTERMEDIATE`)
2. **Extracted sRGB & Hex Code** (e.g. `#AF5569`)
3. **CIE $L^*, a^*, b^*$ Coordinates** (e.g. $47.8, 38.8, 5.9$)
4. **Calculated $\Delta E_{ab}^*$** relative to pristine baseline $(40.5, 26.0, -22.0)$
5. **Model Estimated Dose** in $\text{ppm}\cdot\text{h}$ (e.g. $0.89\text{ ppm}\cdot\text{h}$)
6. **Model Tree Spread Heuristic** (e.g. $\pm 0.35\text{ ppm}\cdot\text{h}$)
7. **Operational Status** (`NORMAL`, `MONITOR`, or `REVIEW`)
8. **Optical QA Verdict** (`PASS` or `WARNING`)

---

## 6. Demonstration PASS / FAIL Criteria

| Evaluation Check | PASS Condition | FAIL Condition |
| :--- | :--- | :--- |
| **Monotonic Dose Trend** | Estimated dose increases monotonically from State 1 through State 5: $\text{Dose}_1 \le \text{Dose}_2 < \text{Dose}_3 < \text{Dose}_4 < \text{Dose}_5$. | Higher color stage yields a lower estimated dose than a lower stage. |
| **Action Level Tripping** | State 1 & State 2 classify as **`NORMAL`**; State 3 classifies as **`MONITOR`**; State 4 & State 5 classify as **`REVIEW`**. | State 1 triggers `REVIEW`, or State 5 remains `NORMAL`. |
| **Optical Localization** | Gemini / OpenCV correctly isolates the sensing strip window without manual cropping. | Sensing strip bounding box misses the active window or captures surrounding strap. |
| **Repeatability** | Triplicate photos of the same physical card under fixed lighting yield $\Delta E$ within $\pm 2.0$ units. | Consecutive shots vary by $\Delta E > 5.0$ due to unmitigated glare or shadows. |
| **Scientific Compliance** | All screens and logs prominently display **`SIMULATED / PROTOTYPE COLOUR STATE`**. | Demonstration claims live toxic gas calibration. |
