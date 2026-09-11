import React from 'react';
import type { ExposureStatus, DemoSampleBadge, Reading } from '../../types/mobile';
import { CalibrationResult } from '../../services/CalibrationEngine';
import { repository } from '../../services/DosimeterRepository';
import { useMobileAuth } from '../../context/MobileAuthContext';
import { ShieldAlert, ShieldCheck, AlertCircle, Check, RotateCcw, Thermometer, Droplets, Clock, Tag } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  result: CalibrationResult;
  sample?: DemoSampleBadge | null;
  imageUri?: string | null;
  onSaveComplete: (savedReading: Reading) => void;
  onRetake: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  result,
  sample,
  imageUri,
  onSaveComplete,
  onRetake
}) => {
  const { currentUser } = useMobileAuth();

  if (!isOpen) return null;

  const bandId = sample?.bandId || (currentUser?.workerId ? repository.getWorkerById(currentUser.workerId)?.assignedBandId : 'DS-1088') || 'DS-1088';
  const workerId = currentUser?.workerId || sample?.workerId || 'WRK-2048';
  const workerName = currentUser?.name || sample?.workerName || 'Rahul Shetty';

  const handleSave = () => {
    const saved = repository.saveReading({
      workerId,
      workerName,
      bandId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      shiftId: 'SH-MORNING',
      estimatedDose: result.estimatedDose,
      status: result.status,
      confidence: result.confidence,
      temperature: result.temperature,
      humidity: result.humidity,
      isSimulated: true,
      notes: result.notes,
      imageUri: imageUri || undefined,
      deltaE: result.deltaE,
      expiryWarning: result.expiryWarning,
      actionRecommendation: result.actionRecommendation
    });

    onSaveComplete(saved);
  };

  const getStatusBadge = (status: ExposureStatus, isExpired: boolean) => {
    if (isExpired) {
      return (
        <span className="px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider bg-[#9A6258]/20 text-[#7A342B] border border-[#9A6258]/40">
          REJECTED (EXPIRED)
        </span>
      );
    }
    switch (status) {
      case 'NORMAL':
        return (
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider bg-[#5A7456]/20 text-[#385034] border border-[#5A7456]/40">
            NORMAL
          </span>
        );
      case 'MONITOR':
        return (
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider bg-[#B08A55]/25 text-[#795726] border border-[#B08A55]/50">
            MONITOR
          </span>
        );
      case 'REVIEW':
        return (
          <span className="px-3 py-1 rounded-md text-xs font-mono font-bold tracking-wider bg-[#9A6258]/20 text-[#7A342B] border border-[#9A6258]/40">
            REVIEW
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F1E7] overflow-y-auto flex flex-col justify-between p-5 max-w-md mx-auto">
      {/* Header */}
      <div className="pt-3 pb-2 border-b border-[#D8D0C2]">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[#71806B] font-semibold">
          AI-Assisted Colorimetric Result
        </span>
        <h2 className="text-xl font-serif font-bold text-[#292925]">
          Exposure Estimation
        </h2>
      </div>

      {/* Main Content Area */}
      <div className="py-4 space-y-4">
        {/* Expiry Alert Warning if Expired */}
        {result.isExpired && (
          <div className="bg-[#9A6258]/15 border border-[#9A6258] rounded-xl p-3.5 text-[#7A342B]">
            <div className="flex items-center gap-2 font-semibold text-sm mb-1">
              <AlertCircle className="w-5 h-5 shrink-0" />
              BADGE EXPIRED
            </div>
            <p className="text-xs leading-relaxed">
              Reading rejected because the sensing chemistry may have degraded (Shelf age &gt; 90 days). Re-issue fresh wristband immediately.
            </p>
          </div>
        )}

        {/* Primary Dose Card */}
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-2xl p-5 text-center shadow-xs">
          <span className="text-[11px] font-mono tracking-widest uppercase text-[#5D5B53] font-medium block mb-2">
            Estimated Cumulative Exposure
          </span>

          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-5xl font-mono font-bold text-[#292925] tracking-tight">
              {result.estimatedDose.toFixed(2)}
            </span>
            <span className="text-base font-serif text-[#5D5B53]">
              ppm·h
            </span>
          </div>

          <div className="mb-4">
            {getStatusBadge(result.status, result.isExpired)}
          </div>

          <div className="border-t border-[#D8D0C2] pt-3 text-xs text-[#5D5B53] leading-relaxed">
            {result.actionRecommendation}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#5D5B53] mb-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Band ID</span>
            </div>
            <div className="font-mono font-bold text-sm text-[#292925]">
              {bandId}
            </div>
          </div>

          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#5D5B53] mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Confidence</span>
            </div>
            <div className="font-mono font-bold text-sm text-[#292925]">
              {result.confidence}%
            </div>
          </div>

          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#5D5B53] mb-1">
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temperature</span>
            </div>
            <div className="font-mono font-bold text-sm text-[#292925]">
              {result.temperature}°C
            </div>
          </div>

          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs text-[#5D5B53] mb-1">
              <Droplets className="w-3.5 h-3.5" />
              <span>Humidity</span>
            </div>
            <div className="font-mono font-bold text-sm text-[#292925]">
              {result.humidity}%
            </div>
          </div>
        </div>

        {/* Worker and Shift Info */}
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-[#5D5B53]">Worker:</span>
            <span className="font-medium text-[#292925]">{workerName} ({workerId})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5D5B53]">Shift:</span>
            <span className="font-medium text-[#292925]">Morning · 06:00–14:00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#5D5B53]">Reference ΔE:</span>
            <span className="font-mono text-[#292925]">ΔE*ab {result.deltaE.toFixed(1)}</span>
          </div>
        </div>

        {/* Prototype Honesty Notice */}
        <div className="p-2.5 bg-[#F6F1E7] border border-dashed border-[#D8D0C2] rounded-lg text-center">
          <span className="text-[10px] font-mono text-[#878377] uppercase tracking-wider block">
            SIMULATED / PROTOTYPE READING
          </span>
          <p className="text-[11px] text-[#5D5B53] mt-0.5">
            Derived from prototype calibration mapping. Phone reads optical color response, not ambient gas directly.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 pb-4 space-y-2">
        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-[#292925] text-[#F6F1E7] rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#1a1a17] active:scale-[0.98] transition-all shadow-md font-semibold"
        >
          <Check className="w-4 h-4" />
          Save Reading to Log
        </button>

        <button
          onClick={onRetake}
          className="w-full py-2.5 bg-[#EDE5D6] text-[#5D5B53] border border-[#D8D0C2] rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retake / Discard
        </button>
      </div>
    </div>
  );
};
