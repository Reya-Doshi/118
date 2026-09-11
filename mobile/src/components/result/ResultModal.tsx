import React from 'react';
import type { ExposureStatus, DemoSampleBadge, Reading, Worker } from '../../types/mobile';
import { CalibrationResult } from '../../services/CalibrationEngine';
import { repository } from '../../services/DosimeterRepository';
import { useMobileAuth } from '../../context/MobileAuthContext';
import { ShieldAlert, ShieldCheck, AlertCircle, Check, RotateCcw, Thermometer, Droplets, Clock, Tag, MapPin, UserCheck } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  result: CalibrationResult;
  sample?: DemoSampleBadge | null;
  imageUri?: string | null;
  targetWorker?: Worker | null;
  inspectionLocation?: string;
  officerNotes?: string;
  onSaveComplete: (savedReading: Reading) => void;
  onRetake: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  result,
  sample,
  imageUri,
  targetWorker,
  inspectionLocation,
  officerNotes,
  onSaveComplete,
  onRetake
}) => {
  const { currentUser, role } = useMobileAuth();

  if (!isOpen) return null;

  const isWorkerRole = role === 'WORKER';
  const resolvedWorker = targetWorker || (currentUser?.workerId ? repository.getWorkerById(currentUser.workerId) : null) || repository.getWorkers()[0];
  const bandId = sample?.bandId || resolvedWorker.assignedBandId || 'DS-1088';
  const workerId = resolvedWorker.workerId;
  const workerName = resolvedWorker.name;

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
      scanType: isWorkerRole ? 'PERSONAL_WORKER_SCAN' : 'OFFICER_FIELD_AUDIT',
      inspectionLocation: inspectionLocation || resolvedWorker.workLocation,
      officerNotes: isWorkerRole ? undefined : officerNotes,
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
      <div className="pt-2 pb-2 border-b border-[#D8D0C2]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#71806B] font-semibold">
            {isWorkerRole ? 'Personal Dosimeter Result' : 'Field Audit Inspection Result'}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
            isWorkerRole ? 'bg-[#5A7456]/20 text-[#385034]' : 'bg-[#B08A55]/20 text-[#795726]'
          }`}>
            {isWorkerRole ? 'OPERATOR SCAN' : 'INSPECTOR AUDIT'}
          </span>
        </div>
        <h2 className="text-xl font-serif font-bold text-[#292925]">
          Exposure Estimation
        </h2>
      </div>

      {/* Main Content */}
      <div className="py-3 space-y-3.5">
        {/* Expiry Warning */}
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

          <div className="mb-3">
            {getStatusBadge(result.status, result.isExpired)}
          </div>

          <div className="border-t border-[#D8D0C2] pt-3 text-xs text-[#5D5B53] leading-relaxed">
            {result.actionRecommendation}
          </div>
        </div>

        {/* Worker & Location Details */}
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium text-[#292925]">
              <UserCheck className="w-4 h-4 text-[#71806B]" />
              <span>{workerName} ({workerId})</span>
            </div>
            <span className="font-mono font-bold bg-[#F6F1E7] px-2 py-0.5 rounded border border-[#D8D0C2]">
              {bandId}
            </span>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-[#5D5B53] pt-1 border-t border-[#D8D0C2]/50">
            <MapPin className="w-3.5 h-3.5 text-[#71806B] shrink-0 mt-0.5" />
            <span>{inspectionLocation || resolvedWorker.workLocation}</span>
          </div>

          {officerNotes && (
            <div className="bg-[#F6F1E7] p-2 rounded-lg border border-[#D8D0C2] text-[11px] text-[#5D5B53] italic">
              Officer Note: "{officerNotes}"
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-2.5">
            <span className="text-[10px] text-[#5D5B53] font-mono block">Confidence</span>
            <span className="font-mono font-bold text-sm text-[#292925]">{result.confidence}%</span>
          </div>

          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-2.5">
            <span className="text-[10px] text-[#5D5B53] font-mono block">Temperature</span>
            <span className="font-mono font-bold text-sm text-[#292925]">{result.temperature}°C</span>
          </div>

          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-2.5">
            <span className="text-[10px] text-[#5D5B53] font-mono block">Relative Hum</span>
            <span className="font-mono font-bold text-sm text-[#292925]">{result.humidity}%</span>
          </div>
        </div>

        {/* Honest Disclaimer */}
        <div className="p-2.5 bg-[#F6F1E7] border border-dashed border-[#D8D0C2] rounded-lg text-center">
          <span className="text-[10px] font-mono text-[#878377] uppercase tracking-wider block">
            SIMULATED / PROTOTYPE READING
          </span>
          <p className="text-[11px] text-[#5D5B53] mt-0.5">
            AI-assisted colorimetric analysis · Corrected for illuminant & temperature.
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
          {isWorkerRole ? 'Save to My Shift Log' : 'Log Officer Inspection'}
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
