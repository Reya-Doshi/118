import React, { useState } from 'react';
import type { Worker, Reading } from '../types/mobile';
import { Camera, Clock, Tag, ChevronRight, ShieldCheck, AlertTriangle, MapPin, Activity, HelpCircle, ArrowUpRight, Flame } from 'lucide-react';

interface WorkerDashboardProps {
  worker: Worker;
  recentReadings: Reading[];
  onOpenScan: () => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  worker,
  recentReadings,
  onOpenScan,
  onViewHistory,
  onViewProfile
}) => {
  const [showColorScaleGuide, setShowColorScaleGuide] = useState(false);
  const latestReading = recentReadings[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return <span className="subtle-badge badge-normal">NORMAL</span>;
      case 'MONITOR':
        return <span className="subtle-badge badge-monitor">MONITOR</span>;
      case 'REVIEW':
        return <span className="subtle-badge badge-review">REVIEW</span>;
      default:
        return null;
    }
  };

  // 8-hour shift target threshold is 1.00 ppm·h
  const targetShiftThreshold = 1.00;
  const dosePercent = Math.min(100, Math.round((worker.currentDose / targetShiftThreshold) * 100));

  return (
    <div className="space-y-4 pb-24">
      {/* Top Header Card */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[10px] font-mono bg-[#71806B]/20 text-[#4F5D4B] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
              Active Operator Session
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#292925] tracking-tight">
            Hello, {worker.name}
          </h1>
          <p className="text-xs text-[#5D5B53] flex items-center gap-1 mt-0.5">
            <span>{worker.designation}</span>
            <span>·</span>
            <span className="font-medium text-[#292925]">{worker.department}</span>
          </p>
        </div>

        <button
          onClick={onViewProfile}
          className="w-11 h-11 rounded-2xl bg-[#292925] text-[#F6F1E7] border border-[#D8D0C2] flex items-center justify-center text-sm font-serif font-bold shadow-xs active:scale-95 transition-all"
        >
          {worker.name.slice(0, 2).toUpperCase()}
        </button>
      </div>

      {/* Workplace Location & Hazard Zone Banner */}
      <div className="card-glow p-3.5 space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs leading-tight">
            <span className="text-[10px] font-mono uppercase text-gray-500 block font-semibold">Assigned Work Area</span>
            <span className="font-bold text-gray-900 block mt-0.5">{worker.workLocation}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 text-[11px]">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate max-w-[210px] font-medium">{worker.hazardZone}</span>
          </div>
          <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded-md ${
            worker.riskLevel === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {worker.riskLevel} RISK
          </span>
        </div>
      </div>

      {/* Shift Progress & Assigned Band ID Strip */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="card-glow p-3 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="text-[10px] text-gray-500 block font-mono uppercase font-semibold">Shift Time</span>
            <span className="font-bold text-gray-900">{worker.shift.split('·')[1]?.trim() || worker.shift}</span>
          </div>
        </div>

        <div className="card-glow p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-500 block font-mono uppercase font-semibold">Assigned Band</span>
            <span className="font-mono font-bold text-gray-900">{worker.assignedBandId}</span>
          </div>
          <Tag className="w-4 h-4 text-emerald-700" />
        </div>
      </div>

      {/* Current Shift Cumulative Exposure Card */}
      <div className={`rounded-2xl p-5 relative overflow-hidden ${
        worker.status === 'REVIEW'
          ? 'card-glow-review'
          : worker.status === 'MONITOR'
          ? 'card-glow-monitor'
          : 'card-glow-safe'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-600 font-bold">
            Shift Cumulative Exposure (ppm·h)
          </span>
          {getStatusBadge(worker.status)}
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-mono font-bold text-gray-900 tracking-tight">
            {worker.currentDose.toFixed(2)}
          </span>
          <span className="text-sm font-serif text-gray-600 font-medium">
            ppm·h
          </span>
          <span className="text-[11px] text-gray-500 ml-auto font-mono">
            Limit: 1.00 ppm·h
          </span>
        </div>

        {/* Progress Bar towards Shift Target Limit */}
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2 border border-gray-200/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              worker.status === 'REVIEW'
                ? 'bg-red-600'
                : worker.status === 'MONITOR'
                ? 'bg-amber-600'
                : 'bg-emerald-600'
            }`}
            style={{ width: `${dosePercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-600 pt-1 font-medium">
          <span>{dosePercent}% of Action Level</span>
          <span className="font-semibold text-gray-900">Last scan: {worker.lastReadingTime || '11:37 AM'}</span>
        </div>

        {/* Safety Recommendation Banner based on dose */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 text-xs leading-relaxed">
          {worker.status === 'REVIEW' ? (
            <div className="flex items-start gap-1.5 text-red-700 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>Shift dose threshold exceeded. Report to safety officer Meera Patel and step out of catalytic area.</span>
            </div>
          ) : worker.status === 'MONITOR' ? (
            <div className="flex items-start gap-1.5 text-amber-800 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>Elevated exposure. Wear breathing protection if servicing high-elevation flanges on Deck B.</span>
            </div>
          ) : (
            <div className="flex items-start gap-1.5 text-emerald-800 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>Within safe 8-hour shift limits. Continue routine monitoring protocol.</span>
            </div>
          )}
        </div>
      </div>

      {/* Prominent High-Contrast Tactile SCAN WRISTBAND CTA */}
      <div>
        <button
          onClick={onOpenScan}
          className="w-full py-4 bg-gray-950 hover:bg-black text-white rounded-2xl font-serif text-base font-bold flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all border border-gray-800"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Camera className="w-4 h-4" />
          </div>
          <span className="tracking-wide">SCAN MY WRISTBAND ({worker.assignedBandId})</span>
        </button>
        <p className="text-center text-[10px] text-gray-500 font-mono mt-1.5 font-medium">
          Reads chemical color response · AI-assisted illumination correction
        </p>
      </div>

      {/* Color Scale Strip Reference Accordion */}
      <div className="card-glow p-4 space-y-2">
        <div
          onClick={() => setShowColorScaleGuide(!showColorScaleGuide)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="text-xs font-serif font-bold text-gray-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            Colorimetric Strip Threshold Guide
          </span>
          <span className="text-[11px] text-emerald-700 font-bold hover:underline">
            {showColorScaleGuide ? 'Hide' : 'View Scale'}
          </span>
        </div>

        {showColorScaleGuide && (
          <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
              The sensing strip turns darker as silver nanoparticles form silver sulfide (Ag₂S) upon H₂S exposure:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="w-full h-4 rounded bg-[#d4c5a9] mb-1.5 border border-black/10 shadow-xs"></div>
                <span className="font-mono font-bold text-[11px] text-emerald-800">0.0 – 0.50</span>
                <span className="block text-[10px] text-gray-600 font-bold uppercase mt-0.5">NORMAL</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="w-full h-4 rounded bg-[#8c6d48] mb-1.5 border border-black/10 shadow-xs"></div>
                <span className="font-mono font-bold text-[11px] text-amber-800">0.50 – 1.00</span>
                <span className="block text-[10px] text-gray-600 font-bold uppercase mt-0.5">MONITOR</span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="w-full h-4 rounded bg-[#3a2e2b] mb-1.5 border border-black/10 shadow-xs"></div>
                <span className="font-mono font-bold text-[11px] text-red-800">&gt; 1.00 ppm·h</span>
                <span className="block text-[10px] text-gray-600 font-bold uppercase mt-0.5">REVIEW</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7-Day Exposure Trend Chart Preview */}
      <div className="card-glow p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-gray-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-700" />
            7-Day Personal Exposure Trend
          </span>
          <span className="text-[10px] font-mono text-gray-500 font-semibold">Weekly Log</span>
        </div>

        <div className="flex items-end justify-between gap-2 h-20 pt-2 px-1">
          {worker.trend7Day.map((item) => {
            const barHeight = Math.max(12, Math.round((item.dose / 1.5) * 64));
            const isToday = item.day === 'Sun' || item.day === 'Sat';

            return (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-mono text-gray-600 font-medium">
                  {item.dose.toFixed(2)}
                </span>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    item.dose >= 1.0
                      ? 'bg-red-500'
                      : item.dose >= 0.5
                      ? 'bg-amber-500'
                      : 'bg-emerald-600'
                  }`}
                  style={{ height: `${barHeight}px` }}
                />
                <span className="text-[9px] font-mono font-bold text-gray-700">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Scans List */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#5D5B53] font-bold">
            Recent Scans Today
          </h3>
          <button
            onClick={onViewHistory}
            className="text-xs text-[#71806B] font-medium flex items-center gap-0.5 active:underline"
          >
            All Logs <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentReadings.slice(0, 3).map((reading) => (
            <div
              key={reading.readingId}
              className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="font-mono font-semibold text-[#292925]">
                  {reading.estimatedDose.toFixed(2)} ppm·h
                </div>
                <div className="text-[11px] text-[#878377] font-mono">
                  {reading.timestamp} · {reading.scanType === 'OFFICER_FIELD_AUDIT' ? 'Inspector Audit' : 'Self Scan'}
                </div>
              </div>
              <div>{getStatusBadge(reading.status)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
