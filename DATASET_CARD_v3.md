# Dual-Zone Ag/Cu Badge: Simulated Dataset v3

> **SIMULATED DATA (model-generated, not measured).** All 303 rows carry `data_type = SIMULATED`.
> Use it to test the app pipeline. It replaces v1 (lead acetate) and v2 (Cu-PAN).

Suggested wording for SIH: *"Simulated dataset (model-generated) for a dual-zone Ag/Cu badge. Behaviour is based on published metal-sulfide sensor studies; numeric parameters are stated design assumptions pending our gas-exposure tests."*

## How close to reality is it?
No public raw dataset exists for AgNO₃/CuSO₄ paper badges under gas exposure. So:
- **Behaviour from literature:** Ag and Cu form insoluble, permanent sulfides; silver darkens in light; temperature changes response (Cu-PAN sheet calibrated at 5–25 °C); moisture is needed; unsealed storage degrades sensors (Engel 2019); thiols also react with silver and copper.
- **Numbers assumed:** rate constants, colours, Ea, humidity term, light rate, ageing rates, fade time, interferent strengths and noise. Every one is listed in `model_parameters_v3.json`, and your own tests should replace them.

## Model
- Dose: D = C·t, or ∫C dt for shift profiles (trapezoid over 480 min).
- Per zone: k_eff = k × f_T × f_RH × e^(−λ·age); reaction fraction F = [1 − e^(−k_eff·D)] × e^(−delay/2000 h).
- Ag zone light term: F_ag = 1 − (1 − F_gas)(1 − F_light)(1 − F_bg), where F_light = 1 − e^(−0.004 × klux·h × transmission), with transmission = 0.05 with the UV film.
- Control patch sees F_light and F_bg only; the app corrects F_ag,gas = 1 − (1 − F_ag)/(1 − F_ctrl).
- Colour: Lab = start + F × (end − start), plus camera noise; RGB converted from Lab (D65).
- Zone estimate: D = −ln(1 − F)/k_eff; σ_D = √[(σ_F/(k_eff(1−F)))² + (0.05D)²].
- Combined estimate: inverse-variance weighted mean of the valid zones, with 95 % CI = ±1.96σ.
- Flags: `BELOW_LOQ` (ΔE < 3 × blank σ), `ABOVE_RANGE`, `LIGHT_OR_AGE_WARNING` (control F > 0.30), `SEAL_BROKEN`.

## Blocks
| Block | Content | Rows |
|---|---|---|
| A_core | 0.25–20 ppm × 0.5–8 h × 3 | 105 |
| B_blank | 0 ppm × 5 durations × 3 | 15 |
| C_temperature | 15/25/35/45 °C × 3 doses × 3 | 36 |
| D_humidity | 20/40/60/80 % RH × 3 doses × 3 | 36 |
| E_shelf_age | sealed vs unsealed × 0/30/60/90 d × 3 | 24 |
| F_light | film vs none × 0–800 klux·h × 3 | 24 |
| G_read_delay | 0–168 h after exposure × 3 | 15 |
| H_interferent_only | CH₃SH, SO₂, NO₂, NH₃, CO, CH₄ × 3 | 18 |
| I_shift_profile | 30 realistic 8-h shifts, mixed T/RH/light | 30 |

## Main takeaways (from `summary_tables_v3.md`)
- The two zones together cover about 0.25–160 ppm·h. Below about 0.2 ppm·h the reading is flagged `BELOW_LOQ`.
- Without the UV film, the control patch reaches 0.56 at 200 klux·h, which would ruin the silver zone without the correction. With the film, it stays at 0.04.
- The stain is permanent over days: error stays within about 8 % up to 72 h, but the one-week error is large under the assumed fade time.
- Methyl mercaptan reads as H₂S. Mention this openly.
- Error figures show only that the software inverts its own model. **They are not sensor accuracy.**
