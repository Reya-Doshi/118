# Final Design: Dual-Zone Ag/Cu Passive H₂S Dosimeter Wristband

## Decision
| Choice | Final pick | Why |
|---|---|---|
| Low-dose reagent | **Silver nitrate (AgNO₃)** zone → black Ag₂S | Silver binds sulfide very strongly and gives a permanent stain; published Ag-based image methods reach low-ppm detection |
| High-dose reagent | **Copper(II) sulfate (CuSO₄·5H₂O)** zone → dark CuS | Cheapest reagent, CuS is highly insoluble (permanent), and it covers the full-shift dose range |
| Dropped | Cu-PAN (reversible), lead acetate (toxic; kept only as an optional benchmark) | Cu-PAN colour returns within days (Engel 2019) |
| Humectant | Glycerol (both zones) | The reaction needs surface moisture. **Never add NaOH to the silver zone**: it precipitates brown Ag₂O |
| Light protection | Amber/UV-blocking film + sealed silver control patch | Silver salts darken in light; the control patch lets the app subtract this |
| Shelf-life indicator | Sealed Ag control patch + anhydrous CuSO₄ seal-breach dot + printed expiry date/QR | Shows light/ageing damage and a broken pouch seal |

## Badge layout (front, left to right)
`[printed colour reference scale] [Ag zone] [Cu zone] [Ag control patch (sealed)] [seal-breach dot] [QR: batch + mfg date]`

## Materials
| Part | Material | Notes |
|---|---|---|
| Strip base | Whatman No. 1 filter paper (or any lab filter paper) | Cut 8 × 8 mm pads |
| Zone A reagent | AgNO₃, 0.05 M in distilled water, 10 µL per pad | ≈0.085 mg AgNO₃ per badge |
| Zone B reagent | CuSO₄·5H₂O, 0.5 M in distilled water, 10 µL per pad | ≈1.25 mg per badge |
| Humectant | Glycerol, 5 % v/v in both solutions | Keeps pads slightly moist |
| Diffusion cover | Microporous PTFE tape/membrane or a PET film with one pin-hole per zone | Slows uptake so the badge lasts a full shift; the pin-hole size is your tuning knob |
| Light filter | Amber/UV-blocking PET or window-tint film over the zones | |
| Control patch | Ag pad fully sealed under clear tape plus the same amber film | No gas access |
| Seal-breach dot | Anhydrous CuSO₄ (heat-dried until white) under a pinhole on the pouch-facing side | Turns blue if moisture got in during storage |
| Reference scale | Printed card: white, grey steps, black, plus the blue→brown Cu scale, laminated | Used by the app for lighting correction |
| Band | Silicone or Tyvek wristband with a window or snap-in holder | Disposable holder, reusable band optional |
| Packaging | Aluminium-laminate pouch, heat-sealed, with a silica gel sachet outside the badge compartment | Protects shelf life |
| PPE / lab | Gloves, goggles, fume hood for any H₂S test | AgNO₃ stains skin and is corrosive |

**Rough cost per badge:** reagents are well under ₹1, since the badge uses under 0.1 mg of silver nitrate. Paper, films, band and pouch dominate the cost. Get quotes from your local lab supplier, because chemical prices vary.

## Build steps
1. Prepare both solutions with 5 % glycerol, and store the AgNO₃ solution in an amber bottle.
2. Pipette 10 µL onto each pad, and dry the pads in the dark at room temperature.
3. Laminate the diffusion cover over both zones and the amber film on top. Fully seal the control patch.
4. Mount the pads next to the reference scale in the band holder.
5. Pouch each badge, heat-seal it, and label it with batch and date.

## What changes in your project
- **README / pitch:** chemistry becomes "dual-zone Ag/Cu metal-sulfide dosimeter." Remove the Cu-PAN and "Arrhenius constants from literature" claims.
- **App:** read two zones plus the control patch. Subtract the light/age signal from the Ag zone, then combine the two zone estimates by inverse-variance weighting. Flags: `BELOW_LOQ`, `ABOVE_RANGE`, `LIGHT_OR_AGE_WARNING`, `SEAL_BROKEN`.
- **Reference card:** add the blue→brown Cu scale next to the grey scale.
- **Workflow:** scan at shift end (the kiosk at gate-out). The stain is permanent, but reading within 3 days keeps the error small.
- **Selectivity note:** thiols such as methyl mercaptan also react with silver and copper. Say so openly, since refinery air can contain them.

## Test plan (when you get lab access)
1. **Liquid pre-test (college lab):** spot dilute Na₂S solutions on pads and photograph them. This proves the progressive darkening but doesn't count as gas calibration.
2. **Gas test (fume hood, faculty present):** use Na₂S + dilute acid in a sealed jar of known volume, 3 concentrations × 4 times × 3 replicates.
3. **Shelf life:** hold pouched badges at 50 °C for accelerated ageing plus some at room temperature, then test at 0, 30, 60 and 90 days (equivalent).
4. **Light:** expose badges with and without the film to sunlight for fixed hours and check the control patch.
5. Fill the real-data template and refit the parameters in `model_parameters_v3.json`.

## References
- Engel et al., Sensors 2019 (Cu-PAN reversibility, ageing, cross-sensitivity): https://doi.org/10.3390/s19051182
- Carpenter et al., Sens. Actuators B 2017 (moist paper + base improves H₂S trapping): https://www.sciencedirect.com/science/article/abs/pii/S0925400517311334
- Digital-image H₂S method with silver nanoprisms (Ag₂S formation, LOD 1.87 ppmv): https://www.sciencedirect.com/science/article/abs/pii/S1386142526001563
- Silver nanoparticle chemochromic H₂S film (visible 10–500 ppm): https://www.sciencedirect.com/science/article/abs/pii/S092540052502074X
- Cellulose films doped with AgNO₃ and CuSO₄ for H₂S/amine sensing: https://www.researchgate.net/publication/317833945_Quantitative_colorimetric_paper_probe_for_hydrogen_sulfide_gas
- Cu-PAN cellulose sheet with temperature-dependent calibration (5–25 °C): https://pubmed.ncbi.nlm.nih.gov/37214707/
- CuSO₄-coated paper as an irreversible moisture indicator: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7564463/
- ASTM D4323 (reflectance-rate H₂S method): https://store.astm.org/d4323-21.html
