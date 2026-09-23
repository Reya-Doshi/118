import React, { useRef, useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import bandVideo from '../assets/band_expand.mp4';
import hardwareMotionVideo from '../assets/hardware_motion.mp4';
import bandDesignImg from '../assets/sarvas_anatomy.jpg';
import {
  ArrowRight,
  Shield,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Database
} from 'lucide-react';
import { FaqSection } from './FaqPage';
import { InteractiveEhsShowcase } from '../components/InteractiveEhsShowcase';

export const LandingPage: React.FC = () => {
  const { setActivePage, currentUser } = useApp();
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  // Cycle the workflow step in the cinematic section
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowStep(prev => (prev + 1) % 5);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  // Loop band_expand.mp4 precisely at 5.3 seconds
  useEffect(() => {
    let animId: number;
    const checkTime = () => {
      const video = videoRef.current;
      if (video && !video.paused && video.currentTime >= 5.3) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      animId = requestAnimationFrame(checkTime);
    };

    animId = requestAnimationFrame(checkTime);
    return () => cancelAnimationFrame(animId);
  }, []);

  // IntersectionObserver to pause video when user scrolls past hero, resume when scrolled back
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (videoRef.current) videoRef.current.pause();
      return;
    }

    const currentHero = heroRef.current;
    if (!currentHero) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              const playPromise = videoRef.current.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // Autoplay prevented by browser
                });
              }
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(currentHero);
    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const workflowSteps = [
    { label: 'WEAR', desc: 'Worker clips zero-power passive badge at start of shift.' },
    { label: 'EXPOSE', desc: 'Chemical dye matrix darkens progressively with H₂S exposure.' },
    { label: 'SCAN', desc: 'Smartphone camera captures strip beside printed reference scale.' },
    { label: 'QUANTIFY', desc: 'Algorithm extracts L*a*b*, computes ΔE, and applies temp/RH correction.' },
    { label: 'RECORD', desc: 'Dose (ppm·h) is stored into worker profile & facility safety audit log.' }
  ];

  return (
    <div className="space-y-16 sm:space-y-20 lg:space-y-28 pb-20 sm:pb-24 bg-[#F6F1E7]">
      
      {/* 01 — FULL-SCREEN VIDEO HERO */}
      <section
        ref={heroRef}
        className="relative w-full min-h-[580px] h-[100dvh] max-h-[1080px] overflow-hidden flex items-center justify-start bg-[#1C1C19]"
      >
        {/* Background 360° Video */}
        {!videoError ? (
          <video
            ref={videoRef}
            src={bandVideo}
            autoPlay
            muted
            playsInline
            preload="metadata"
            onTimeUpdate={(e) => {
              if (e.currentTarget.currentTime >= 5.3) {
                e.currentTarget.currentTime = 0;
                e.currentTarget.play().catch(() => {});
              }
            }}
            onEnded={(e) => {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play().catch(() => {});
            }}
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover object-[center_38%] sm:object-center pointer-events-none"
          />
        ) : (
          <img
            src={bandDesignImg}
            alt="118 Passive Wristband"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
          />
        )}

        {/* Minimal Scrim Scrim (No heavy black box, preserves product visibility) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C19]/85 via-[#1C1C19]/45 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-[#F6F1E7] to-transparent pointer-events-none" />

        {/* Hero Content Overlay with Sparse, Cinematic Ivory Typography */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 w-full pt-14 sm:pt-20 pb-16">
          <div className="max-w-xl space-y-4 sm:space-y-6 text-left">
            
            {/* Eyebrow */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <img 
                src="/sarvas_logo_v2.png" 
                alt="SARVAS Logo" 
                className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 border border-white/20 shadow-md"
              />
              <span className="text-xs font-bold font-mono tracking-widest text-white uppercase">
                SARVAS
              </span>
              <span className="text-[#D8D0C2]/60 font-mono text-xs">•</span>
              <span className="text-[10px] sm:text-[11px] font-mono tracking-widest text-[#EDE5D6] uppercase font-semibold">
                PASSIVE H₂S DOSIMETRY
              </span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-[1.15] text-[#F6F1E7]">
              Because not all danger <br />
              <span className="font-normal text-[#C2CBBF]">announces itself.</span>
            </h1>

            {/* Subtext */}
            <p className="text-xs sm:text-sm md:text-base text-[#EDE5D6]/85 font-normal leading-relaxed max-w-lg">
              An intelligent passive wristband that turns cumulative H₂S exposure into a measurable, traceable safety insight.
            </p>

            {/* Elegant Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
              <button
                onClick={() => scrollToSection('the-problem')}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded bg-[#EDE5D6] text-[#292925] text-xs font-semibold tracking-wide hover:bg-[#E2D9C7] transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Explore the Solution</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#4F5D4B]" />
              </button>

              <button
                onClick={() => setActivePage('scan')}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded bg-[#4F5D4B] text-[#F6F1E7] text-xs font-semibold tracking-wide hover:bg-[#3D493A] transition-all duration-200 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Read a Wristband</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C2CBBF]" />
              </button>
            </div>

            {/* Understated Specs Line */}
            <div className="pt-3 sm:pt-5 flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] sm:text-[11px] font-mono text-[#D8D0C2]/75 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#71806B]" />
                <span>Zero-Power Sensor</span>
              </div>
              <div>Shift Memory</div>
              <div>MRPL Ready</div>
            </div>

          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-[#292925]/60 text-[9px] font-mono tracking-widest cursor-pointer"
          onClick={() => scrollToSection('the-problem')}
        >
          <span>SCROLL</span>
          <ChevronDown className="w-3 h-3" />
        </div>
      </section>

      {/* 02 — THE PROBLEM */}
      <section id="the-problem" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#71806B]">
            THE OCCUPATIONAL HEALTH BLIND SPOT
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#292925]">
            Peak alarms tell you when something happened. <br />
            <span className="text-[#5D5B53]">Cumulative exposure tells you what happened over time.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#5D5B53] leading-relaxed">
            In refineries and petrochemical operations, electronic detectors monitor instantaneous peaks. Yet personnel regularly encounter sub-alarm ambient concentrations (1–10 ppm) that accumulate silently across 8-hour shifts without triggering audible alarms.
          </p>
        </div>

        {/* Minimal Quiet-Luxury Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg bg-[#EDE5D6] border border-[#D8D0C2] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#826235] uppercase">ELECTRONIC GAS DETECTOR</span>
              <AlertTriangle className="w-4 h-4 text-[#B08A55]" />
            </div>
            <h3 className="text-base font-semibold text-[#292925]">Instantaneous Spike Alarms</h3>
            <ul className="space-y-2 text-xs text-[#5D5B53]">
              <li className="flex items-start gap-2">
                <span className="text-[#878377] mt-0.5">—</span>
                <span>Requires batteries, active electronics, and hazardous-area certifications.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#878377] mt-0.5">—</span>
                <span>Only alerts when instantaneous ceiling limits are momentarily breached.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#878377] mt-0.5">—</span>
                <span>Does not track chronic cumulative dose burden across entire plant shifts.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-lg bg-[#E5EADF] border border-[#C5CEC0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-[#4F5D4B] uppercase">118 PASSIVE DOSIMETER</span>
              <Shield className="w-4 h-4 text-[#4F5D4B]" />
            </div>
            <h3 className="text-base font-semibold text-[#292925]">Continuous Cumulative Dosimetry</h3>
            <ul className="space-y-2 text-xs text-[#374234]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4F5D4B] shrink-0 mt-0.5" />
                <span><strong>Zero-power chemical response</strong>: Intrinsic zero-spark safety in Zone 0/1 environments.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4F5D4B] shrink-0 mt-0.5" />
                <span><strong>Permanent physical reaction</strong>: Chemochromic strip darkens proportionally to cumulative H₂S.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4F5D4B] shrink-0 mt-0.5" />
                <span><strong>AI-assisted quantitative readout</strong>: Standard smartphone photo calibrated against printed scale.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 03 — THE BAND (“The Band, Explained.”) */}
      <section id="the-band" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#71806B]">
            ANATOMY & HARDWARE SPECIFICATIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#292925]">
            The Band, Explained.
          </h2>
          <p className="text-xs sm:text-sm text-[#5D5B53] leading-relaxed">
            Every element is designed around one purpose: making cumulative exposure visible without adding another powered device to the worker.
          </p>
        </div>

        {/* Display the Actual band design.png Prominently in Warm Frame */}
        <div className="bg-[#292925] rounded-xl p-6 md:p-8 border border-[#3E3C36] space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#3E3C36] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#C2CBBF] uppercase font-semibold">
                PHYSICAL DOSIMETER ARCHITECTURE
              </span>
              <div className="text-sm font-bold text-[#EDE5D6]">SARVAS Hardware Anatomy</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#32322D] border border-[#43423A] text-[#A69F91] text-[10px] font-mono">
                Architecture: Micro-porous ePTFE
              </span>
            </div>
          </div>

          {/* Actual Image Render */}
          <div className="relative flex items-center justify-center p-3 bg-[#1F1F1B] rounded-lg border border-[#35342E] overflow-hidden">
            <img
              src={bandDesignImg}
              alt="118 Physical Band Anatomy"
              className="max-h-[480px] w-auto object-contain rounded"
            />
          </div>

          {/* 4 Subtle Feature Callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-3.5 rounded-lg bg-[#32322D] border border-[#43423A] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#4F5D4B] text-[#EDE5D6] text-[10px] font-mono font-bold flex items-center justify-center">
                  01
                </span>
                <h4 className="text-[11px] font-bold text-[#EDE5D6] uppercase font-mono">DUAL-ZONE SENSORS</h4>
              </div>
              <p className="text-[11px] text-[#A69F91] leading-relaxed">
                Permanent Ag₂S (Zone A, 0.125–10 ppm·h) &amp; CuS (Zone B, 10–160 ppm·h) precipitation. Insoluble mineral sulfides guarantee zero fading.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#32322D] border border-[#43423A] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#B08A55]/30 text-[#EDE5D6] text-[10px] font-mono font-bold flex items-center justify-center">
                  02
                </span>
                <h4 className="text-[11px] font-bold text-[#EDE5D6] uppercase font-mono">REFERENCE &amp; CONTROL</h4>
              </div>
              <p className="text-[11px] text-[#A69F91] leading-relaxed">
                Printed CIE scale for ambient normalization, plus a sealed gas-impermeable silver control patch to subtract light photo-drift.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#32322D] border border-[#43423A] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#71806B]/40 text-[#EDE5D6] text-[10px] font-mono font-bold flex items-center justify-center">
                  03
                </span>
                <h4 className="text-[11px] font-bold text-[#EDE5D6] uppercase font-mono">SEAL-BREACH DOT</h4>
              </div>
              <p className="text-[11px] text-[#A69F91] leading-relaxed">
                Anhydrous white CuSO₄ dot turns vivid blue upon moisture/seal breach, providing a physical pre-shift visual shelf-life indicator.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#32322D] border border-[#43423A] space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-[#5D5B53] text-[#EDE5D6] text-[10px] font-mono font-bold flex items-center justify-center">
                  04
                </span>
                <h4 className="text-[11px] font-bold text-[#EDE5D6] uppercase font-mono">BAND ID</h4>
              </div>
              <p className="text-[11px] text-[#A69F91] leading-relaxed">
                Links the physical badge to a worker and shift record, integrating directly into plant safety logs.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 04 — PRODUCT-FILM SECTION & HOW IT WORKS */}
      <section id="how-it-works" className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#71806B]">
            END-TO-END SHIFT LIFECYCLE
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-[#292925]">
            From a shift on the wrist <br />
            to a number you can act on.
          </h2>
          <p className="text-xs sm:text-sm text-[#5D5B53] leading-relaxed">
            The hardware and software workflow bridges continuous physical chemical change to calibrated digital safety records.
          </p>
        </div>

        {/* Cinematic Video Frame */}
        <div className="bg-[#292925] rounded-xl p-6 border border-[#3E3C36] space-y-6">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-[#3E3C36] bg-[#1C1C19]">
            <video
              src={hardwareMotionVideo}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/60 border border-white/15 text-[#C2CBBF] text-[11px] font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#71806B]" />
              <span>118 Hardware Motion</span>
            </div>
          </div>

          {/* Animated Sequence Underneath */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#A69F91] border-b border-[#3E3C36] pb-2">
              <span>WORKFLOW SEQUENCE</span>
              <span className="text-[#C2CBBF] font-bold">PHASE 0{activeWorkflowStep + 1} / 05</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              {workflowSteps.map((step, idx) => {
                const isActive = activeWorkflowStep === idx;
                return (
                  <div
                    key={step.label}
                    className={`p-3 rounded border text-left transition-all duration-300 ${
                      isActive
                        ? 'border-[#71806B] bg-[#32322D] shadow-xs'
                        : 'border-[#3E3C36] bg-[#20201C] opacity-75'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[11px] font-mono font-bold ${isActive ? 'text-[#C2CBBF]' : 'text-[#8E897E]'}`}>
                        0{idx + 1}
                      </span>
                      <span className={`text-xs font-mono font-semibold ${isActive ? 'text-[#EDE5D6]' : 'text-[#A69F91]'}`}>
                        {step.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#A69F91] leading-tight">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 05 — INTERACTIVE EHS SHOWCASE & LIVE SIMULATOR */}
      <section id="ehs-showcase" className="max-w-5xl mx-auto px-4 sm:px-6">
        <InteractiveEhsShowcase />
      </section>

      {/* 06.5 — FREQUENTLY ASKED QUESTIONS & TECHNICAL SPECIFICATIONS */}
      {!currentUser && (
        <section id="faq" className="max-w-5xl mx-auto px-4 sm:px-6">
          <FaqSection isEmbedded={true} />
        </section>
      )}

      {/* 07 — FINAL CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16 relative z-0">
        <div className="bg-[#292925] text-[#EDE5D6] rounded-xl p-6 sm:p-10 md:p-12 text-center space-y-6 border border-[#3E3C36] shadow-sm">
          <div className="space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#C2CBBF]">
              SMART INDIA HACKATHON 2026
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight text-white">
              Make invisible exposure measurable.
            </h2>
            <p className="text-xs sm:text-sm text-[#A69F91] leading-relaxed">
              Experience the complete dosimeter workflow with simulated optical calibration, environmental correction, and shift audit logs.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={() => setActivePage('scan')}
              className="w-full sm:w-auto px-7 py-3 rounded bg-[#4F5D4B] text-[#F6F1E7] text-xs font-bold tracking-wide hover:bg-[#3D493A] transition-all flex items-center justify-center gap-2"
            >
              <span>Try the Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActivePage('calibration')}
              className="w-full sm:w-auto px-6 py-3 rounded bg-[#32322D] border border-[#43423A] text-[#EDE5D6] text-xs font-medium hover:bg-[#3B3A34] transition-colors flex items-center justify-center gap-2"
            >
              <Database className="w-3.5 h-3.5 text-[#B08A55]" />
              <span>Explore 303-Sample Matrix</span>
            </button>
          </div>

          <div className="pt-6 border-t border-[#3E3C36] text-[11px] font-mono text-[#8E897E]">
            Designed & developed for passive industrial chemical dosimetry
          </div>
        </div>
      </section>

    </div>
  );
};
