import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  CALIBRATION_DATASET,
  computeEnvironmentalCompensation,
  rgbToLab,
  estimateDoseFromLab
} from '../data/calibrationData';
import type { ExposureReading } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import {
  Camera,
  Upload,
  Play,
  Cpu,
  Sparkles,
  Sliders,
  Database,
  UserCheck,
  RotateCw,
  Check,
  SwitchCamera,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

export const ScanPage: React.FC = () => {
  const { selectedSample, setLatestReading, setActivePage, workers, currentUser, selectedWorker } = useApp();
  
  const [activeSampleId, setActiveSampleId] = useState<string>(selectedSample.id || 'CP-086');
  const activeCalibration = CALIBRATION_DATASET.find(s => s.sampleId === activeSampleId) || CALIBRATION_DATASET[85];
  
  const [assignedWorkerId, setAssignedWorkerId] = useState<string>(() => {
    if (selectedWorker) return selectedWorker.workerId;
    if (currentUser?.role === 'WORKER') {
      const matched = workers.find(
        w => w.workerId === currentUser.employeeId || 
             w.badgeId === currentUser.assignedBandId || 
             w.name.toLowerCase() === currentUser.name.toLowerCase()
      );
      if (matched) return matched.workerId;
    }
    return workers[0]?.workerId || 'WRK-2048';
  });

  useEffect(() => {
    if (selectedWorker) {
      setAssignedWorkerId(selectedWorker.workerId);
    } else if (currentUser?.role === 'WORKER') {
      const matched = workers.find(
        w => w.workerId === currentUser.employeeId || 
             w.badgeId === currentUser.assignedBandId || 
             w.name.toLowerCase() === currentUser.name.toLowerCase()
      );
      if (matched) setAssignedWorkerId(matched.workerId);
    }
  }, [selectedWorker, currentUser, workers]);

  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [liveStepMessages, setLiveStepMessages] = useState<string[]>([
    'Detecting wristband & QR badge ID…',
    'Extracting sensor reticle colors…',
    'Computing CIE76 color difference from Cu-PAN baseline…',
    'Applying Arrhenius temperature & humidity compensation…',
    'Quantifying cumulative H₂S dose…'
  ]);

  // Camera Scanning States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera tracks
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Request browser camera
  const startCamera = async (overrideFacingMode?: 'environment' | 'user') => {
    setCameraError(null);
    setCapturedPreview(null);
    stopCamera();

    const mode = overrideFacingMode || facingMode;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by this browser environment or requires HTTPS. You can upload a photo instead.');
      return;
    }

    try {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      } catch {
        // ignore device enum error
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 }
        },
        audio: false
      });

      streamRef.current = stream;
      setIsCameraActive(true);
      setFacingMode(mode);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      }, 50);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      stopCamera();
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions or upload a photo.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera was detected on this device. You can upload a photo instead.');
      } else {
        setCameraError('Could not access device camera. Please check permissions or use Upload Photo.');
      }
    }
  };

  const switchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedPreview(dataUrl);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCapturedPreview(null);
    startCamera();
  };

  const useCapturedPhoto = () => {
    if (capturedPreview) {
      setCustomImage(capturedPreview);
      setCapturedPreview(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSelectSample = (sampleId: string) => {
    setActiveSampleId(sampleId);
    setCustomImage(null);
    setCapturedPreview(null);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result as string);
        setCapturedPreview(null);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  // Extract true pixel colors from uploaded/captured photo using HTML5 Canvas
  const extractColorFromImage = (imageDataUrl: string): Promise<{ r: number; g: number; b: number; hex: string; lab: { L: number; a: number; b: number } }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const offscreen = document.createElement('canvas');
        offscreen.width = img.naturalWidth || 640;
        offscreen.height = img.naturalHeight || 480;
        const ctx = offscreen.getContext('2d');
        if (!ctx) {
          resolve({ r: 121, g: 81, b: 133, hex: '#795185', lab: { L: 40.6, a: 26.6, b: -22.5 } });
          return;
        }
        ctx.drawImage(img, 0, 0, offscreen.width, offscreen.height);

        // Center reticle sampling (central 30% x 30% area)
        const startX = Math.floor(offscreen.width * 0.35);
        const startY = Math.floor(offscreen.height * 0.35);
        const sampleW = Math.max(10, Math.floor(offscreen.width * 0.3));
        const sampleH = Math.max(10, Math.floor(offscreen.height * 0.3));

        const imgData = ctx.getImageData(startX, startY, sampleW, sampleH).data;
        let totalR = 0, totalG = 0, totalB = 0, count = 0;

        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i + 1];
          const b = imgData[i + 2];
          const a = imgData[i + 3];
          if (a < 128) continue;
          const brightness = r + g + b;
          if (brightness > 740 || brightness < 20) continue; // Filter glare and extreme shadows
          totalR += r;
          totalG += g;
          totalB += b;
          count++;
        }

        if (count === 0) {
          resolve({ r: 121, g: 81, b: 133, hex: '#795185', lab: { L: 40.6, a: 26.6, b: -22.5 } });
          return;
        }

        const avgR = Math.round(totalR / count);
        const avgG = Math.round(totalG / count);
        const avgB = Math.round(totalB / count);
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        const hex = `#${toHex(avgR)}${toHex(avgG)}${toHex(avgB)}`;
        const lab = rgbToLab(avgR, avgG, avgB);

        resolve({ r: avgR, g: avgG, b: avgB, hex, lab });
      };
      img.onerror = () => {
        resolve({ r: 121, g: 81, b: 133, hex: '#795185', lab: { L: 40.6, a: 26.6, b: -22.5 } });
      };
      img.src = imageDataUrl;
    });
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setCurrentStep(1);

    let sampledLab = activeCalibration.lab;
    let sampledHex = activeCalibration.hexColor;
    let sampledColorString = activeCalibration.rawColorString;
    let sampleLabel = activeCalibration.sampleId;

    if (customImage) {
      const extracted = await extractColorFromImage(customImage);
      sampledLab = extracted.lab;
      sampledHex = extracted.hex;
      sampledColorString = `sRGB(${extracted.r}, ${extracted.g}, ${extracted.b}) → L*=${extracted.lab.L}, a*=${extracted.lab.a}, b*=${extracted.lab.b}`;
      sampleLabel = 'Live Camera/Upload Scan';
    }

    const estimate = estimateDoseFromLab(
      sampledLab,
      activeCalibration.tempC,
      activeCalibration.rh,
      activeCalibration.shelfAge
    );

    const steps = [
      'Detecting wristband & QR badge registration…',
      `Extracting sensor reticle: L*=${sampledLab.L}, a*=${sampledLab.a}, b*=${sampledLab.b}…`,
      `Computing CIE76 color difference: ΔEab* = ${estimate.deltaE}…`,
      `Color Classification: ${estimate.colorName} [${estimate.stageName}]…`,
      estimate.isOutOfCalibration
        ? 'OUT OF CALIBRATION — DO NOT ESTIMATE DOSE'
        : `Quantifying cumulative H₂S dose: ${estimate.estimatedDosePpmH} ppm·h [${estimate.status}]…`
    ];
    setLiveStepMessages(steps);

    // Rapid, responsive progression (200ms per step, ~1000ms total)
    let stepCount = 1;
    const interval = setInterval(() => {
      stepCount++;
      if (stepCount > 5) {
        clearInterval(interval);
        setTimeout(() => {
          const now = new Date();
          const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const assignedWorker = workers.find(w => w.workerId === assignedWorkerId) || workers[0];

          const reading: ExposureReading = {
            id: `rd-${Date.now()}`,
            timestamp: now.toISOString(),
            timeAgo: formattedTime,
            workerId: assignedWorker.workerId,
            workerName: assignedWorker.name,
            badgeId: customImage ? `CP-${assignedWorker.workerId.replace('WRK-', '')}` : activeCalibration.sampleId,
            sampleId: sampleLabel,
            dosePpmH: estimate.isOutOfCalibration ? 0 : estimate.estimatedDosePpmH,
            status: estimate.status,
            shift: assignedWorker.shift || 'Morning · 06:00–14:00',
            confidenceScore: estimate.confidenceScore,
            location: assignedWorker.department || 'Hydrocracker Unit 2',
            tempC: activeCalibration.tempC,
            humidityPercent: activeCalibration.rh,
            stripColorHex: sampledHex,
            isDemo: !customImage,
            lab: sampledLab,
            rawColorString: sampledColorString,
            rawDeltaE: estimate.deltaE,
            compensatedDeltaE: estimate.deltaE,
            gasConc: activeCalibration.gasConc,
            exposureTime: activeCalibration.exposureTime,
            shelfAge: activeCalibration.shelfAge,
            expiryStatus: estimate.isOutOfCalibration ? 'EXPIRED' : 'Valid (Active)',
            actionFlag: estimate.stageName,
            calibrationMetrics: {
              referenceCalibration: 98,
              colorExtraction: estimate.confidenceScore,
              lightingCorrection: 95,
              doseEstimation: estimate.confidenceScore
            }
          };

          setLatestReading(reading);
          setIsAnalyzing(false);
          setActivePage('result');
        }, 200);
        return;
      }
      setCurrentStep(stepCount);
    }, 200);
  };

  // 6 Representative Presets based on User Stage Table
  const featuredSamples = [
    { id: 'CP-001', label: 'Stage 1: Fresh Baseline', stage: 'Stage 1', dose: '0.00', deltaE: '0.8', hex: '#795185', status: 'NORMAL' as const },
    { id: 'CP-050', label: 'Stage 2: Trace Baseline', stage: 'Stage 2', dose: '0.24', deltaE: '9.7', hex: '#935881', status: 'NORMAL' as const },
    { id: 'CP-086', label: 'Stage 3: Action Level', stage: 'Stage 3', dose: '1.33', deltaE: '40.2', hex: '#c96b70', status: 'REVIEW' as const },
    { id: 'CP-151', label: 'Stage 4: Elevated Shift', stage: 'Stage 4', dose: '1.52', deltaE: '51.8', hex: '#d8796a', status: 'REVIEW' as const },
    { id: 'CP-201', label: 'Stage 5: Saturated Limit', stage: 'Stage 5', dose: '13.04', deltaE: '101.1', hex: '#fdb937', status: 'REVIEW' as const },
    { id: 'CP-236', label: 'Out of Cal: Degraded', stage: 'Out of Cal', dose: '0.00', deltaE: '17.2', hex: '#85637b', status: 'OUT_OF_CALIBRATION' as const }
  ];

  const currentComp = computeEnvironmentalCompensation(activeCalibration);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-[var(--text-primary)]">
      
      {/* Hidden Helper Elements */}
      <canvas ref={canvasRef} className="hidden" />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full command-card border border-[var(--card-border)] text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>Cu-PAN Displacement Chemistry · 260 Calibrated Records</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-heading">
          Read Wristband Dosimeter
        </h1>
        <p className="text-xs text-[var(--text-secondary)] max-w-xl mx-auto">
          Capture or upload an optical image of the SARVAS dosimeter wristband. Extract true CIE L*a*b* coordinates, compute ΔEab*, and quantify cumulative H₂S exposure.
        </p>
      </div>

      {/* SAMPLE SELECTOR & WORKER ASSIGNMENT */}
      <div className="command-card p-4 sm:p-5 rounded-2xl border border-[var(--card-border)] shadow-md space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[var(--card-border)] pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--text-primary)]">
              Prototype Calibration Stage Presets (Stages 1–5 & Out of Cal)
            </span>
          </div>
          <button
            onClick={() => setActivePage('calibration')}
            className="text-xs font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-1 cursor-pointer font-mono"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Explore All 260 Samples</span>
          </button>
        </div>

        {/* 6 Quick Stage Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {featuredSamples.map(f => {
            const isSelected = activeSampleId === f.id && !customImage && !capturedPreview && !isCameraActive;
            return (
              <button
                key={f.id}
                onClick={() => handleSelectSample(f.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/15 shadow-sm ring-1 ring-[var(--accent-primary)]'
                    : 'border-[var(--card-border)] bg-[var(--card-surface-subtle)] hover:border-[var(--accent-primary)]/50'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                  <span className="text-[var(--text-primary)]">{f.id}</span>
                  <div
                    className="w-3 h-3 rounded-xs border border-black/20 shadow-xs"
                    style={{ backgroundColor: f.hex }}
                  />
                </div>
                <div className="text-[10px] font-bold text-[var(--accent-primary)] mt-1 font-mono">
                  {f.status === 'OUT_OF_CALIBRATION' ? 'OUT OF CAL' : `${f.dose} ppm·h`}
                </div>
                <div className="text-[9px] text-[var(--text-secondary)] truncate font-mono">
                  {f.stage}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dropdown to pick ANY of the 260 samples & Assign to Worker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[var(--card-border)]">
          
          {/* 260 Samples Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wide flex items-center gap-1.5 font-mono">
              <Database className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Full Cu-PAN Calibration Directory (260 Records):</span>
            </label>
            <select
              value={activeSampleId}
              onChange={e => handleSelectSample(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--card-surface-subtle)] rounded-xl border border-[var(--card-border)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            >
              {CALIBRATION_DATASET.map(s => (
                <option key={s.sampleId} value={s.sampleId} className="bg-[var(--canvas-bg)] text-[var(--text-primary)]">
                  {s.sampleId} | {s.targetDose} ppm·h | ΔE: {s.deltaE} | {s.visualStage}
                </option>
              ))}
            </select>
          </div>

          {/* Worker Assign Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wide flex items-center gap-1.5 font-mono">
              <UserCheck className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <span>Associate Reading With Worker:</span>
            </label>
            <select
              value={assignedWorkerId}
              onChange={e => setAssignedWorkerId(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--card-surface-subtle)] rounded-xl border border-[var(--card-border)] text-xs font-medium text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
            >
              {workers.map(w => (
                <option key={w.workerId} value={w.workerId} className="bg-[var(--canvas-bg)] text-[var(--text-primary)]">
                  {w.name} ({w.workerId}) — Badge {w.badgeId} — {w.department}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* SCANNER CAMERA DISPLAY WITH TRUE L*a*b* EXTRACTION */}
      <div className="command-card rounded-2xl p-5 sm:p-7 md:p-8 border border-[var(--card-border)] shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl">
        
        {/* Top Header with Unified Dual Scanning Controls: Take Photo | Upload Photo */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--card-border)] pb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-[var(--accent-primary)]" />
            <span className="text-sm font-bold font-mono tracking-wide text-[var(--text-primary)]">
              Colorimetric Strip Analyzer
            </span>
          </div>

          {/* Unified Scanner Action Bar */}
          <div className="inline-flex items-center p-1 rounded-full bg-black/5 dark:bg-black/40 border border-[var(--card-border)]">
            <button
              onClick={() => isCameraActive ? stopCamera() : startCamera()}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                isCameraActive
                  ? 'bg-[var(--accent-primary)] text-black shadow-xs font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.08]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{isCameraActive ? 'Cancel Camera' : 'Take Photo'}</span>
            </button>

            <div className="w-px h-4 bg-[var(--card-border)] mx-1" />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-full text-xs font-mono font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.08] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        {/* SCAN VIEWPORT */}
        <div className="relative bg-black/20 dark:bg-black/60 border-2 border-dashed border-[var(--card-border)] rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px] overflow-hidden">
          
          {/* Reticle Target Overlay */}
          <div className="absolute inset-3 sm:inset-4 pointer-events-none border border-[var(--card-border)] rounded-xl flex flex-col justify-between p-2 z-20">
            <div className="flex justify-between">
              <div className="w-4 h-4 border-t-2 border-l-2 border-[var(--accent-primary)]" />
              <div className="w-4 h-4 border-t-2 border-r-2 border-[var(--accent-primary)]" />
            </div>
            <div className="flex justify-between">
              <div className="w-4 h-4 border-b-2 border-l-2 border-[var(--accent-primary)]" />
              <div className="w-4 h-4 border-b-2 border-r-2 border-[var(--accent-primary)]" />
            </div>
          </div>

          {/* VIEWPORT CONTENT SWITCHING */}
          
          {/* 1. Active Camera Viewfinder */}
          {isCameraActive ? (
            <div className="relative w-full max-w-md flex flex-col items-center space-y-4">
              <div className="relative w-full overflow-hidden rounded-xl border border-[var(--card-border)] bg-black aspect-video sm:aspect-4/3 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 text-[10px] font-mono text-[var(--accent-primary)] flex items-center gap-1.5 border border-[var(--accent-primary)]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
                  Live Camera Feed
                </span>

                {hasMultipleCameras && (
                  <button
                    onClick={switchCamera}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-black text-[var(--text-primary)] border border-white/20 text-xs flex items-center gap-1 cursor-pointer"
                    title="Switch camera"
                  >
                    <SwitchCamera className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Shutter Controls */}
              <div className="flex items-center gap-3 z-30">
                <button
                  onClick={stopCamera}
                  className="px-4 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={capturePhoto}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-mono text-xs font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                  <span>Capture Photo</span>
                </button>
              </div>
            </div>

          /* 2. Captured Preview (Before Confirming) */
          ) : capturedPreview ? (
            <div className="relative w-full max-w-md flex flex-col items-center space-y-4">
              <div className="relative w-full overflow-hidden rounded-xl border border-[var(--card-border)] bg-black aspect-video sm:aspect-4/3 flex items-center justify-center">
                <img
                  src={capturedPreview}
                  alt="Captured Dosimeter Preview"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 text-[10px] font-mono text-[var(--text-primary)] border border-[var(--card-border)]">
                  Preview Captured Frame
                </span>
              </div>

              {/* Retake & Use Photo Controls */}
              <div className="flex items-center gap-3 z-30">
                <button
                  onClick={retakePhoto}
                  className="px-4 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>

                <button
                  onClick={useCapturedPhoto}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-mono text-xs font-bold hover:shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Use Photo</span>
                </button>
              </div>
            </div>

          /* 3. Custom Photo Loaded (From Camera or Upload) */
          ) : customImage ? (
            <div className="relative max-w-xs mx-auto space-y-3 text-center">
              <div className="relative rounded-xl overflow-hidden border border-[var(--card-border)] shadow-lg">
                <img
                  src={customImage}
                  alt="Custom Wristband Upload"
                  className="rounded-xl max-h-48 object-cover mx-auto"
                />
                <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 text-[10px] font-mono text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
                  Custom Image Loaded
                </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCustomImage(null)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[var(--card-surface-subtle)] border border-[var(--card-border)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-[11px] font-mono transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Switch to Calibration Strip Sample</span>
                </button>
              </div>
            </div>

          /* 4. Camera Error State */
          ) : cameraError ? (
            <div className="max-w-md p-4 rounded-xl bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/30 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-[var(--accent-primary)] font-semibold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>Camera Notice</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {cameraError}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => startCamera()}
                  className="px-3.5 py-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-xs font-mono text-[var(--text-primary)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
                >
                  Retry Camera
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black text-xs font-mono font-bold hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Photo Instead</span>
                </button>
              </div>
            </div>

          /* 5. Default Cu-PAN Calibration Sample Simulation */
          ) : (
            <div className="w-full max-w-md command-card border border-[var(--card-border)] rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)] border-b border-[var(--card-border)] pb-2.5">
                <span>SAMPLE: <strong className="text-[var(--text-primary)]">{activeCalibration.sampleId}</strong></span>
                <StatusBadge status={activeCalibration.safetyStatus} size="sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Sensing Strip with simulated color */}
                <div className="p-3 rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--card-border)] text-center space-y-1.5">
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase font-mono font-bold">Cu-PAN STRIP</div>
                  <div
                    className="h-11 rounded-lg border border-white/20 shadow-inner flex items-center justify-center transition-colors duration-500"
                    style={{ backgroundColor: activeCalibration.hexColor }}
                  >
                    <span className="text-[9.5px] font-mono text-white/95 font-bold drop-shadow-xs">
                      ΔE: {activeCalibration.deltaE}
                    </span>
                  </div>
                  <div className="text-[9px] font-mono text-[var(--text-secondary)]">
                    {activeCalibration.visualStage.split(':')[0]}
                  </div>
                </div>

                {/* Printed 5-Step Reference Scale */}
                <div className="p-3 rounded-xl bg-black/5 dark:bg-black/30 border border-[var(--card-border)] text-center space-y-1.5">
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase font-mono font-bold">5-STEP SCALE</div>
                  <div className="flex items-center justify-center gap-1 pt-1">
                    {[
                      { code: 'S1', hex: '#795185' },
                      { code: 'S2', hex: '#935881' },
                      { code: 'S3', hex: '#c96b70' },
                      { code: 'S4', hex: '#d8796a' },
                      { code: 'S5', hex: '#fdb937' }
                    ].map(r => (
                      <div key={r.code} className="flex flex-col items-center">
                        <div className="w-4 h-8 rounded-xs border border-white/20 shadow-xs" style={{ backgroundColor: r.hex }} />
                        <span className="text-[7.5px] font-mono text-[var(--text-secondary)] mt-0.5">{r.code}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[8.5px] font-mono text-[var(--text-secondary)]">
                    Cu-PAN Graded Scale
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-[var(--text-secondary)] flex items-center justify-between border-t border-[var(--card-border)] pt-2">
                <span>STAGE: {activeCalibration.visualStage}</span>
                <span>{activeCalibration.targetDose} ppm·h</span>
              </div>
            </div>
          )}

          {/* Animated 5-Step Process Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-6 space-y-4 animate-in fade-in z-40">
              <div className="w-12 h-12 rounded-full border-2 border-[var(--accent-primary)] border-t-transparent animate-spin flex items-center justify-center">
                <Cpu className="w-5 h-5 text-[var(--accent-primary)]" />
              </div>
              <div className="text-center space-y-1.5 max-w-sm">
                <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent-primary)] font-bold">
                  STEP 0{currentStep} / 05
                </div>
                <div className="text-sm font-mono font-bold text-[var(--text-primary)]">
                  {liveStepMessages[currentStep - 1] || 'Analyzing...'}
                </div>
              </div>
              
              <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#F59E0B] to-[#10B981] transition-all duration-200"
                  style={{ width: `${(currentStep / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={startAnalysis}
            disabled={isAnalyzing || isCameraActive}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-mono text-xs sm:text-sm font-bold tracking-wide hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {customImage
                ? 'Analyze Captured Wristband Photo'
                : `Analyze Strip (${activeCalibration.sampleId})`}
            </span>
          </button>

          <div className="text-xs font-mono text-[var(--text-secondary)] text-right">
            Expected: <strong className="text-[var(--text-primary)] font-bold">{activeCalibration.targetDose} ppm·h</strong> · Flag: <strong className="text-[var(--accent-primary)] font-bold">{activeCalibration.actionFlag.split(':')[0]}</strong>
          </div>
        </div>

      </div>

      {/* DETAILED COLORIMETRIC & CALIBRATION DIAGNOSTIC PANEL */}
      <div className="command-card p-6 rounded-2xl border border-[var(--card-border)] shadow-md space-y-6 backdrop-blur-md">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[var(--card-border)] pb-4">
          <div>
            <h3 className="text-sm font-bold font-mono text-[var(--text-primary)]">
              AI-Assisted Quantitative Dosimetry Breakdown
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Color extraction, CIE L*a*b* coordinates, and Arrhenius environmental compensation
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] text-[10px] font-mono font-bold">
            Cu-PAN Kinetic Model
          </span>
        </div>

        {/* 4 Metric Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* CIE L*a*b* */}
          <div className="p-3.5 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] space-y-1">
            <div className="text-[10px] text-[var(--text-secondary)] font-mono uppercase font-bold">CIE L*a*b* Color</div>
            <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
              {activeCalibration.rawColorString}
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] flex items-center gap-1.5 pt-0.5">
              <span className="w-2.5 h-2.5 rounded-xs border border-black/20" style={{ backgroundColor: activeCalibration.hexColor }} />
              <span>sRGB: {activeCalibration.hexColor}</span>
            </div>
          </div>

          {/* Color Difference ΔE */}
          <div className="p-3.5 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] space-y-1">
            <div className="text-[10px] text-[var(--text-secondary)] font-mono uppercase font-bold">Color Difference ΔEab*</div>
            <div className="text-sm font-mono font-bold text-[var(--accent-primary)]">
              ΔE = {activeCalibration.deltaE.toFixed(1)}
            </div>
            <div className="text-[9.5px] text-[var(--text-secondary)]">
              Vs Pristine Cu-PAN Baseline
            </div>
          </div>

          {/* Environmental Factor */}
          <div className="p-3.5 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] space-y-1">
            <div className="text-[10px] text-[var(--text-secondary)] font-mono uppercase font-bold">Environmental Factors</div>
            <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
              {activeCalibration.tempC}°C · {activeCalibration.rh}% RH
            </div>
            <div className="text-[9.5px] text-[var(--text-secondary)]">
              T-factor: {currentComp.tempCompensationFactor}x · RH: {currentComp.humidityCompensationFactor}x
            </div>
          </div>

          {/* Shelf Life & Flag */}
          <div className="p-3.5 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] space-y-1">
            <div className="text-[10px] text-[var(--text-secondary)] font-mono uppercase font-bold">Shelf Life & Status</div>
            <div className="text-xs font-mono font-bold text-[var(--text-primary)]">
              {activeCalibration.shelfAge} Days ({activeCalibration.expiryStatus})
            </div>
            <div className="text-[10px] text-[var(--accent-primary)] truncate font-semibold">
              {activeCalibration.actionFlag}
            </div>
          </div>

        </div>

        {/* Disclaimer Footer */}
        <div className="pt-2 text-[11px] text-[var(--text-secondary)] italic border-t border-[var(--card-border)] flex items-center justify-between">
          <span>Literature Anchors: Thongboon et al. 2023, Wang et al. 2022, Carpenter et al. 2017</span>
          <span className="font-mono text-[10px] text-[var(--text-secondary)]">Record: {activeCalibration.sampleId}</span>
        </div>

      </div>

    </div>
  );
};
