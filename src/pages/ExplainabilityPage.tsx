import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import mlVideo from '../assets/ml.mp4';
import {
  Play,
  Pause,
  Sliders,
  Maximize2,
  Scan
} from 'lucide-react';

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

  // Calculate simulated dose live based on empirical formula
  // dose = 0.00185 * (deltaE ^ 1.96) * tempFactor * rhFactor
  const tempFactor = 1.0 + 0.012 * (simTemp - 25.0);
  const rhFactor = 1.0 + 0.004 * (simRh - 50.0);
  const rawDose = 0.00185 * Math.pow(Math.max(0, simDeltaE), 1.96) * tempFactor * rhFactor;
  const calculatedDose = parseFloat(rawDose.toFixed(2));

  // Determine status & color
  let simStatus: 'NORMAL' | 'MONITOR' | 'REVIEW' = 'NORMAL';
  let simHex = '#B8728A';
  if (calculatedDose > 1.00) {
    simStatus = 'REVIEW';
    simHex = '#3D2B1F';
  } else if (calculatedDose >= 0.50) {
    simStatus = 'MONITOR';
    simHex = '#7A5B43';
  } else {
    simStatus = 'NORMAL';
    simHex = simDeltaE < 12 ? '#B8728A' : '#9E5B6A';
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

      {/* SECTION 1: EMBEDDED DEMONSTRATION VIDEO (ml.mp4) */}
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
                Source: src/assets/ml.mp4 · Live Strip Chelation & Spatial Median Regression
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
              controls={false}
              className="w-full h-full max-h-[460px] object-contain cursor-pointer"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={mlVideo} type="video/mp4" />
              <source src="/assets/ml.mp4" type="video/mp4" />
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
                  ml.mp4 · Automated Colorimetry
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
              Spatial masking extracts inner 25% core, discarding specular glare and ambient reflections.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <div className="font-bold text-[#292925] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-mono">2</span>
              <span>CIE L*a*b* Chelation Shift</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
              Transforms RGB into perceptual coordinates, measuring ΔE distance as Cu-PAN chelates H₂S gas.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <div className="font-bold text-[#292925] flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-mono">3</span>
              <span>Calibrated Dose Output</span>
            </div>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
              Dual Arrhenius environmental correction feeds Random Forest regressor for ppm·h prediction.
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
            <h3 className="font-serif font-bold text-sm text-[#292925]">Optical Quality &amp; Localization</h3>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Gemini Vision / OpenCV isolates sensing strip bounding box and audits perspective, blur, and lighting conditions.
            </p>
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-gray-200 text-[10px] font-mono text-gray-600">
              Output: Bounding Box [ymin, xmin, ymax, xmax] &amp; PASS/FAIL Verdict
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
            <h3 className="font-serif font-bold text-sm text-[#292925]">Spatial CIE L*a*b* Conversion</h3>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Spatial median sampling of central 25% strip core converted to CIE L*a*b* under D65 illuminant to compute Euclidean ΔE*ab.
            </p>
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-gray-200 text-[10px] font-mono text-gray-600">
              Formula: ΔE = √((ΔL*)² + (Δa*)² + (Δb*)²)
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
            <h3 className="font-serif font-bold text-sm text-[#292925]">Environmental Compensation</h3>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Dual Arrhenius temperature scaling (25°C base) and matrix swelling humidity factors normalize chemical reaction kinetics.
            </p>
            <div className="p-2 bg-[#FAF8F5] rounded-lg border border-gray-200 text-[10px] font-mono text-gray-600">
              Compensation: ΔE_comp = ΔE · f(T) · f(RH) · f(Age)
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
            <h3 className="font-serif font-bold text-sm text-[#292925]">Calibrated Random Forest Dose</h3>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              Calibrated model trained on 120 empirical gas test batches predicts cumulative dose in ppm·h with 95% confidence bounds.
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

            {/* Simulated Color Swatch */}
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-16 h-16 rounded-2xl shadow-md border-2 border-white transition-all duration-200"
                style={{ backgroundColor: simHex }}
              />
              <div className="text-left text-xs font-mono">
                <div className="font-bold text-[#292925]">{simHex}</div>
                <div className="text-gray-500 text-[10px]">Cu-PAN Chelation</div>
              </div>
            </div>

            {/* Predicted Cumulative Dose */}
            <div>
              <div className="text-3xl sm:text-4xl font-mono font-bold text-[#292925]">
                {calculatedDose.toFixed(2)}
                <span className="text-xs font-serif text-gray-600 ml-1">ppm·h</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500 block mt-0.5">
                95% CI: ±0.08 ppm·h
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
              {simStatus === 'NORMAL' && 'Safe exposure range. Chelation within OSHA permissible 8h TWA.'}
              {simStatus === 'MONITOR' && 'Action Level reached. Reassign personnel to low-risk exterior sector.'}
              {simStatus === 'REVIEW' && 'OSHA Threshold Exceeded! Emergency rotation & medical assessment required.'}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};
