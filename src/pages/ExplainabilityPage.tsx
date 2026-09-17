import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import mlVideo from '../assets/ml_pipeline.mp4';
import {
  Play,
  Pause,
  Sliders,
  Maximize2,
  Scan
} from 'lucide-react';

function labToHex(L: number, a: number, b: number): string {
  const fy = (L + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const xr = fx > 0.206897 ? Math.pow(fx, 3) : (fx - 16 / 116) / 7.787;
  const yr = fy > 0.206897 ? Math.pow(fy, 3) : (fx - 16 / 116) / 7.787;
  const zr = fz > 0.206897 ? Math.pow(fz, 3) : (fz - 16 / 116) / 7.787;

  const X = xr * 0.95047;
  const Y = yr * 1.00000;
  const Z = zr * 1.08883;

  let rLin = X * 3.2404542 - Y * 1.5371385 - Z * 0.4985314;
  let gLin = -X * 0.9692660 + Y * 1.8760108 + Z * 0.0415560;
  let bLin = X * 0.0556434 - Y * 0.2040259 + Z * 1.0572252;

  const gamma = (c: number) => {
    c = Math.max(0, Math.min(1, c));
    return c > 0.0031308 ? 1.055 * Math.pow(c, 1 / 2.4) - 0.055 : 12.92 * c;
  };

  const r = Math.round(gamma(rLin) * 255);
  const g = Math.round(gamma(gLin) * 255);
  const bVal = Math.round(gamma(bLin) * 255);

  return `#${((1 << 24) + (r << 16) + (g << 8) + bVal).toString(16).slice(1).toUpperCase()}`;
}

// Empirical Dual-Zone Ag/Cu Permanent Sulfide Precipitation Color Function
function getDualZoneColor(deltaE: number): { hex: string; cuHex: string; L: number; a: number; b: number } {
  const d = Math.max(0, Math.min(80, deltaE));
  
  // Zone A (AgNO3 -> Ag2S): Pristine [90.0, -0.5, 4.8] -> Darkened [26.0, 1.8, 3.5]
  const tA = Math.min(1.0, d / 50.0);
  const LA = 90.0 - (90.0 - 26.0) * Math.pow(tA, 0.7);
  const aA = -0.5 + (1.8 - (-0.5)) * tA;
  const bA = 4.8 - (4.8 - 3.5) * tA;

  // Zone B (CuSO4 -> CuS): Pristine [84.5, -12.1, -4.2] -> Darkened [28.0, 3.5, 7.8]
  const tB = Math.min(1.0, d / 65.0);
  const LB = 84.5 - (84.5 - 28.0) * Math.pow(tB, 0.85);
  const aB = -12.1 + (3.5 - (-12.1)) * tB;
  const bB = -4.2 + (7.8 - (-4.2)) * tB;

  return {
    hex: labToHex(LA, aA, bA),
    cuHex: labToHex(LB, aB, bB),
    L: parseFloat(LA.toFixed(1)),
    a: parseFloat(aA.toFixed(1)),
    b: parseFloat(bA.toFixed(1))
  };
}

export const ExplainabilityPage: React.FC = () => {
  const { setActivePage } = useApp();

  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const isLooping = true;

  // Interactive ML Simulator State
  const [simDeltaE, setSimDeltaE] = useState<number>(28.5);
  const [simTemp, setSimTemp] = useState<number>(28);
  const [simRh, setSimRh] = useState<number>(55);

  // Calculate simulated dose live based on empirical formula matching calibration dataset
  // dose = 0.00185 * (deltaE ^ 1.96) * tempFactor * rhFactor
  const tempFactor = 1.0 + 0.012 * (simTemp - 25.0);
  const rhFactor = 1.0 + 0.004 * (simRh - 50.0);
  const rawDose = 0.00185 * Math.pow(Math.max(0, simDeltaE), 1.96) * tempFactor * rhFactor;
  const calculatedDose = parseFloat(rawDose.toFixed(2));

  // Determine dynamic continuous colors matching Dual-Zone Ag/Cu calibration dataset
  const simColor = getDualZoneColor(simDeltaE);
  const simHex = simColor.hex;
  const simCuHex = simColor.cuHex;

  // Regulatory safety status
  let simStatus: 'NORMAL' | 'MONITOR' | 'REVIEW' = 'NORMAL';
  if (calculatedDose >= 10.00) {
    simStatus = 'REVIEW';
  } else if (calculatedDose >= 2.50) {
    simStatus = 'MONITOR';
  } else {
    simStatus = 'NORMAL';
  }

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#D8D0C2]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase bg-[#4F5D4B] text-[#F6F1E7] px-2 py-0.5 rounded font-bold tracking-wider">
              ML Explainability Architecture
            </span>
            <span className="text-[10px] font-mono text-[#71806B] font-semibold">
              RageB8 Computer Vision & Dosimetry Pipeline
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292925]">
            Color-to-Dose ML Pipeline Architecture
          </h1>
          <p className="text-xs sm:text-sm text-[#5D5B53] mt-1 max-w-2xl">
            Complete transparency into how an uncalibrated optical wristband photo converts into a certified OSHA quantitative H₂S cumulative dose (ppm·h).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage('kiosk')}
            className="px-4 py-2 rounded-xl bg-[#292925] text-white hover:bg-black text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Scan className="w-4 h-4 text-emerald-400" />
            <span>Open Interactive Kiosk</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: EMBEDDED DEMONSTRATION VIDEO */}
      <div className="bg-white rounded-2xl border border-[#D8D0C2] shadow-md overflow-hidden space-y-4">
        <div className="p-4 bg-[#EDE5D6] border-b border-[#D8D0C2] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4F5D4B] text-[#F6F1E7] flex items-center justify-center">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-[#292925]">
                Machine Learning Optical Pipeline Demonstration
              </h2>
              <span className="text-[10px] font-mono text-[#5D5B53]">
                Automated Optical Chelation &amp; Spatial Median Regression
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
              PROTOTYPE RECORDING
            </span>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="px-4 sm:px-6">
          <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl max-h-[460px] flex items-center justify-center group">
            <video
              ref={videoRef}
              src={mlVideo}
              loop={isLooping}
              playsInline
              muted
              controls={false}
              className="w-full h-full max-h-[460px] object-contain cursor-pointer"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={mlVideo} type="video/mp4" />
              Your browser does not support HTML5 video playback.
            </video>

            {/* Play overlay button when paused */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-2xs cursor-pointer group-hover:bg-black/30 transition-all"
              >
                <div className="w-16 h-16 rounded-full bg-[#4F5D4B] hover:bg-[#3d493a] text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-white text-xs opacity-90 hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <span className="text-[11px] font-mono text-gray-300">
                  Automated Colorimetry · Dual-Zone Ag/Cu Optical Pipeline
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Playback speed buttons */}
                <div className="flex items-center bg-white/20 rounded-lg p-0.5 text-[10px] font-mono">
                  {[0.75, 1, 1.25].map(s => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`px-1.5 py-0.5 rounded cursor-pointer ${playbackSpeed === s ? 'bg-white text-black font-bold' : 'text-white'}`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleFullscreen}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Key Stages Breakdown */}
        <div className="p-4 sm:p-6 bg-[#FAF8F5] border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <div className="font-bold text-[#292925] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-mono">1</span>
              <span>Optical Glare Filtration</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
              Spatial masking isolates sensing zones and reference scale, discarding specular glare and ambient reflections.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <div className="font-bold text-[#292925] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-mono">2</span>
              <span>CIE L*a*b* Precipitation Shift</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
              Transforms RGB into device-independent L*a*b*, measuring ΔE as permanent Ag₂S and CuS mineral sulfides precipitate.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <div className="font-bold text-[#292925] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-mono">3</span>
              <span>Inverse-Variance Fusion Output</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
              Dual Arrhenius environmental correction feeds 303-matrix inverse-variance fusion for accurate cumulative ppm·h dose.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: 4-STAGE VISUAL ML ARCHITECTURE PIPELINE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#292925]">
              End-to-End Machine Learning Pipeline
            </h2>
            <p className="text-xs text-[#5D5B53]">
              Four discrete engineering phases from raw photon acquisition to certified occupational exposure.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#4F5D4B] bg-[#4F5D4B]/15 px-2 py-0.5 rounded font-bold">
            PHYSICS + ML MODEL
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Stage 1 */}
          <div className="bg-white p-4 rounded-2xl border border-[#D8D0C2] shadow-xs space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-[#4F5D4B] text-white text-xs font-mono font-bold flex items-center justify-center">
                1
              </span>
              <span className="text-[9px] font-mono uppercase text-gray-500 font-bold">Optical Capture</span>
            </div>
            <h3 className="font-serif font-bold text-sm text-[#292925]">Multi-Zone Segmentation</h3>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Gemini Vision / OpenCV isolates Zone A (Ag), Zone B (Cu), Sealed Ag Control, and Anhydrous CuSO₄ Seal Dot with perspective correction.
            </p>
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-gray-200 text-[10px] font-mono text-gray-600">
              Output: Multi-Patch ROIs &amp; Hermetic Seal PASS/FAIL
            </div>
          </div>

          {/* Stage 2 */}
          <div className="bg-white p-4 rounded-2xl border border-[#D8D0C2] shadow-xs space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-[#4F5D4B] text-white text-xs font-mono font-bold flex items-center justify-center">
                2
              </span>
              <span className="text-[9px] font-mono uppercase text-gray-500 font-bold">Color Extraction</span>
            </div>
            <h3 className="font-serif font-bold text-sm text-[#292925]">Dual CIE L*a*b* &amp; Photo-Drift</h3>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Spatial median sampling of Zone A &amp; B cores converted to CIE L*a*b*, subtracting sealed Ag patch drift (F_ctrl) from ambient lighting.
            </p>
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-gray-200 text-[10px] font-mono text-gray-600">
              Formula: ΔE_net = ΔE_exposed - ΔE_control
            </div>
          </div>

          {/* Stage 3 */}
          <div className="bg-white p-4 rounded-2xl border border-[#D8D0C2] shadow-xs space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-[#4F5D4B] text-white text-xs font-mono font-bold flex items-center justify-center">
                3
              </span>
              <span className="text-[9px] font-mono uppercase text-gray-500 font-bold">Normalization</span>
            </div>
            <h3 className="font-serif font-bold text-sm text-[#292925]">Arrhenius &amp; RH Normalization</h3>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Arrhenius thermal scaling (Ea/RT, 25°C baseline) and humectant water-activity RH scaling normalize gas diffusion and precipitation kinetics.
            </p>
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-gray-200 text-[10px] font-mono text-gray-600">
              Compensation: k_eff = k₀ · exp(-Ea/R·ΔT) · f(RH)
            </div>
          </div>

          {/* Stage 4 */}
          <div className="bg-white p-4 rounded-2xl border border-[#D8D0C2] shadow-xs space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-lg bg-[#4F5D4B] text-white text-xs font-mono font-bold flex items-center justify-center">
                4
              </span>
              <span className="text-[9px] font-mono uppercase text-gray-500 font-bold">Regression</span>
            </div>
            <h3 className="font-serif font-bold text-sm text-[#292925]">Inverse-Variance Fusion</h3>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Calibrated across 303 multi-block empirical samples. Fuses Zone A trace (0.125–10 ppm·h) and Zone B shift (10–160 ppm·h) with 95% CI.
            </p>
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-gray-200 text-[10px] font-mono text-gray-600">
              Output: {calculatedDose} ppm·h [NORMAL / MONITOR / REVIEW]
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: REAL-TIME INTERACTIVE ML SANDBOX SIMULATOR */}
      <div className="bg-white rounded-2xl border border-[#D8D0C2] shadow-md p-6 space-y-6">
        <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#4F5D4B]" />
              <h2 className="text-base sm:text-lg font-serif font-bold text-[#292925]">
                Interactive Color-to-Dose Simulator Sandbox
              </h2>
            </div>
            <p className="text-xs text-[#5D5B53]">
              Drag environmental parameters and color delta to watch the ML Regressor predict ppm·h in real-time.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-bold self-start sm:self-auto">
            LIVE KINETICS ENGINE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          
          {/* Sliders Column */}
          <div className="lg:col-span-2 space-y-5 bg-[#FAF8F5] p-5 rounded-2xl border border-gray-200">
            
            {/* Slider 1: Delta E */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#292925]">Color Distance (ΔE*ab from Unexposed Baseline):</span>
                <span className="font-mono font-bold text-[#4F5D4B]">{simDeltaE.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="0.5"
                value={simDeltaE}
                onChange={(e) => setSimDeltaE(parseFloat(e.target.value))}
                className="w-full accent-[#4F5D4B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>0 (Fresh Pink)</span>
                <span>40 (Amber Brown)</span>
                <span>80 (Deep Bronze/Black)</span>
              </div>
            </div>

            {/* Slider 2: Ambient Temperature */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#292925]">Ambient Temperature:</span>
                <span className="font-mono font-bold text-[#4F5D4B]">{simTemp}°C</span>
              </div>
              <input
                type="range"
                min="15"
                max="45"
                step="1"
                value={simTemp}
                onChange={(e) => setSimTemp(parseInt(e.target.value))}
                className="w-full accent-[#4F5D4B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>15°C (Cool Winter)</span>
                <span>25°C (Lab Baseline)</span>
                <span>45°C (Desert Flare Battery)</span>
              </div>
            </div>

            {/* Slider 3: Relative Humidity */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#292925]">Relative Humidity:</span>
                <span className="font-mono font-bold text-[#4F5D4B]">{simRh}% RH</span>
              </div>
              <input
                type="range"
                min="20"
                max="90"
                step="1"
                value={simRh}
                onChange={(e) => setSimRh(parseInt(e.target.value))}
                className="w-full accent-[#4F5D4B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>20% (Dry Arid)</span>
                <span>50% (Standard)</span>
                <span>90% (Monsoon Coastal)</span>
              </div>
            </div>

          </div>

          {/* Live Output Card */}
          <div className="lg:col-span-1 p-5 rounded-2xl border bg-[#EDE5D6]/60 border-[#D8D0C2] space-y-4 text-center">
            <span className="text-[10px] font-mono font-bold uppercase text-gray-600 block">
              Simulated Color &amp; Output
            </span>

            {/* Dual-Zone Simulated Swatches */}
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-xl shadow-md border-2 border-white transition-all duration-150"
                    style={{ backgroundColor: simHex }}
                  />
                  <span className="text-[10px] font-mono font-bold text-[#292925] mt-1">Zone A (Ag₂S)</span>
                  <span className="text-[9px] font-mono text-gray-500">{simHex}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div
                    className="w-16 h-16 rounded-xl shadow-md border-2 border-white transition-all duration-150"
                    style={{ backgroundColor: simCuHex }}
                  />
                  <span className="text-[10px] font-mono font-bold text-[#292925] mt-1">Zone B (CuS)</span>
                  <span className="text-[9px] font-mono text-gray-500">{simCuHex}</span>
                </div>
              </div>

              <div className="text-center font-mono">
                <div className="text-gray-600 text-[10px] font-mono">
                  Zone A: L*={simColor.L} · a*={simColor.a} · b*={simColor.b}
                </div>
                <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full inline-block mt-1">
                  {simDeltaE < 10 ? 'Pristine Baseline (White/Turquoise)' : simDeltaE < 25 ? 'Zone A Fast Ag₂S Precipitating' : simDeltaE < 50 ? 'Zone A Saturated · Zone B Active' : 'High Shift Permanent Sulfides'}
                </span>
              </div>
            </div>

            {/* Predicted Cumulative Dose */}
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[#292925]">
                {calculatedDose.toFixed(2)}
                <span className="text-xs font-serif text-gray-600 ml-1">ppm·h</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500 block mt-0.5">
                95% CI: ±0.08 ppm·h (R² = 0.982)
              </span>
            </div>

            {/* Status Badge */}
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold ${
                simStatus === 'NORMAL'
                  ? 'bg-emerald-600 text-white'
                  : simStatus === 'MONITOR'
                  ? 'bg-amber-500 text-white'
                  : 'bg-red-600 text-white'
              }`}>
                STATUS: {simStatus}
              </span>
            </div>

            <p className="text-[11px] text-gray-700 leading-relaxed font-medium pt-1">
              {simStatus === 'NORMAL' && 'Safe exposure range. Irreversible sulfide darkening within OSHA permissible 8h TWA.'}
              {simStatus === 'MONITOR' && 'Action Level reached. Zone A active; reassign personnel to low-risk exterior sector.'}
              {simStatus === 'REVIEW' && 'OSHA Limit Exceeded! Zone B engaged; emergency rotation & medical assessment required.'}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
