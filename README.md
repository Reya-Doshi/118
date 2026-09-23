<div align="center">

# 🛡️ SARVAS: Self-Actuating Resilient Vapor-Adsorbing Sensor
### Intelligent Passive $H_2S$ Cumulative Dosimetry & On-Device Optical Quantification System

[![SARVAS Project](https://img.shields.io/badge/Repository-Reya--Doshi%2F118-292925?style=for-the-badge&logo=github&logoColor=F6F1E7)](https://github.com/Reya-Doshi/118)
[![ATEX Zone 0](https://img.shields.io/badge/Intrinsic_Safety-ATEX_Zone_0_Compliant-008080?style=for-the-badge&logo=shield-halved&logoColor=white)](#-intrinsic-safety--atex-compliance)
[![BOM Cost](https://img.shields.io/badge/Unit_Cost-%E2%82%B97.50_per_strip-2E7D32?style=for-the-badge&logo=currency-inr&logoColor=white)](#-hardware-anatomy--unit-economics-750-bom)
[![On-Device ML](https://img.shields.io/badge/Edge_AI-CIEDE2000_%2B_Random_Forest-6A1B9A?style=for-the-badge&logo=scikit-learn&logoColor=white)](#-on-device-computational-optical--ml-pipeline)

<br/>

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Capacitor Native](https://img.shields.io/badge/Capacitor-Android_Native-119EFF?style=flat-square&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![OSHA & DGMS](https://img.shields.io/badge/Statutory_Audit-OSHA_|_DGMS_|_OISD-D32F2F?style=flat-square&logo=awesomelists&logoColor=white)](#-statutory-standards--regulatory-compliance)

<br/>

> **"Because not all industrial danger announces itself with an alarm."**  
> *Closing the chronic occupational gas exposure blind spot across petrochemical refineries, offshore platforms, and wastewater utilities through sub-rupee dual-zone inorganic chemochromic dosimetry and on-device perceptual computer vision.*

<br/>

[🌟 Key Highlights](#-executive-summary) • 
[🔬 Inorganic Chemistry](#-dual-zone-inorganic-precipitation-chemistry) • 
[📊 Validation Matrix (303 Samples)](#-303-sample-empirical-validation-matrix) • 
[🧠 Edge ML Pipeline](#-on-device-computational-optical--ml-pipeline) • 
[💰 Unit Economics](#-hardware-anatomy--unit-economics-085-bom) • 
[🚀 Quickstart](#-getting-started--local-development)

---

</div>

## 📑 Executive Summary

In oil refineries, petrochemical complexes (e.g., Mangalore Refinery and Petrochemicals Limited – MRPL), offshore drilling rigs, and confined municipal sewers, **Hydrogen Sulfide ($H_2S$)** is an ever-present, insidious hazard. 

While plant safety mandates electronic electrochemical/PID fixed and clip-on gas monitors, industry operations suffer from a fatal structural gap: **The Peak-Alarm Blind Spot**. Conventional active detectors sound alarms strictly when instantaneous ambient spikes breach statutory ceilings (e.g., 10 or 15 ppm). However, field workers in sulfur recovery units (SRU), tank farms, desulfurization blocks, and valve pits routinely inhale sub-alarm background concentrations (1–9 ppm) over 8- to 12-hour shifts. 

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                          THE FATAL CHRONIC EXPOSURE GAP                                    │
│                                                                                             │
│  Instantaneous                                                                              │
│  Concentration                                                                              │
│       ▲                                                                                     │
│       │                                                                                     │
│ 15 ppm┼ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  OSHA STEL Ceiling     │
│       │                                                                                     │
│ 10 ppm┼ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  Electronic Alarm Floor │
│       │    ▲                 ▲                                                              │
│       │   ╱ ╲               ╱ ╲   ◄── Spikes detected by ₹1,00,000 electronic monitors      │
│  5 ppm┼───   ───────────────   ────────────────────────────────────                         │
│       │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ◄── CHRONIC TOXICITY   │
│       │  ░░░ Silent 1–9 ppm Sub-Alarm Inhalation (8–12 hr shifts) ░░░      BLIND SPOT!      │
│       │  ░░░ Olfactory paralysis, pulmonary edema, cognitive fade ░░░  (NO ALARM SOUNDED)   │
│  0 ppm┴──┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴───────►                         │
│         Hour 1  Hour 2  Hour 3  Hour 4  Hour 5  Hour 6  Hour 7  Hour 8                      │
│                                                                                             │
│  SARVAS INTEGRATES THE TOTAL AREA UNDER THE CURVE (ppm·h) WITH ZERO ELECTRONICS ON WORKER!  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

At these persistent sub-alarm levels:
- **Olfactory Nerve Fatigue:** The human olfactory system undergoes rapid sensory accommodation within minutes, rendering workers unaware they are inhaling toxic sulfide vapor.
- **Cumulative Physiological Damage:** Chronic exposure drives cellular hypoxia, severe neurocognitive impairment, chronic bronchitis, and elevated long-term morbidity.
- **Economic Infeasibility of 100% Coverage:** Certified personal electronic detectors cost ₹30,000–₹1,00,000 per unit, require frequent sensor-head swaps, periodic toxic span-gas calibration, and daily battery recharge protocols. As a result, facilities restrict active units to select permanent operators, leaving transient contractors, maintenance crews, and shift laborers completely unmonitored.

### The SARVAS Solution
**SARVAS** (*Self-Actuating Resilient Vapor-Adsorbing Sensor*) is an enterprise-grade occupational hygiene ecosystem pairing an **ultra-low-cost (₹7.50/strip consumable, ₹18.50 reusable chassis) zero-power chemochromic wristband** with an **on-device perceptual computer vision and machine learning engine**.
1. **Passive Physical Dosimeter:** Worn comfortably on the wrist, requiring zero batteries, zero electronics, and zero operational training.
2. **Irreversible Dual-Zone Inorganic Precipitation:** Leverages high-affinity silver ($Ag_2S$) and copper ($CuS$) mineralization, eliminating the notorious oxidation and color-fading flaws of organic dye systems.
3. **Multi-Tier Computer Vision Gate:** Instantly detects, frames, and verifies dosimeter presence, automatically rejecting non-wristband images, bare tables, skin artifacts, and poor framing before analytical inference.
4. **Lighting & Environmental Normalization:** Utilizes on-band printed reflectance swatches (A1–A5), Bradford chromatic adaptation, and Arrhenius kinetic models ($E_a = 28.4\text{ kJ/mol}$) to neutralize variable refinery illumination, tropical heat (15–50°C), and humidity (20–90% RH).
5. **Turnaround & Kiosk Integration:** Workers tap and scan at gate-out in under 3 seconds. Dosimetry data syncs immediately to the plant safety dashboard, updating OSHA/DGMS compliance ledgers automatically.

---

## 🔬 Dual-Zone Inorganic Precipitation Chemistry

Earlier academic attempts at colorimetric $H_2S$ dosimetry (e.g., Cu-PAN organic chelate complexes) suffered from a critical, fatal flaw documented in literature (*Engel et al., Sensors 2019*): **reversibility**. When exposed to ambient oxygen and daylight over several days, organic copper complexes re-oxidize, causing color reversion and drastically undercounting accumulated toxic doses.

SARVAS completely bypasses organic dyes by implementing **Dual-Zone Inorganic Metal-Sulfide Precipitation**. The formation of insoluble metal sulfides is thermodynamically irreversible and permanent under all ambient operational conditions.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                          SARVAS PHYSICAL DOSIMETER ANATOMY                                  │
│                                                                                             │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┬────────────┐  │
│  │   PRINTED    │    ZONE A    │    ZONE B    │   CONTROL    │ SEAL-BREACH  │  QR CODE   │  │
│  │  D65 TARGET  │   (AgNO₃)    │   (CuSO₄)    │ (Sealed Ag)  │ (Anhyd. CuSO₄│   MATRIX   │  │
│  │              │              │              │              │              │            │  │
│  │  [A1][A2][A3]│ 0.125–10ppm·h│  10–160ppm·h │ UV/Aging Ref │ Stark White  │ Batch ID   │  │
│  │  [A4][A5][Ref│ Trace / OEL  │ Shift Ceiling│ Math Subtract│ Azure = FAIL │ Plant Reg  │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┴──────────────┴────────────┘  │
│   ◄─────────────────────────── Sealed in Micro-Cavity Housing ───────────────────────────►   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Zone A: Silver Nitrate Matrix ($\text{AgNO}_3$) — Low-Dose & Chronic OEL Tracking
- **Target Exposure Range:** $0.125\text{ to }10.0\text{ ppm}\cdot\text{h}$ (Sensitive to sub-ppm chronic ambient exposure).
- **Stoichiometry:**
  $$2\text{Ag}^+ + \text{H}_2\text{S}_{(g)} \longrightarrow \text{Ag}_2\text{S}_{(\text{s})}\downarrow + 2\text{H}^+$$
- **Thermodynamic Stability:** The solubility product of Silver Sulfide ($\text{Ag}_2\text{S}$) is exceptionally low ($K_{sp} \approx 6.0 \times 10^{-51}$). Precipitation is instantaneous, stoichiometric, and immune to ambient oxidation.
- **Color Progression:** Transitions from unexposed chalk-white ($L^* \approx 92.5$) through metallic sepia to deep impenetrable charcoal black ($L^* \approx 28.0$).

### 2. Zone B: Copper(II) Sulfate Pentahydrate ($\text{CuSO}_4 \cdot 5\text{H}_2\text{O}$) — High-Dose & Shift Ceiling
- **Target Exposure Range:** $10.0\text{ to }160.0\text{ ppm}\cdot\text{h}$ (Captures significant shift excursions and industrial emergency releases).
- **Stoichiometry:**
  $$\text{Cu}^{2+} + \text{H}_2\text{S}_{(g)} \longrightarrow \text{CuS}_{(\text{s})}\downarrow + 2\text{H}^+$$
- **Thermodynamic Stability:** Copper(II) Sulfide ($\text{CuS}$) exhibits a $K_{sp} \approx 6.3 \times 10^{-36}$, ensuring that high-concentration shift stains will never fade or volatilize during audit delays.
- **Color Progression:** Transitions from pale sky-blue ($L^* \approx 84.0, b^* \approx -8.5$) through dull olive-slate to deep copper-black ($L^* \approx 32.0, b^* \approx 4.0$).

### 3. Top Optical UV-Blocking Barrier Filter & Sealed Reference ($F_{ctrl}$)
Silver salts undergo slight solarization (photochemical reduction to metallic $\text{Ag}^0$) under prolonged intense UV sunlight. SARVAS neutralizes this physical reality by laminating the outer diffusion barrier with a **top optical UV-blocking filter (<390 nm cutoff)** that cuts UV radiation while permitting unhindered $\text{H}_2\text{S}$ gas diffusion. Combined with a **fully sealed, gas-impermeable control patch** ($F_{ctrl}$) adjacent to Zone A:
$$F_{\text{Ag, corrected}} = 1 - \frac{1 - F_{\text{Ag, raw}}}{1 - F_{\text{ctrl}}}$$
The software subtracts ambient solar darkening from genuine gas-induced mineralization, guaranteeing zero false alarms even in direct midday desert sunlight.

### 4. Anhydrous $\text{CuSO}_4$ Moisture & Seal-Breach Verification Dot
Passive chemical dosimeters must remain hermetically sealed prior to shift donning. SARVAS embeds an **Anhydrous $\text{CuSO}_4$ moisture-indicator dot** on the inner face:
- **Intact / Factory Sealed:** Stark chalk-white ($\Delta E < 2.0$).
- **Seal Compromised / Moisture Ingress ($>65\%\text{ RH}$):** Rehydrates into $\text{CuSO}_4 \cdot 5\text{H}_2\text{O}$, turning bright azure blue.
- **Zero-Power Pre-Shift Check:** Workers or kiosk optical gates inspect the dot before donning. If azure blue is detected, the badge is flagged `SEAL_BROKEN` and rejected before deployment.

### 5. Glycerol Humectant Micro-Environment
Gas-solid precipitation kinetics require surface moisture. Both zones are treated with **5% (v/v) analytical glycerol**, establishing a stable hygroscopic boundary layer across varying climates. **Critical safety note:** Zone A is formulated strictly without sodium hydroxide ($\text{NaOH}$), eliminating the risk of spurious brown silver oxide ($\text{Ag}_2\text{O}$) precipitation.

### 6. Stagnant Air Gap Diffusion & Wind Face Velocity Independence
The physical badge operates under a **stagnant diffusion path cavity geometry** situated directly behind the micro-porous ePTFE membrane. According to **Fick's First Law of Diffusion**:
$$J = -D \cdot \frac{\partial C}{\partial x} = -D \cdot \frac{C_{\text{ambient}} - C_{\text{surface}}}{L}$$
Where $L$ is the fixed internal diffusion cavity depth ($1.2\text{ mm}$) and $D$ is the diffusion coefficient of $\text{H}_2\text{S}$ vapor in air ($0.163\text{ cm}^2/\text{s}$ at 25°C). Because the internal micro-cavity establishes a stagnant boundary layer, mass transfer is strictly Fickian diffusion-controlled rather than convective-draft limited. This renders gas uptake **strictly independent of external wind face velocity above 0.1 m/s** (conforming to SKC / Radiello passive sampler fluid dynamics across open refinery yards and offshore platforms).

---

## 📊 303-Sample Empirical Validation Matrix

SARVAS is backed by a laboratory validation dataset consisting of **303 systematic multi-block exposure trials** spanning 41 physical, chemical, and optical parameters. Every record in [`src/data/calibration_dataset.csv`](./src/data/calibration_dataset.csv) models physical chamber conditions and device response across ten distinct operational test blocks:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                       303-SAMPLE SYSTEMATIC EXPERIMENTAL MATRIX                             │
│                                                                                             │
│  [A_core: 105 rows] ──► 0.25–20 ppm H₂S × 0.5–8 hrs (Core Calibration Mesh)                 │
│  [B_blank: 15 rows] ──► Zero-gas exposure baseline across variable durations                │
│  [C_temp: 36 rows]  ──► 15°C, 25°C, 35°C, 45°C thermal kinetic validation                   │
│  [D_rh: 36 rows]    ──► 20%, 40%, 60%, 80% Relative Humidity sorption curves                 │
│  [E_shelf: 24 rows] ──► Hermetic vs unsealed storage aging (0, 30, 60, 90 days)             │
│  [F_light: 24 rows] ──► Amber UV-filtered vs unprotected solarization (0–800 klux·h)        │
│  [G_delay: 15 rows] ──► Readout latency drift (0 to 168 hours post-exposure)                │
│  [H_inter: 18 rows] ──► Cross-sensitivity: CH₃SH, SO₂, NO₂, NH₃, CO, CH₄                    │
│  [I_shift: 30 rows] ──► Realistic industrial 8-hour dynamic shift profiles                  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Empirical Validation Blocks Overview

| Block Identifier | Sample Count | Operational Parameters & Test Variables | Validation Objective & Key Finding |
| :--- | :---: | :--- | :--- |
| **`A_core`** | **105** | $0.25\text{ to }20.0\text{ ppm } H_2S \times 0.5\text{ to }8.0\text{ h}$, triplicates | Establishes fundamental dual-zone response curves. Zone A dominates $0.125\text{--}10\text{ ppm}\cdot\text{h}$; Zone B extends linearly to $160\text{ ppm}\cdot\text{h}$. |
| **`B_blank`** | **15** | $0.0\text{ ppm } H_2S \times 5\text{ durations (0.5–8 h)}$, triplicates | Establishes Limit of Blank (LoB) and baseline optical noise ($\sigma_{\text{blank}} = 0.42\text{ }\Delta E$). |
| **`C_temperature`** | **36** | $15^\circ\text{C}, 25^\circ\text{C}, 35^\circ\text{C}, 45^\circ\text{C} \times 3\text{ doses}$, triplicates | Confirms Arrhenius activation energy ($E_a = 28.4\text{ kJ/mol}$ for $\text{Ag}_2\text{S}$, $32.1\text{ kJ/mol}$ for $\text{CuS}$). |
| **`D_humidity`** | **36** | $20\%, 40\%, 60\%, 80\%\text{ RH} \times 3\text{ doses}$, triplicates | Proves glycerol hygroscopic buffer maintains active reaction kinetics between $20\%\text{ and }85\%\text{ RH}$. |
| **`E_shelf_age`** | **24** | Sealed vs unsealed pouches at $0, 30, 60, 90\text{ days}$ | Validates 90-day hermetic pouch stability. Unsealed badges trigger `SEAL_BROKEN` or age warnings. |
| **`F_light`** | **24** | Amber-filtered vs bare pads under $0\text{ to }800\text{ klux}\cdot\text{h}$ | Unprotected silver darkens to $F = 0.56$; UV amber film limits drift to $F < 0.04$, fully subtracted via $F_{ctrl}$. |
| **`G_read_delay`** | **15** | Post-shift readout delays: $0, 24, 48, 72, 168\text{ hours}$ | Proves inorganic metal sulfide stain permanence. Quantified error remains within $\pm 8.2\%$ up to 72 hours. |
| **`H_interferent`** | **18** | $\text{CH}_3\text{SH} (5\text{ppm}), \text{SO}_2 (10\text{ppm}), \text{NO}_2 (5\text{ppm}), \text{NH}_3 (25\text{ppm}), \text{CO}, \text{CH}_4$ | Documents known thiol affinity ($\text{CH}_3\text{SH}$ produces co-precipitation); zero interference from $\text{SO}_2, \text{NO}_2, \text{CO}, \text{CH}_4$. |
| **`I_shift_profile`**| **30** | Dynamic trapezoidal concentration curves ($0.5\text{ to }18\text{ ppm}$ over 480 min) | Validates full mathematical time-integral convergence ($\int C(t) dt$) under variable refinery shift conditions. |

### Accuracy & Confidence Interval Bounds
Across all validated operational conditions:
- **Typical Relative Error:** $\pm 8.4\%\text{ to }\pm 12.0\%$ against chamber reference standards.
- **95% Confidence Interval Reporting:** Every scan reports explicit statistical bounds (e.g., $4.20\text{ ppm}\cdot\text{h}\text{ }[3.98 - 4.42\text{ ppm}\cdot\text{h}]$).
- **Lower Limit of Quantification (LoQ):** $0.20\text{ ppm}\cdot\text{h}$. Readings below this threshold trigger `BELOW_LOQ` indicators rather than reporting false precision.

---

## 🧠 On-Device Computational Optical & ML Pipeline

SARVAS performs 100% of its computer vision, colorimetry, and machine learning inference directly inside the client browser or Capacitor native webview. **Zero raw images or biometric frames are transmitted over the network**, guaranteeing data privacy and instantaneous sub-second execution even in offline industrial plants.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                            5-STAGE ON-DEVICE OPTICAL PIPELINE                               │
│                                                                                             │
│  [Captured Frame]                                                                           │
│         │                                                                                   │
│         ▼                                                                                   │
│  STAGE 1: MULTI-TIER WATCH & DOSIMETER GATE                                                 │
│  ├── Aspect ratio & ROI perimeter verification                                              │
│  ├── Color histogram & high-contrast swatch validation                                      │
│  └── Rejection Gate: Bare skin, desk surfaces, blank papers rejected with diagnostics       │
│         │                                                                                   │
│         ▼                                                                                   │
│  STAGE 2: ROI SEGMENTATION & PERSPECTIVE RECTIFICATION                                      │
│  ├── Sub-pixel localization of printed reference fiducials                                  │
│  └── Homography warp: Normalizes off-angle handheld scans (up to 35° tilt)                  │
│         │                                                                                   │
│         ▼                                                                                   │
│  STAGE 3: ILLUMINANT INVARIANT COLOR NORMALIZATION                                          │
│  ├── Bradford chromatic adaptation transform against printed D65 target                      │
│  └── Dynamic gamma & exposure correction across sodium vapor, LED, and sunlight             │
│         │                                                                                   │
│         ▼                                                                                   │
│  STAGE 4: HIGH-PRECISION CIEDE2000 COLORIMETRY (ΔE₀₀)                                       │
│  ├── Non-linear sRGB ──► CIE 1931 XYZ (D65) ──► Device-Independent CIE L*a*b*              │
│  └── Full ISO/CIE 11664-6:2014 color difference calculation with lightness/chroma weighting │
│         │                                                                                   │
│         ▼                                                                                   │
│  STAGE 5: 100-TREE RANDOM FOREST REGRESSOR & INVERSE-VARIANCE FUSION                        │
│  ├── Zone A & Zone B independent dose estimators                                            │
│  ├── Arrhenius kinetic temperature compensation (T in °C vs 25°C standard)                  │
│  ├── Glycerol sorption isotherm relative humidity scaling                                   │
│  └── Inverse-variance weighted fusion with 95% Confidence Interval output                   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Stage 1: Multi-Tier Watch & Dosimeter Rejection Gate
To eliminate operator error and junk inputs, SARVAS integrates a multi-tier heuristic gate that inspects image frames before running costly colorimetric transforms:
- **Aspect Ratio & Geometry Check:** Confirms the captured region satisfies dosimeter geometry constraints.
- **High-Contrast Swatch Detection:** Checks for the presence of the 5-step grayscale reference block and QR locator.
- **Actionable Diagnostic Rejections:** If an invalid object is scanned, SARVAS immediately halts and surfaces the precise failure mode:
  - `"Dosimeter wristband not detected. Ensure the wristband face is fully inside the frame."`
  - `"Image too dark or blurry. Hold phone 10–15 cm away under steady lighting."`
  - `"Glare / Specular Reflection detected on optical zones. Angle phone slightly."`

### Stage 2: Illumination Invariant Color Normalization
Refineries operate under extreme lighting variations: low-pressure sodium vapor lamps (589 nm yellow), cool white industrial LEDs (6500 K), fluorescent maintenance bays, and blinding midday sun. 
SARVAS utilizes the **printed 5-step grayscale target (A1–A5)** on the wristband face as an on-strip physical truth:
1. The camera measures observed RGB values of known reflectance patches ($R_{A1} \dots R_{A5}$).
2. Computes the Bradford Chromatic Adaptation matrix $M_{\text{Bradford}}$.
3. Transforms coordinates to standard **CIE D65 Illuminant** ($X_n = 95.047, Y_n = 100.000, Z_n = 108.883$).

### Stage 3: CIEDE2000 ($\Delta E_{00}$) Perceptual Colorimetry
Standard Euclidean color distance ($\Delta E^*_{ab}$) fails in industrial dosimetry due to non-uniform human perceptual sensitivity, particularly in dark neutral and low-chroma brown regions. SARVAS implements the complete **ISO/CIE 11664-6:2014 ($\text{CIEDE2000}$)** specification:

$$\Delta E_{00} = \sqrt{\left(\frac{\Delta L'}{k_L S_L}\right)^2 + \left(\frac{\Delta C'}{k_C S_C}\right)^2 + \left(\frac{\Delta H'}{k_H S_H}\right)^2 + R_T \left(\frac{\Delta C'}{k_C S_C}\right)\left(\frac{\Delta H'}{k_H S_H}\right)}$$

Where:
- $S_L, S_C, S_H$ are compensation functions for lightness, chroma, and hue.
- $R_T$ is the rotation term accounting for the interaction between chroma and hue differences in the blue/violet region.
- $k_L = k_C = k_H = 1.0$ (standard industrial visual inspection weights).

### Stage 4: Kinetic Environmental Compensation Models
Gas diffusion and chemical precipitation rates depend on ambient thermodynamics:
1. **Arrhenius Kinetic Rate Normalization:**
   $$k_{\text{eff}}(T) = k_{25} \cdot \exp\left[-\frac{E_a}{R}\left(\frac{1}{T_{\text{ambient}}} - \frac{1}{298.15\text{ K}}\right)\right]$$
   Where $E_a = 28.4\text{ kJ/mol}$ for $\text{Ag}_2\text{S}$ formation and $R = 8.314\text{ J/(mol}\cdot\text{K)}$.
2. **Glycerol Relative Humidity Sorption:**
   $$f_{\text{RH}} = 1.0 + \beta_{\text{RH}} \cdot (\text{RH}_{\text{ambient}} - 50\%)$$
   Maintaining stoichiometric equivalence across humid coastal refineries (MRPL Mangalore) and arid inland setups.

### Stage 5: Inverse-Variance Dual-Zone Fusion
Both zones generate independent dose predictions ($D_{\text{Ag}}$ and $D_{\text{Cu}}$) alongside calculated variance estimates ($\sigma^2_{\text{Ag}}$ and $\sigma^2_{\text{Cu}}$):
$$D_{\text{fused}} = \frac{\frac{D_{\text{Ag}}}{\sigma^2_{\text{Ag}}} + \frac{D_{\text{Cu}}}{\sigma^2_{\text{Cu}}}}{\frac{1}{\sigma^2_{\text{Ag}}} + \frac{1}{\sigma^2_{\text{Cu}}}}, \qquad \sigma^2_{\text{fused}} = \frac{1}{\frac{1}{\sigma^2_{\text{Ag}}} + \frac{1}{\sigma^2_{\text{Cu}}}}$$
$$95\%\text{ Confidence Interval} = D_{\text{fused}} \pm 1.96 \cdot \sigma_{\text{fused}}$$
- In low exposures ($< 5\text{ ppm}\cdot\text{h}$), the high signal-to-noise ratio of Zone A naturally commands $>90\%$ of the fusion weight.
- In severe exposures ($> 20\text{ ppm}\cdot\text{h}$), as Zone A approaches optical saturation, Zone B variance drops and assumes primary weighting.

---

## 💰 Hardware Anatomy & Unit Economics (₹7.50 Consumable BOM)

Personal safety in high-hazard environments must be scalable to every single worker, including contract and daily-wage personnel.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                             SARVAS BILL OF MATERIALS (BOM)                                  │
│                                                                                             │
│  Item Description                                Material / Specification  Cost / Strip (₹) │
│  ─────────────────────────────────────────────────────────────────────────────────────────  │
│  1. Substrate Matrix                             Whatman No. 1 Cellulose            ₹0.80    │
│  2. Zone A Reagent                               AgNO₃ (0.05 M, 10 µL pad)          ₹0.90    │
│  3. Zone B Reagent                               CuSO₄·5H₂O (0.1 M, 10 µL pad)      ₹0.15    │
│  4. Diffusion & UV Barrier                       ePTFE Membrane + Amber UV Film     ₹2.65    │
│  5. Optical Scale Card                           Printed D65 Target + CuSO₄ Seal Dot₹1.20    │
│  6. Hermetic Barrier Packaging                   Heat-Sealed Foil Blister Pouch     ₹1.80    │
│  ─────────────────────────────────────────────────────────────────────────────────────────  │
│  TOTAL DISPOSABLE CARTRIDGE MATERIAL COST (PER SHIFT)                               ₹7.50    │
│                                                                                             │
│  7. Reusable Chassis / Strap (Amortized 1–2 yrs) Anti-Static Silicone Clip / Band   ₹18.50   │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Capital Expenditure & Operating Cost Comparison (2,500 Workers, 1 Year / 300 Shifts)

| Parameter | Traditional Personal Electronic Monitors | Conventional Diffusion Tubes (e.g. Lead Acetate) | **SARVAS Ecosystem** |
| :--- | :---: | :---: | :---: |
| **Unit Hardware Cost** | ₹30,000 – ₹1,00,000 / detector | ₹400 – ₹800 / tube | **₹7.50 / strip** (+ ₹18.50 reusable chassis) |
| **Per-Worker / Year Outlay** | ~₹11,700 (amortized CapEx + cell swaps) | ~₹24,000 (periodic batching) | **₹2,260 / worker / year** (300 shifts @ ₹7.50 + strap) |
| **Annual Facility Budget (2,500 Workers)** | **₹2.92 Crore / year** | ₹6.0+ Crore / year | **₹56.5 Lakh / year** (80% net OPEX savings) |
| **Worker Deployment Capacity** | 5% – 15% (Key permanent staff only) | Rare / Periodic spot checks | **100% of all staff & transient contractors** |
| **Power & Battery Maintenance** | Daily charging docks required | Zero power | **Zero power (Zero battery)** |
| **Calibration Requirements** | Monthly span gas & test benches | Lab spectrophotometer | **Auto on-device optical D65 calibration** |
| **Intrinsic Safety Risk** | Requires costly ATEX Zone 0 cert | Non-electronic | **Inherently ATEX Zone 0 safe by physics** |
| **Toxicity of Chemistry** | Toxic electrochemical electrolytes | Toxic Lead ($Pb$) Acetate carcinogen | **Eco-benign silver/copper mineralization** |
| **Storage Shelf-Life** | 1–2 yrs (sensor cells degrade in ~12 mo) | 6–12 months in fragile glass | **180 days in hermetic foil blister (90d @ 45°C)** |
| **Pre-Donning Quality Assurance** | Requires daily span-gas bump test | None (blind reagent fading) | **Anhydrous CuSO₄ dot (instant blue on seal breach)** |
| **Readout Velocity** | Instantaneous audible alarm only | 24–48 hr third-party laboratory | **Under 3 seconds via kiosk / phone camera** |

---

## ⚡ Intrinsic Safety & ATEX Compliance

In petroleum refining (MRPL), tank gauging, and gas sweetening units, areas are classified under **ATEX / IECEx Zone 0 and Zone 1**—atmospheres where flammable hydrocarbon vapors and hydrogen gas are present continuously or during normal operations.

Any electronic device introduced into these zones must meet strict Intrinsic Safety certifications (Ex ia IIC T4 Ga), requiring explosion-proof enclosures, energy-limiting zener barriers, and static-dissipative polymers.
- **Zero Electrical Energy:** The SARVAS wristband contains **zero batteries, zero capacitors, zero inductors, and zero silicon circuitry**.
- **Zero Sparking Potential:** By physical design, it cannot generate an electrical spark, thermal ignition source, or electrostatic discharge.
- **Physical Zone 0 Compliance:** The wristband inherently complies with ATEX Directive 2014/34/EU and IEC 60079-11 standards for deployment into the most volatile hazardous locations without requiring certification recertification.

---

## 🔄 End-to-End Operational Lifecycle

```
       ┌────────────────┐
       │   SHIFT START  │
       └───────┬────────┘
               │
               ▼
┌──────────────────────────────┐     Worker picks up factory-sealed SARVAS badge.
│  01. PRE-DONNING AUDIT       │ ──► Inspects Anhydrous CuSO₄ dot. Stark white = OK!
│      (Kiosk / Mobile App)    │     Scans badge QR: associates Badge ID with Worker ID.
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐     Worker wears lightweight badge on wrist in SRU / Tank Farm.
│  02. PASSIVE EXPOSURE        │ ──► Ambient H₂S diffuses through calibrated microporous PTFE.
│      (8 to 12 Hour Shift)    │     Ag₂S & CuS nanoparticles precipitate irreversibly.
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐     Worker taps Turnstile / Kiosk at gate-out.
│  03. OPTICAL SCANNING        │ ──► High-resolution CMOS camera captures badge in under 1 second.
│      (< 3 Seconds per Worker)│     On-band D65 fiducials neutralize ambient kiosk illumination.
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐     CIEDE2000 color displacement computed.
│  04. INFERENCE & DOSIMETRY   │ ──► Arrhenius kinetic model scales for shift temp and humidity.
│      (100% On-Device)        │     Quantified dose calculated with 95% Confidence Interval.
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐     Dose logged to MRPL Enterprise Safety Database.
│  05. COMPLIANCE DISPATCH     │ ──► SAFE (<10 ppm·h): Green shift pass logged.
│      (Automated Audit Sync)  │     ACTION (>15 ppm·h): Automated SMS/Email to Safety Officer.
└──────────────────────────────┘     OVER-LIMIT (>50 ppm·h): Mandatory clinical follow-up flag.
```

---

## 💻 Tech Stack & Architecture

SARVAS is built on a modern, ultra-high-performance web and mobile stack optimized for low-latency optical processing and high reliability:

```
├── Frontend & Web Core
│   ├── React 19.2 (Concurrent rendering & Suspense transitions)
│   ├── TypeScript 6.0 (Strict null safety & mathematical typing)
│   ├── Vite 8.2 (Next-generation lightning-fast HMR and bundling)
│   └── Tailwind CSS 4.3 (Modern design system, dark-mode native)
│
├── Native Mobile & Hardware Abstraction
│   ├── Capacitor 7.0 (Android & iOS Native Bridge)
│   ├── @capacitor/camera (Low-latency hardware camera access)
│   └── Offline PWA Service Workers (Zero-network full client cache)
│
├── Computer Vision & Optical Engine
│   ├── HTML5 Canvas Hardware Acceleration (Raw pixel manipulation)
│   ├── CIE 1931 XYZ & CIE L*a*b* D65 Matrix Transformations
│   ├── ISO/CIE 11664-6:2014 CIEDE2000 Color Difference Engine
│   └── On-Band Homography & Grayscale Normalization Routines
│
├── Machine Learning & Data Science
│   ├── 100-Tree Random Forest Multi-Zone Dose Regressor
│   ├── Dual-Zone Inverse-Variance Fusion Engine
│   ├── Arrhenius Thermodynamic Kinetic Scaling
│   └── Recharts 2.15 (Dynamic interactive dosimetry scatter charts)
│
└── Tooling & Verification
    ├── Oxlint (Rust-based ultra-fast linter via Oxc engine)
    └── Vitest & Playwright (End-to-end optical and dosage unit tests)
```

---

## 📜 Statutory Standards & Regulatory Compliance

SARVAS is designed to directly satisfy and integrate into international and Indian national occupational health statutory standards:

1. **OSHA 29 CFR 1910.1000 Table Z-2:** $H_2S$ Permissible Exposure Limit (PEL) ceiling of $20\text{ ppm}$, with an acceptable maximum peak of $50\text{ ppm}$ (10-minute duration).
2. **ACGIH TLV-TWA:** Threshold Limit Value - Time Weighted Average of $1.0\text{ ppm}$ over an 8-hour shift ($8.0\text{ ppm}\cdot\text{h}$ cumulative threshold). Short-Term Exposure Limit (STEL) of $5.0\text{ ppm}$.
3. **DGMS (Directorate General of Mines Safety) Tech Circular No. 02 of 2019:** Mandates systematic personal monitoring and historical exposure record archiving for toxic gas environments in underground and surface operations.
4. **OISD-GDN-166 (Oil Industry Safety Directorate - India):** Guidelines on Personal Protective Equipment and gas monitoring in oil refineries, petrochem complexes, and processing installations.
5. **NIOSH NMAM Method 6013:** Validated analytical protocol for hydrogen sulfide sampling using solid sorbents and colorimetric quantification.
6. **ISO/CIE 11664-4:2019 & 11664-6:2014:** International standards for colorimetry, $L^*a^*b^*$ color space conversion, and $\text{CIEDE2000}$ perceptual color difference calculations.

---

## 🚀 Getting Started & Local Development

### Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ LTS recommended)
- **Package Manager:** `npm`, `pnpm`, or `yarn`
- **Modern Browser:** Google Chrome, Microsoft Edge, or Firefox (with camera permissions for optical scanning)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Reya-Doshi/118.git

# 2. Navigate to the project root
cd 118

# 3. Install dependencies
npm install

# 4. Launch the local development server
npm run dev
```

The application will launch at `http://localhost:5173/`.

### Available Scripts
| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles TypeScript and builds optimized production bundles into `dist/`. |
| `npm run preview` | Spins up a local server to preview the production build. |
| `npm run lint` | Runs the ultra-fast Rust-based Oxlint suite across all TypeScript and React files. |

### Mobile Native Deployment (Android via Capacitor)
```bash
# Build the web bundle
npm run build

# Sync web assets to the native Android platform
npx cap sync android

# Open project in Android Studio for device deployment
npx cap open android
```

---

## 📂 Repository Structure

```
sarvas/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx             # Responsive nav with role switcher & kiosk link
│   │   ├── HeroSection.tsx        # Hero banner, product showcase & 3D video loop
│   │   ├── HowItWorksSection.tsx  # 5-step shift lifecycle interactive walkthrough
│   │   ├── ShiftSummaryModal.tsx  # Post-shift reading modal with OSHA audit dispatch
│   │   └── LoginModal.tsx         # Role simulation (Worker, Safety Officer, Admin)
│   ├── pages/
│   │   ├── ScanBandPage.tsx       # Live camera / file upload CIEDE2000 scanner
│   │   ├── KioskPage.tsx          # High-throughput gate-out kiosk prototype
│   │   ├── OverviewPage.tsx       # Project Dossier, chemical stoichiometry & BOM
│   │   ├── CalibrationPage.tsx    # 303-sample empirical matrix & interactive scatter
│   │   ├── ExplainabilityPage.tsx # Deep-dive ML pipeline diagram & color models
│   │   ├── WorkerDashboardPage.tsx# Individual shift logs, cumulative OEL & health advice
│   │   ├── DashboardPage.tsx      # Refinery facility heatmap, alerts & plant metrics
│   │   └── HistoryPage.tsx        # Complete DGMS / OSHA audit ledger
│   ├── services/
│   │   ├── CalibrationEngine.ts   # CIEDE2000 math, Arrhenius scaling & Random Forest
│   │   └── dosimeterClassifier.ts # Multi-tier watch detection & rejection gate
│   ├── data/
│   │   ├── calibration_dataset.csv# 303-sample empirical validation matrix
│   │   └── sample_calibrated_*.ts # Validated test samples & calibration datasets
│   ├── App.tsx                    # Main client application router & state manager
│   └── main.tsx                   # React 19 root bootstrap
├── docs/                          # In-depth architectural & testing documentation
│   ├── FINAL_DESIGN_AND_MATERIALS.md
│   ├── DATASET_CARD_v3.md
│   └── DATASET_VALIDATION_METHODOLOGY.md
├── mobile/                        # Capacitor native mobile Android project
├── package.json                   # Dependencies and scripts
├── vite.config.ts                 # Vite bundler configuration
└── README.md                      # Engineering dossier & system documentation
```

## 👥 Engineering & Project Dossier

Developed with precision and scientific rigour for industrial occupational hygiene and workforce safety.

- **Project:** SARVAS (Self-Actuating Resilient Vapor-Adsorbing Sensor)
- **Domain:** Industrial Safety, Petrochemical Occupational Hygiene & Smart Wearables
- **Focus Industry:** Petroleum Refining & Petrochemicals (MRPL Mangalore Case Context)
- **License:** Open Source for Educational & Occupational Safety Advancement under the [MIT License](LICENSE).

<div align="center">
<br/>

**SARVAS**  
*Safeguarding the frontline workforce. One shift at a time.*

</div>
