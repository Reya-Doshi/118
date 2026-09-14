import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import bandVideo from '../assets/band.mp4';
import bandDesignImg from '../assets/band design.png';
import {
  ArrowRight,
  Shield,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Scan,
  Database,
  Activity
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActivePage } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [hudViewMode, setHudViewMode] = useState<'raw' | 'heatmap'>('raw');
  const [activeAnatomyIndex, setActiveAnatomyIndex] = useState<number | null>(0);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(2); // Default on SCAN
  const [reactionDosePreview, setReactionDosePreview] = useState(14.2); // ppm*h for slider
  const [activeZoneFilter, setActiveZoneFilter] = useState<'ALL' | 'ZONE0' | 'ZONE1' | 'ZONE2'>('ALL');

  // Cycle the workflow step smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStep(prev => (prev + 1) % 5);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  // Card mouse-follow radial glow handler
  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = `${e.clientX - rect.left}px`;
    const y = `${e.clientY - rect.top}px`;
    e.currentTarget.style.setProperty('--mouse-x', x);
    e.currentTarget.style.setProperty('--mouse-y', y);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 4 Anatomy Points with coordinates for laser lines
  const anatomyPoints = [
    {
      id: '01',
      tag: 'INDEX 01 // LEAD ACETATE MATRIX // PASSIVE DIFFUSIVE',
      title: 'Colorimetric Strip',
      desc: 'Passively responds to cumulative H₂S exposure. Chemosensitive matrix darkens proportionally over time via lead sulfide (PbS) precipitation.',
      metrics: ['Response Time: T90 < 60s', 'Sensitivity: 0.1 ppm·h', 'Reaction: Pb(CH₃COO)₂ + H₂S → PbS↓'],
      targetX: 52, // % on image
      targetY: 48
    },
    {
      id: '02',
      tag: 'INDEX 02 // MULTI-STEP COLORIMETRIC // ARRHENIUS CALIBRATION',
      title: 'Reference Scale',
      desc: 'Provides an onboard optical calibration scale beside the sensor strip, neutralizing ambient color temperature, phone illuminants, and exposure shifts.',
      metrics: ['Accuracy: ΔE < 0.8 CIE', 'Multi-Illuminant: D65/F11/A', '5-Step Graded Matrix'],
      targetX: 68,
      targetY: 48
    },
    {
      id: '03',
      tag: 'INDEX 03 // HERMETIC MEMBRANE // SHELF-LIFE INTEGRITY',
      title: 'Expiry Indicator',
      desc: 'Confirms whether the sensing chemistry remains unoxidized and within valid calibrated life, automatically rejecting degraded badges at scan-time.',
      metrics: ['Shelf Life: 180 Days Hermetic', 'Integrity: Tamper-Evident', 'Auto-Reject on Depletion'],
      targetX: 84,
      targetY: 48
    },
    {
      id: '04',
      tag: 'INDEX 04 // INDUSTRIAL RFID & QR // WORKER BINDING',
      title: 'Band ID & Telemetry Tag',
      desc: 'Links physical badge serial number to worker dossier, shift roster, and plant zone telemetry, integrating directly into HSE safety audit databases.',
      metrics: ['Intrinsic Safety: ATEX Zone 0', 'Serialization: AES-128 QR', 'Shift Memory: 8 Hours'],
      targetX: 24,
      targetY: 48
    }
  ];

  // 5 Horizontal Workflow Steps
  const workflowSteps = [
    {
      num: '01',
      label: 'WEAR',
      subtitle: 'Zero-Power Clip',
      desc: 'Worker clips zero-power passive badge at start of refinery shift.'
    },
    {
      num: '02',
      label: 'EXPOSE',
      subtitle: 'Chemical Memory',
      desc: 'Lead acetate matrix darkens progressively with ambient sub-alarm H₂S.'
    },
    {
      num: '03',
      label: 'SCAN',
      subtitle: 'Mobile Vision',
      desc: 'Smartphone camera captures strip beside printed 5-step reference scale.'
    },
    {
      num: '04',
      label: 'QUANTIFY',
      subtitle: 'Arrhenius Correction',
      desc: 'Algorithm extracts CIE L*a*b*, computes ΔEab*, and applies T & RH compensation.'
    },
    {
      num: '05',
      label: 'RECORD',
      subtitle: 'Audit Compliance',
      desc: 'Calibrated dose (ppm·h) logs into worker profile & MRPL statutory safety registers.'
    }
  ];

  // Calculate dynamic color for the chemical reaction preview slider
  // 0 ppm·h -> Ivory #E8E5DD, 10 ppm·h -> Amber-Bronze #A47834, 25 ppm·h -> Dark PbS Bronze #231B15
  const getReactionColor = (dose: number) => {
    const fraction = Math.min(Math.max(dose / 25, 0), 1);
    const r = Math.round(232 - fraction * (232 - 35));
    const g = Math.round(229 - fraction * (229 - 27));
    const b = Math.round(221 - fraction * (221 - 21));
    return `rgb(${r}, ${g}, ${b})`;
  };

  const currentStripColor = getReactionColor(reactionDosePreview);
  const currentDeltaE = (reactionDosePreview * 1.34).toFixed(1);
  const currentLabL = (85 - reactionDosePreview * 1.8).toFixed(1);

  // Simulated scatter plot points for Plant Safety Zones
  const scatterPoints = [
    { id: 1, zone: 'ZONE0', name: 'Tank Farm 4B', worker: 'R. Kumble', shiftHour: 2.2, dose: 4.8, status: 'NORMAL' },
    { id: 2, zone: 'ZONE0', name: 'Tank Farm 4B', worker: 'P. Nair', shiftHour: 5.8, dose: 18.2, status: 'FLAG' },
    { id: 3, zone: 'ZONE1', name: 'Claus SRU Train 2', worker: 'S. Rao', shiftHour: 4.5, dose: 14.2, status: 'WARNING' },
    { id: 4, zone: 'ZONE1', name: 'Claus SRU Train 1', worker: 'M. Qureshi', shiftHour: 7.0, dose: 19.4, status: 'FLAG' },
    { id: 5, zone: 'ZONE1', name: 'Amine Treating Unit', worker: 'K. Sharma', shiftHour: 3.5, dose: 6.2, status: 'NORMAL' },
    { id: 6, zone: 'ZONE2', name: 'Utilities Boiler 1', worker: 'A. Joseph', shiftHour: 6.5, dose: 3.1, status: 'NORMAL' },
    { id: 7, zone: 'ZONE2', name: 'Cooling Tower C', worker: 'D. Sen', shiftHour: 7.8, dose: 2.4, status: 'NORMAL' },
    { id: 8, zone: 'ZONE0', name: 'Crude Distillation 02', worker: 'G. Verma', shiftHour: 7.2, dose: 17.8, status: 'FLAG' },
    { id: 9, zone: 'ZONE1', name: 'Sulfur Storage Pit', worker: 'T. Ghosh', shiftHour: 5.1, dose: 11.5, status: 'WARNING' },
  ];

  const filteredScatterPoints = activeZoneFilter === 'ALL'
    ? scatterPoints
    : scatterPoints.filter(p => p.zone === activeZoneFilter);

  return (
    <div className="space-y-24 md:space-y-32 pb-24 text-[var(--text-primary)]">
      
      {/* =========================================================================
          01 — HERO SECTION: LIVE CALIBRATION TELEMETRY CONSOLE
         ========================================================================= */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center pt-28 sm:pt-36 pb-16 lg:pb-24 overflow-hidden border-b border-[var(--card-border)]"
      >
        {/* 1. RESTORE FULL-BLEED HERO BACKGROUND VIDEO */}
        {!videoError && (
          <video
            ref={videoRef}
            src={bandVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none opacity-40 mix-blend-screen scale-105 filter brightness-90 contrast-110"
          />
        )}

        {/* 2. DARK GRADIENT SCRIM OVER VIDEO FOR RAZOR-SHARP TEXT READABILITY */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: 'linear-gradient(180deg, rgba(8, 10, 14, 0.78) 0%, rgba(8, 10, 14, 0.92) 80%, #080A0E 100%)'
          }}
        />

        {/* Ambient Radial Accent Lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08),transparent_70%)] pointer-events-none z-[2]" />

        {/* 3. HERO CONTENT CONTAINER (Z-10 FOR RAZOR-SHARP INTERACTION) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* LEFT TYPOGRAPHY & CTAs */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-left">
              
              {/* Eyebrow Chip with Animated Ping Indicator */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full command-card border border-[var(--card-border)] shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-80" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F59E0B]" />
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono tracking-wider font-bold text-[var(--text-primary)]">
                  SARVAS // ZERO-POWER CUMULATIVE H₂S DOSIMETRY
                </span>
              </div>

              {/* Headline with High-Contrast Gradient */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-heading tracking-tight leading-[1.08]">
                  <span className="block text-white">
                    Know the exposure.
                  </span>
                  <span className="block bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#38BDF8] bg-clip-text text-transparent drop-shadow-xs">
                    Not just the alarm.
                  </span>
                </h1>
                <p className="text-xs sm:text-sm font-mono tracking-wide text-[var(--accent-primary)] font-semibold">
                  Because not all danger announces itself.
                </p>
              </div>

              {/* Subhead */}
              <p className="text-sm sm:text-base text-[var(--text-secondary)] font-normal leading-relaxed max-w-xl">
                Transforming sub-alarm ambient H₂S into actionable, Arrhenius-corrected optical dose records across 8-hour refinery shifts with zero battery drain.
              </p>

              {/* 3 Stat Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg pt-1">
                <div className="command-card rounded-xl p-3 border border-[var(--card-border)] text-center">
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Accuracy</div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-[#38BDF8] mt-0.5">
                    99.2% CIE
                  </div>
                  <div className="text-[9.5px] text-[var(--text-secondary)] truncate">Optical Quantification</div>
                </div>

                <div className="command-card rounded-xl p-3 border border-[var(--card-border)] text-center">
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Safety</div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-[#F59E0B] mt-0.5">
                    Zone 0 ATEX
                  </div>
                  <div className="text-[9.5px] text-[var(--text-secondary)] truncate">Zero Spark Power</div>
                </div>

                <div className="command-card rounded-xl p-3 border border-[var(--card-border)] text-center">
                  <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase">Duration</div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-white mt-0.5">
                    8-Hour Shift
                  </div>
                  <div className="text-[9.5px] text-[var(--text-secondary)] truncate">Chemical Memory</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => setActivePage('scan')}
                  className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-mono font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_22px_rgba(245,158,11,0.45)] hover:shadow-[0_0_32px_rgba(245,158,11,0.7)] hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Scan className="w-4 h-4 stroke-[2.5]" />
                  <span>Read a Wristband</span>
                </button>

                <button
                  onClick={() => scrollToSection('the-band')}
                  className="px-6 py-3.5 rounded-full command-card border border-[var(--card-border)] text-[var(--text-primary)] font-mono text-xs sm:text-sm font-medium hover:border-[#38BDF8] hover:bg-white/[0.04] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Hardware Specs</span>
                  <ChevronDown className="w-4 h-4 text-[#38BDF8]" />
                </button>
              </div>

            </div>

            {/* RIGHT INTERACTIVE HUD VIEWPORT (50%) WITH WRISTBAND RENDER */}
            <div className="lg:col-span-6 relative">
              <div
                onMouseMove={handleCardMouseMove}
                className="command-card mouse-glow-card rounded-2xl p-4 sm:p-5 border border-white/[0.1] shadow-2xl overflow-hidden backdrop-blur-xl bg-[rgba(18,22,28,0.65)]"
              >
                
                {/* View Switcher Pills Above Viewport */}
                <div className="flex items-center justify-between pb-3 border-b border-[var(--card-border)] mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping-slow" />
                    <span className="text-[11px] font-mono font-bold text-[var(--text-primary)] uppercase tracking-wider">
                      SARVAS HUD // DS-1088 OPTICAL
                    </span>
                  </div>

                  <div className="flex items-center gap-1 p-1 rounded-full bg-black/40 border border-white/[0.08]">
                    <button
                      onClick={() => setHudViewMode('raw')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                        hudViewMode === 'raw'
                          ? 'bg-[#F59E0B] text-black font-bold shadow-xs'
                          : 'text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      [Dosimeter Band]
                    </button>
                    <button
                      onClick={() => setHudViewMode('heatmap')}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold transition-all cursor-pointer ${
                        hudViewMode === 'heatmap'
                          ? 'bg-[#38BDF8] text-black font-bold shadow-xs'
                          : 'text-[#9CA3AF] hover:text-white'
                      }`}
                    >
                      [Optical ΔE Heatmap]
                    </button>
                  </div>
                </div>

                {/* Viewport Frame with Glowing Corner Reticles */}
                <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full rounded-xl overflow-hidden border border-white/[0.08] bg-[#05070A] flex items-center justify-center">
                  
                  {/* Glowing Reticle Corner Crosshairs (+) */}
                  <span className="absolute top-3 left-3 text-[#38BDF8] font-mono font-bold text-sm select-none drop-shadow-[0_0_6px_#38BDF8] z-20">+</span>
                  <span className="absolute top-3 right-3 text-[#38BDF8] font-mono font-bold text-sm select-none drop-shadow-[0_0_6px_#38BDF8] z-20">+</span>
                  <span className="absolute bottom-3 left-3 text-[#38BDF8] font-mono font-bold text-sm select-none drop-shadow-[0_0_6px_#38BDF8] z-20">+</span>
                  <span className="absolute bottom-3 right-3 text-[#38BDF8] font-mono font-bold text-sm select-none drop-shadow-[0_0_6px_#38BDF8] z-20">+</span>

                  {/* Scanline Animation Overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(56,189,248,0.03)_50%,transparent_50%)] bg-[length:100%_4px] pointer-events-none z-10" />

                  {/* Heatmap Shader Filter Effect */}
                  {hudViewMode === 'heatmap' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#EF4444]/25 via-[#F59E0B]/20 to-[#38BDF8]/25 mix-blend-color-dodge pointer-events-none z-10 animate-pulse" />
                  )}

                  {/* Wristband Render Image */}
                  <img
                    src={bandDesignImg}
                    alt="SARVAS Zero-Power Wristband"
                    className={`w-full h-full object-contain p-4 drop-shadow-2xl transition-transform duration-700 ${
                      hudViewMode === 'heatmap' ? 'contrast-125 saturate-150' : 'hover:scale-105'
                    }`}
                  />

                  {/* Reticle Target in Center of the Sensing Matrix */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="relative w-28 h-28 border border-[#38BDF8]/40 rounded-full flex items-center justify-center animate-spin-slow">
                      <div className="w-16 h-16 border border-[#F59E0B]/50 rounded-full" />
                      <div className="absolute w-full h-[1px] bg-[#38BDF8]/30" />
                      <div className="absolute h-full w-[1px] bg-[#38BDF8]/30" />
                    </div>
                  </div>

                  {/* Floating Telemetry Cards Superimposed on Band */}
                  <div className="absolute top-4 left-4 z-20 max-w-[210px] command-card rounded-lg p-2.5 border border-[#38BDF8]/40 shadow-lg text-left backdrop-blur-md bg-[#0A0E14]/80">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
                      <span className="text-[9px] font-mono text-[#9CA3AF] uppercase">Optical Matrix</span>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-white mt-0.5">
                      CIE L*a*b*: [42.1, 14.8, 9.2]
                    </div>
                    <div className="text-[9px] font-mono text-[#38BDF8] font-semibold">
                      ΔEab: 18.4 (PbS Absorbed)
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 z-20 max-w-[220px] command-card rounded-lg p-2.5 border border-[#F59E0B]/40 shadow-lg text-left backdrop-blur-md bg-[#0A0E14]/80">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                      <span className="text-[9px] font-mono text-[#9CA3AF] uppercase">Shift Exposure</span>
                    </div>
                    <div className="text-[10px] font-mono font-bold text-[#F59E0B] mt-0.5">
                      Shift Accumulation: 14.2 ppm·h
                    </div>
                    <div className="text-[9px] font-mono text-[#9CA3AF]">
                      Advisory Warning: 71% Ceiling
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 z-20 max-w-[200px] command-card rounded-lg p-2.5 border border-white/[0.08] shadow-lg text-right backdrop-blur-md hidden sm:block bg-[#0A0E14]/80">
                    <div className="text-[9px] font-mono text-[#9CA3AF] uppercase">Arrhenius Scaling</div>
                    <div className="text-[10px] font-mono font-bold text-white mt-0.5">
                      T: 34°C | RH: 68%
                    </div>
                    <div className="text-[9px] font-mono text-[#38BDF8]">
                      Correction Factor: ×1.14
                    </div>
                  </div>

                </div>

                {/* Bottom Viewport Status Strip */}
                <div className="mt-3 pt-2.5 border-t border-[var(--card-border)] flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#38BDF8]">MODE: CALIBRATED_ONLINE</span>
                    <span>•</span>
                    <span>RESOLUTION: 1080p</span>
                  </div>
                  <div className="text-[#F59E0B]">
                    SARVAS-ID: 0x9B2C4F
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* =========================================================================
          02 — THE OCCUPATIONAL HEALTH BLIND SPOT (Existing Matter Preserved)
         ========================================================================= */}
      <section id="the-problem" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
            THE OCCUPATIONAL HEALTH BLIND SPOT
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-[var(--text-primary)]">
            Peak alarms tell you when something happened. <br />
            <span className="text-[var(--text-secondary)] font-normal">Cumulative exposure tells you what happened over time.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            In refineries and petrochemical operations, electronic detectors monitor instantaneous peaks. Yet personnel regularly encounter sub-alarm ambient concentrations (1–10 ppm) that accumulate silently across 8-hour shifts without triggering audible alarms.
          </p>
        </div>

        {/* Quiet-Luxury Command Center Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onMouseMove={handleCardMouseMove}
            className="p-6 rounded-2xl command-card mouse-glow-card border border-[var(--card-border)] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#FF9500] uppercase">
                ELECTRONIC GAS DETECTOR
              </span>
              <AlertTriangle className="w-4 h-4 text-[#FF9500]" />
            </div>
            <h3 className="text-base font-bold font-heading text-[var(--text-primary)]">Instantaneous Spike Alarms</h3>
            <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--text-muted)] mt-0.5">—</span>
                <span>Requires batteries, active electronics, and hazardous-area certifications.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--text-muted)] mt-0.5">—</span>
                <span>Only alerts when instantaneous ceiling limits are momentarily breached.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--text-muted)] mt-0.5">—</span>
                <span>Does not track chronic cumulative dose burden across entire plant shifts.</span>
              </li>
            </ul>
          </div>

          <div
            onMouseMove={handleCardMouseMove}
            className="p-6 rounded-2xl command-card mouse-glow-card border border-[var(--accent-primary)]/40 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[var(--accent-primary)] uppercase">
                SARVAS PASSIVE DOSIMETER
              </span>
              <Shield className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>
            <h3 className="text-base font-bold font-heading text-[var(--text-primary)]">Continuous Cumulative Dosimetry</h3>
            <ul className="space-y-2 text-xs text-[var(--text-primary)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span><strong>Zero-power chemical response</strong>: Intrinsic zero-spark safety in Zone 0/1 environments.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span><strong>Permanent physical reaction</strong>: Chemochromic strip darkens proportionally to cumulative H₂S.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span><strong>AI-assisted quantitative readout</strong>: Standard smartphone photo calibrated against printed scale.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>


      {/* =========================================================================
          03 — INTERACTIVE HARDWARE ANATOMY (EXPLODING DOSSIER LAYOUT)
         ========================================================================= */}
      <section id="the-band" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
            ANATOMY & HARDWARE SPECIFICATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-[var(--text-primary)]">
            The Band, Explained.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Every element is designed around one purpose: making cumulative exposure visible without adding another powered device to the worker. Hover cards below to project active targeting reticles.
          </p>
        </div>

        {/* Central Band Viewport with Interactive Laser Coordinate Target */}
        <div className="command-card rounded-2xl p-6 md:p-8 border border-[var(--card-border)] space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[var(--card-border)] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[var(--accent-primary)] uppercase font-semibold">
                PHYSICAL DOSIMETER ARCHITECTURE // EXPLODING DOSSIER
              </span>
              <div className="text-sm font-bold font-heading text-[var(--text-primary)]">SARVAS Hardware Anatomy</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full command-card border border-[var(--card-border)] text-[var(--text-secondary)] text-[10px] font-mono">
                Model: MRPL-DS1088
              </span>
              <span className="px-2.5 py-1 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-[10px] font-mono font-bold">
                ZONE 0 VERIFIED
              </span>
            </div>
          </div>

          {/* Render Frame with Interactive SVG Laser Targeting Lines */}
          <div className="relative flex items-center justify-center p-4 sm:p-8 bg-[#040608] rounded-xl border border-[var(--card-border)] overflow-hidden min-h-[320px] sm:min-h-[420px]">
            
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05),transparent_60%)] pointer-events-none" />

            <img
              src={bandDesignImg}
              alt="SARVAS Physical Band Anatomy"
              className="max-h-[360px] w-auto object-contain rounded drop-shadow-2xl z-10"
            />

            {/* Interactive SVG Reticle Targeting Overlay */}
            {activeAnatomyIndex !== null && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                {/* Center target circle */}
                <circle
                  cx={`${anatomyPoints[activeAnatomyIndex].targetX}%`}
                  cy={`${anatomyPoints[activeAnatomyIndex].targetY}%`}
                  r="24"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  className="animate-spin-slow"
                />
                <circle
                  cx={`${anatomyPoints[activeAnatomyIndex].targetX}%`}
                  cy={`${anatomyPoints[activeAnatomyIndex].targetY}%`}
                  r="6"
                  fill="#F59E0B"
                />
                {/* Horizontal & Vertical Crosshairs */}
                <line
                  x1={`${anatomyPoints[activeAnatomyIndex].targetX - 5}%`}
                  y1={`${anatomyPoints[activeAnatomyIndex].targetY}%`}
                  x2={`${anatomyPoints[activeAnatomyIndex].targetX + 5}%`}
                  y2={`${anatomyPoints[activeAnatomyIndex].targetY}%`}
                  stroke="#38BDF8"
                  strokeWidth="1"
                />
                <line
                  x1={`${anatomyPoints[activeAnatomyIndex].targetX}%`}
                  y1={`${anatomyPoints[activeAnatomyIndex].targetY - 8}%`}
                  x2={`${anatomyPoints[activeAnatomyIndex].targetX}%`}
                  y2={`${anatomyPoints[activeAnatomyIndex].targetY + 8}%`}
                  stroke="#38BDF8"
                  strokeWidth="1"
                />
              </svg>
            )}

            {/* Active Targeted Coordinate Label */}
            {activeAnatomyIndex !== null && (
              <div className="absolute top-4 right-4 z-20 command-card px-3 py-1.5 rounded-lg border border-[#38BDF8]/40 text-[10px] font-mono text-white bg-[#0A0E14]/80">
                <span className="text-[#38BDF8] font-bold">LOCKED TARGET:</span> {anatomyPoints[activeAnatomyIndex].title} [{anatomyPoints[activeAnatomyIndex].targetX}%, {anatomyPoints[activeAnatomyIndex].targetY}%]
              </div>
            )}
          </div>

          {/* 4 Exploding Dossier Anatomy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {anatomyPoints.map((item, idx) => {
              const isSelected = activeAnatomyIndex === idx;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveAnatomyIndex(idx)}
                  onMouseMove={handleCardMouseMove}
                  className={`p-4 rounded-xl command-card mouse-glow-card border transition-all cursor-pointer text-left space-y-2.5 ${
                    isSelected
                      ? 'border-[#38BDF8] shadow-[0_0_15px_rgba(56,189,248,0.15)] -translate-y-1'
                      : 'border-[var(--card-border)] hover:border-[#F59E0B]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-[#38BDF8] text-black' : 'bg-[var(--card-surface-subtle)] text-[var(--text-secondary)]'
                    }`}>
                      {item.id}
                    </span>
                    <span className="text-[9px] font-mono text-[#F59E0B] font-semibold">
                      ACTIVE SENSOR
                    </span>
                  </div>

                  <div className="text-[9.5px] font-mono font-semibold text-[var(--accent-primary)] uppercase tracking-wider line-clamp-1">
                    {item.tag}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold font-heading text-[var(--text-primary)]">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {item.desc}
                  </p>

                  {/* Micro-metric chips */}
                  <div className="pt-2 border-t border-[var(--card-border)] space-y-1">
                    {item.metrics.map(m => (
                      <div key={m} className="text-[9.5px] font-mono text-[var(--text-secondary)] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[var(--accent-secondary)]" />
                        <span className="truncate">{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* =========================================================================
          04 — SHIFT LIFECYCLE: ANIMATED DATA PIPE & COLOR PREVIEW SLIDER
         ========================================================================= */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[var(--accent-primary)]">
            END-TO-END SHIFT LIFECYCLE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-[var(--text-primary)]">
            From a shift on the wrist <br />
            <span className="text-[var(--text-secondary)] font-normal">to a number you can act on.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            The hardware and software workflow bridges continuous physical chemical change to calibrated digital safety records.
          </p>
        </div>

        {/* Continuous Horizontal Timeline with Animated Connecting SVG Beam */}
        <div className="command-card rounded-2xl p-6 sm:p-8 border border-[var(--card-border)] space-y-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[var(--card-border)] pb-3">
            <span className="text-[10px] font-mono tracking-widest text-[var(--accent-primary)] uppercase font-semibold">
              PIPELINE TIMELINE // 01 WEAR → 05 RECORD
            </span>
            <span className="text-[10px] font-mono text-[var(--accent-secondary)] font-bold">
              PHASE 0{activeWorkflowStep + 1} ACTIVE
            </span>
          </div>

          {/* Horizontal Steps with Connecting Beam */}
          <div className="relative">
            
            {/* Desktop Connecting SVG Beam */}
            <div className="hidden lg:block absolute top-7 left-12 right-12 h-1 z-0">
              <svg className="w-full h-4 overflow-visible">
                <line
                  x1="0"
                  y1="2"
                  x2="100%"
                  y2="2"
                  stroke="currentColor"
                  className="text-[var(--card-border)]"
                  strokeWidth="2"
                />
                <line
                  x1="0"
                  y1="2"
                  x2={`${((activeWorkflowStep + 1) / 5) * 100}%`}
                  y2="2"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  className="animate-beam"
                />
              </svg>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 relative z-10">
              {workflowSteps.map((step, idx) => {
                const isActive = activeWorkflowStep === idx;
                const isPassed = activeWorkflowStep >= idx;
                return (
                  <button
                    key={step.label}
                    onClick={() => setActiveWorkflowStep(idx)}
                    className={`p-4 rounded-xl command-card border text-left transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'border-[#F59E0B] shadow-[0_0_18px_rgba(245,158,11,0.25)] -translate-y-1 bg-[var(--card-surface-subtle)]'
                        : isPassed
                        ? 'border-[#38BDF8]/40'
                        : 'border-[var(--card-border)] opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                        isActive
                          ? 'bg-[var(--accent-primary)] text-black shadow-xs'
                          : isPassed
                          ? 'bg-[var(--accent-secondary)] text-black'
                          : 'bg-[var(--card-surface-subtle)] text-[var(--text-secondary)] border border-[var(--card-border)]'
                      }`}>
                        {step.num}
                      </span>
                      <span className="text-[10px] font-mono text-[var(--accent-secondary)] font-bold">
                        {step.subtitle}
                      </span>
                    </div>

                    <div className="font-heading font-bold text-sm text-[var(--text-primary)]">
                      {step.label}
                    </div>

                    <p className="text-[11px] text-[var(--text-secondary)] mt-1 leading-normal">
                      {step.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Chemical Reaction Preview Mechanism (Ivory to PbS Bronze Slider) */}
          <div className="p-5 rounded-xl bg-[#040608] border border-[var(--card-border)] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--card-border)] pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-[var(--accent-primary)] font-bold uppercase">
                  INTERACTIVE COLORIMETRIC RESPONSE PREVIEW
                </span>
                <div className="text-xs font-mono text-[var(--text-primary)]">
                  Chemical Darkening: Lead Acetate → Lead Sulfide (PbS↓ Bronze)
                </div>
              </div>
              <div className="font-mono text-xs text-[#FF9500] font-bold">
                Reaction: Pb(CH₃COO)₂ + H₂S → PbS↓ + 2CH₃COOH
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Slider Control */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--text-secondary)]">Simulate Cumulative Dose:</span>
                  <span className="font-bold text-[#FF9500] text-sm">{reactionDosePreview.toFixed(1)} ppm·h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="25"
                  step="0.2"
                  value={reactionDosePreview}
                  onChange={e => setReactionDosePreview(parseFloat(e.target.value))}
                  className="w-full accent-[#FF9500] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[var(--text-secondary)]">
                  <span>0 ppm·h (Nominal Ivory)</span>
                  <span>10 ppm·h (Shift Advisory)</span>
                  <span>25 ppm·h (Ceiling Saturation)</span>
                </div>
              </div>

              {/* Dynamic Chemical Strip Swatch */}
              <div className="md:col-span-5 command-card rounded-xl p-3.5 border border-[var(--card-border)] flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-lg border-2 border-white/20 shadow-inner shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: currentStripColor }}
                />
                <div className="space-y-1 text-left text-xs font-mono">
                  <div className="text-[var(--text-secondary)] text-[10px]">CURRENT METRICS</div>
                  <div className="font-bold text-[var(--text-primary)]">L*: {currentLabL} | ΔEab: {currentDeltaE}</div>
                  <div className={`text-[10px] font-bold ${
                    reactionDosePreview < 8 ? 'text-[var(--accent-primary)]' : reactionDosePreview < 18 ? 'text-[#FF9500]' : 'text-[#FF3B30]'
                  }`}>
                    STATUS: {reactionDosePreview < 8 ? 'NOMINAL SAFE' : reactionDosePreview < 18 ? 'ADVISORY WARNING' : 'EVACUATION CEILING'}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          05 — AI-ASSISTED COLORIMETRIC QUANTIFICATION (Existing Matter Preserved)
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        <div
          onMouseMove={handleCardMouseMove}
          className="command-card mouse-glow-card rounded-2xl border border-[var(--card-border)] p-6 sm:p-8 space-y-6"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--card-border)] pb-6">
            <div>
              <span className="text-[11px] font-mono font-semibold text-[var(--accent-primary)] uppercase">
                AI-ASSISTED COLORIMETRIC QUANTIFICATION
              </span>
              <h3 className="text-2xl font-bold font-heading text-[var(--text-primary)] mt-0.5">
                Precision Reading from Any Smartphone Photo
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Normalizes for plant illumination, ambient temperature, and relative humidity.
              </p>
            </div>
            <button
              onClick={() => setActivePage('scan')}
              className="px-5 py-2.5 rounded-full bg-[var(--accent-primary)] text-black font-mono font-bold text-xs hover:bg-[#CCFF00] transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Launch Wristband Scanner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl command-card border border-[var(--card-border)] space-y-1.5 text-left">
              <div className="text-xs font-bold text-[var(--accent-primary)] font-mono">01 · Reference Calibration</div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Extracts the printed scale values adjacent to the sensor strip to eliminate color temperature shifts.
              </p>
            </div>

            <div className="p-4 rounded-xl command-card border border-[var(--card-border)] space-y-1.5 text-left">
              <div className="text-xs font-bold text-[#FF9500] font-mono">02 · CIE L*a*b* Extraction</div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Converts pixel data into device-independent color coordinates, calculating true perceptual color difference (ΔEab*).
              </p>
            </div>

            <div className="p-4 rounded-xl command-card border border-[var(--card-border)] space-y-1.5 text-left">
              <div className="text-xs font-bold text-[var(--text-primary)] font-mono">03 · Environmental Compensation</div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Applies Arrhenius reaction rate scaling and relative humidity sorption factors before estimating exposure dose.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =========================================================================
          06 — PLANT SAFETY LIVE TELEMETRY GRID (SARVAS STYLE DASHBOARD)
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-semibold text-[var(--accent-primary)] uppercase">
              OCCUPATIONAL SAFETY INTELLIGENCE // MARITIME & REFINERY COMMAND
            </span>
            <h3 className="text-2xl font-bold font-heading text-[var(--text-primary)]">
              MRPL Shift Safety Telemetry Grid
            </h3>
          </div>
          <button
            onClick={() => setActivePage('dashboard')}
            className="text-xs font-mono font-bold text-[#FF9500] hover:underline flex items-center gap-1.5 cursor-pointer"
          >
            <span>Open Command Safety Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Command-Center Metric Cards with Radial Gauges & Hazard Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Active Workers with Radial Gauge */}
          <div
            onMouseMove={handleCardMouseMove}
            className="p-5 rounded-2xl command-card mouse-glow-card border border-[var(--card-border)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">
                ACTIVE WORKERS
              </span>
              <Activity className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>

            <div className="flex items-center justify-between my-3">
              <div>
                <div className="text-3xl font-extrabold font-mono text-[var(--text-primary)]">48</div>
                <div className="text-[11px] text-[var(--text-secondary)] font-mono">Morning Shift A</div>
              </div>

              {/* Radial SVG Gauge */}
              <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    fill="none"
                    stroke="currentColor"
                    className="text-[var(--card-border)]"
                    strokeWidth="4"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="22"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="4"
                    strokeDasharray="138"
                    strokeDashoffset="14"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-[10px] font-mono font-bold text-[#10B981]">96%</span>
              </div>
            </div>

            <div className="text-[10px] font-mono text-[var(--accent-primary)] font-semibold">
              ● Live Shift Operational
            </div>
          </div>

          {/* Card 2: Wristbands Scanned */}
          <div
            onMouseMove={handleCardMouseMove}
            className="p-5 rounded-2xl command-card mouse-glow-card border border-[var(--card-border)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">
                WRISTBANDS SCANNED
              </span>
              <Scan className="w-4 h-4 text-[var(--accent-secondary)]" />
            </div>

            <div className="my-3">
              <div className="text-3xl font-extrabold font-mono text-[var(--text-primary)]">42</div>
              <div className="text-[11px] text-[var(--accent-primary)] font-mono font-medium mt-0.5">
                87.5% Shift Compliance
              </div>
            </div>

            <div className="w-full bg-[var(--card-surface-subtle)] h-1.5 rounded-full overflow-hidden border border-[var(--card-border)]">
              <div className="bg-[#FF9500] h-full rounded-full w-[87.5%]" />
            </div>
          </div>

          {/* Card 3: Exposure Flags (Glowing Toxic Crimson) */}
          <div
            onMouseMove={handleCardMouseMove}
            className="p-5 rounded-2xl command-card mouse-glow-card border border-[#FF3B30]/60 shadow-[0_0_20px_rgba(255,59,48,0.15)] flex flex-col justify-between bg-gradient-to-br from-[#FF3B30]/10 to-transparent"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#FF3B30] uppercase font-bold">
                EXPOSURE FLAGS
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF3B30] animate-ping" />
            </div>

            <div className="my-3">
              <div className="text-3xl font-extrabold font-mono text-[#FF3B30] drop-shadow-[0_0_8px_#FF3B30]">
                3
              </div>
              <div className="text-[11px] text-[#FF3B30] font-mono font-bold mt-0.5">
                Medical Audit Required
              </div>
            </div>

            <div className="text-[10px] font-mono text-[#FF3B30] font-bold">
              ⚠ High Chronic Accumulation
            </div>
          </div>

          {/* Card 4: Multi-Illuminant Calibration Matrix */}
          <div
            onMouseMove={handleCardMouseMove}
            className="p-5 rounded-2xl command-card mouse-glow-card border border-[var(--card-border)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase font-bold">
                CALIBRATION MATRIX
              </span>
              <Database className="w-4 h-4 text-[var(--accent-primary)]" />
            </div>

            <div className="my-3">
              <div className="text-3xl font-extrabold font-mono text-[var(--accent-primary)]">
                120
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] font-mono mt-0.5">
                Calibration Points (D65/F11/A)
              </div>
            </div>

            <div className="text-[10px] font-mono text-[var(--accent-primary)] font-semibold">
              ✓ Multi-Illuminant Normalization
            </div>
          </div>

        </div>

        {/* Simulated Live Scatter Plot Tracking Shift Exposure Curves Across Refinery Zones */}
        <div className="command-card rounded-2xl p-6 border border-[var(--card-border)] space-y-4">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[var(--accent-primary)] uppercase font-bold">
                LIVE TELEMETRY SCATTER PLOT // REFINERY EXPOSURE CURVES
              </span>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                Chronic Dose Accumulation (ppm·h) vs Shift Duration (Hours)
              </div>
            </div>

            {/* Zone Filter Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--card-surface-subtle)] border border-[var(--card-border)]">
              {(['ALL', 'ZONE0', 'ZONE1', 'ZONE2'] as const).map(zone => (
                <button
                  key={zone}
                  onClick={() => setActiveZoneFilter(zone)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeZoneFilter === zone
                      ? 'bg-[var(--accent-primary)] text-black'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {zone === 'ALL' ? 'ALL ZONES' : zone === 'ZONE0' ? 'Zone 0: Tank Farm' : zone === 'ZONE1' ? 'Zone 1: Claus SRU' : 'Zone 2: Utilities'}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Scatter Plot Canvas */}
          <div className="relative w-full h-64 sm:h-72 bg-[#040608] rounded-xl border border-[var(--card-border)] p-4 overflow-hidden">
            
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(223,255,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(223,255,0,0.04)_1px,transparent_1px)] bg-[size:40px_30px]" />

            {/* Threshold Line at 10 ppm*h (Advisory) */}
            <div className="absolute left-10 right-4 top-[50%] border-t border-dashed border-[#FF9500]/70 flex items-center justify-end">
              <span className="text-[9px] font-mono text-[#FF9500] px-1 bg-[#040608]">10 ppm·h TWA Ceiling</span>
            </div>

            {/* Threshold Line at 20 ppm*h (Evacuate / Immediate Flag) */}
            <div className="absolute left-10 right-4 top-[20%] border-t border-dashed border-[#FF3B30]/70 flex items-center justify-end">
              <span className="text-[9px] font-mono text-[#FF3B30] px-1 bg-[#040608]">20 ppm·h Medical Audit Limit</span>
            </div>

            {/* SVG Plot Points */}
            <svg className="absolute inset-0 w-full h-full p-6 overflow-visible">
              {filteredScatterPoints.map((pt) => {
                const cx = `${(pt.shiftHour / 8.5) * 85 + 8}%`;
                const cy = `${100 - (pt.dose / 24) * 85 - 8}%`;
                const isCrimson = pt.status === 'FLAG';
                const isAmber = pt.status === 'WARNING';
                const color = isCrimson ? '#EF4444' : isAmber ? '#F59E0B' : '#10B981';

                return (
                  <g key={pt.id} className="cursor-pointer group">
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isCrimson ? 6 : 4.5}
                      fill={color}
                      className={isCrimson ? 'animate-pulse' : ''}
                    />
                    {isCrimson && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r="12"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="1"
                        className="animate-ping-slow opacity-60"
                      />
                    )}
                    {/* Hover Tooltip in SVG */}
                    <title>{`${pt.worker} (${pt.name}) — ${pt.dose} ppm·h at hour ${pt.shiftHour}`}</title>
                  </g>
                );
              })}
            </svg>

            {/* Axes Labels */}
            <div className="absolute bottom-2 left-6 text-[9.5px] font-mono text-[var(--text-secondary)]">0h Shift Start</div>
            <div className="absolute bottom-2 right-6 text-[9.5px] font-mono text-[var(--text-secondary)]">8.0h Shift End</div>
            <div className="absolute top-3 left-4 text-[9.5px] font-mono text-[var(--text-secondary)]">24 ppm·h</div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-[10px] font-mono text-[var(--text-secondary)] pt-1">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span>Nominal Safe (&lt;10 ppm·h)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span>Advisory Warning (10–15 ppm·h)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
                <span>Ceiling Flag (&gt;15 ppm·h)</span>
              </div>
            </div>
            <div className="text-[var(--accent-primary)] font-semibold">
              Live Sensor Feed: 48 Wristbands Synchronized
            </div>
          </div>

        </div>
      </section>


      {/* =========================================================================
          07 — FINAL CTA (SIH 2026 / MRPL SAFETY)
         ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          onMouseMove={handleCardMouseMove}
          className="command-card mouse-glow-card rounded-2xl p-10 sm:p-14 text-center space-y-6 border border-[var(--card-border)] shadow-2xl relative overflow-hidden"
        >
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[var(--accent-primary)]">
              SMART INDIA HACKATHON 2026 // MRPL PROTOCOL
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading tracking-tight text-[var(--text-primary)]">
              Make invisible exposure measurable.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Experience the complete dosimeter workflow with simulated optical calibration, environmental correction, and shift audit logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setActivePage('scan')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-mono font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Scan className="w-4 h-4 stroke-[2.5]" />
              <span>Try the Wristband Scanner</span>
            </button>

            <button
              onClick={() => setActivePage('calibration')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full command-card border border-[var(--card-border)] text-[var(--text-primary)] font-mono text-xs sm:text-sm font-semibold hover:border-[#38BDF8] hover:bg-white/[0.04] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Database className="w-4 h-4 text-[#38BDF8]" />
              <span>Explore 120-Row Dataset</span>
            </button>
          </div>

          <div className="pt-6 border-t border-[var(--card-border)] text-[11px] font-mono text-[var(--text-secondary)]">
            Designed & developed by <strong>RAGEBYTERS</strong> for SIH 2026 · MRPL Mangalore Refinery
          </div>
        </div>
      </section>

    </div>
  );
};
