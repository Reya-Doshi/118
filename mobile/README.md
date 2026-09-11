# 118 — Android Mobile Safety Platform Companion

This directory contains the complete Android mobile application for the SIH 2026 prototype:
**“Passive Colorimetric H2S Exposure-Dosimeter Wristband with AI-Based Quantitative Reading.”**

---

## Key Features & Architecture

- **Single App, Three Role-Based Dashboards**:
  - **Worker**: Shift tracking, assigned Band ID, cumulative dose card, large tactile **SCAN WRISTBAND** CTA, recent shift scans, and profile.
  - **Safety Officer**: Real-time workforce overview (Active Workers, Active Bands, Readings Today, Threshold Alerts), worker exposure roster with detailed dossier inspection, live colorimetric reading feed.
  - **Admin / Supervisor**: Facility overview, workforce exposure distribution chart (Normal / Monitor / Review breakdown), wristband inventory lifecycle tracker (Active vs. Expired if shelf age >90 days), and interactive wristband assignment to operators.

- **Real Android Camera Access (`@capacitor/camera`)**:
  - Hardware camera permission negotiation.
  - Live rear camera capture with full viewfinder.
  - Captured photo review with **Retake** and **Use Photo**.
  - Gallery photo upload fallback.
  - Calibrated SIH demo samples drawer (Sample A 0.18 ppm·h Normal, Sample B 0.72 ppm·h Monitor, Sample C 1.24 ppm·h Review, Expired Badge).

- **Multi-Step Colorimetric Analysis Animation**:
  - 5-step animated sequence with progress radar:
    1. *Detecting wristband outline*
    2. *Locating printed reference scale*
    3. *Sampling colorimetric strip response*
    4. *Correcting ambient illumination*
    5. *Estimating cumulative exposure*

- **Honest Prototype Exposure Result Screen**:
  - Clear, restrained status styling:
    - `NORMAL` (0.18 ppm·h) — Muted Sage / Green
    - `MONITOR` (0.72 ppm·h) — Muted Amber
    - `REVIEW` (1.24 ppm·h) — Muted Brick / Red
  - Confidence rating (e.g. 92%), Band ID, Temperature (32°C), Relative Humidity (68%), Timestamp.
  - Prototype disclaimer: *"SIMULATED / PROTOTYPE READING — Reads physical color response, not ambient gas directly."*
  - Expiry rejection banner if wristband shelf age > 90 days.

---

## How to Run

### 1. Mobile Development Server (Browser / Mobile Device via LAN)
From the project root:
```bash
npm run mobile:dev
```
Or inside `mobile/`:
```bash
npm run dev
```
Open `http://localhost:5174/` on your browser or phone browser on the same Wi-Fi.

### 2. Native Android App in Android Studio
1. Open **Android Studio**.
2. Select **Open** and choose the `mobile/android` directory (`c:\Users\reyad\OneDrive\Desktop\Projects\118\mobile\android`).
3. Android Studio will automatically index the project and sync Gradle.
4. Plug in your Android phone via USB (with USB Debugging enabled) or choose an Android Emulator.
5. Click **Run 'app'** (Green play button) or build APK via **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

---

## Demo Access Credentials

To facilitate swift evaluation during SIH demonstration without requiring judges to type credentials, one-tap demo buttons are provided on the sign-in screen:

1. **Worker Demo**: Rahul Shetty (Hydrocracker Unit 2 · Process Operator · Band `DS-1088`)
2. **Safety Officer Demo**: Inspector Meera Patel (Safety Team)
3. **Admin Demo**: Anand Verma (Plant Operations Supervisor)

You can also dynamically switch roles at any time from the **Profile** view.
