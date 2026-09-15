import React from 'react';
import type { ExposureStatus, DemoSampleBadge, Reading, Worker, BackendAnalyzeResponse } from '../../types/mobile';
import { repository } from '../../services/DosimeterRepository';
import { useMobileAuth } from '../../context/MobileAuthContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  RotateCcw, 
  Thermometer, 
  Droplets, 
  Clock, 
  Tag, 
  MapPin, 
  UserCheck,
  Palette,
  Layers,
  Sparkles
} from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  apiResult?: BackendAnalyzeResponse | null;
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
  apiResult,
  sample,
  imageUri,
  targetWorker,
  inspectionLocation,
  officerNotes,
  onSaveComplete,
  onRetake
}) => {
  const { currentUser, role } = useMobileAuth();

  if (!isOpen || !apiResult) return null;

  const isWorkerRole = role === 'WORKER';
  const resolvedWorker = targetWorker || (currentUser?.workerId ? repository.getWorkerById(currentUser.workerId) : null) || repository.getWorkers()[0];
  const bandId = sample?.bandId || resolvedWorker?.assignedBandId || 'DS-1088';
  const workerId = resolvedWorker?.workerId || 'EMP-9021';
  const workerName = resolvedWorker?.name || 'Worker';

  const isExpired = Boolean(apiResult.shelf_age_days > 90 || (apiResult.status === 'REVIEW' && apiResult.action_guideline?.includes('expired')));

  const handleSave = () => {
    const saved = repository.saveReading({
      workerId,
      workerName,
      bandId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      shiftId: 'SH-MORNING',
      estimatedDose: apiResult.estimated_exposure_ppm_h,
      status: apiResult.status,
      confidence: Math.round((apiResult.confidence?.score ?? 0.95) * 100),
      confidenceInterval: `±${apiResult.confidence?.uncertainty_95_ci_ppm_h ?? 0.3} ppm·h`,
      temperature: apiResult.temperature,
      humidity: apiResult.humidity,
      isSimulated: true,
      scanType: isWorkerRole ? 'PERSONAL_WORKER_SCAN' : 'OFFICER_FIELD_AUDIT',
      inspectionLocation: inspectionLocation || resolvedWorker?.workLocation,
      officerNotes: isWorkerRole ? undefined : officerNotes,
      notes: `ML Model: ${apiResult.vision_engine || 'Random Forest Regressor'}`,
      imageUri: imageUri || undefined,
      rgb: apiResult.rgb,
      lab: apiResult.lab,
      deltaE: apiResult.delta_e,
      visionEngine: apiResult.vision_engine,
      expiryWarning: isExpired ? 'Band exceeded 90-day chemical shelf-life limit.' : undefined,
      actionRecommendation: apiResult.action_guideline
    });

    onSaveComplete(saved);
  };

  const getStatusBadge = (status: ExposureStatus, expired: boolean) => {
    if (expired) {
      return (
        <span className="px-3.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider bg-[#9A6258]/25 text-[#7A342B] border border-[#9A6258]/50">
          REJECTED (EXPIRED)
        </span>
      );
    }
    switch (status) {
      case 'NORMAL':
        return (
          <span className="px-3.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider bg-[#5A7456]/20 text-[#385034] border border-[#5A7456]/40">
            NORMAL
          </span>
        );
      case 'MONITOR':
        return (
          <span className="px-3.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider bg-[#B08A55]/25 text-[#795726] border border-[#B08A55]/50">
            MONITOR
          </span>
        );
      case 'REVIEW':
        return (
          <span className="px-3.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider bg-[#9A6258]/20 text-[#7A342B] border border-[#9A6258]/40">
            REVIEW
          </span>
        );
    }
  };

  const timestampDisplay = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 bg-[#F6F1E7] overflow-y-auto flex flex-col justify-between p-4 max-w-md mx-auto text-[#292925]">
      {/* Header */}
      <div className="pt-2 pb-2 border-b border-[#D8D0C2]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#71806B] font-bold">
            {isWorkerRole ? 'Personal Dosimeter Result' : 'Field Audit Inspection Result'}
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
            isWorkerRole ? 'bg-[#5A7456]/20 text-[#385034]' : 'bg-[#B08A55]/20 text-[#795726]'
          }`}>
            {isWorkerRole ? 'OPERATOR SCAN' : 'INSPECTOR AUDIT'}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <h2 className="text-xl font-serif font-bold text-[#292925]">
            Exposure Estimation
          </h2>
          <span className="text-[10px] font-mono text-[#5D5B53] flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#71806B]" /> {timestampDisplay}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-2.5 space-y-3">
        {/* Expiry Warning */}
        {isExpired && (
          <div className="bg-[#9A6258]/15 border border-[#9A6258] rounded-xl p-3 text-[#7A342B]">
            <div className="flex items-center gap-2 font-bold text-xs mb-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              BAND EXPIRED (&gt;90 DAYS)
            </div>
            <p className="text-[11px] leading-relaxed">
              Reading rejected because the sensing chemistry may have degraded. Re-issue fresh wristband immediately.
            </p>
          </div>
        )}

        {/* Primary Dose Card with Dynamic Status Glow */}
        <div className={`p-4 text-center rounded-2xl ${
          isExpired || apiResult.status === 'REVIEW'
            ? 'card-glow-review'
            : apiResult.status === 'MONITOR'
            ? 'card-glow-monitor'
            : 'card-glow-safe'
        }`}>
          <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500 font-bold block mb-1">
            Estimated Cumulative H₂S Exposure
          </span>

          <div className="flex items-baseline justify-center gap-1.5 my-1">
            <span className="text-5xl font-mono font-bold text-gray-900 tracking-tight">
              {apiResult.estimated_exposure_ppm_h.toFixed(2)}
            </span>
            <span className="text-base font-serif text-gray-600 font-medium">
              ppm·h
            </span>
          </div>

          <div className="my-2">
            {getStatusBadge(apiResult.status, isExpired)}
          </div>

          <div className="border-t border-gray-100 pt-2 text-xs text-gray-600 leading-relaxed font-medium">
            {apiResult.action_guideline || (
              apiResult.status === 'NORMAL' 
                ? 'Safe working level. Within permissible 8-hr exposure limits.'
                : apiResult.status === 'MONITOR'
                ? 'Action level reached. Limit further exposure and verify area ventilation.'
                : 'Permissible exposure limit exceeded. Prompt medical triage and evacuation.'
            )}
          </div>
        </div>

        {/* Actionable Precautionary Directives (Mandatory SOP) */}
        {apiResult.precautions && apiResult.precautions.length > 0 && (
          <div className="card-glow p-3.5 space-y-2 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Mandatory Safety SOP Directives
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                Action Required
              </span>
            </div>
            <ul className="space-y-1.5 pt-0.5">
              {apiResult.precautions.map((precaution, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-gray-700 leading-snug">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{precaution}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Worker, Band ID & Location */}
        <div className="card-glow p-3 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium text-gray-900">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="font-bold">{workerName}</span>
              <span className="text-gray-500 text-[11px]">({workerId})</span>
            </div>
            <span className="font-mono font-bold text-[11px] bg-gray-50 px-2 py-0.5 rounded border border-gray-200 text-gray-800">
              Band: {bandId}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-gray-600 pt-1 border-t border-gray-100">
            <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
            <span className="truncate">{inspectionLocation || resolvedWorker?.workLocation}</span>
          </div>

          {officerNotes && (
            <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 text-[11px] text-gray-700 italic">
              Note: "{officerNotes}"
            </div>
          )}
        </div>

        {/* Colorimetric Scientific Metrics Grid (RGB, Lab, Delta E) */}
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-[#D8D0C2]/60 pb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase text-[#71806B] flex items-center gap-1">
              <Palette className="w-3 h-3 text-[#71806B]" /> Colorimetric Parameters
            </span>
            <span className="text-[10px] font-mono text-[#5D5B53]">Cu-PAN Chelation Matrix</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            {/* RGB */}
            <div className="bg-[#F6F1E7] border border-[#D8D0C2] rounded-lg p-2 flex flex-col items-center justify-center">
              <span className="text-[9px] text-[#5D5B53] font-mono uppercase">Extracted RGB</span>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className="w-3 h-3 rounded-full border border-black/20 shrink-0 shadow-xs"
                  style={{ backgroundColor: apiResult.rgb.hex }}
                />
                <span className="font-mono text-[10px] font-bold text-[#292925]">{apiResult.rgb.hex}</span>
              </div>
              <span className="text-[9px] font-mono text-[#878377] mt-0.5">
                ({apiResult.rgb.r}, {apiResult.rgb.g}, {apiResult.rgb.b})
              </span>
            </div>

            {/* CIE Lab */}
            <div className="bg-[#F6F1E7] border border-[#D8D0C2] rounded-lg p-2 flex flex-col items-center justify-center">
              <span className="text-[9px] text-[#5D5B53] font-mono uppercase">CIE L*a*b*</span>
              <span className="font-mono text-[10px] font-bold text-[#292925] mt-0.5">
                {apiResult.lab.L.toFixed(1)}, {apiResult.lab.a.toFixed(1)}
              </span>
              <span className="text-[9px] font-mono text-[#878377] mt-0.5">
                b* = {apiResult.lab.b.toFixed(1)}
              </span>
            </div>

            {/* Delta E */}
            <div className="bg-[#F6F1E7] border border-[#D8D0C2] rounded-lg p-2 flex flex-col items-center justify-center">
              <span className="text-[9px] text-[#5D5B53] font-mono uppercase">Color Diff (ΔE)</span>
              <span className="font-mono text-xs font-bold text-[#292925] mt-0.5">
                {apiResult.delta_e.toFixed(1)}
              </span>
              <span className="text-[9px] font-mono text-[#878377] mt-0.5">vs L0* Baseline</span>
            </div>
          </div>
        </div>

        {/* Environmental & Model Variance Row */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-2">
            <span className="text-[9px] text-[#5D5B53] font-mono block">Optical QA</span>
            <span className="font-mono font-bold text-xs text-[#292925]">
              {Math.round((apiResult.confidence?.score ?? 0.95) * 100)}%
            </span>
            <span className="text-[8px] text-[#878377] font-mono block">
              ±{apiResult.confidence?.uncertainty_95_ci_ppm_h ?? 0.3} Tree Spread
            </span>
          </div>

          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-2">
            <span className="text-[9px] text-[#5D5B53] font-mono block">Ambient Temp</span>
            <span className="font-mono font-bold text-xs text-[#292925]">{apiResult.temperature}°C</span>
            <span className="text-[8px] text-[#878377] font-mono block">Compensated</span>
          </div>

          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-2">
            <span className="text-[9px] text-[#5D5B53] font-mono block">Humidity</span>
            <span className="font-mono font-bold text-xs text-[#292925]">{apiResult.humidity}%</span>
            <span className="text-[8px] text-[#878377] font-mono block">Compensated</span>
          </div>
        </div>

        {/* Honest Prototype Banner */}
        <div className="p-2.5 bg-[#F6F1E7] border border-dashed border-[#D8D0C2] rounded-xl text-center">
          <span className="text-[9px] font-mono text-[#795726] font-bold tracking-wider block">
            *** SIMULATED / PROTOTYPE READING ***
          </span>
          <p className="text-[10px] text-[#5D5B53] mt-0.5">
            Colorimetry modeled for Cu-PAN test strip. Thresholds (Safe &lt;0.50, Action 0.50–1.00, Review &gt;1.00 ppm·h) are prototype conventions, not official OSHA regulatory limits.
          </p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 pb-3 space-y-2">
        <button
          onClick={handleSave}
          className="w-full py-3.5 bg-[#292925] text-[#F6F1E7] rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#1a1a17] active:scale-[0.98] transition-all shadow-md font-semibold"
        >
          <Check className="w-4 h-4" />
          {isWorkerRole ? 'Save to My Shift Log' : 'Save & Log Officer Inspection'}
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
