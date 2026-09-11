import React, { useState } from 'react';
import type { Reading } from '../types/mobile';
import { Clock, Filter, ArrowLeft, Thermometer, Droplets, ShieldCheck } from 'lucide-react';

interface HistoryViewProps {
  readings: Reading[];
  onBack: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ readings, onBack }) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filtered = readings.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

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

  return (
    <div className="space-y-4 pb-20">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-1 border-b border-[#D8D0C2] pb-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#EDE5D6] border border-[#D8D0C2] flex items-center justify-center text-[#292925] active:bg-[#E2DBD0]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-serif font-bold text-[#292925]">
            Exposure History
          </h1>
          <span className="text-[11px] font-mono text-[#71806B]">
            All Quantitative Dosimeter Scans
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['ALL', 'NORMAL', 'MONITOR', 'REVIEW'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              filterStatus === status
                ? 'bg-[#292925] text-[#F6F1E7] shadow-xs'
                : 'bg-[#EDE5D6] border border-[#D8D0C2] text-[#5D5B53]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Readings Timeline List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#878377] text-xs">
            No readings found for selected filter.
          </div>
        ) : (
          filtered.map((reading) => (
            <div
              key={reading.readingId}
              className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-4 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-sm text-[#292925] block">
                    {reading.workerName}
                  </span>
                  <span className="text-[11px] font-mono text-[#878377]">
                    Band {reading.bandId} · {reading.timestamp}
                  </span>
                </div>
                <div>{getStatusBadge(reading.status)}</div>
              </div>

              <div className="flex items-baseline gap-2 pt-1 border-t border-[#D8D0C2]/60">
                <span className="text-2xl font-mono font-bold text-[#292925]">
                  {reading.estimatedDose.toFixed(2)}
                </span>
                <span className="text-xs text-[#5D5B53] font-serif">ppm·h estimated dose</span>
              </div>

              <div className="flex items-center gap-4 text-[11px] font-mono text-[#5D5B53] pt-1">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#71806B]" />
                  <span>{reading.confidence}% confidence</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-[#71806B]" />
                  <span>{reading.temperature}°C</span>
                </div>
                <div className="flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-[#71806B]" />
                  <span>{reading.humidity}% RH</span>
                </div>
              </div>

              {reading.notes && (
                <p className="text-[11px] text-[#5D5B53] italic pt-1 border-t border-[#D8D0C2]/40">
                  {reading.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
