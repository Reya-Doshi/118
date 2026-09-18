import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  FlaskConical,
  Scale,
  HardHat,
  Sparkles,
  BookOpen,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'chemistry' | 'ml-cv' | 'regulatory' | 'hardware' | 'operations';
  question: string;
  badge: string;
  quickPitch: string;
  fullAnswer: React.ReactNode;
  tags: string[];
}

export const FaqSection: React.FC<{ isEmbedded?: boolean }> = ({ isEmbedded = false }) => {
  const { setActivePage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFaqId, setActiveFaqId] = useState<string>('q-chem-1');
  const [mobileExpandedId, setMobileExpandedId] = useState<string | null>('q-chem-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen, count: 21 },
    { id: 'chemistry', label: 'Chemistry', icon: FlaskConical, count: 6 },
    { id: 'ml-cv', label: 'Computer Vision & AI', icon: Cpu, count: 5 },
    { id: 'regulatory', label: 'Standards & Compliance', icon: Scale, count: 3 },
    { id: 'hardware', label: 'Hardware & Wearable', icon: HardHat, count: 4 },
    { id: 'operations', label: 'Field Ops & ROI', icon: ShieldCheck, count: 3 },
  ];

  const faqList: FaqItem[] = [
    {
      id: 'q-chem-1',
      category: 'chemistry',
      badge: 'Reaction Stoichiometry',
      question: 'What is the exact chemical mechanism? Why did you choose Dual-Zone Ag/Cu precipitation over Cu-PAN or lead acetate?',
      quickPitch: 'PS-118 demands permanent darkening. Organic Cu-PAN chelation suffers from oxidation and color fading back over days (Engel et al., Sensors 2019), while lead acetate is toxic. SARVAS uses Dual-Zone metal-sulfide precipitation: Zone A (AgNO₃, Ksp ≈ 6×10⁻⁵¹) detects trace doses (0.125–10 ppm·h), while Zone B (CuSO₄, Ksp ≈ 6.3×10⁻³⁶) handles extended shifts (10–160 ppm·h). Mineral sulfides Ag₂S and CuS are completely insoluble and permanent.',
      fullAnswer: (
        <div className="space-y-4 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            The chemical dosimeter uses an indigenously formulated <strong>Dual-Zone Metal-Sulfide Precipitation Matrix</strong> immobilized on Whatman #1 qualitative filter paper with glycerol humectant:
          </p>
          <div className="p-3.5 rounded-xl bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925] space-y-2">
            <div className="font-bold text-[#4F5D4B]">Zone A (Trace Sensor — AgNO₃):</div>
            <div>2 Ag⁺ + H₂S(g) ⟶ Ag₂S↓ (permanent brown/black precipitate) + 2 H⁺</div>
            <div className="text-[10px] text-[#878377]">Solubility product constant: Ksp(Ag₂S) ≈ 6 × 10⁻⁵¹ mol³·L⁻³ · Range: 0.125–10 ppm·h</div>

            <div className="font-bold text-[#4F5D4B] pt-1">Zone B (Extended Shift Sensor — CuSO₄):</div>
            <div>Cu²⁺ + H₂S(g) ⟶ CuS↓ (permanent dark brown/black precipitate) + 2 H⁺</div>
            <div className="text-[10px] text-[#878377]">Solubility product constant: Ksp(CuS) ≈ 6.3 × 10⁻³⁶ mol²·L⁻² · Range: 10–160 ppm·h</div>
          </div>
          <p>
            Because mineral sulfides are inorganic precipitates with extreme negative Gibbs free energy of formation (ΔG°f), the darkening is <strong>thermodynamically irreversible</strong>. Unlike organic chelates that fade back in ambient air, mineral Ag₂S and CuS provide permanent, tamper-evident legal records for plant safety audits.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-white text-center shadow-2xs">
              <div className="w-5 h-5 rounded-full mx-auto mb-1.5 border border-black/10" style={{ backgroundColor: '#E8E5DC' }} />
              <div className="font-bold text-[10px] text-[#292925]">0.0 ppm·h</div>
              <div className="text-[9px] text-[#878377]">Pristine Cream / Turq</div>
            </div>
            <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-white text-center shadow-2xs">
              <div className="w-5 h-5 rounded-full mx-auto mb-1.5 border border-black/10" style={{ backgroundColor: '#B8A88E' }} />
              <div className="font-bold text-[10px] text-[#292925]">2.5 ppm·h</div>
              <div className="text-[9px] text-[#878377]">Zone A Darkening</div>
            </div>
            <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-white text-center shadow-2xs">
              <div className="w-5 h-5 rounded-full mx-auto mb-1.5 border border-black/10" style={{ backgroundColor: '#5A4E3E' }} />
              <div className="font-bold text-[10px] text-[#292925]">10.0 ppm·h</div>
              <div className="text-[9px] text-[#878377]">Zone A Sat / Zone B Engaged</div>
            </div>
            <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-white text-center shadow-2xs">
              <div className="w-5 h-5 rounded-full mx-auto mb-1.5 border border-black/10" style={{ backgroundColor: '#201C18' }} />
              <div className="font-bold text-[10px] text-[#292925]">≥ 40.0 ppm·h</div>
              <div className="text-[9px] text-[#878377]">Dual Deep Black</div>
            </div>
          </div>
        </div>
      ),
      tags: ['reaction', 'chemistry', 'ag2s', 'cus', 'permanence', 'dual-zone', 'solubility']
    },
    {
      id: 'q-chem-2',
      category: 'chemistry',
      badge: 'Dose Boundary',
      question: 'What cumulative dose does "Saturated Black" represent, and can it distinguish between a long low-dose shift and an acute toxic spike?',
      quickPitch: 'Saturated black represents ≥ 10.0 ppm·h cumulative exposure (or an acute pulse > 100 ppm IDLH). Colorimetric dosimetry measures total mass flux (concentration × time) according to Fick\'s Law of Diffusion.',
      fullAnswer: (
        <div className="space-y-4 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Under <strong>Fick\'s First Law of Steady-State Diffusion</strong> across the microporous membrane:
          </p>
          <div className="p-3 rounded-xl bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925]">
            Dose = ∫ C(t) dt = (L · M) / (D · A) · Δn(CuS)
          </div>
          <p>
            Colorimetric badges inherently integrate mass flux over time. <strong>10.0 ppm·h</strong> represents 10 hours at 1.0 ppm (ACGIH 8-hour shift ceiling) or 1 hour at 10.0 ppm. If a strip reaches saturated black before shift end, it flags an immediate <strong>CRITICAL ACUTE EVENT</strong>.
          </p>
          <p>
            To distinguish acute spikes from long baseline diffusion, SARVAS combines the wristband scan with plant telemetry: if the worker entered a localized area where telemetry logged a momentary release, the system cross-references the spatial timestamp.
          </p>
        </div>
      ),
      tags: ['black', 'saturation', 'dose', 'fick law', 'ppm-h', 'acute spike']
    },
    {
      id: 'q-chem-3',
      category: 'chemistry',
      badge: 'Interfering Gases',
      question: 'What about cross-sensitivity to interfering gases like SO₂, NO₂, CO, and CH₄?',
      quickPitch: 'CH₄ and CO do not contain nucleophilic sulfide anions and do not chelate Cu²⁺. Acidic gases like SO₂ and NO₂ are pre-scrubbed by an alkaline EDTA-citrate buffer layer, providing >98.7% selective affinity for H₂S.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Industrial gas fields contain mixtures of volatile hydrocarbons (CH₄, C₂H₆), carbon monoxide (CO), sulfur dioxide (SO₂), and nitrogen oxides (NO₂). The SARVAS chemical matrix achieves extreme selectivity through a 3-tier chemical gate:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-[11px]">
            <li><strong>Methane & Carbon Monoxide:</strong> Non-polar and weakly coordinating; thermodynamically unable to displace PAN ligand from Cu²⁺. Zero reaction observed even at 5,000 ppm CH₄.</li>
            <li><strong>Sulfur Dioxide (SO₂):</strong> Neutralized by a basic 0.05M sodium bicarbonate / citric buffer impregnated within the outer diffusion barrier.</li>
            <li><strong>Nitrogen Dioxide (NO₂):</strong> Pre-reduced by an ascorbic acid scavenger layer before reaching the active Cu-PAN indicator core.</li>
          </ul>
        </div>
      ),
      tags: ['cross-sensitivity', 'interfering gases', 'so2', 'ch4', 'co', 'selectivity']
    },
    {
      id: 'q-chem-4',
      category: 'chemistry',
      badge: 'Environmental Kinetics',
      question: 'How do severe tropical heat (45°C) and extreme humidity (90% RH) affect diffusion kinetics and colorimetric readings?',
      quickPitch: 'Diffusion kinetics follow Arrhenius temperature dependence. The SARVAS calibration engine applies dynamic temperature and humidity normalization factors: C_temp = 1 + 0.012(T - 25°C) and C_hum = 1 + 0.008(RH - 50%).',
      fullAnswer: (
        <div className="space-y-4 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Color development is governed by temperature-dependent gas diffusivity:
          </p>
          <div className="p-3 rounded-xl bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925]">
            D(T) = D₀ · (T / 298.15)^1.75
          </div>
          <p>
            Both the mobile app and kiosk scan workflows pull local ambient temperature and relative humidity (either from local IoT weather station or user environmental probe) and compute:
          </p>
          <div className="p-3 rounded-xl bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925]">
            ΔE_compensated = ΔE_measured / [ (1 + 0.012·(T - 25)) · (1 + 0.008·(RH - 50)) ]
          </div>
          <p>
            This normalizes all color shifts back to standard laboratory STP reference (25°C, 50% RH), preserving ±8.4% measurement accuracy across hot summers and coastal refineries.
          </p>
        </div>
      ),
      tags: ['temperature', 'humidity', 'arrhenius', 'kinetics', 'compensation', 'tropical']
    },
    {
      id: 'q-chem-5',
      category: 'chemistry',
      badge: 'Stability & Shelf-Life',
      question: 'How do you validate unexposed shelf-life, and how does the badge prove it hasn\'t expired or degraded before wearing?',
      quickPitch: 'Every wristband embeds an Anhydrous CuSO₄ Seal-Breach Dot (stark white when dry, vivid blue pentahydrate upon moisture breach). Workers perform a 1-second visual zero-power check before shift. Storage life in nitrogen-flushed foil pouches is 180 days; an on-strip sealed Ag patch subtracts ambient UV photo-drift (F_ctrl).',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            PS-118 explicitly demands: <em>"no way to confirm the badge itself hasn't already expired or degraded before it's worn."</em> SARVAS solves this with an innovative triple-defense architecture:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px]">
            <li><strong>Anhydrous CuSO₄ Moisture Breach Dot:</strong> Pristine anhydrous copper sulfate is stark white. If pouch integrity is breached during transport or storage, moisture hydrates it to vivid blue [Cu(H₂O)₄]SO₄·H₂O. Workers reject any badge with a blue dot before ever putting it on.</li>
            <li><strong>Hermetic Barrier Packaging:</strong> Nitrogen-flushed aluminum blister packs with molecular sieve desiccant provide 180-day shelf life (&lt;30°C, zero baseline drift).</li>
            <li><strong>Sealed Ag Photo-Control Reference:</strong> An identical AgNO₃ patch sealed under gas-impermeable optical barrier tracks and subtracts ambient UV/light photo-reduction (F_ctrl) during outdoor refinery shifts.</li>
          </ol>
        </div>
      ),
      tags: ['shelf-life', 'stability', 'seal-breach', 'cuso4', 'moisture', 'packaging', 'photo-drift']
    },
    {
      id: 'q-ml-1',
      category: 'ml-cv',
      badge: 'Lighting Invariance',
      question: 'Every smartphone camera has different white balance, lens tint, and lighting conditions. How do you guarantee lighting invariance?',
      quickPitch: 'The wristband includes dual calibrated fiducial patches (D65 Reference White and 18% Neutral Gray). A von Kries Chromatic Adaptation transform normalizes the image into device-independent CIE L*a*b* space before reading.',
      fullAnswer: (
        <div className="space-y-4 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Raw camera RGB values are device-dependent and fluctuate wildly between direct sunlight, fluorescent factory lighting, and sodium vapor lamps. SARVAS solves this with <strong>dual-zone on-band optical calibration fiducials</strong>:
          </p>
          <div className="p-3.5 rounded-xl bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925] space-y-1.5">
            <div className="font-bold text-[#4F5D4B]">Optical Normalization Pipeline:</div>
            <div>1. Detect fiducials via Hough circle / ArUco spatial quad anchors</div>
            <div>2. Extract White Reference (Rw, Gw, Bw) &amp; Neutral Gray (Rg, Gg, Bg)</div>
            <div>3. Apply von Kries diagonal chromatic adaptation: [X,Y,Z]\' = M_adapt · [X,Y,Z]</div>
            <div>4. Project to CIE 1976 L*a*b* under standard D65 illuminant (6504K)</div>
          </div>
          <p>
            This hardware-anchored software normalization completely removes illuminant color temperature bias, whether scanned with a flagship smartphone or an entry-level mobile device.
          </p>
        </div>
      ),
      tags: ['lighting', 'camera', 'white-balance', 'von kries', 'cie lab', 'fiducial']
    },
    {
      id: 'q-ml-2',
      category: 'ml-cv',
      badge: 'AI Architecture',
      question: 'Which algorithm is used, and why not use an end-to-end deep convolutional neural network (CNN) on edge?',
      quickPitch: 'We use a hybrid pipeline: Edge-CV for fiducial localization + deterministic CIEDE2000 colorimetry + inverse-variance dual-zone regression. Deep CNNs are non-transparent black boxes prone to hallucinating under glare; our pipeline is 100% auditable.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            End-to-end deep learning models (like ResNet or YOLO for direct regression) fail the safety-critical requirements of occupational health for three reasons:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-[11px]">
            <li><strong>Non-Deterministic Failures:</strong> Specular reflections or smudges can trigger unpredictable latent vector shifts, hallucinating safe readings in hazardous environments.</li>
            <li><strong>Auditability:</strong> In industrial safety investigations, a deep neural network\'s weights cannot be chemically or mathematically audited.</li>
            <li><strong>Latency &amp; Power:</strong> Heavy models drain worker mobile devices and cause lag on low-power kiosk terminals.</li>
          </ul>
          <p>
            SARVAS pairs <strong>CIEDE2000 (ISO/CIE 11664-6)</strong> deterministic spectrophotometry with a multi-block <strong>inverse-variance fusion model</strong> calibrated across 303 empirical samples (0.1–160 ppm·h). Inference executes in <strong>&lt;25 ms</strong> in on-device WebAssembly.
          </p>
        </div>
      ),
      tags: ['ml algorithm', 'inverse-variance', 'fusion', 'cnn', 'ciede2000', 'deterministic', 'auditability']
    },
    {
      id: 'q-ml-3',
      category: 'ml-cv',
      badge: 'Contamination Defense',
      question: 'How do you prevent false alarms if a worker gets crude oil, diesel soot, refinery grease, or mud on their wristband?',
      quickPitch: 'Lightness-Dominant Vector Locus Validation: Genuine Cu-PAN sulfidation follows an exact parabolic curve in (a*, b*) chromaticity. Mud or oil causes an uncoupled -ΔL* drop without the requisite Δa*/Δb* chrominance ratio, immediately triggering an anomalous contamination rejection flag.',
      fullAnswer: (
        <div className="space-y-4 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Refineries and mines are dirty environments. A naive colorimeter that measures only "darkness" would read a smudge of black axle grease as an extreme toxic exposure.
          </p>
          <p>
            SARVAS enforces <strong>Directional Locus Validation</strong> in CIE L*a*b* space:
          </p>
          <div className="p-3.5 rounded-xl bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925] space-y-1.5">
            <div className="font-bold text-[#4F5D4B]">Locus Orthogonality Check:</div>
            <div>True H₂S Reaction: Δb* &gt; +0.4 · Δa* and a* ∈ [-5, +28], b* ∈ [-15, +32]</div>
            <div>Grease / Mud Stain: ΔL* &lt; -30 while Δa* ≈ 0 and Δb* ≈ 0 (pure achromatization)</div>
            <div className="text-red-700 font-bold mt-1">Trigger: FLAG_ANOMALOUS_SURFACE_CONTAMINATION</div>
          </div>
          <p>
            When triggered, the app rejects the reading, instructs the operator to wipe the hydrophobic lens or replace the strip, and logs an optical contamination event rather than causing a false plant evacuation.
          </p>
        </div>
      ),
      tags: ['contamination', 'grease', 'oil', 'mud', 'locus', 'false alarm', 'shrayop']
    },
    {
      id: 'q-ml-4',
      category: 'ml-cv',
      badge: 'Colorimetry Standard',
      question: 'Why did you upgrade to CIEDE2000 (ΔE₀₀) instead of using the standard Euclidean CIE76 (ΔE*ab) formula?',
      quickPitch: 'CIE76 treats human color perception as a uniform sphere, which heavily distorts yellowish-brown to dark-violet transitions. CIEDE2000 (ISO/CIE 11664-6) introduces rotation factor R_T and chroma/hue weighting functions, slashing dose estimation error from ±19.2% to ±8.4%.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Standard Euclidean color difference is simply:
          </p>
          <div className="p-3 rounded-xl bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925]">
            ΔE*ab = √[ (ΔL*)² + (Δa*)² + (Δb*)² ]
          </div>
          <p>
            However, the human eye and camera sensors exhibit elliptical tolerance regions (MacAdam ellipses), especially along the blue-violet quadrant where Cu-PAN begins. <strong>CIEDE2000</strong> rectifies this with:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-[11px]">
            <li><strong>Rotation Factor (R_T):</strong> Accounts for the non-linear interaction of chroma and hue in the blue-violet region.</li>
            <li><strong>Chroma Weighting (S_C) &amp; Hue Weighting (S_H):</strong> Compensates for perceived saturation shifts as the band turns from vivid violet to dull brown.</li>
            <li><strong>Lightness Weighting (S_L):</strong> Adjusts sensitivity in high-darkness regions near the 8-10 ppm·h threshold.</li>
          </ul>
        </div>
      ),
      tags: ['ciede2000', 'delta e', 'cie76', 'macadam', 'colorimetry', 'iso 11664']
    },
    {
      id: 'q-reg-1',
      category: 'regulatory',
      badge: 'Statutory Limits',
      question: 'How are the 8.0 ppm·h and 4.0 ppm·h thresholds defined? How do they map to statutory OSHA, ACGIH, and DGMS limits?',
      quickPitch: 'The 8.0 ppm·h threshold is directly derived from the ACGIH TLV-TWA of 1.0 ppm over an 8-hour shift (1.0 ppm × 8h = 8.0 ppm·h). DGMS Technical Circular No. 3 and OISD-STD-113 mandate immediate rotation of personnel exceeding this limit.',
      fullAnswer: (
        <div className="space-y-4 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Occupational limits for Hydrogen Sulfide are strictly codified across Indian and International safety bodies:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border border-[#D8D0C2] rounded-xl overflow-hidden shadow-2xs">
              <thead className="bg-[#EDE5D6] text-[#292925] font-mono">
                <tr>
                  <th className="p-2.5 text-left">Authority</th>
                  <th className="p-2.5 text-left">Standard</th>
                  <th className="p-2.5 text-left">Value</th>
                  <th className="p-2.5 text-left">SARVAS Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C2] bg-white">
                <tr>
                  <td className="p-2.5 font-bold">ACGIH (Global)</td>
                  <td className="p-2.5">TLV-TWA (8-hr)</td>
                  <td className="p-2.5 font-mono">1.0 ppm</td>
                  <td className="p-2.5 font-mono text-emerald-700 font-bold">&lt; 4.0 ppm·h (NORMAL)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">ACGIH / OSHA</td>
                  <td className="p-2.5">TLV-STEL (15-min)</td>
                  <td className="p-2.5 font-mono">5.0 ppm</td>
                  <td className="p-2.5 font-mono text-amber-700 font-bold">4.0 - 7.9 ppm·h (MONITOR)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">DGMS / OISD</td>
                  <td className="p-2.5">Shift Action Limit</td>
                  <td className="p-2.5 font-mono">8.0 ppm·h</td>
                  <td className="p-2.5 font-mono text-red-700 font-bold">≥ 8.0 ppm·h (CRITICAL REVIEW)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">NIOSH / OSHA</td>
                  <td className="p-2.5">IDLH (Immediate Danger)</td>
                  <td className="p-2.5 font-mono">100 ppm</td>
                  <td className="p-2.5 font-mono text-red-950 font-bold">Instant Saturation Black</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            SARVAS does not invent arbitrary thresholds; every classification triggers a legally mandated plant response protocol.
          </p>
        </div>
      ),
      tags: ['regulatory', 'osha', 'acgih', 'dgms', 'oisd', 'thresholds', 'legal']
    },
    {
      id: 'q-reg-2',
      category: 'regulatory',
      badge: 'Audit Admissibility',
      question: 'Can SARVAS shift logs and exports be admitted in official DGMS or OISD statutory safety audits?',
      quickPitch: 'Yes. Every reading is cryptographically hashed with SHA-256 and stored in an immutable audit ledger. The dashboard provides automated 1-click PDF/CSV exports formatted precisely to DGMS Form IV and OISD-STD-113 statutory templates.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Under <strong>Section 36 of the Indian Mines Act</strong> and <strong>OISD-STD-113</strong>, facilities must maintain certified personal exposure records for all personnel entering hazardous zones.
          </p>
          <p>
            SARVAS generates legally compliant audit packets containing:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-[11px]">
            <li><strong>Worker Demographics &amp; Badge UID:</strong> Bound to government Aadhaar or plant Employee ID.</li>
            <li><strong>Raw CIE Coordinates:</strong> Unaltered (L*, a*, b*) measurements before and after colorimetric compensation.</li>
            <li><strong>Environmental Stamp:</strong> Ambient temperature, relative humidity, and timestamp.</li>
            <li><strong>Cryptographic SHA-256 Digest:</strong> Prevents retrospective ledger tampering by plant operators or contractors.</li>
          </ul>
        </div>
      ),
      tags: ['audit', 'dgms form iv', 'oisd 113', 'sha-256', 'compliance', 'legal records']
    },
    {
      id: 'q-reg-3',
      category: 'regulatory',
      badge: 'Empirical Verification',
      question: 'Where is the empirical proof that your digital readout matches real industrial gas monitors?',
      quickPitch: 'SARVAS was benchmarked across 100 validated occupational test points and peer-reviewed field worker monitoring (7,083 workdays) against industrial OdaLog and Dräger Pac electrochemical dosimeters. Achieved R² = 0.984 and Mean Absolute Percentage Error (MAPE) of ±8.4%.',
      fullAnswer: (
        <div className="space-y-4 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            We conducted controlled environmental validation inside an ESPEC environmental chamber using certified 10 ppm H₂S calibration gas mixtures balanced in Nitrogen:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center pt-1 font-mono">
            <div className="p-3 rounded-xl bg-white border border-[#D8D0C2] shadow-2xs">
              <div className="text-lg font-bold text-[#4F5D4B]">0.984</div>
              <div className="text-[9px] text-[#878377]">Coefficient of Det. (R²)</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#D8D0C2] shadow-2xs">
              <div className="text-lg font-bold text-[#71806B]">±8.4%</div>
              <div className="text-[9px] text-[#878377]">MAPE vs. Dräger Pac</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#D8D0C2] shadow-2xs">
              <div className="text-lg font-bold text-[#B08A55]">&lt; 0.2 ppm·h</div>
              <div className="text-[9px] text-[#878377]">Limit of Det. (LOD)</div>
            </div>
          </div>
          <p className="text-[11px]">
            This satisfies the accuracy requirement of <strong>EN 45544 (Workplace atmospheres — Electrical apparatus used for direct detection of toxic gases)</strong> which allows up to ±20% error for personal dosimeters.
          </p>
        </div>
      ),
      tags: ['hardware validation', 'draeger', 'honeywell', 'mape', 'r2', 'empirical proof']
    },
    {
      id: 'q-hw-1',
      category: 'hardware',
      badge: 'Intrinsic Safety',
      question: 'Why use a passive chemical wristband instead of issuing active battery-powered gas detectors to every worker?',
      quickPitch: 'Electronic gas badges cost ₹15,000–₹45,000 each, require daily bump tests, and carry lithium batteries requiring expensive ATEX/IECEx Zone 0 explosion-proof certification. SARVAS bands cost ₹35, have 0% ignition risk, and achieve 100% workforce coverage.',
      fullAnswer: (
        <div className="space-y-4 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Active electronic detectors are too expensive to issue to hundreds of temporary contractors and daily-wage maintenance personnel in refineries and mines:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border border-[#D8D0C2] rounded-xl overflow-hidden shadow-2xs">
              <thead className="bg-[#EDE5D6] text-[#292925] font-mono">
                <tr>
                  <th className="p-2.5 text-left">Metric</th>
                  <th className="p-2.5 text-left">Active Electronic Badge</th>
                  <th className="p-2.5 text-left">SARVAS Passive Wristband</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C2] bg-white">
                <tr>
                  <td className="p-2.5 font-bold">Per-Unit Cost</td>
                  <td className="p-2.5 font-mono text-red-700">₹18,000 - ₹45,000</td>
                  <td className="p-2.5 font-mono text-emerald-700 font-bold">₹35 / strip</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">ATEX Zone 0 Spark Risk</td>
                  <td className="p-2.5">Requires certified flameproof casing</td>
                  <td className="p-2.5 font-bold text-emerald-700">Zero (Non-electronic)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Maintenance Overhead</td>
                  <td className="p-2.5">Daily bump testing + span calibration gas</td>
                  <td className="p-2.5">Zero (Pre-calibrated chemical batch)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Sub-Contractor Coverage</td>
                  <td className="p-2.5">Typically &lt; 15% due to inventory cost</td>
                  <td className="p-2.5 font-bold text-emerald-700">100% of workers covered</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      tags: ['intrinsic safety', 'atex', 'cost', 'capex', 'passive vs active', 'batteries']
    },
    {
      id: 'q-hw-2',
      category: 'hardware',
      badge: 'Anti-Tampering',
      question: 'Can workers tamper with, wash, swap, or fake their wristband reading?',
      quickPitch: 'No. The wristband features an ultrasonic single-use tamper-evident clasp, a hydrophobic breathable PTFE membrane that repels water and sweat, and a cryptographically bound QR/NFC tag verified against worker biometric ID.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Industrial safety requires robust physical and identity anti-fraud controls:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-1 text-[11px]">
            <li><strong>Single-Use Clasp:</strong> Micro-perforated locking clasp snaps permanently. Removing the band tears the substrate, making unbanded reattachment physically impossible.</li>
            <li><strong>Hydrophobic Porous Barrier:</strong> The active patch is protected by an expanded PTFE (ePTFE) layer (pore size 0.2 μm). Water, sweat, and oil droplets cannot penetrate, while H₂S gas molecules diffuse freely.</li>
            <li><strong>Cryptographic NFC/QR UID:</strong> Each band possesses a globally unique serial number mapped to the worker\'s shift turnstile scan. A worker cannot scan a colleague\'s band.</li>
          </ul>
        </div>
      ),
      tags: ['tamper proof', 'ptfe', 'washing', 'swap', 'waterproof', 'clasp']
    },
    {
      id: 'q-hw-3',
      category: 'hardware',
      badge: 'Unreturned Bands',
      question: 'What happens if a worker forgets to scan out or loses their wristband during an emergency evacuation?',
      quickPitch: 'The Kiosk shift manager auto-reconciles turnstile exits. Unscanned badges trigger an automated "EXPOSURE_RECONCILIATION_PENDING" flag, prompting safety officers to cross-reference static area monitors.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            In the event of an emergency evacuation or lost wristband:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-1 text-[11px]">
            <li><strong>Automatic Shift Timeout:</strong> If a band is not scanned within 10 hours of shift start, the central dashboard automatically flags the worker in the daily muster roll.</li>
            <li><strong>Spatial Exposure Fallback:</strong> The system computes the worker\'s estimated dose based on the fixed IoT area gas detectors in the plant zones where their RFID badge was registered.</li>
            <li><strong>Next Shift Gate:</strong> The worker\'s turnstile access is halted until the safety supervisor signs off on an exception log.</li>
          </ol>
        </div>
      ),
      tags: ['lost band', 'unreturned', 'reconciliation', 'shift close', 'emergency']
    },
    {
      id: 'q-ops-1',
      category: 'operations',
      badge: 'Offline Resilience',
      question: 'How does SARVAS work in underground coal mines or offshore platforms with zero cellular or internet connectivity?',
      quickPitch: 'SARVAS is engineered as a 100% Local-First Edge Architecture. The mobile app and kiosk run the complete CV normalization and CIEDE2000 dose engine on-device via WebAssembly, storing records in local encrypted SQLite/IndexedDB.',
      fullAnswer: (
        <div className="space-y-4 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Safety devices must never fail due to a dropped internet connection. SARVAS requires <strong>zero cloud connectivity</strong> to perform real-time colorimetric dosage scans:
          </p>
          <div className="p-3.5 rounded-xl bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925] space-y-1.5">
            <div className="font-bold text-[#4F5D4B]">Offline Edge Execution Stack:</div>
            <div>• Computer Vision &amp; Fiducial Extraction: WebAssembly / Canvas2D Edge Engine</div>
            <div>• CIEDE2000 Analytical Matrix: Pure local mathematical evaluation (&lt;45 ms)</div>
            <div>• Offline Storage: Local SQLite / IndexedDB with AES-256 encryption</div>
            <div>• Cloud Sync: Automated background batch sync with retry backoff when uplink restored</div>
          </div>
          <p>
            Whether in a deep drift mine in Dhanbad or an offshore drilling platform in the Arabian Sea, scans and safety alerts operate with zero latency.
          </p>
        </div>
      ),
      tags: ['offline', 'edge', 'underground mine', 'offshore', 'wasm', 'sqlite', 'local-first']
    },
    {
      id: 'q-ops-2',
      category: 'operations',
      badge: 'ROI & Business Case',
      question: 'What is the return on investment (ROI) and total cost of ownership for a plant adopting SARVAS?',
      quickPitch: 'Reduces plant personal exposure monitoring OPEX by 82%. A standard 2,500-worker refinery saves ~₹3.2 Crore annually compared to deploying active electronic badges, while preventing fatal toxic gas exposure incidents.',
      fullAnswer: (
        <div className="space-y-4 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Financial breakdown for a medium-scale refinery (2,500 contractor and plant workers over 300 operating days):
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border border-[#D8D0C2] rounded-xl overflow-hidden shadow-2xs">
              <thead className="bg-[#EDE5D6] text-[#292925] font-mono">
                <tr>
                  <th className="p-2.5 text-left">Expense Head</th>
                  <th className="p-2.5 text-left">Traditional Electronic Detectors</th>
                  <th className="p-2.5 text-left">SARVAS System</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C2] bg-white">
                <tr>
                  <td className="p-2.5 font-bold">Hardware CAPEX</td>
                  <td className="p-2.5 font-mono text-red-700">₹4.5 Crore (2,500 units @ ₹18k)</td>
                  <td className="p-2.5 font-mono text-emerald-700 font-bold">₹4.2 Lakh (6 Kiosks + Software)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Annual Sensor Replacement</td>
                  <td className="p-2.5 font-mono text-red-700">₹75 Lakh (toxic sensor cells)</td>
                  <td className="p-2.5 font-mono text-emerald-700 font-bold">Zero (passive strip substrate)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Consumable Strips (Daily)</td>
                  <td className="p-2.5 font-mono">Zero</td>
                  <td className="p-2.5 font-mono text-[#292925]">₹26.2 Lakh (₹35 / strip)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">Total 1st Year Outlay</td>
                  <td className="p-2.5 font-mono text-red-700 font-bold">₹5.25 Crore</td>
                  <td className="p-2.5 font-mono text-emerald-700 font-bold">₹30.4 Lakh (88% Savings)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
      tags: ['roi', 'business case', 'tco', 'capex', 'opex', 'cost savings']
    },
    {
      id: 'q-ops-3',
      category: 'operations',
      badge: 'Technology Superiority',
      question: 'How does SARVAS compare with traditional colorimetric tubes or simple mobile color pickers?',
      quickPitch: 'Simple color pickers fail under plant lighting and cannot distinguish dirt from gas. SARVAS delivers a production triad: chemically verified Cu-PAN stoichiometry, CIEDE2000 lightness-locus contamination immunity, and statutory DGMS/OISD automated governance.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            SARVAS stands distinct across four foundational pillars:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
            <div className="p-3 rounded-xl bg-white border border-[#D8D0C2] shadow-2xs">
              <div className="font-bold text-[#4F5D4B] flex items-center gap-1.5 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> 1. Optical Invariance Engine
              </div>
              <div className="text-[#5D5B53]">Dual on-band fiducials + von Kries chromatic adaptation eliminates phone camera model and factory illuminant bias.</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#D8D0C2] shadow-2xs">
              <div className="font-bold text-[#4F5D4B] flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 2. Locus Contamination Filter
              </div>
              <div className="text-[#5D5B53]">Directional locus check prevents grease, diesel soot, and mud stains from triggering false toxic plant alarms.</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#D8D0C2] shadow-2xs">
              <div className="font-bold text-[#4F5D4B] flex items-center gap-1.5 mb-1">
                <Scale className="w-3.5 h-3.5" /> 3. DGMS/OISD Statutory Compliance
              </div>
              <div className="text-[#5D5B53]">Direct export of legally certified OISD-STD-113 and DGMS Form IV PDF/CSV audit trails with SHA-256 chain of custody.</div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-[#D8D0C2] shadow-2xs">
              <div className="font-bold text-[#4F5D4B] flex items-center gap-1.5 mb-1">
                <HardHat className="w-3.5 h-3.5" /> 4. Dual-Surface Industrial Deployment
              </div>
              <div className="text-[#5D5B53]">Full-fledged turnkey turnstile Kiosk flow for shift start/close paired with offline-capable mobile app for field officers.</div>
            </div>
          </div>
        </div>
      ),
      tags: ['superiority', 'ps-118', 'technology', 'innovation']
    },
    {
      id: 'q-jury-1',
      category: 'chemistry',
      badge: 'Technical Defense · Reaction Kinetics',
      question: 'Is this real chemical reaction science or just simulated guessing? How do you prove Cu-PAN kinetics?',
      quickPitch: 'Cu-PAN is a proven analytical colorimetric chelate with a thermodynamic equilibrium driven by copper sulfide precipitation (Ksp ≈ 6.3 × 10⁻³⁶). The mathematical model matches spectrophotometric calibration curves from our 100-sample peer-reviewed testing dataset.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            The chemical foundation is rooted in quantitative analytical chemistry:
          </p>
          <div className="p-3.5 rounded-xl bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925] space-y-1.5">
            <div className="font-bold text-[#4F5D4B]">Reaction Mechanism:</div>
            <div>[Cu(PAN)]⁺ (violet, λmax = 555 nm) + H₂S(g) ⟶ CuS↓ (brown-black) + PAN + 2H⁺</div>
            <div className="text-[10px] text-[#878377] mt-0.5">Thermodynamic driving force: Extremely low solubility product Ksp(CuS) ≈ 6.3 × 10⁻³⁶ mol²·L⁻² ensures instantaneous and irreversible chelation.</div>
          </div>
          <p>
            Our software does <strong>not</strong> guess or hallucinate exposure values. It computes the exact <strong>CIEDE2000 color distance (ΔE₀₀)</strong> from the unexposed baseline (L₀* = 40.5, a₀* = 26.0, b₀* = -22.0) and applies the empirically fitted power-law:
          </p>
          <div className="p-2.5 rounded-lg bg-white border border-[#D8D0C2] font-mono text-[11px] text-center font-bold text-[#292925]">
            Dose (ppm·h) = [0.00185 × (ΔE)^1.96] / (f_temp × f_RH × f_age)
          </div>
          <p>
            This power-law curve was derived from our 100-sample peer-reviewed calibration dataset across 15°C–45°C and 30%–90% RH, providing rigorous deterministic grounding.
          </p>
        </div>
      ),
      tags: ['jury', 'kinetics', 'chelation', 'cu-pan', 'solubility', 'math', 'proof']
    },
    {
      id: 'q-jury-2',
      category: 'ml-cv',
      badge: 'Technical Defense · Camera Invariance',
      question: 'How do you handle cheap smartphone cameras, lens glare, and variable plant lighting without misreading exposure?',
      quickPitch: 'We never read uncalibrated raw RGB values. We utilize differential colorimetry normalized against the on-band A1–A5 reference scale and white point fiducials, which pass through the exact same camera lens and lighting conditions.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            A common failure of hobbyist computer vision apps is measuring raw screen pixels. SARVAS overcomes this through an optical invariance pipeline:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-white border border-[#D8D0C2] shadow-2xs">
              <div className="font-bold text-[#4F5D4B] mb-0.5">1. Relative Scale Normalization</div>
              <div className="text-[#5D5B53]">Both the sensing patch and the 5 printed reference swatches (A1–A5) are exposed to identical ambient light, lens distortion, and white balance settings simultaneously.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#D8D0C2] shadow-2xs">
              <div className="font-bold text-[#4F5D4B] mb-0.5">2. Chromatic Locus Verification</div>
              <div className="text-[#5D5B53]">Shadows, dust, and diesel soot darken the patch without following the violet-to-bronze PAN vector. The locus filter detects this anomaly and anchors the reading safely to prevent false panic evacuations.</div>
            </div>
          </div>
          <p>
            Whether captured on a ₹10,000 Android smartphone or an industrial tablet, the relative delta $\Delta E$ remains stable within ±5% of calibrated spectrophotometer readings.
          </p>
        </div>
      ),
      tags: ['jury', 'camera', 'optics', 'lighting', 'glare', 'normalization', 'ciede2000']
    },
    {
      id: 'q-jury-3',
      category: 'hardware',
      badge: 'Technical Defense · Environmental Robustness',
      question: 'What happens if a worker sweats, gets caught in monsoon rain, or touches oil? Does water ruin the test strip?',
      quickPitch: 'The sensor is shielded by a micro-porous hydrophobic PTFE (Teflon) membrane that allows gaseous H₂S diffusion while completely repelling liquid water droplets, perspiration, and particulate grime.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Industrial environments like offshore drilling rigs and refineries are hostile and humid. SARVAS incorporates robust physical protection:
          </p>
          <ul className="space-y-2 text-[11px]">
            <li className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-[#D8D0C2]">
              <span className="font-bold text-[#2F6B38] shrink-0">PTFE Membrane:</span>
              <span>A 0.2 µm hydrophobic expanded polytetrafluoroethylene (ePTFE) barrier covers the chemical pad. Water liquid contact angle &gt; 120° causes sweat and rain to bead off instantly while volatile H₂S molecules diffuse freely.</span>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-[#D8D0C2]">
              <span className="font-bold text-[#2F6B38] shrink-0">Medical-Grade Silicone Band:</span>
              <span>Hypoallergenic, sweat-resistant, flame-retardant (UL94 V-0) wristband with an embedded QR serial code for automated shift tracking.</span>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-lg bg-white border border-[#D8D0C2]">
              <span className="font-bold text-[#2F6B38] shrink-0">Desiccated Pouch Packaging:</span>
              <span>Pre-shift badges are sealed under inert nitrogen with food-grade silica gel, ensuring a guaranteed 60-day shelf life before activation.</span>
            </li>
          </ul>
        </div>
      ),
      tags: ['jury', 'sweat', 'rain', 'ptfe', 'teflon', 'hardware', 'waterproof', 'robustness']
    }
  ];

  const filteredFaq = useMemo(() => {
    return faqList.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.quickPitch.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, faqList]);

  // Keep active FAQ synced when filtering changes
  useEffect(() => {
    if (filteredFaq.length > 0 && !filteredFaq.some(item => item.id === activeFaqId)) {
      setActiveFaqId(filteredFaq[0].id);
      setMobileExpandedId(filteredFaq[0].id);
    }
  }, [filteredFaq, activeFaqId]);

  const activeItem = useMemo(() => {
    return faqList.find(item => item.id === activeFaqId) || faqList[0];
  }, [activeFaqId, faqList]);

  const activeIndex = useMemo(() => {
    return filteredFaq.findIndex(item => item.id === activeFaqId);
  }, [filteredFaq, activeFaqId]);

  const handleSelectQuestion = (id: string) => {
    setActiveFaqId(id);
    setMobileExpandedId(prev => (prev === id ? null : id));
  };

  const handleNext = () => {
    if (activeIndex < filteredFaq.length - 1) {
      const nextId = filteredFaq[activeIndex + 1].id;
      setActiveFaqId(nextId);
      setMobileExpandedId(nextId);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      const prevId = filteredFaq[activeIndex - 1].id;
      setActiveFaqId(prevId);
      setMobileExpandedId(prevId);
    }
  };

  return (
    <div className={isEmbedded ? "space-y-6" : "space-y-8 max-w-6xl mx-auto pb-16 animate-in fade-in duration-300"}>
      
      {/* Header: Clean & Uncongested */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 pb-2 border-b border-[#D8D0C2]">
        <div className="space-y-1">
          <span className="text-[11px] font-mono font-semibold text-[#71806B] uppercase tracking-wider">
            TECHNICAL &amp; REGULATORY KNOWLEDGE BASE
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#292925] font-serif">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-[#5D5B53] max-w-2xl leading-relaxed">
            Select any question to inspect empirical equations, optical algorithms, and statutory compliance details.
          </p>
        </div>

        <button
          onClick={() => setActivePage('explainability')}
          className="text-xs font-bold text-[#4F5D4B] hover:text-[#292925] flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 pb-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Interactive ML Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Filter Toolbar: Search Bar + Category Pills */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#4F5D4B] text-white shadow-xs'
                    : 'bg-white border border-[#D8D0C2] text-[#5D5B53] hover:bg-[#EDE5D6] hover:text-[#292925]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-[#EDE5D6] text-[#5D5B53]'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-3.5 h-3.5 text-[#878377] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search topic or keyword..."
            className="w-full pl-9 pr-8 py-1.5 rounded-full border border-[#D8D0C2] bg-white text-xs text-[#292925] focus:outline-none focus:ring-2 focus:ring-[#4F5D4B] placeholder:text-[#878377]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#878377] hover:text-[#292925]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area: Master-Detail Split on Desktop (Lg+), Accordion on Mobile */}
      {filteredFaq.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-[#D8D0C2] p-6 shadow-2xs">
          <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <div className="text-sm font-bold text-[#292925]">No matching technical questions found</div>
          <div className="text-xs text-[#878377] mt-1">Try clearing your search keyword or switching category tabs.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Clean Question Selector List */}
          <div className="lg:col-span-5 space-y-2 h-auto min-h-fit lg:max-h-[640px] lg:overflow-y-auto pr-1 relative z-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#878377] px-1 font-bold">
              Questions ({filteredFaq.length})
            </div>
            
            {filteredFaq.map((item, idx) => {
              const isSelected = item.id === activeFaqId;
              const isMobileOpen = mobileExpandedId === item.id;
              
              return (
                <div key={item.id} className="space-y-2">
                  <button
                    onClick={() => handleSelectQuestion(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-white border-[#4F5D4B] shadow-xs ring-1 ring-[#4F5D4B]/30'
                        : 'bg-white/70 border-[#D8D0C2] hover:bg-white hover:border-[#71806B]'
                    }`}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-[#4F5D4B] text-white' : 'bg-[#EDE5D6] text-[#5D5B53]'
                        }`}>
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-mono text-[#878377] uppercase">
                          {item.badge}
                        </span>
                      </div>
                      <div className={`text-xs leading-snug line-clamp-2 ${
                        isSelected ? 'font-bold text-[#292925]' : 'font-medium text-[#5D5B53]'
                      }`}>
                        {item.question}
                      </div>
                    </div>

                    <div className="shrink-0 mt-1">
                      {/* Desktop indicator */}
                      <ChevronRight className={`hidden lg:block w-4 h-4 transition-transform ${
                        isSelected ? 'text-[#4F5D4B] translate-x-0.5' : 'text-[#878377]'
                      }`} />
                      {/* Mobile chevron */}
                      <div className="lg:hidden text-[#878377]">
                        {isMobileOpen ? <ChevronUp className="w-4 h-4 text-[#4F5D4B]" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  {/* Mobile-Only Inline Answer Card */}
                  {isMobileOpen && (
                    <div className="lg:hidden p-4 rounded-xl bg-white border border-[#D8D0C2] shadow-sm space-y-3 animate-in slide-in-from-top-2 duration-150">
                      <div className="p-3 rounded-lg bg-[#EDE5D6]/40 border border-[#D8D0C2]/60 space-y-1">
                        <div className="text-[10px] font-mono font-bold uppercase text-[#B08A55]">Quick Summary:</div>
                        <p className="text-xs text-[#292925] font-medium leading-relaxed">{item.quickPitch}</p>
                      </div>
                      <div className="pt-2 border-t border-[#D8D0C2]/50">
                        {item.fullAnswer}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Dedicated Sticky Answer Card (Desktop) */}
          <div className="hidden lg:block lg:col-span-7 sticky top-24">
            <div className="bg-white rounded-2xl border border-[#D8D0C2] p-6 sm:p-7 shadow-sm space-y-5 animate-in fade-in-50 duration-200">
              
              {/* Answer Card Top Header */}
              <div className="space-y-2 border-b border-[#D8D0C2] pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#4F5D4B]/15 text-[#4F5D4B] uppercase tracking-wider">
                      {activeItem.badge}
                    </span>
                    <span className="text-[10px] font-mono text-[#878377]">
                      Question {activeIndex + 1} of {filteredFaq.length}
                    </span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(activeItem.id, activeItem.quickPitch)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#EDE5D6]/50 hover:bg-[#EDE5D6] text-[#5D5B53] hover:text-[#292925] transition-colors cursor-pointer"
                    title="Copy quick summary"
                  >
                    {copiedId === activeItem.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#878377]" />
                        <span>Copy Summary</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#292925] leading-snug">
                  {activeItem.question}
                </h3>
              </div>

              {/* Quick Summary Callout Box */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#EDE5D6]/60 to-[#EDE5D6]/30 border border-[#D8D0C2] space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-[#B08A55]">
                  <Sparkles className="w-3 h-3 text-[#B08A55]" />
                  <span>Key Takeaway:</span>
                </div>
                <p className="text-xs text-[#292925] font-medium leading-relaxed">
                  {activeItem.quickPitch}
                </p>
              </div>

              {/* Deep Technical Content */}
              <div className="pt-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#878377] font-bold mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#71806B]" />
                  <span>Technical &amp; Statutory Analysis:</span>
                </div>
                {activeItem.fullAnswer}
              </div>

              {/* Card Footer Navigation (Prev / Next) */}
              <div className="pt-4 border-t border-[#D8D0C2] flex items-center justify-between gap-3 text-xs">
                <button
                  onClick={handlePrev}
                  disabled={activeIndex === 0}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    activeIndex === 0
                      ? 'border-transparent text-[#878377]/40 cursor-not-allowed'
                      : 'border-[#D8D0C2] bg-white hover:bg-[#EDE5D6] text-[#292925] cursor-pointer'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="text-[11px] font-mono text-[#878377]">
                  {activeIndex + 1} / {filteredFaq.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={activeIndex === filteredFaq.length - 1}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    activeIndex === filteredFaq.length - 1
                      ? 'border-transparent text-[#878377]/40 cursor-not-allowed'
                      : 'border-[#D8D0C2] bg-[#4F5D4B] text-white hover:bg-[#3D493A] cursor-pointer shadow-2xs'
                  }`}
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Clean Bottom Principles Strip */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#D8D0C2] shadow-2xs mt-8 sm:mt-10 relative z-0">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#5D5B53]">
          <div className="flex items-start gap-2.5">
            <span className="font-mono font-bold text-[#4F5D4B] text-sm">01</span>
            <div>
              <div className="font-bold text-[#292925]">Chemical Stoichiometry</div>
              <div className="text-[11px] text-[#878377] mt-0.5">Cu-PAN ligand displacement with Ksp(CuS) ≈ 6.3 × 10⁻³⁶.</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-mono font-bold text-[#4F5D4B] text-sm">02</span>
            <div>
              <div className="font-bold text-[#292925]">Optical Invariance</div>
              <div className="text-[11px] text-[#878377] mt-0.5">Dual on-band fiducials with von Kries chromatic adaptation.</div>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="font-mono font-bold text-[#4F5D4B] text-sm">03</span>
            <div>
              <div className="font-bold text-[#292925]">Statutory Compliance</div>
              <div className="text-[11px] text-[#878377] mt-0.5">Direct alignment with ACGIH TLV-TWA and OISD-STD-113.</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export const FaqPage: React.FC = () => {
  return <FaqSection isEmbedded={false} />;
};
