<div align="center">

<img src="public/sarvas_logo_v2.png" alt="SARVAS Logo" width="130" />

# SARVAS
### **Autonomous Industrial Vapor Dosimeter & Edge Optical Quantification System**
#### *Zero-Power Chemochromic Cumulative Exposure Monitoring with On-Device Perceptual Readout*

<br/>

[![Developed by Nxyen Labs](https://img.shields.io/badge/Developed_by-Nxyen_Labs-0F172A?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Nxyen-labs)
[![Repository](https://img.shields.io/badge/Repository-Reya--Doshi%2F118-292925?style=for-the-badge&logo=github&logoColor=F6F1E7)](https://github.com/Reya-Doshi/118)
[![Intrinsic Safety](https://img.shields.io/badge/Intrinsic_Safety-Non--Electrical_Passive_Badge-008080?style=for-the-badge&logo=shield-halved&logoColor=white)](#-intrinsic-safety-zero-electronics-zero-sparks)
[![Consumable BOM](https://img.shields.io/badge/Consumable_Strip-%E2%82%B97.50-2E7D32?style=for-the-badge&logo=currency-inr&logoColor=white)](#-hardware-anatomy--grounded-unit-economics)
[![Reusable Strap](https://img.shields.io/badge/Reusable_Chassis-%E2%82%B918.50-4E342E?style=for-the-badge)](#-hardware-anatomy--grounded-unit-economics)
[![Status](https://img.shields.io/badge/Status-Submitted_%26_Under_Evaluation-15803D?style=for-the-badge&logo=check-circle&logoColor=white)](#-project-status--milestones)

<br/>

> **"Because not all industrial dangers announces itself with an alarm."**  
> *A zero-power chemical dosimeter wristband that catches silent, chronic gas exposure for frontline workers—measured on any smartphone or gate turnstile.*

<br/>

[The Problem](#-the-problem-the-silent-gas-leak) • 
[How SARVAS Works](#-how-sarvas-works-in-plain-english) • 
[The Chemistry](#-the-chemistry-permanent-mineral-stains) • 
[BOM & Pricing](#-hardware-anatomy--grounded-unit-economics) • 
[Optical & AI Pipeline](#-how-the-optical--ai-readout-works) • 
[Industrial Benchmark](#-industrial-benchmark-comparison) • 
[Synthetic Dataset](#-303-scenario-synthetic-validation-dataset) • 
[Shift Lifecycle](#-the-daily-shift-lifecycle) • 
[Quickstart](#-getting-started--local-development)

---

</div>

## 🚨 The Problem: The Silent Gas Leak

In petroleum refining, gas processing complexes, and petrochemical installations, **Hydrogen Sulfide ($H_2S$)** is an invisible, highly toxic hazard. 

Heavy industrial facilities already invest in electronic gas detectors. **So why do frontline workers still face chronic toxicity?**

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                          THE FATAL CHRONIC EXPOSURE GAP                                    │
│                                                                                             │
│  Concentration                                                                              │
│       ▲                                                                                     │
│ 15 ppm┼ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  Statutory Ceiling      │
│       │                                                                                     │
│ 10 ppm┼ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  Electronic Alarm Floor │
│       │    ▲                 ▲                                                              │
│       │   ╱ ╲               ╱ ╲   ◄── Audible alarm sounds only during sudden big spikes    │
│  5 ppm┼───   ───────────────   ────────────────────────────────────                         │
│       │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  ◄── CHRONIC TOXICITY   │
│       │  ░░░ Silent 1–9 ppm Sub-Alarm Inhalation (8–12 hr shifts) ░░░      BLIND SPOT!      │
│       │  ░░░ Eye & airway irritation, headaches, chronic fatigue  ░░░  (NO ALARM EVER RANG) │
│  0 ppm┴──┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴───────►                         │
│         Hour 1  Hour 2  Hour 3  Hour 4  Hour 5  Hour 6  Hour 7  Hour 8                      │
│                                                                                             │
│  SARVAS MEASURES THE ENTIRE ACCUMULATED DOSE WITH ZERO BATTERIES ON THE WORKER!             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **The Peak-Alarm Blind Spot:** Electronic monitors only beep when gas spikes past 10 ppm. If gas seeps slowly at 2–5 ppm, **no alarm ever sounds**. Over an 8-hour shift, breathing 3 ppm constantly can irritate the eyes and airways and cause headaches and fatigue.
2. **Cost Excludes a Fraction of the Workforce:** Electronic monitors cost ₹20,000 to ₹1,00,000 each. Refineries can typically afford them only for a fraction of frontline operators. Contract workers, turnaround crews, and cleaning technicians often enter the same hazardous units with **zero monitoring**.
3. **No Cumulative Record:** Electronic beepers tell you what is happening *this exact second*. They do not calculate total toxic dose absorbed over a full workday or workweek.

---

## 💡 How SARVAS Works (In Plain English)

SARVAS uses a **two-part system**:

1. **On the Worker's Wrist (Zero Electronics):**  
   The worker wears a comfortable silicone strap holding a **₹7.50 chemical cartridge strip**. As they walk through the facility, any $H_2S$ gas in the air naturally touches the strip and permanently darkens it. It requires no battery, no charging, and zero buttons.
2. **At Shift End (Instant Optical Readout):**  
   As the worker exits the gate, they hold their wrist under a camera (or a smartphone app) for **under 3 seconds**. The software reads the darkness of the strip, adjusts for ambient temperature and lighting, and **estimates** their shift dose in **ppm·hours**.

---

## 🔬 The Chemistry: Permanent Mineral Stains

Earlier chemical badges used organic dye solutions that had a critical flaw: **they faded backwards** when exposed to sunlight and ambient air (*Engel et al., Sensors 2019*). If a badge fades before it is scanned, the worker's toxic exposure is dangerously undercounted.

SARVAS uses **Dual-Zone Inorganic Metal Precipitation**. Instead of dyes, the gas chemically turns metal salts into insoluble rock-stable minerals:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                               SARVAS STRIP ARCHITECTURE                                     │
│                                                                                             │
│  ┌──────────────────┬──────────────┬──────────────┬──────────────┬───────────────────────┐  │
│  │   PRINTED D65    │    ZONE A    │    ZONE B    │   CONTROL    │        QR CODE        │  │
│  │   COLOR SCALE    │   (AgNO₃)    │   (CuSO₄)    │ (Sealed Ag)  │        MATRIX         │  │
│  │                  │              │              │              │                       │  │
│  │  White / Gray    │  0–8 ppm·h   │  8–50 ppm·h  │ UV Sun Blind │ Worker Association &  │  │
│  │  Reference Ring  │ Trace Doses  │ Shift Ceiling│ Math Offset  │ Batch Expiry Serial   │  │
│  └──────────────────┴──────────────┴──────────────┴──────────────┴───────────────────────┘  │
│   ◄────────────────────── Micro-Porous Hydrophobic ePTFE Membrane ────────────────────────► │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Zone A: Silver Nitrate ($\text{AgNO}_3$) — For Trace Doses (0 to 8 ppm·h)
* **What happens:** Silver ions react with $H_2S$ gas to form **Silver Sulfide ($\text{Ag}_2\text{S}$)**.
* **Why it's permanent:** Silver sulfide is one of the most insoluble substances known to chemistry ($K_{sp} \approx 10^{-51}$). Once it forms, it cannot un-react, dissolve, or evaporate.
* **Color change:** Changes from chalk-white $\rightarrow$ sepia brown $\rightarrow$ charcoal black.

### 2. Zone B: Copper Sulfate ($\text{CuSO}_4$) — For Excursions (8 to 50 ppm·h, saturation flagged >50 ppm·h)
* **What happens:** Copper ions react with $H_2S$ gas to form **Copper Sulfide ($\text{CuS}$)** ($K_{sp} \approx 10^{-36}$).
* **Why two zones?** If a sudden leak occurs, Zone A darkens completely. Zone B takes over to measure heavy exposures without saturating. Readings above 50 ppm·h are flagged as saturated.
* **Color change:** Changes from pale sky-blue $\rightarrow$ olive drab $\rightarrow$ dense copper-black.

### 3. Solar & Weather Protection
* **Amber UV-Blocking Film:** Blocks solar ultraviolet rays (<390 nm) so sunlight won't discolor the silver.
* **Sealed Control Dot ($F_{ctrl}$):** An identical silver dot sealed under airtight film. If extreme sunlight causes any background darkening, the software subtracts it automatically.
* **Hydrophobic ePTFE Membrane:** Rain and sweat bead right off (water contact angle > 120°), while gas molecules pass through freely.
* **Optical Scale Card & QR Print:** Embedded high-contrast D65 grayscale reference ring plus high-density QR code for automated worker assignment and shelf-age expiration verification.

---

## 💰 Hardware Anatomy & Grounded Unit Economics

### 1. Bill of Materials (BOM) per Strip

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                             SARVAS BILL OF MATERIALS (BOM)                                  │
│                                                                                             │
│  Component                                       Specification             Cost / Strip (₹) │
│  ─────────────────────────────────────────────────────────────────────────────────────────  │
│  1. Cellulose Substrate Matrix                   Whatman No. 1 Filter               ₹0.80   │
│  2. Zone A Reagent                               AgNO₃ (0.05 M analytical)          ₹0.90   │
│  3. Zone B Reagent                               CuSO₄·5H₂O (0.1 M analytical)      ₹0.15   │
│  4. Weather & UV Shield                          ePTFE Membrane + Amber UV Film     ₹2.65   │
│  5. Optical Scale Card + QR Print                Printed D65 Target + QR Matrix     ₹1.20   │
│  6. Hermetic Foil Packaging                      Tamper-evident pouch (printed exp) ₹1.80   │
│  ─────────────────────────────────────────────────────────────────────────────────────────  │
│  TOTAL CONSUMABLE MATERIAL COST (PER SHIFT)                                         ₹7.50   │
│                                                                                             │
│  7. Reusable Silicone Chassis / Strap            Medical-grade, lasts 1–2 years     ₹18.50  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2. Facility Cost Math (2,500-Worker Plant Model)

* **Cost per worker per year:**
  $$300\text{ shifts} \times ₹7.50\text{ strip} + ₹10\text{ (strap amortized)} = \mathbf{₹2,260 / \text{worker / year}}$$
* **Cost per worker per month:**
  $$\frac{₹2,260}{12\text{ months}} \approx \mathbf{₹188 / \text{month}}$$
* **Total annual operational outlay for 2,500 workers:**
  $$2,500 \times ₹2,260 = \mathbf{₹56.5\text{ Lakh / year}}$$

> [!NOTE]
> **Why ₹188/Month is Superior to Monthly Subscriptions:**  
> Monthly subscription models expect one fragile badge to survive 30 straight days of refinery grease, sweat, and rain without saturating. SARVAS provides **25 brand-new, fresh strips every month** (1 per shift). If a maintenance contractor works only 3 days during a shutdown, the plant spends just $3 \times ₹7.50 = \mathbf{₹22.50}$, not a locked monthly fee.

---

## 📊 Industrial Benchmark Comparison

| Performance Metric | Electronic Gas Detectors | Glass Diffusion Tubes | **SARVAS Solution** |
| :--- | :---: | :---: | :---: |
| **Unit Hardware Cost** | ₹20,000 to ₹1,00,000 | ₹400 to ₹800 per tube | **₹7.50 / strip** (+ ₹18.50 reusable chassis) |
| **Annual Facility Cost (2,500 staff)** | **₹2.92 Crore / year** | High recurring OPEX | **₹56.5 Lakh / year (80% net OPEX savings)** |
| **Workforce Coverage** | Fraction of workforce (permanent staff) | Periodic spot checks only | **100% Universal Coverage (Permanent + Contractors)** |
| **Maintenance Burden** | Daily battery docks & monthly span gas | Zero power, offsite lab | **Zero power, zero battery, on-device instant read** |
| **Cumulative Dose Tracking** | ❌ No cumulative dose integration | ❌ Delayed lab report | ✅ **Dual (Physical shift integral + digital career ledger)** |
| **Hazardous Area Safety** | Requires certified ATEX Zone 0 enclosure | Non-electronic | **Non-electrical: no battery, no spark source** |
| **Reagent / Sensor Chemistry** | Toxic liquid electrolyte sensor cells | Hazardous chemical reagents | **Solid-state mineral precipitation (sealed cartridge)**|
| **Storage Shelf-Life** | Sensor cells expire in ~12 months | 6–12 months in fragile glass | **180 days in sealed tamper-evident foil pouch** |
| **Pre-Shift Quality Check** | Daily bump test with span-gas bottle | None (risk of faded badge) | **QR batch scanning & tamper-evident pouch seal** |
| **Readout Speed & Privacy** | Instantaneous alarm beep only | 24–48 hours lab turnaround | **Under 3 seconds on-device (zero raw photos sent to cloud)** |

---

## 🧠 How the Optical & AI Readout Works

All image processing runs **100% on the device** (in the phone or turnstile mini-PC). No raw photos are ever uploaded to an external server.

```
[Captured Camera Frame]
       │
       ▼
1. WATCH & IMAGE GATE ──────────► Rejects bare tables, skin, blurry photos, or oil stains
       │
       ▼
2. PERSPECTIVE RECTIFICATION ───► Corrects handheld camera angles up to 35° tilt
       │
       ▼
3. COLOR NORMALIZATION ─────────► Calibrates lighting (sunlight vs yellow plant sodium lamps)
       │
       ▼
4. CIEDE2000 COLORIMETRY ───────► Calculates precise perceptual color shift (ΔE₀₀)
       │
       ▼
5. ARRHENIUS THERMAL SCALING ───► Adjusts chemical reaction speed for ambient temperature
       │
       ▼
6. DUAL-ZONE AI REGRESSOR ──────► Estimates shift dose (ppm·h) with 95% Confidence Interval
```

1. **Rejection Gate:** If someone points the camera at a desk, a blank wall, or a thumb, the system rejects it immediately with clear advice (*"Dosimeter not detected"* or *"Angle camera away from direct glare"*).
2. **Lighting Normalization:** Refineries have harsh sodium lamps, cool LEDs, or bright sun. The on-band printed reference ring allows the algorithm to mathematically re-balance the image to standard **D65 daylight**.
3. **CIEDE2000 ($\Delta E_{00}$):** Uses the international standard for perceptual color difference (ISO/CIE 11664-6) to detect minute chemical darkening.
4. **Arrhenius Kinetic Compensation ($E_a = 28.4\text{ kJ/mol}$):** Chemical reactions happen faster on hot summer afternoons ($45^\circ\text{C}$) than cool mornings ($18^\circ\text{C}$). The formula scales the reading so temperature never skews the result.
5. **Inverse-Variance Fusion:** Combines Zone A and Zone B data to output a single reliable dose estimate with confidence intervals (e.g. `4.2 ppm·h [3.98 – 4.42]`).

---

## 📊 303-Scenario Synthetic Validation Dataset

> **Note on Data Provenance:** Generated from published sensor parameters to test the software pipeline; physical chamber validation is planned.

The software pipeline was validated across 303 synthetic exposure scenarios derived from literature kinetic constants and field operating envelopes recorded in [`src/data/calibration_dataset.csv`](./src/data/calibration_dataset.csv):

| Test Block | Rows | Variables Tested | Result |
| :--- | :---: | :--- | :--- |
| **`A_core`** | 105 | 0.25 to 20 ppm $H_2S \times 0.5$ to 8 hours | Zone A covers 0–8 ppm·h; Zone B covers 8–50 ppm·h (saturation flagged >50). |
| **`B_blank`** | 15 | Zero gas across 0.5 to 8 hours | Establishes zero-noise optical baseline ($\sigma = 0.42\text{ }\Delta E$). |
| **`C_temp`** | 36 | 15°C, 25°C, 35°C, 45°C | Validates Arrhenius activation energy ($E_a = 28.4\text{ kJ/mol}$). |
| **`D_rh`** | 36 | 20%, 40%, 60%, 80% Relative Humidity | Confirms glycerol buffer prevents drying across dry and humid plants. |
| **`E_shelf`** | 24 | Sealed vs unsealed at 0, 30, 60, 90 days | Models 180-day storage stability in tamper-evident pouch. |
| **`F_light`** | 24 | UV-filtered vs unprotected (0–800 klux·h) | Amber film blocks sunlight discoloration; control patch offsets drift. |
| **`G_delay`** | 15 | Scans delayed 0, 24, 48, 72, 168 hours | Mineral stain does not fade; error stays within $\pm 8.2\%$ at 72 hours. |
| **`H_inter`** | 18 | Cross-gases: $CH_3SH, SO_2, NO_2, NH_3, CO, CH_4$ | Known cross-sensitivity to thiols such as methyl mercaptan ($CH_3SH$); readings represent total sulfur exposure. Zero interference from $SO_2, NO_2, CO, CH_4$. |
| **`I_shift`** | 30 | Realistic dynamic shift gas curves | Proves mathematical convergence of $\int C(t) dt$ over full 8 hours. |

* **Quantification Accuracy:** Within $\pm 8.4\%$ to $\pm 12.0\%$ of reference model values.
* **Limit of Quantification (LoQ):** $0.20\text{ ppm}\cdot\text{h}$ (below this, reads `BELOW_LOQ` to prevent false precision).

---

## ⚡ Intrinsic Safety: Zero Electronics, Zero Sparks

Petrochemical processing areas contain volatile hydrocarbon vapors classified under hazardous Zone 0 / Zone 1 areas.

* **Non-electrical:** No battery, no capacitors, no inductors, and no silicon chips on the worker.
* **No Spark Source:** Completely passive mineral chemistry that cannot generate electrical arcing or electrostatic discharge.
* **Certification Status:** Not a certified electrical device (IEC 60079-11 applies to electrical apparatus; passive badges avoid electrical ignition hazards by physics, but formal statutory plant approval / certification is required for commercial industrial deployment).

---

## 🔄 The Daily Shift Lifecycle

```
1. SHIFT START (15 Seconds)
   • Worker grabs factory-sealed ₹7.50 strip.
   • Snaps strip into reusable wristband, scans QR badge at entrance turnstile.

2. DURING SHIFT (8 Hours)
   • Worn comfortably on wrist inside hazardous units.
   • Silently absorbs any ambient H₂S gas.
   • Nanoparticles precipitate permanently. Rain and sweat bead off.

3. SHIFT END (3 Seconds)
   • Worker taps wristband at gate-out kiosk or phone camera.
   • On-device vision estimates shift dose (e.g. 2.4 ppm·h).
   • Green pass logged: worker goes home safely.

4. SAFETY DASHBOARD (Automated)
   • EHS safety officer sees live plant exposure heatmaps.
   • System automatically alerts if any worker's rolling 7-day dose nears OEL limits.
   • Digital audit ledger updates for statutory compliance.
```

---

## 💻 Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
* **Mobile Engine:** Capacitor Native Android Bridge & Offline PWA
* **Computer Vision:** HTML5 Canvas Hardware Accelerated Processing, Bradford Chromatic Adaptation, CIEDE2000 Engine
* **Machine Learning:** 100-Tree Random Forest Multi-Zone Regressor, Arrhenius Thermodynamic Kinetics
* **Backend (Optional Microservice):** Python FastAPI (`backend/main.py`)
* **Data Visualization:** Recharts (Dynamic exposure curves and confidence intervals)

---

## 🚀 Getting Started & Local Development

### Prerequisites
* Node.js v18 or higher (v20+ recommended)
* npm or yarn

### Quick Start
```bash
# 1. Clone repository (Matches slide QR code)
git clone https://github.com/Reya-Doshi/118.git
cd 118

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open `http://localhost:5173/` in your browser.

### Key Commands
| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs local development server on port 5173 |
| `npm run build` | Compiles TypeScript and builds optimized production bundle |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs Oxlint linter across codebase |

---

## 📌 Project Status & Milestones

| Phase / Milestone | Status | Scope & Deliverables |
| :--- | :---: | :--- |
| **System Architecture & Unit BOM** | ✅ Completed | ₹7.50 consumable cartridge + ₹18.50 reusable chassis specifications finalized |
| **Optical Vision & Kinetic ML Models** | ✅ Completed | On-device CIEDE2000 colorimetry, Bradford adaptation & Arrhenius normalization |
| **Turnstile Kiosk & Mobile PWA Prototypes** | ✅ Completed | Sub-3-second optical inference with full offline local cache capability |
| **Formal Submission Milestone** | 🚀 **Submitted** | **Official technical dossier submitted & currently under active evaluation** |
| **Industrial Chamber Trials** | ⏳ Planned | Multi-gas chamber validation protocol & refinery pilot field testing |

---

## 🏢 About Nxyen Labs

SARVAS is developed as an open-architecture occupational health research initiative by [**Nxyen Labs**](https://github.com/Nxyen-labs).

* **Organization:** [Nxyen Labs](https://github.com/Nxyen-labs)
* **GitHub Organization:** [@Nxyen-labs](https://github.com/Nxyen-labs)
* **Repository:** [github.com/Reya-Doshi/118](https://github.com/Reya-Doshi/118)
* **Domain:** Deep-Tech Industrial Safety, Applied Chemochromics & Edge Machine Vision
* **Current Status:** Submitted & Under Evaluation
* **License:** Open Source under the [MIT License](LICENSE).

<div align="center">
<br/>

**SARVAS**  
*Safeguarding the frontline workforce. One shift at a time.*  
**Developed by [Nxyen Labs](https://github.com/Nxyen-labs).**

</div>
