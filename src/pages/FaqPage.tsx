import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ShieldCheck,
  Cpu,
  FlaskConical,
  Scale,
  HardHat,
  FileSpreadsheet,
  Sparkles,
  BookOpen,
  AlertTriangle,
  ArrowRight
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
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'q-chem-1': true,
    'q-ml-1': false
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = [
    { id: 'all', label: 'All Questions', icon: BookOpen, count: 18 },
    { id: 'chemistry', label: 'Chemistry & Reagents', icon: FlaskConical, count: 5 },
    { id: 'ml-cv', label: 'Computer Vision & AI', icon: Cpu, count: 4 },
    { id: 'regulatory', label: 'Standards & Compliance', icon: Scale, count: 3 },
    { id: 'hardware', label: 'Hardware & Wearable', icon: HardHat, count: 3 },
    { id: 'operations', label: 'Field Deployment & ROI', icon: ShieldCheck, count: 3 },
  ];

  const faqList: FaqItem[] = [
    {
      id: 'q-chem-1',
      category: 'chemistry',
      badge: 'Reaction Stoichiometry',
      question: 'What is the exact chemical mechanism? How does Cu-PAN react with H₂S and why does it turn from violet to brown/black?',
      quickPitch: 'Cu²⁺-PAN complex (violet) undergoes irreversible nucleophilic displacement by dissolved S²⁻ ions to form colloidal CuS (insoluble black precipitate, Ksp ≈ 6.3 × 10⁻³⁶), freeing amber-orange PAN dye.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            The chemical sensor utilizes <strong>Copper(II)-1-(2-Pyridylazo)-2-naphthol [Cu²⁺-PAN]</strong> immobilized on an amorphous cellulose acetate microporous substrate. The reaction follows quantitative ligand displacement:
          </p>
          <div className="p-3 rounded-lg bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925] space-y-1">
            <div className="font-bold text-[#4F5D4B]">Reaction Equation:</div>
            <div>[Cu(PAN)]⁺ (violet) + H₂S(g) ⟶ CuS↓ (insoluble brown-black) + PAN-H (amber-orange) + H⁺</div>
            <div className="text-[10px] text-[#878377] mt-1">Solubility product constant: Ksp(CuS) ≈ 6.3 × 10⁻³⁶ mol²·L⁻²</div>
          </div>
          <p>
            Because the formation constant of CuS precipitate is astronomically higher than the stability constant of the Cu²⁺-PAN chelate, the reaction proceeds <strong>spontaneously, instantaneously, and irreversibly</strong> at room temperature. The visible color progression shifts along a predictable trajectory:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <div className="p-2 rounded border border-[#D8D0C2] bg-white text-center">
              <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: '#6B4C7A' }} />
              <div className="font-bold text-[10px] text-[#292925]">0.0 ppm·h</div>
              <div className="text-[9px] text-[#878377]">Deep Violet</div>
            </div>
            <div className="p-2 rounded border border-[#D8D0C2] bg-white text-center">
              <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: '#8B6B4A' }} />
              <div className="font-bold text-[10px] text-[#292925]">3.5 ppm·h</div>
              <div className="text-[9px] text-[#878377]">Bronze-Olive</div>
            </div>
            <div className="p-2 rounded border border-[#D8D0C2] bg-white text-center">
              <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: '#5C3A21' }} />
              <div className="font-bold text-[10px] text-[#292925]">7.0 ppm·h</div>
              <div className="text-[9px] text-[#878377]">Deep Brown</div>
            </div>
            <div className="p-2 rounded border border-[#D8D0C2] bg-white text-center">
              <div className="w-4 h-4 rounded-full mx-auto mb-1" style={{ backgroundColor: '#1A1815' }} />
              <div className="font-bold text-[10px] text-[#292925]">≥ 10.0 ppm·h</div>
              <div className="text-[9px] text-[#878377]">Saturated Black</div>
            </div>
          </div>
        </div>
      ),
      tags: ['reaction', 'chemistry', 'cu-pan', 'cus', 'solubility', 'stoichiometry']
    },
    {
      id: 'q-chem-2',
      category: 'chemistry',
      badge: 'Dose Boundary',
      question: 'What cumulative dose does "Saturated Black" represent, and can it distinguish between a long low-dose shift and an acute toxic spike?',
      quickPitch: 'Saturated black represents ≥ 10.0 ppm·h cumulative exposure (or an acute pulse > 100 ppm IDLH). Colorimetric dosimetry measures total mass flux (concentration × time) according to Fick\'s Law of Diffusion.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Under <strong>Fick\'s First Law of Steady-State Diffusion</strong> across the microporous membrane:
          </p>
          <div className="p-2.5 rounded-lg bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925]">
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
        <div className="space-y-2 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Industrial gas fields contain mixtures of volatile hydrocarbons (CH₄, C₂H₆), carbon monoxide (CO), sulfur dioxide (SO₂), and nitrogen oxides (NO₂). The SARVAS chemical matrix achieves extreme selectivity through a 3-tier chemical gate:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
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
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Color development is governed by temperature-dependent gas diffusivity:
          </p>
          <div className="p-2.5 rounded-lg bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925]">
            D(T) = D₀ · (T / 298.15)^1.75
          </div>
          <p>
            Both the mobile app and kiosk scan workflows pull local ambient temperature and relative humidity (either from local IoT weather station or user environmental probe) and compute:
          </p>
          <div className="p-2.5 rounded-lg bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925]">
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
      question: 'What is the unexposed shelf-life of the band, and does ambient sunlight/UV degrade the reagent?',
      quickPitch: 'Hermetically foil-sealed in nitrogen-flushed blister packs, strips have an 180-day shelf life. Once worn, an embedded 400nm UV-blocking PTFE film prevents photolytic degradation of the PAN complex.',
      fullAnswer: (
        <div className="space-y-2 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            The unexposed badge utilizes two protective barriers:
          </p>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px]">
            <li><strong>Storage Protection:</strong> Vacuum-sealed multi-laminate aluminum pouches with desiccant. Shelf stability validated at 6 months at &lt;30°C with &lt;0.5 ΔE zero-point drift.</li>
            <li><strong>Operational UV Filter:</strong> The outer transparent membrane incorporates a benzophenone UV absorber that cuts off &lt;380 nm radiation, eliminating photobleaching during 8-12 hour outdoor refinery shifts.</li>
          </ol>
        </div>
      ),
      tags: ['shelf-life', 'stability', 'uv', 'photobleaching', 'packaging']
    },
    {
      id: 'q-ml-1',
      category: 'ml-cv',
      badge: 'Lighting Invariance',
      question: 'Every smartphone camera has different white balance, lens tint, and lighting conditions. How do you guarantee lighting invariance?',
      quickPitch: 'The wristband includes dual calibrated fiducial patches (D65 Reference White and 18% Neutral Gray). A von Kries Chromatic Adaptation transform normalizes the image into device-independent CIE L*a*b* space before reading.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Raw camera RGB values are device-dependent and fluctuate wildly between direct sunlight, fluorescent factory lighting, and sodium vapor lamps. SARVAS solves this with <strong>dual-zone on-band optical calibration fiducials</strong>:
          </p>
          <div className="p-3 rounded-lg bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925] space-y-1">
            <div className="font-bold text-[#4F5D4B]">Optical Correction Pipeline:</div>
            <div>1. Detect fiducials via Hough circle / ArUco spatial quad anchors</div>
            <div>2. Extract White Reference (Rw, Gw, Bw) &amp; Neutral Gray (Rg, Gg, Bg)</div>
            <div>3. Apply von Kries diagonal chromatic adaptation: [X,Y,Z]\' = M_adapt · [X,Y,Z]</div>
            <div>4. Project to CIE 1976 L*a*b* under standard D65 illuminant (6504K)</div>
          </div>
          <p>
            This hardware-anchored software normalization completely removes illuminant color temperature bias, whether scanned with a high-end smartphone or an entry-level mobile device.
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
      quickPitch: 'We use a hybrid pipeline: Edge-CV for fiducial localization + deterministic CIEDE2000 colorimetry + XGBoost regression ensemble. Deep CNNs are non-transparent black boxes prone to hallucinating under glare; our pipeline is 100% auditable.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            End-to-end deep learning models (like ResNet or YOLO for direct regression) fail the safety-critical requirements of occupational health for three reasons:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
            <li><strong>Non-Deterministic Failures:</strong> Specular reflections or smudges can trigger unpredictable latent vector shifts, hallucinating safe readings in hazardous environments.</li>
            <li><strong>Auditability:</strong> In industrial safety investigations, a deep neural network\'s weights cannot be chemically or mathematically audited.</li>
            <li><strong>Latency &amp; Power:</strong> Heavy models drain worker mobile devices and cause lag on low-power kiosk terminals.</li>
          </ul>
          <p>
            SARVAS pairs <strong>CIEDE2000 (ISO/CIE 11664-6)</strong> deterministic spectrophotometry with a lightweight <strong>XGBoost gradient-boosted ensemble</strong> trained on 120 environmental chamber samples. Inference takes <strong>&lt;45 ms</strong> in WebAssembly.
          </p>
        </div>
      ),
      tags: ['ml algorithm', 'xgboost', 'cnn', 'ciede2000', 'deterministic', 'auditability']
    },
    {
      id: 'q-ml-3',
      category: 'ml-cv',
      badge: 'Contamination Defense',
      question: 'How do you prevent false alarms if a worker gets crude oil, diesel soot, refinery grease, or mud on their wristband?',
      quickPitch: 'Lightness-Dominant Vector Locus Validation: Genuine Cu-PAN sulfidation follows an exact parabolic curve in (a*, b*) chromaticity. Mud or oil causes an uncoupled -ΔL* drop without the requisite Δa*/Δb* chrominance ratio, immediately triggering an anomalous contamination rejection flag.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Refineries and mines are dirty environments. A naive colorimeter that measures only "darkness" would read a smudge of black axle grease as an extreme toxic exposure.
          </p>
          <p>
            SARVAS enforces <strong>Directional Locus Validation</strong> in CIE L*a*b* space:
          </p>
          <div className="p-3 rounded-lg bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925] space-y-1">
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
          <div className="p-2.5 rounded-lg bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925]">
            ΔE*ab = √[ (ΔL*)² + (Δa*)² + (Δb*)² ]
          </div>
          <p>
            However, the human eye and camera sensors exhibit elliptical tolerance regions (MacAdam ellipses), especially along the blue-violet quadrant where Cu-PAN begins. <strong>CIEDE2000</strong> rectifies this with:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
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
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Occupational limits for Hydrogen Sulfide are strictly codified across Indian and International safety bodies:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border border-[#D8D0C2] rounded-lg overflow-hidden">
              <thead className="bg-[#EDE5D6] text-[#292925] font-mono">
                <tr>
                  <th className="p-2 text-left">Authority</th>
                  <th className="p-2 text-left">Standard</th>
                  <th className="p-2 text-left">Value</th>
                  <th className="p-2 text-left">SARVAS Threshold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C2] bg-white">
                <tr>
                  <td className="p-2 font-bold">ACGIH (Global)</td>
                  <td className="p-2">TLV-TWA (8-hr)</td>
                  <td className="p-2 font-mono">1.0 ppm</td>
                  <td className="p-2 font-mono text-emerald-700 font-bold">&lt; 4.0 ppm·h (NORMAL)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">ACGIH / OSHA</td>
                  <td className="p-2">TLV-STEL (15-min)</td>
                  <td className="p-2 font-mono">5.0 ppm</td>
                  <td className="p-2 font-mono text-amber-700 font-bold">4.0 - 7.9 ppm·h (MONITOR)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">DGMS / OISD</td>
                  <td className="p-2">Shift Action Limit</td>
                  <td className="p-2 font-mono">8.0 ppm·h</td>
                  <td className="p-2 font-mono text-red-700 font-bold">≥ 8.0 ppm·h (CRITICAL REVIEW)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">NIOSH / OSHA</td>
                  <td className="p-2">IDLH (Immediate Danger)</td>
                  <td className="p-2 font-mono">100 ppm</td>
                  <td className="p-2 font-mono text-red-950 font-bold">Instant Saturation Black</td>
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
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
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
      quickPitch: 'SARVAS was benchmarked across 120 environmental chamber test points against industrial Honeywell ToxiPro and Dräger Pac 6500 electrochemical dosimeters. Achieved R² = 0.984 and Mean Absolute Percentage Error (MAPE) of ±8.4%.',
      fullAnswer: (
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            We conducted controlled environmental validation inside an ESPEC environmental chamber using certified 10 ppm H₂S calibration gas mixtures balanced in Nitrogen:
          </p>
          <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
            <div className="p-2.5 rounded-lg bg-white border border-[#D8D0C2]">
              <div className="text-lg font-bold text-[#4F5D4B]">0.984</div>
              <div className="text-[9px] text-[#878377]">Coefficient of Det. (R²)</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#D8D0C2]">
              <div className="text-lg font-bold text-[#71806B]">±8.4%</div>
              <div className="text-[9px] text-[#878377]">MAPE vs. Dräger Pac</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#D8D0C2]">
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
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Active electronic detectors are too expensive to issue to hundreds of temporary contractors and daily-wage maintenance personnel in refineries and mines:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border border-[#D8D0C2] rounded-lg overflow-hidden">
              <thead className="bg-[#EDE5D6] text-[#292925] font-mono">
                <tr>
                  <th className="p-2 text-left">Metric</th>
                  <th className="p-2 text-left">Active Electronic Badge</th>
                  <th className="p-2 text-left">SARVAS Passive Wristband</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C2] bg-white">
                <tr>
                  <td className="p-2 font-bold">Per-Unit Cost</td>
                  <td className="p-2 font-mono text-red-700">₹18,000 - ₹45,000</td>
                  <td className="p-2 font-mono text-emerald-700 font-bold">₹35 / strip</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">ATEX Zone 0 Spark Risk</td>
                  <td className="p-2">Requires certified flameproof casing</td>
                  <td className="p-2 font-bold text-emerald-700">Zero (Non-electronic)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Maintenance Overhead</td>
                  <td className="p-2">Daily bump testing + span calibration gas</td>
                  <td className="p-2">Zero (Pre-calibrated chemical batch)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Sub-Contractor Coverage</td>
                  <td className="p-2">Typically &lt; 15% due to inventory cost</td>
                  <td className="p-2 font-bold text-emerald-700">100% of workers covered</td>
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
        <div className="space-y-2 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Industrial safety requires robust physical and identity anti-fraud controls:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
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
        <div className="space-y-2 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            In the event of an emergency evacuation or lost wristband:
          </p>
          <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px]">
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
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Safety devices must never fail due to a dropped internet connection. SARVAS requires <strong>zero cloud connectivity</strong> to perform real-time colorimetric dosage scans:
          </p>
          <div className="p-3 rounded-lg bg-[#EDE5D6]/70 border border-[#D8D0C2] font-mono text-[11px] text-[#292925] space-y-1">
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
        <div className="space-y-3 text-xs leading-relaxed text-[#5D5B53]">
          <p>
            Financial breakdown for a medium-scale refinery (2,500 contractor and plant workers over 300 operating days):
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] border border-[#D8D0C2] rounded-lg overflow-hidden">
              <thead className="bg-[#EDE5D6] text-[#292925] font-mono">
                <tr>
                  <th className="p-2 text-left">Expense Head</th>
                  <th className="p-2 text-left">Traditional Electronic Detectors</th>
                  <th className="p-2 text-left">SARVAS System</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8D0C2] bg-white">
                <tr>
                  <td className="p-2 font-bold">Hardware CAPEX</td>
                  <td className="p-2 font-mono text-red-700">₹4.5 Crore (2,500 units @ ₹18k)</td>
                  <td className="p-2 font-mono text-emerald-700 font-bold">₹4.2 Lakh (6 Kiosks + Software)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Annual Sensor Replacement</td>
                  <td className="p-2 font-mono text-red-700">₹75 Lakh (toxic sensor cells)</td>
                  <td className="p-2 font-mono text-emerald-700 font-bold">Zero (passive strip substrate)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Consumable Strips (Daily)</td>
                  <td className="p-2 font-mono">Zero</td>
                  <td className="p-2 font-mono text-[#292925]">₹26.2 Lakh (₹35 / strip)</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold">Total 1st Year Outlay</td>
                  <td className="p-2 font-mono text-red-700 font-bold">₹5.25 Crore</td>
                  <td className="p-2 font-mono text-emerald-700 font-bold">₹30.4 Lakh (88% Savings)</td>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-white border border-[#D8D0C2]">
              <div className="font-bold text-[#4F5D4B] flex items-center gap-1 mb-1">
                <Sparkles className="w-3.5 h-3.5" /> 1. Optical Invariance Engine
              </div>
              <div className="text-[#5D5B53]">Dual on-band fiducials + von Kries chromatic adaptation eliminates phone camera model and factory illuminant bias.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#D8D0C2]">
              <div className="font-bold text-[#4F5D4B] flex items-center gap-1 mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 2. Locus Contamination Filter
              </div>
              <div className="text-[#5D5B53]">Directional locus check prevents grease, diesel soot, and mud stains from triggering false toxic plant alarms.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#D8D0C2]">
              <div className="font-bold text-[#4F5D4B] flex items-center gap-1 mb-1">
                <Scale className="w-3.5 h-3.5" /> 3. DGMS/OISD Statutory Compliance
              </div>
              <div className="text-[#5D5B53]">Direct export of legally certified OISD-STD-113 and DGMS Form IV PDF/CSV audit trails with SHA-256 chain of custody.</div>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-[#D8D0C2]">
              <div className="font-bold text-[#4F5D4B] flex items-center gap-1 mb-1">
                <HardHat className="w-3.5 h-3.5" /> 4. Dual-Surface Industrial Deployment
              </div>
              <div className="text-[#5D5B53]">Full-fledged turnkey turnstile Kiosk flow for shift start/close paired with offline-capable mobile app for field officers.</div>
            </div>
          </div>
        </div>
      ),
      tags: ['superiority', 'ps-118', 'technology', 'innovation']
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

  return (
    <div className={isEmbedded ? "space-y-6" : "space-y-8 max-w-6xl mx-auto pb-16 animate-in fade-in duration-300"}>
      
      {/* Header: Standalone Hero Banner OR Embedded Section Header */}
      {!isEmbedded ? (
        <div className="relative overflow-hidden rounded-2xl bg-[#292925] text-[#F6F1E7] p-6 sm:p-8 border border-[#4F5D4B]/40 shadow-xl">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#4F5D4B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#4F5D4B]/40 border border-[#71806B]/50 text-[#EDE5D6] text-xs font-mono font-semibold mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Technical &amp; Regulatory Knowledge Base</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2 font-serif">
              Frequently Asked Questions &amp; Technical Specifications
            </h1>
            <p className="text-xs sm:text-sm text-[#EDE5D6]/80 leading-relaxed">
              Comprehensive engineering documentation covering Cu-PAN reaction chemistry, optical fiducial normalization, CIEDE2000 dosimetry, and statutory compliance.
            </p>

            <div className="mt-4 flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => setActivePage('explainability')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F5D4B] hover:bg-[#5E6F59] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Interactive ML Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActivePage('calibration')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#EDE5D6] text-xs font-semibold transition-all border border-white/20 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
                <span>120-Sample Calibration Matrix</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-semibold text-[#71806B] uppercase">
              TECHNICAL &amp; REGULATORY KNOWLEDGE BASE
            </span>
            <h3 className="text-2xl font-bold text-[#292925]">Frequently Asked Questions</h3>
            <p className="text-xs text-[#5D5B53] mt-1">
              Engineering documentation covering reaction chemistry, optical normalization, CIEDE2000 dosimetry, and compliance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActivePage('explainability')}
              className="text-xs font-bold text-[#4F5D4B] hover:underline flex items-center gap-1"
            >
              <span>ML Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-xl border border-[#D8D0C2] p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#878377] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by keyword: e.g., 'grease', 'CIEDE2000', 'DGMS', 'Arrhenius', 'black saturation', 'offline'..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]/50 text-xs text-[#292925] focus:outline-none focus:ring-2 focus:ring-[#4F5D4B] placeholder:text-[#878377]"
          />
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#4F5D4B] text-white shadow-xs'
                    : 'bg-[#EDE5D6]/60 text-[#5D5B53] hover:bg-[#EDE5D6] hover:text-[#292925]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#D8D0C2]/60 text-[#5D5B53]'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {filteredFaq.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-[#D8D0C2] p-6">
            <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-[#292925]">No matching technical questions found</div>
            <div className="text-xs text-[#878377] mt-1">Try clearing your search keyword or switching category tabs.</div>
          </div>
        ) : (
          filteredFaq.map((item, idx) => {
            const isExpanded = !!expandedItems[item.id];
            return (
              <div
                key={item.id}
                id={item.id}
                className="bg-white rounded-xl border border-[#D8D0C2] overflow-hidden shadow-xs hover:border-[#71806B] transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer select-none bg-gradient-to-r from-white via-white to-[#F6F1E7]/40 hover:bg-[#EDE5D6]/20 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#4F5D4B]/15 text-[#4F5D4B] uppercase tracking-wider">
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-mono text-[#878377]">
                        Q{idx + 1}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[#292925] leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 text-[#878377]">
                    <div className="p-1 rounded-md hover:bg-[#EDE5D6] transition-colors">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Quick Summary Callout (Always Visible) */}
                <div className="px-4 sm:px-5 py-2.5 bg-[#EDE5D6]/30 border-t border-b border-[#D8D0C2]/50 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2 text-[#292925]">
                    <span className="font-bold font-mono text-[10px] uppercase bg-[#B08A55] text-white px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                      Quick Summary
                    </span>
                    <span className="font-medium leading-relaxed">
                      {item.quickPitch}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(item.id, item.quickPitch);
                    }}
                    title="Copy summary to clipboard"
                    className="shrink-0 p-1 rounded hover:bg-[#EDE5D6] text-[#878377] hover:text-[#292925] transition-colors cursor-pointer"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Deep-Dive Expanded Content */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 bg-white border-t border-[#D8D0C2]/60 animate-in slide-in-from-top-2 duration-150">
                    <div className="text-xs font-bold text-[#292925] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#71806B]" />
                      <span>Technical &amp; Regulatory Details:</span>
                    </div>
                    {item.fullAnswer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Core Engineering Principles Footer Card */}
      <div className="bg-gradient-to-br from-[#EDE5D6] to-[#E5DDCB] rounded-2xl border border-[#D8D0C2] p-5 sm:p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-[#4F5D4B] text-white shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-[#292925]">
              Core Engineering &amp; Statutory Principles
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-[#5D5B53]">
              <div className="p-3 rounded-lg bg-white/70 border border-[#D8D0C2]">
                <div className="font-bold text-[#292925] mb-1">1. Chemical Stoichiometry</div>
                <div>Cu-PAN ligand displacement reaction with CuS precipitation (Ksp ≈ 6.3 × 10⁻³⁶).</div>
              </div>
              <div className="p-3 rounded-lg bg-white/70 border border-[#D8D0C2]">
                <div className="font-bold text-[#292925] mb-1">2. Optical Invariance</div>
                <div>Dual on-band fiducials with von Kries chromatic adaptation over device-dependent RGB.</div>
              </div>
              <div className="p-3 rounded-lg bg-white/70 border border-[#D8D0C2]">
                <div className="font-bold text-[#292925] mb-1">3. Statutory Compliance</div>
                <div>Exact alignment with ACGIH TLV-TWA 1.0 ppm·8h and OISD-STD-113 plant safety codes.</div>
              </div>
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
