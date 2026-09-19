import React, { useState } from 'react';
import type { Worker } from '../types/mobile';
import { repository } from '../services/DosimeterRepository';
import {
  Scan,
  UserCheck,
  Camera,
  Activity,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileCheck2,
  Check
} from 'lucide-react';

interface KioskModeViewProps {
  onBack: () => void;
  onOpenScanModal: () => void;
}

export const KioskModeView: React.FC<KioskModeViewProps> = ({ onBack, onOpenScanModal }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const workers = repository.getWorkers();

  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(workers[0]?.workerId || 'WRK-1002');
  const [selectedPreset, setSelectedPreset] = useState<'normal' | 'monitor' | 'review'>('monitor');
  const [shiftTime, setShiftTime] = useState('Morning (06:00–14:00)');

  const activeWorker = workers.find(w => w.workerId === selectedWorkerId) || workers[0];

  const PRESETS = {
    normal: {
      dose: 0.18,
      status: 'NORMAL' as const,
      deltaE: 8.2,
      hex: '#B8728A',
      directive: 'Normal baseline reading. Safe to resume plant operations.'
    },
    monitor: {
      dose: 0.68,
      status: 'MONITOR' as const,
      deltaE: 28.4,
      hex: '#7A5B43',
      directive: 'Action Level Reached. Rotate out of active SRU battery to low-risk sector.'
    },
    review: {
      dose: 1.48,
      status: 'REVIEW' as const,
      deltaE: 64.8,
      hex: '#3D2B1F',
      directive: 'CRITICAL OVEREXPOSURE (> 1.00 ppm·h). Suspend shift immediately.'
    }
  };

  const currentDoseConfig = PRESETS[selectedPreset];

  const handleCompleteShift = () => {
    repository.saveReading({
      workerId: activeWorker.workerId,
      workerName: activeWorker.name,
      bandId: activeWorker.assignedBandId,
      shiftId: shiftTime,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedDose: currentDoseConfig.dose,
      status: currentDoseConfig.status,
      confidence: 97,
      temperature: 28,
      humidity: 55,
      isSimulated: true,
      scanType: 'PERSONAL_WORKER_SCAN',
      deltaE: currentDoseConfig.deltaE,
      rgb: { r: 120, g: 90, b: 65, hex: currentDoseConfig.hex },
      inspectionLocation: 'Sulfur Recovery Unit (Kiosk)'
    });
    setCurrentStep(4);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-[#71806B] uppercase tracking-wider font-semibold block">
            Field Kiosk Simulation
          </span>
          <h1 className="text-xl font-serif font-bold text-[#292925]">
            Shift Dosimetry Kiosk
          </h1>
        </div>
        <button
          onClick={onBack}
          className="px-2.5 py-1 rounded-lg border border-[#D8D0C2] bg-white text-xs font-semibold text-[#292925]"
        >
          Exit Kiosk
        </button>
      </div>

      {/* 4-Step Tracker Bar */}
      <div className="grid grid-cols-4 gap-1 bg-[#EDE5D6] p-1.5 rounded-xl border border-[#D8D0C2] text-center">
        {[
          { step: 1, label: 'Start' },
          { step: 2, label: 'Scan' },
          { step: 3, label: 'Dose' },
          { step: 4, label: 'Close' }
        ].map(item => (
          <button
            key={item.step}
            onClick={() => setCurrentStep(item.step as any)}
            className={`py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all ${
              currentStep === item.step
                ? 'bg-[#292925] text-white shadow-xs'
                : currentStep > item.step
                ? 'bg-[#4F5D4B]/20 text-[#2F6B38]'
                : 'text-gray-500'
            }`}
          >
            {item.step}. {item.label}
          </button>
        ))}
      </div>

      {/* STEP 1: START SHIFT */}
      {currentStep === 1 && (
        <div className="card-glow p-4 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-[#292925] flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              1. Select Operator & Shift
            </span>
            <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
              CHECK-IN
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-700 block">Operator Arriving:</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {workers.map(w => {
                const isSelected = w.workerId === selectedWorkerId;
                return (
                  <div
                    key={w.workerId}
                    onClick={() => setSelectedWorkerId(w.workerId)}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#EDE5D6] border-[#4F5D4B] font-bold text-[#292925]'
                        : 'bg-white border-[#D8D0C2] text-gray-700'
                    }`}
                  >
                    <div>
                      <div>{w.name}</div>
                      <div className="text-[9px] font-mono text-gray-500">{w.workerId} · Badge #{w.assignedBandId}</div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-700" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full py-3 bg-[#292925] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-98"
            >
              <span>Proceed to Scan Wristband</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SCAN WRISTBAND */}
      {currentStep === 2 && (
        <div className="card-glow p-4 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-[#292925] flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-700" />
              2. Optical Dosimeter Scan
            </span>
            <span className="text-[9px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
              SCANNING
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs flex items-center justify-between">
            <div>
              <div className="font-bold text-[#292925]">{activeWorker.name}</div>
              <div className="text-[10px] text-gray-500 font-mono">Badge #{activeWorker.assignedBandId}</div>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">Gemini AI Active</span>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-700 block">Select Optical Test Sample:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'monitor', 'review'] as const).map(key => {
                const sample = PRESETS[key];
                const isSelected = selectedPreset === key;
                return (
                  <div
                    key={key}
                    onClick={() => setSelectedPreset(key)}
                    className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-emerald-600 ring-2 ring-emerald-600 shadow-sm'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full mx-auto mb-1 border border-gray-300"
                      style={{ backgroundColor: sample.hex }}
                    />
                    <div className="font-mono text-[10px] font-bold uppercase">{key}</div>
                    <div className="text-[9px] font-mono text-gray-500">{sample.dose} ppm·h</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setCurrentStep(1)}
              className="py-2.5 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="flex-1 py-2.5 bg-[#4F5D4B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Analyze & Compute Dose</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DOSE READING */}
      {currentStep === 3 && (
        <div className="card-glow p-4 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-[#292925] flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-700" />
              3. Color-to-Dose Assessment
            </span>
            <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
              currentDoseConfig.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' : currentDoseConfig.status === 'MONITOR' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
            }`}>
              {currentDoseConfig.status}
            </span>
          </div>

          <div className="text-center p-4 bg-white rounded-2xl border border-gray-200 space-y-1">
            <div className="text-[10px] font-mono uppercase text-gray-500 font-bold">Estimated Exposure</div>
            <div className="text-3xl font-mono font-bold text-[#292925]">
              {currentDoseConfig.dose.toFixed(2)} <span className="text-xs font-serif text-gray-500">ppm·h</span>
            </div>
            <div className="text-[10px] font-mono text-emerald-700 font-bold">
              ΔE₀₀ = {currentDoseConfig.deltaE.toFixed(1)} (97% Confidence)
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs">
            <div className="font-bold text-[#292925] mb-0.5">Mandated Safety Action:</div>
            <p className="text-gray-600 text-[11px] leading-relaxed">{currentDoseConfig.directive}</p>
          </div>

          <div className="flex gap-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setCurrentStep(2)}
              className="py-2.5 px-3 rounded-xl border border-gray-200 bg-white text-xs font-semibold"
            >
              Re-Scan
            </button>
            <button
              onClick={handleCompleteShift}
              className="flex-1 py-2.5 bg-[#292925] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Confirm & Close Shift</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: CLOSE SHIFT */}
      {currentStep === 4 && (
        <div className="card-glow p-4 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              4. Shift Logged & Synced
            </span>
            <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
              COMPLETE
            </span>
          </div>

          <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-300 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#292925]">{activeWorker.name}</span>
              <span className="font-mono text-emerald-800 font-bold">{currentDoseConfig.dose} ppm·h</span>
            </div>
            <div className="text-[10px] font-mono text-gray-500 space-y-0.5">
              <div>Badge ID: {activeWorker.assignedBandId}</div>
              <div>Audit Serial: OSHA-LOG-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div>Logged to Plant Safety Officer Mira Patel's Dashboard</div>
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(1)}
            className="w-full py-3 bg-[#4F5D4B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Kiosk for Next Worker</span>
          </button>
        </div>
      )}

    </div>
  );
};
