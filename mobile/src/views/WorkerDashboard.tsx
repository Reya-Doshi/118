import React from 'react';
import type { Worker, Reading } from '../types/mobile';
import { Camera, Clock, Tag, ChevronRight, ShieldCheck, AlertCircle, Thermometer, Droplets } from 'lucide-react';

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
  const latestReading = recentReadings[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="subtle-badge badge-normal">
            NORMAL
          </span>
        );
      case 'MONITOR':
        return (
          <span className="subtle-badge badge-monitor">
            MONITOR
          </span>
        );
      case 'REVIEW':
        return (
          <span className="subtle-badge badge-review">
            REVIEW
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header Card */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-mono text-[#71806B] uppercase tracking-wider font-semibold">
            Operator Session
          </span>
          <h1 className="text-xl font-serif font-bold text-[#292925]">
            Hello, {worker.name.split(' ')[0]}
          </h1>
          <p className="text-xs text-[#5D5B53]">
            {worker.department} · {worker.designation}
          </p>
        </div>

        <button
          onClick={onViewProfile}
          className="w-10 h-10 rounded-full bg-[#EDE5D6] border border-[#D8D0C2] flex items-center justify-center text-xs font-serif font-bold text-[#292925] shadow-xs"
        >
          {worker.name.slice(0, 2).toUpperCase()}
        </button>
      </div>

      {/* Shift & Assigned Band Info Strip */}
      <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#71806B]" />
          <span className="text-[#5D5B53]">{worker.shift}</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[11px] bg-[#F6F1E7] px-2 py-0.5 rounded border border-[#D8D0C2]">
          <Tag className="w-3 h-3 text-[#5D5B53]" />
          <span className="font-bold text-[#292925]">{worker.assignedBandId}</span>
        </div>
      </div>

      {/* Current Cumulative Status Card */}
      <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#5D5B53]">
            Shift Cumulative Exposure
          </span>
          {getStatusBadge(worker.status)}
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-mono font-bold text-[#292925] tracking-tight">
            {worker.currentDose.toFixed(2)}
          </span>
          <span className="text-sm font-serif text-[#5D5B53]">
            ppm·h
          </span>
        </div>

        <div className="text-xs text-[#5D5B53] flex items-center justify-between border-t border-[#D8D0C2] pt-2.5">
          <span>Last Logged:</span>
          <span className="font-medium text-[#292925]">{worker.lastReadingTime || 'No readings today'}</span>
        </div>
      </div>

      {/* High-Contrast Tactile SCAN WRISTBAND CTA */}
      <div>
        <button
          onClick={onOpenScan}
          className="w-full py-4 bg-[#292925] hover:bg-[#1a1a17] text-[#F6F1E7] rounded-xl font-serif text-base font-bold flex items-center justify-center gap-3 shadow-md active:scale-[0.98] transition-all"
        >
          <div className="w-7 h-7 rounded-full bg-[#5A7456] flex items-center justify-center text-white">
            <Camera className="w-4 h-4" />
          </div>
          <span>SCAN WRISTBAND</span>
        </button>
        <p className="text-center text-[10px] text-[#878377] font-mono mt-1.5">
          Hold camera over strip & printed color reference
        </p>
      </div>

      {/* Latest Reading Detail Card */}
      {latestReading && (
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold text-[#292925]">Latest Dosimeter Scan</span>
            <span className="text-[10px] font-mono text-[#71806B]">{latestReading.timestamp}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1">
            <div className="bg-[#F6F1E7] p-2 rounded-lg border border-[#D8D0C2]">
              <span className="text-[10px] text-[#5D5B53] block">Dose</span>
              <span className="font-mono font-bold text-xs text-[#292925]">{latestReading.estimatedDose} ppm·h</span>
            </div>
            <div className="bg-[#F6F1E7] p-2 rounded-lg border border-[#D8D0C2]">
              <span className="text-[10px] text-[#5D5B53] block">Confidence</span>
              <span className="font-mono font-bold text-xs text-[#292925]">{latestReading.confidence}%</span>
            </div>
            <div className="bg-[#F6F1E7] p-2 rounded-lg border border-[#D8D0C2]">
              <span className="text-[10px] text-[#5D5B53] block">Ambient</span>
              <span className="font-mono font-bold text-xs text-[#292925]">{latestReading.temperature}°C</span>
            </div>
          </div>

          {latestReading.notes && (
            <p className="text-[11px] text-[#5D5B53] italic pt-1">
              "{latestReading.notes}"
            </p>
          )}
        </div>
      )}

      {/* Recent Readings Section */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#5D5B53] font-bold">
            Recent Readings
          </h3>
          <button
            onClick={onViewHistory}
            className="text-xs text-[#71806B] font-medium flex items-center gap-0.5 active:underline"
          >
            Full Log <ChevronRight className="w-3.5 h-3.5" />
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
                  {reading.timestamp} · {reading.bandId}
                </div>
              </div>
              <div>
                {getStatusBadge(reading.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
