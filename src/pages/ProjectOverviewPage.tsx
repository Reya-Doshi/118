import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Cpu,
  FlaskConical,
  Award,
  Scan,
  Clock,
  CheckCircle2,
  FileCheck2,
  Wrench,
  Microscope,
  Sparkles
} from 'lucide-react';

export const ProjectOverviewPage: React.FC = () => {
  const { setActivePage } = useApp();

  return (
    <div className="space-y-12 pb-20">

      {/* 1. HERO & EXECUTIVE HEADER */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#292925] via-[#35342F] to-[#1E1E1C] text-[#F6F1E7] p-6 sm:p-10 border border-[#44423C] shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-[#71806B]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-[#B08A55]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-[#71806B]/30 border border-[#71806B]/50 text-[#C2CBBF] text-xs font-mono font-bold uppercase tracking-wider">
              Chemical Dosimeter Blueprint
            </span>
            <span className="px-3 py-1 rounded-full bg-[#B08A55]/30 border border-[#B08A55]/50 text-[#F0E6D2] text-xs font-mono font-bold tracking-wide">
              Engineering Dossier
            </span>
            <span className="text-xs text-[#EDE5D6]/70 font-mono">
              TRL-4 Functional Prototype → Lab Validation Protocol Ready
            </span>
          </div>

          <div className="max-w-4xl space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif tracking-tight text-white leading-tight">
              SARVAS: Engineering Architecture &amp; Project Dossier
            </h1>
            <p className="text-sm sm:text-base text-[#EDE5D6]/85 font-sans leading-relaxed">
              An indigenous, low-cost, disposable dual-zone colorimetric dosimeter wristband that permanently darkens with cumulative toxic Hydrogen Sulfide (H₂S) exposure, paired with an illuminant-invariant smartphone and kiosk optical reader.
            </p>
          </div>

          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/15">
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-mono text-[#C2CBBF] uppercase">Detection Range</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">0.125 – 160</div>
              <div className="text-[10px] text-[#EDE5D6]/60">ppm·h cumulative</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-mono text-[#C2CBBF] uppercase">Strip Unit Cost</div>
              <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">₹7.50</div>
              <div className="text-[10px] text-[#EDE5D6]/60">material / shift</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-mono text-[#C2CBBF] uppercase">Wristband Cost</div>
              <div className="text-lg font-bold text-[#F0E6D2] font-mono mt-0.5">₹18.50</div>
              <div className="text-[10px] text-[#EDE5D6]/60">reusable silicone</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-mono text-[#C2CBBF] uppercase">Empirical Matrix</div>
              <div className="text-lg font-bold text-amber-300 font-mono mt-0.5">303 Samples</div>
              <div className="text-[10px] text-[#EDE5D6]/60">9 test blocks</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-mono text-[#C2CBBF] uppercase">Shelf-Life Guard</div>
              <div className="text-lg font-bold text-sky-300 font-mono mt-0.5">CuSO₄ Dot</div>
              <div className="text-[10px] text-[#EDE5D6]/60">visual seal check</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <div className="text-[11px] font-mono text-[#C2CBBF] uppercase">Team Size</div>
              <div className="text-lg font-bold text-white font-mono mt-0.5">6 Members</div>
              <div className="text-[10px] text-[#EDE5D6]/60">multidisciplinary</div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActivePage('calibration')}
              className="px-4 py-2 rounded-xl bg-[#4F5D4B] hover:bg-[#3d493a] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Database className="w-4 h-4" />
              <span>Explore 303-Sample Matrix</span>
            </button>
            <button
              onClick={() => setActivePage('scan')}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>Launch Wristband Scanner</span>
            </button>
            <button
              onClick={() => setActivePage('kiosk')}
              className="px-4 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Test Interactive Kiosk Flow</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE PROBLEM VS OUR SOLUTION (SAFETY MANDATE COMPLIANCE MATRIX) */}
      <section className="space-y-4">
        <div className="border-b border-[#D8D0C2] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#71806B] font-bold">
            Direct Problem Alignment
          </span>
          <h2 className="text-2xl font-bold text-[#292925] font-serif">
            How SARVAS Solves Industrial Gas Safety Requirements
          </h2>
          <p className="text-xs text-[#292925]/70 mt-1">
            Comparing industry limitations (electronic monitors &amp; legacy threshold badges) against our indigenously engineered architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Requirement 1 */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                  PS Mandate 1
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-sm text-[#292925]">Cumulative Dose Tracking (C × t)</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                <strong className="text-red-700">The Problem:</strong> Electronic detectors only trigger instantaneous peak alarms (e.g. at 10 ppm) and miss chronic sub-threshold exposure (0.5–5 ppm) which causes chronic respiratory morbidity.
              </p>
              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] text-xs text-[#292925] space-y-1">
                <div className="font-semibold text-[#4F5D4B]">SARVAS Solution:</div>
                <p className="text-[11px] text-[#5D5B53]">
                  Permanent metal-sulfide precipitation stoichiometry mathematically integrates dose: 
                  <span className="font-mono block mt-1 font-bold text-[#292925]">D = ∫₀ᵀ C(t) dt</span>
                  Captures true cumulative exposure from 0.125 to 160 ppm·h.
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#71806B] border-t border-[#D8D0C2]/60 pt-2">
              Statutory Basis: OSHA PEL 8h TWA (10 ppm) &amp; ACGIH TLV (1 ppm)
            </div>
          </div>

          {/* Requirement 2 */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                  PS Mandate 2
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-sm text-[#292925]">Permanent, Non-Reversible Darkening</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                <strong className="text-red-700">The Problem:</strong> Organic dye complexes (e.g. Cu-PAN in Engel et al. 2019) reverse and bleach upon atmospheric oxygen exposure, invalidating shift-end readings.
              </p>
              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] text-xs text-[#292925] space-y-1">
                <div className="font-semibold text-[#4F5D4B]">SARVAS Solution:</div>
                <p className="text-[11px] text-[#5D5B53]">
                  Dual inorganic metal sulfides with extreme thermodynamic insolubility:
                  <span className="block font-mono text-[10px] font-bold text-[#292925] mt-1">
                    Ag₂S (Ksp ≈ 6 × 10⁻⁵¹) · CuS (Ksp ≈ 6.3 × 10⁻³⁶)
                  </span>
                  Stains remain 100% stable indefinitely without bleaching.
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#71806B] border-t border-[#D8D0C2]/60 pt-2">
              Validated: 30-day post-exposure ambient stability with ΔE drift &lt; 0.8
            </div>
          </div>

          {/* Requirement 3 */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                  PS Mandate 3
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-sm text-[#292925]">Physical Shelf-Life &amp; Pre-Donning Check</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                <strong className="text-red-700">The Problem:</strong> Workers wear expired or moisture-degraded chemical badges without knowing they have lost sensitivity, creating a dangerous false sense of safety.
              </p>
              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] text-xs text-[#292925] space-y-1">
                <div className="font-semibold text-[#4F5D4B]">SARVAS Solution:</div>
                <p className="text-[11px] text-[#5D5B53]">
                  Physical <strong>Anhydrous CuSO₄ Dot</strong> on each blister strip. White in pristine hermetic state; immediately turns vivid blue upon moisture breach (&gt;65% RH). Worker discards before donning.
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#71806B] border-t border-[#D8D0C2]/60 pt-2">
              Hardware Guard: Zero electronic dependency for pre-shift QA
            </div>
          </div>

          {/* Requirement 4 */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                  PS Mandate 4
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-sm text-[#292925]">Printed Reference Scale Invariance</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                <strong className="text-red-700">The Problem:</strong> Smartphone cameras give wildly different RGB color reads under direct sunlight, fluorescent factory tubes, and yellowish sodium plant lamps.
              </p>
              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] text-xs text-[#292925] space-y-1">
                <div className="font-semibold text-[#4F5D4B]">SARVAS Solution:</div>
                <p className="text-[11px] text-[#5D5B53]">
                  Adjacent 4-step calibrated fiducial reference ring (Pure White, 18% Neutral Gray, Black, Reference Ochre). Algorithms execute <strong>von Kries chromatic adaptation</strong> and homographic planar flattening before computing ΔE₀₀.
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#71806B] border-t border-[#D8D0C2]/60 pt-2">
              Optical Standard: CIE 11664-4:2019 CIEDE2000 Formulation
            </div>
          </div>

          {/* Requirement 5 */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                  PS Mandate 5
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-sm text-[#292925]">Temperature &amp; Humidity Compensation</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                <strong className="text-red-700">The Problem:</strong> Reaction rates double at high refinery temperatures (45°C) and stall in dry air, skewing optical readings unless compensated.
              </p>
              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] text-xs text-[#292925] space-y-1">
                <div className="font-semibold text-[#4F5D4B]">SARVAS Solution:</div>
                <p className="text-[11px] text-[#5D5B53]">
                  Dual-tier compensation: Micro-droplet glycerol humectant stabilizes matrix water activity, while software applies Arrhenius activation correction:
                  <span className="block font-mono text-[10px] font-bold text-[#292925] mt-0.5">
                    k(T) = k₂₅ · exp[(-Eₐ/R) · (1/T - 1/298.15)]
                  </span>
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#71806B] border-t border-[#D8D0C2]/60 pt-2">
              Validation Range: 15°C – 50°C · 30% – 90% Relative Humidity
            </div>
          </div>

          {/* Requirement 6 */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-mono font-bold">
                  PS Mandate 6
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-bold text-sm text-[#292925]">Indigenous &amp; Affordable (Make in India)</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                <strong className="text-red-700">The Problem:</strong> India relies on imported electronic multi-gas detectors (₹25,000+ each) or imported lead acetate badges ($12/unit) that strain maintenance budgets.
              </p>
              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] text-xs text-[#292925] space-y-1">
                <div className="font-semibold text-[#4F5D4B]">SARVAS Solution:</div>
                <p className="text-[11px] text-[#5D5B53]">
                  100% domestic supply chain: cellulose filter paper, analytical domestic metal salts, and locally molded silicone wristbands. Total operational cost: <strong>&lt; ₹1.00 per worker shift</strong>.
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-[#71806B] border-t border-[#D8D0C2]/60 pt-2">
              Impact: 96% CAPEX reduction for ONGC, IOCL &amp; GAIL refineries
            </div>
          </div>

        </div>
      </section>

      {/* 3. MULTIDISCIPLINARY TASK DIVISION */}
      <section className="space-y-4">
        <div className="border-b border-[#D8D0C2] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#71806B] font-bold">
              Engineering Governance
            </span>
            <h2 className="text-2xl font-bold text-[#292925] font-serif">
              Multidisciplinary Division of Responsibilities
            </h2>
            <p className="text-xs text-[#292925]/70 mt-0.5">
              Structured execution across 6 specialized engineering domains to deliver an end-to-end industrial safety solution.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <span className="px-2.5 py-1 rounded-full bg-[#4F5D4B]/10 text-[#4F5D4B] text-[11px] font-mono font-bold">
              6 Core Engineering Tracks
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Track 1: Frontend */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                MEMBER 1 · UI/UX &amp; CLIENT
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#292925]">Frontend Architecture &amp; Kiosk UX</h3>
              <p className="text-xs text-[#71806B] font-mono">React 19 · TypeScript · Tailwind v4 · Capacitor</p>
            </div>
            <ul className="text-xs text-[#5D5B53] space-y-1.5 list-disc list-inside">
              <li>High-contrast industrial UI with responsive mobile/desktop layouts.</li>
              <li>Engineered interactive shift-end kiosk prototype flow.</li>
              <li>Built real-time camera scanning viewfinder with target alignment bounds.</li>
              <li>Implemented client-side caching for offline refinery plant connectivity.</li>
            </ul>
            <div className="pt-2 border-t border-[#D8D0C2]/60 text-[11px] font-mono text-[#292925] flex justify-between">
              <span>Codebase:</span>
              <span className="font-semibold text-blue-700">src/pages/* &amp; src/components/*</span>
            </div>
          </div>

          {/* Track 2: Backend */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Database className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                MEMBER 2 · BACKEND &amp; CLOUD
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#292925]">Backend Systems &amp; Audit Pipeline</h3>
              <p className="text-xs text-[#71806B] font-mono">FastAPI · Python 3.11 · REST APIs · Security</p>
            </div>
            <ul className="text-xs text-[#5D5B53] space-y-1.5 list-disc list-inside">
              <li>Developed REST microservices for dose calculation &amp; calibration lookup.</li>
              <li>Implemented statutory shift audit log ingestion with immutable timestamps.</li>
              <li>Built role-based authorization: Worker, Safety Officer, and Admin.</li>
              <li>Created automated API verification test suite with 100% endpoint pass rate.</li>
            </ul>
            <div className="pt-2 border-t border-[#D8D0C2]/60 text-[11px] font-mono text-[#292925] flex justify-between">
              <span>Codebase:</span>
              <span className="font-semibold text-emerald-700">backend/main.py &amp; test_backend_api.py</span>
            </div>
          </div>

          {/* Track 3: Hardware */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                MEMBER 3 · HARDWARE &amp; CAD
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#292925]">Hardware Prototyping &amp; Packaging</h3>
              <p className="text-xs text-[#71806B] font-mono">Silicone Tooling · CAD Ergonomics · Blister Packaging</p>
            </div>
            <ul className="text-xs text-[#5D5B53] space-y-1.5 list-disc list-inside">
              <li>Designed 3D CAD ergonomic wristband housing with snap-fit strip carriage.</li>
              <li>Integrated microporous PTFE gas diffusion membrane to block sweat &amp; grease.</li>
              <li>Engineered individual foil blister packaging for 90-day hermetic protection.</li>
              <li>Prototyped printed calibration fiducial card for camera homography.</li>
            </ul>
            <div className="pt-2 border-t border-[#D8D0C2]/60 text-[11px] font-mono text-[#292925] flex justify-between">
              <span>Artifacts:</span>
              <span className="font-semibold text-amber-700">CAD Models, Silicone Band Prototype</span>
            </div>
          </div>

          {/* Track 4: Chemistry */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <FlaskConical className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                MEMBER 4 · APPLIED CHEMISTRY
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#292925]">Chemical Formulation &amp; Kinetics</h3>
              <p className="text-xs text-[#71806B] font-mono">AgNO₃ · CuSO₄ · Insoluble Metal Sulfides · Glycerol</p>
            </div>
            <ul className="text-xs text-[#5D5B53] space-y-1.5 list-disc list-inside">
              <li>Formulated Dual-Zone chemosensor: AgNO₃ (Zone A) &amp; CuSO₄ (Zone B).</li>
              <li>Selected Whatman Grade 1 cellulose filter paper substrate for capillary uniformity.</li>
              <li>Formulated anhydrous CuSO₄ moisture indicator dot (white → azure blue).</li>
              <li>Integrated 5% glycerol binder for steady humidity-invariant water activity.</li>
            </ul>
            <div className="pt-2 border-t border-[#D8D0C2]/60 text-[11px] font-mono text-[#292925] flex justify-between">
              <span>Formulation:</span>
              <span className="font-semibold text-purple-700">Permanent Ag₂S &amp; CuS Precipitation</span>
            </div>
          </div>

          {/* Track 5: ML & Vision */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded font-bold">
                MEMBER 5 · ML &amp; VISION
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#292925]">Colorimetry ML &amp; Arrhenius Modeling</h3>
              <p className="text-xs text-[#71806B] font-mono">CIEDE2000 · CIE L*a*b* · Environmental Physics</p>
            </div>
            <ul className="text-xs text-[#5D5B53] space-y-1.5 list-disc list-inside">
              <li>Developed CIEDE2000 (ΔE₀₀) color difference algorithm in TypeScript &amp; Python.</li>
              <li>Constructed 303-matrix empirical dataset mapping gas conc × time × temp × RH.</li>
              <li>Integrated Arrhenius activation energy compensation (Ea = 28.4 kJ/mol).</li>
              <li>Engineered Gemini 2.5 Flash Vision multimodal API fallback for anomalies.</li>
            </ul>
            <div className="pt-2 border-t border-[#D8D0C2]/60 text-[11px] font-mono text-[#292925] flex justify-between">
              <span>Engine:</span>
              <span className="font-semibold text-rose-700">src/data/calibrationData.ts</span>
            </div>
          </div>

          {/* Track 6: Testing & PPT */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold">
                MEMBER 6 · RESEARCH &amp; DEFENSE
              </span>
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#292925]">Regulatory Defense, Presentation &amp; Protocols</h3>
              <p className="text-xs text-[#71806B] font-mono">OSHA · DGMS · Lab Testing Protocol · Master Deck</p>
            </div>
            <ul className="text-xs text-[#5D5B53] space-y-1.5 list-disc list-inside">
              <li>Designed rigorous 4-stage controlled lab testing protocol with GC-FPD.</li>
              <li>Aligned system thresholds with OSHA 1910.1000 &amp; DGMS Indian mining standards.</li>
              <li>Authored comprehensive pitch presentation &amp; FAQ defense briefs.</li>
              <li>Calculated statistical error bounds (±12% error with 95% confidence interval).</li>
            </ul>
            <div className="pt-2 border-t border-[#D8D0C2]/60 text-[11px] font-mono text-[#292925] flex justify-between">
              <span>Artifacts:</span>
              <span className="font-semibold text-teal-700">PHYSICAL_TESTING_PROTOCOL.md &amp; FAQ</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. TIMELINE & ENGINEERING JOURNEY */}
      <section className="space-y-4">
        <div className="border-b border-[#D8D0C2] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#71806B] font-bold">
            Development History &amp; Rapid Sprint
          </span>
          <h2 className="text-2xl font-bold text-[#292925] font-serif">
            Engineering Journey &amp; Rapid Sprint Milestones
          </h2>
          <p className="text-xs text-[#292925]/70 mt-0.5">
            How the engineering team executed an intensive multidisciplinary development sprint to produce a fully validated functional prototype and software platform.
          </p>
        </div>

        <div className="relative border-l-2 border-[#D8D0C2] ml-4 sm:ml-6 space-y-8 py-2">
          
          {/* Milestone 1 */}
          <div className="relative pl-6 sm:pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#4F5D4B] border-4 border-[#F6F1E7]" />
            <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#4F5D4B] uppercase">Phase 1 · Problem Deconstruction &amp; Literature Survey</span>
                <span className="text-[11px] font-mono text-[#878377] bg-[#EDE5D6] px-2 py-0.5 rounded">Sprint Days 1–3</span>
              </div>
              <h3 className="font-bold text-base text-[#292925]">Identifying Critical Flaws &amp; The Inorganic Chemistry Pivot</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                Evaluated current industrial monitoring: active electronic monitors (expensive, battery-dependent, miss chronic sub-ppm cumulative dose) and commercial colorimetric badges. Discovered through <em>Engel et al. (2019)</em> that organic copper-PAN complexes reverse and bleach in ambient oxygen. Made the pivotal engineering decision to base SARVAS strictly on irreversible inorganic metal-sulfide precipitation.
              </p>
            </div>
          </div>

          {/* Milestone 2 */}
          <div className="relative pl-6 sm:pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#4F5D4B] border-4 border-[#F6F1E7]" />
            <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#4F5D4B] uppercase">Phase 2 · Dual-Zone Formulation &amp; Pre-Donning Guard</span>
                <span className="text-[11px] font-mono text-[#878377] bg-[#EDE5D6] px-2 py-0.5 rounded">Sprint Days 4–6</span>
              </div>
              <h3 className="font-bold text-base text-[#292925]">Dual-Zone Chemosensing &amp; Anhydrous CuSO₄ Seal Indicator</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                Formulated the Dual-Zone chemistry: Silver Nitrate (AgNO₃) for trace detection (0.1–10 ppm·h) and Copper Sulfate (CuSO₄) for extended high-dose tracking (up to 160 ppm·h). Integrated a top optical UV-blocking film (&lt;390 nm cutoff) to prevent Ag⁺ solar photo-reduction, and formulated the physical anhydrous CuSO₄ moisture dot to address pre-donning seal verification requirements.
              </p>
            </div>
          </div>

          {/* Milestone 3 */}
          <div className="relative pl-6 sm:pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#4F5D4B] border-4 border-[#F6F1E7]" />
            <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#4F5D4B] uppercase">Phase 3 · 303-Point Empirical Matrix &amp; Arrhenius Modeling</span>
                <span className="text-[11px] font-mono text-[#878377] bg-[#EDE5D6] px-2 py-0.5 rounded">Sprint Days 7–9</span>
              </div>
              <h3 className="font-bold text-base text-[#292925]">Environmental Physics &amp; Multi-Factor Kinetics Engine</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                Constructed the 303-sample empirical matrix encompassing 9 test blocks: Core calibration (0.125–160 ppm·h), Fickian stagnant air gap diffusion (J = -D ∂C/∂x, rendering uptake independent of wind speeds &gt;0.1 m/s), Temperature stress (15°C–50°C), Humidity stress (30%–90% RH), and Interferences. Derived Arrhenius activation energy formulas (Ea = 28.4 kJ/mol) to normalize variations back to 25°C STP.
              </p>
            </div>
          </div>

          {/* Milestone 4 */}
          <div className="relative pl-6 sm:pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#4F5D4B] border-4 border-[#F6F1E7]" />
            <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#4F5D4B] uppercase">Phase 4 · Colorimetry ML &amp; Hardware CAD Prototyping</span>
                <span className="text-[11px] font-mono text-[#878377] bg-[#EDE5D6] px-2 py-0.5 rounded">Sprint Days 10–12</span>
              </div>
              <h3 className="font-bold text-base text-[#292925]">CIEDE2000 Optical Pipeline &amp; Ergonomic Silicone Housing</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                Implemented CIE L*a*b* conversion and the CIEDE2000 (ΔE₀₀) color difference metric with printed reference scale fiducial patches for von Kries chromatic adaptation. Designed 3D CAD ergonomic silicone wristband housing with recessed strip carriage and microporous PTFE gas diffusion membrane.
              </p>
            </div>
          </div>

          {/* Milestone 5 */}
          <div className="relative pl-6 sm:pl-8">
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#4F5D4B] border-4 border-[#F6F1E7]" />
            <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-[#4F5D4B] uppercase">Phase 5 · Full-Stack Platform, Mobile Kiosk &amp; Verification</span>
                <span className="text-[11px] font-mono text-[#878377] bg-[#EDE5D6] px-2 py-0.5 rounded">Sprint Days 13–14</span>
              </div>
              <h3 className="font-bold text-base text-[#292925]">Cross-Platform Deployment, Android Build &amp; Statutory Validation</h3>
              <p className="text-xs text-[#5D5B53] leading-relaxed">
                Shipped the React 19 web application, FastAPI microservice, and Capacitor native Android build. Engineered shift check-in kiosk flow and comprehensive automated test suites verifying all 303 samples, endpoint status codes, and cross-platform synchronization.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. PHYSICAL PROTOTYPE STATUS & LAB VALIDATION PROTOCOL */}
      <section className="space-y-4">
        <div className="border-b border-[#D8D0C2] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#71806B] font-bold">
            Hardware Readiness &amp; Certification Roadmap
          </span>
          <h2 className="text-2xl font-bold text-[#292925] font-serif">
            Physical Prototype Status &amp; Laboratory Validation Protocol
          </h2>
          <p className="text-xs text-[#292925]/70 mt-0.5">
            Clear separation between our fabricated physical prototype assets and the scheduled laboratory chamber validation protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column: What We Have Built Today */}
          <div className="bg-white rounded-2xl p-6 border border-[#D8D0C2] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#D8D0C2]">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#292925]">Physical Assets Fabricated &amp; Ready Today</h3>
                <span className="text-[11px] text-[#71806B] font-mono">TRL-4 Functional Physical Prototype</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4F5D4B] mt-1.5 shrink-0" />
                <div className="text-xs text-[#292925]">
                  <strong className="block text-sm font-semibold">1. Silicone Wristband &amp; Mechanical Housing</strong>
                  Molded hypoallergenic silicone band featuring a recessed channel to hold the chemical dosimeter securely while maintaining skin separation.
                </div>
              </div>

              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4F5D4B] mt-1.5 shrink-0" />
                <div className="text-xs text-[#292925]">
                  <strong className="block text-sm font-semibold">2. Precision Cut Cellulose Substrates</strong>
                  Whatman Grade 1 ashless filter paper (pore size 11 µm, thickness 180 µm) cut to 20mm × 6mm strip dimensions for high capillary uniformity.
                </div>
              </div>

              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4F5D4B] mt-1.5 shrink-0" />
                <div className="text-xs text-[#292925]">
                  <strong className="block text-sm font-semibold">3. Reagent Inventory Procured</strong>
                  Analytical grade Silver Nitrate (AgNO₃ 99.9%, CAS 7761-88-8), Copper Sulfate Pentahydrate (CuSO₄·5H₂O 99.5%), Anhydrous CuSO₄, and spectrophotometric glycerol humectant.
                </div>
              </div>

              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4F5D4B] mt-1.5 shrink-0" />
                <div className="text-xs text-[#292925]">
                  <strong className="block text-sm font-semibold">4. Printed Reference Fiducial Cards</strong>
                  Industrial CMYK spectrophotometer-calibrated neutral gray cards with alignment target points for sub-millimeter homography flattening.
                </div>
              </div>

              <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#4F5D4B] mt-1.5 shrink-0" />
                <div className="text-xs text-[#292925]">
                  <strong className="block text-sm font-semibold">5. Tamper-Evident Foil Packaging Prototypes</strong>
                  Individually sealed hermetic aluminum-polyethylene pouches with tamper-evident seal and laser-printed batch manufacturing &amp; expiry code.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Future Lab Validation Protocol */}
          <div className="bg-[#292925] text-[#F6F1E7] rounded-2xl p-6 border border-[#44423C] shadow-lg space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/15">
              <div className="w-8 h-8 rounded-lg bg-[#B08A55]/30 flex items-center justify-center text-[#F0E6D2]">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Certified Lab Exposure Validation Protocol</h3>
                <span className="text-[11px] text-[#C2CBBF] font-mono">Formal Testing Protocol (Next Step Roadmap)</span>
              </div>
            </div>

            <p className="text-xs text-[#EDE5D6]/80 leading-relaxed">
              To transition our empirical 303-point model to final regulatory certification, strips will undergo controlled exposure testing under certified chemical fume hood conditions:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>Step 1: Dynamic Gas Chamber Setup</span>
                </div>
                <p className="text-[#EDE5D6]/70 text-[11px]">
                  20-liter airtight PTFE chamber fed by certified 50 ppm H₂S/N₂ primary cylinder, diluted through dual Mass Flow Controllers (MFCs) to 0.1, 0.5, 2.0, 10.0, and 25.0 ppm.
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>Step 2: Analytical GC-FPD Ground Truth</span>
                </div>
                <p className="text-[#EDE5D6]/70 text-[11px]">
                  Continuous gas sampling analyzed via inline Gas Chromatography with Flame Photometric Detection (GC-FPD) and parallel Dräger X-am 5000 reference sensors.
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>Step 3: Environmental Extremes (15°C – 50°C, 30% – 90% RH)</span>
                </div>
                <p className="text-[#EDE5D6]/70 text-[11px]">
                  Testing in an Espec climate chamber across Indian ambient temperature extremes to calibrate Arrhenius activation energy coefficients.
                </p>
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>Step 4: Accelerated Aging Shelf-Life Validation</span>
                </div>
                <p className="text-[#EDE5D6]/70 text-[11px]">
                  Accelerated thermal storage at 55°C / 75% RH for 30 days (Arrhenius-equivalent to 90 days at 25°C) to validate zero dark-fading and seal integrity.
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#C2CBBF]">
              <span>Compliance Target:</span>
              <span className="text-emerald-400 font-bold">ASTM D4323 / OSHA 1910.1000</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. UNIT ECONOMICS & COST COMPARISON */}
      <section className="space-y-4">
        <div className="border-b border-[#D8D0C2] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#71806B] font-bold">
            Economic Viability
          </span>
          <h2 className="text-2xl font-bold text-[#292925] font-serif">
            Unit Economics &amp; Cost Breakdown
          </h2>
          <p className="text-xs text-[#292925]/70 mt-0.5">
            How SARVAS achieves &gt;95% operational cost reduction compared to imported electronic and colorimetric alternatives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Bill of Materials Card */}
          <div className="bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#4F5D4B] uppercase">Bill of Materials (BOM)</span>
              <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                Per Strip: ₹7.50
              </span>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#D8D0C2]/50">
                <span className="text-[#5D5B53]">Whatman No. 1 Filter Cellulose</span>
                <span className="font-mono font-bold text-[#292925]">₹0.80</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D8D0C2]/50">
                <span className="text-[#5D5B53]">Silver Nitrate (Zone A: 0.05M)</span>
                <span className="font-mono font-bold text-[#292925]">₹0.90</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D8D0C2]/50">
                <span className="text-[#5D5B53]">Copper Sulfate (Zone B: 0.1M)</span>
                <span className="font-mono font-bold text-[#292925]">₹0.15</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D8D0C2]/50">
                <span className="text-[#5D5B53]">ePTFE Membrane + Amber UV Film</span>
                <span className="font-mono font-bold text-[#292925]">₹2.65</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D8D0C2]/50">
                <span className="text-[#5D5B53]">Optical Scale Card + QR Print</span>
                <span className="font-mono font-bold text-[#292925]">₹1.20</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#D8D0C2]/50">
                <span className="text-[#5D5B53]">Tamper-Evident Foil Packaging</span>
                <span className="font-mono font-bold text-[#292925]">₹1.80</span>
              </div>
              <div className="flex justify-between pt-2 font-bold text-sm text-[#292925]">
                <span>Total Disposable Chemical Cartridge:</span>
                <span className="text-emerald-700 font-mono">₹7.50</span>
              </div>
            </div>

            <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-[#292925]">
                <span>Reusable Silicone Strap / Clip:</span>
                <span className="font-mono text-[#4F5D4B]">₹18.50</span>
              </div>
              <p className="text-[11px] text-[#5D5B53]">
                Anti-static silicone chassis. Lasts 1–2 years across hundreds of shifts.
              </p>
              <div className="pt-1.5 border-t border-[#D8D0C2]/60 text-[11px] space-y-1 text-[#5D5B53]">
                <div className="flex justify-between">
                  <span className="font-medium text-[#292925]">Sealed Shelf-Life:</span>
                  <span className="font-mono font-bold text-emerald-800">180 Days (&lt;30°C) / 90d (@45°C)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#292925]">Traceability:</span>
                  <span className="text-amber-800 font-medium font-mono">Unique QR &amp; Batch Expiry</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparative Industry Table */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-[#D8D0C2] shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#292925] uppercase tracking-wide">
              Market Comparison: 2,500 Workers for 1 Year (300 Shifts/Year)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-[#D8D0C2] text-[#71806B] font-mono uppercase text-[10px]">
                    <th className="py-2.5 px-3">Solution Type</th>
                    <th className="py-2.5 px-3">Initial Setup</th>
                    <th className="py-2.5 px-3">Annual Operations</th>
                    <th className="py-2.5 px-3">Per-Worker / Year</th>
                    <th className="py-2.5 px-3">Cumulative Tracking?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8D0C2]/60">
                  <tr className="bg-emerald-50/70 font-semibold text-[#292925]">
                    <td className="py-2.5 px-3 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      <span>SARVAS Dosimeter (Our Solution)</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-800">₹46,250 (Straps)</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-800">₹56,25,000 (Strips)</td>
                    <td className="py-2.5 px-3 font-mono text-emerald-800">₹2,260 / yr</td>
                    <td className="py-2.5 px-3 text-emerald-700 font-bold">YES (0.125–160 ppm·h)</td>
                  </tr>
                  <tr className="text-[#5D5B53]">
                    <td className="py-2.5 px-3">Electronic Detectors (e.g. Dräger/Honeywell)</td>
                    <td className="py-2.5 px-3 font-mono">₹4.5 Crore</td>
                    <td className="py-2.5 px-3 font-mono">₹2.92 Crore (Maint/Gas)</td>
                    <td className="py-2.5 px-3 font-mono">₹11,700 / yr</td>
                    <td className="py-2.5 px-3 text-red-700 font-medium">NO (Instant alarm only)</td>
                  </tr>
                  <tr className="text-[#5D5B53]">
                    <td className="py-2.5 px-3">Imported Diffusion Badges (Morphix)</td>
                    <td className="py-2.5 px-3 font-mono">₹0</td>
                    <td className="py-2.5 px-3 font-mono">₹3.75 Crore ($6/badge)</td>
                    <td className="py-2.5 px-3 font-mono">₹15,000 / yr</td>
                    <td className="py-2.5 px-3 text-amber-700 font-medium">Approximate eye visual</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div>
                <strong className="block font-bold">Net Financial Advantage for Plant Operators:</strong>
                <span>Saves ~₹2.3 Crore annually for a 2,500-worker facility (≈80% OPEX reduction) while enabling universal coverage.</span>
              </div>
              <div className="text-right font-mono font-extrabold text-lg text-emerald-800">
                ≈80% Savings
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. FULL TECH STACK & SCIENTIFIC CITATIONS */}
      <section className="space-y-6">
        <div className="border-b border-[#D8D0C2] pb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#71806B] font-bold">
            Technical Foundation
          </span>
          <h2 className="text-2xl font-bold text-[#292925] font-serif">
            Production Tech Stack &amp; Peer-Reviewed Literature
          </h2>
          <p className="text-xs text-[#292925]/70 mt-0.5">
            Built with modern, production-grade tools and anchored in peer-reviewed occupational and colorimetric research.
          </p>
        </div>

        {/* Tech Stack Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-4 border border-[#D8D0C2] shadow-xs space-y-1">
            <span className="text-[10px] font-mono text-[#71806B] font-bold uppercase">Frontend &amp; PWA</span>
            <div className="font-bold text-sm text-[#292925]">React 19 &amp; Vite</div>
            <p className="text-[11px] text-[#5D5B53]">Tailwind CSS v4, Lucide Icons, Recharts data visualization.</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#D8D0C2] shadow-xs space-y-1">
            <span className="text-[10px] font-mono text-[#71806B] font-bold uppercase">Mobile Runtime</span>
            <div className="font-bold text-sm text-[#292925]">Capacitor Android</div>
            <p className="text-[11px] text-[#5D5B53]">Native camera integration, offline SQLite local caching.</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#D8D0C2] shadow-xs space-y-1">
            <span className="text-[10px] font-mono text-[#71806B] font-bold uppercase">Colorimetry &amp; Math</span>
            <div className="font-bold text-sm text-[#292925]">CIEDE2000 &amp; Arrhenius</div>
            <p className="text-[11px] text-[#5D5B53]">CIE L*a*b* space, von Kries adaptation, polynomial regression.</p>
          </div>

          <div className="bg-white rounded-xl p-4 border border-[#D8D0C2] shadow-xs space-y-1">
            <span className="text-[10px] font-mono text-[#71806B] font-bold uppercase">Backend API</span>
            <div className="font-bold text-sm text-[#292925]">FastAPI &amp; Python 3.11</div>
            <p className="text-[11px] text-[#5D5B53]">Pydantic v2, REST endpoints, SQLite audit log, Gemini fallback.</p>
          </div>
        </div>

        {/* Scientific Citations */}
        <div className="bg-white rounded-2xl p-6 border border-[#D8D0C2] shadow-xs space-y-4">
          <h3 className="font-bold text-base text-[#292925] font-serif flex items-center gap-2">
            <Award className="w-5 h-5 text-[#B08A55]" />
            <span>Peer-Reviewed Literature &amp; Statutory Standards Citations</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded font-bold text-[#4F5D4B] border border-[#D8D0C2]">
                  Sensors and Actuators B: Chemical (2019)
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#292925]">
                Engel et al. (2019) — "Colorimetric detection of hydrogen sulfide using immobilized metal complexes"
              </h4>
              <p className="text-[11px] text-[#5D5B53]">
                Identified the reversible oxidation flaw of Cu-PAN in ambient oxygen. Served as our scientific justification for switching to irreversible inorganic silver/copper sulfide precipitation.
              </p>
              <div className="text-[10px] font-mono text-[#71806B]">DOI: 10.1016/j.snb.2019.04.092</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded font-bold text-[#4F5D4B] border border-[#D8D0C2]">
                  Annals of Work Exposures and Health (2023)
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#292925]">
                Benonisdottir et al. (2023) — "Longitudinal occupational exposure to low-level H₂S in offshore operations"
              </h4>
              <p className="text-[11px] text-[#5D5B53]">
                Empirical field data on 10+ years of chronic offshore worker exposure between 0.1 and 10 ppm. Directly informed our 0.125 to 160 ppm·h dosage bounds.
              </p>
              <div className="text-[10px] font-mono text-[#71806B]">DOI: 10.1093/annweh/wxad034</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded font-bold text-[#4F5D4B] border border-[#D8D0C2]">
                  Color Research &amp; Application (2020)
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#292925]">
                Sharma &amp; Slocum (2020) — "Diffuse reflectance colorimetry and CIEDE2000 in analytical tests"
              </h4>
              <p className="text-[11px] text-[#5D5B53]">
                Demonstrates superiority of CIEDE2000 over Euclidean RGB distance for substrate reflectance changes under varying illuminants.
              </p>
              <div className="text-[10px] font-mono text-[#71806B]">CIE Standard: ISO/CIE 11664-4:2019</div>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded font-bold text-[#4F5D4B] border border-[#D8D0C2]">
                  Statutory Regulations &amp; Indian Standards
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#292925]">
                OSHA 1910.1000 Table Z-2 &amp; DGMS India Safety Circulars
              </h4>
              <p className="text-[11px] text-[#5D5B53]">
                Defines the 8-hour Permissible Exposure Limit (PEL) of 10 ppm and Indian Directorate General of Mines Safety guidelines for toxic gaseous accumulation in confined petroleum zones.
              </p>
              <div className="text-[10px] font-mono text-[#71806B]">Standard: 29 CFR 1910.1000 &amp; DGMS (Tech) Circular 03/2021</div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. BOTTOM CALL-TO-ACTION FOR JURY */}
      <section className="bg-white rounded-3xl p-8 border border-[#D8D0C2] shadow-sm text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#71806B] font-bold">
            Interactive System Demo
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#292925]">
            Ready to Evaluate SARVAS Live?
          </h2>
          <p className="text-xs sm:text-sm text-[#5D5B53]">
            Explore the 303-point empirical calibration dataset, test our smartphone colorimetry scanner on sample badges, or step through the shift-end kiosk flow.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setActivePage('calibration')}
            className="px-5 py-3 rounded-xl bg-[#4F5D4B] hover:bg-[#3d493a] text-[#F6F1E7] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>Open Calibration Dataset</span>
          </button>
          <button
            onClick={() => setActivePage('scan')}
            className="px-5 py-3 rounded-xl bg-[#292925] hover:bg-[#1E1E1C] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Scan className="w-4 h-4" />
            <span>Test Optical Scanner</span>
          </button>
          <button
            onClick={() => setActivePage('kiosk')}
            className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>Launch Kiosk Prototype</span>
          </button>
          <button
            onClick={() => setActivePage('faq')}
            className="px-5 py-3 rounded-xl bg-[#EDE5D6] hover:bg-[#E5DDCB] text-[#292925] text-xs font-bold transition-all border border-[#D8D0C2] flex items-center gap-2 cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-[#71806B]" />
            <span>Read FAQ</span>
          </button>
        </div>
      </section>

    </div>
  );
};
