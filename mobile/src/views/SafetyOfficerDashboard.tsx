import React from 'react';
import type { Worker, Reading, Alert, Wristband } from '../types/mobile';
import { ShieldAlert, Users, Radio, AlertTriangle, Camera, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

interface SafetyOfficerDashboardProps {
  workers: Worker[];
  readings: Reading[];
  alerts: Alert[];
  wristbands: Wristband[];
  onOpenScan: () => void;
  onViewWorkers: () => void;
  onViewAlerts: () => void;
  onSelectWorker: (worker: Worker) => void;
}

export const SafetyOfficerDashboard: React.FC<SafetyOfficerDashboardProps> = ({
  workers,
  readings,
  alerts,
  wristbands,
  onOpenScan,
  onViewWorkers,
  onViewAlerts,
  onSelectWorker
}) => {
  const activeWorkersCount = workers.length;
  const activeBandsCount = wristbands.filter(b => b.status === 'ACTIVE').length;
  const readingsTodayCount = readings.length;
  const unresolvedAlerts = alerts.filter(a => !a.resolved);

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
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[11px] font-mono text-[#71806B] uppercase tracking-wider font-semibold">
            Safety Monitoring Station
          </span>
          <h1 className="text-xl font-serif font-bold text-[#292925]">
            Officer Dashboard
          </h1>
          <p className="text-xs text-[#5D5B53]">
            Refinery Operations · Real-Time Exposure Overview
          </p>
        </div>

        <button
          onClick={onOpenScan}
          className="w-10 h-10 rounded-full bg-[#292925] text-[#F6F1E7] flex items-center justify-center shadow-md active:scale-95 transition-all"
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>

      {/* KPI Grid (4 Metrics) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-[#5D5B53]">Active Workers</span>
            <Users className="w-4 h-4 text-[#71806B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#292925]">{activeWorkersCount}</div>
          <span className="text-[10px] text-[#878377]">All shifts tracked</span>
        </div>

        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-[#5D5B53]">Active Bands</span>
            <Radio className="w-4 h-4 text-[#71806B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#292925]">{activeBandsCount}</div>
          <span className="text-[10px] text-[#878377]">{wristbands.length - activeBandsCount} expired/degraded</span>
        </div>

        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-[#5D5B53]">Readings Today</span>
            <Activity className="w-4 h-4 text-[#71806B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#292925]">{readingsTodayCount}</div>
          <span className="text-[10px] text-[#878377]">Colorimetric scans</span>
        </div>

        <div 
          onClick={onViewAlerts}
          className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 shadow-xs cursor-pointer active:bg-[#E2DBD0]"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-[#5D5B53]">Exposure Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${unresolvedAlerts.length > 0 ? 'text-[#9A6258]' : 'text-[#71806B]'}`} />
          </div>
          <div className={`text-2xl font-mono font-bold ${unresolvedAlerts.length > 0 ? 'text-[#7A342B]' : 'text-[#292925]'}`}>
            {unresolvedAlerts.length}
          </div>
          <span className="text-[10px] text-[#878377]">Action required</span>
        </div>
      </div>

      {/* Critical Alerts Banner (if any) */}
      {unresolvedAlerts.length > 0 && (
        <div className="bg-[#F6E2DF] border border-[#E4B5AF] rounded-xl p-3.5 space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#7A342B]">
              <AlertTriangle className="w-4 h-4 text-[#9A6258]" />
              <span>Pending Safety Alerts ({unresolvedAlerts.length})</span>
            </div>
            <button
              onClick={onViewAlerts}
              className="text-[11px] font-medium text-[#7A342B] underline"
            >
              View All
            </button>
          </div>
          <p className="text-xs text-[#7A342B] leading-relaxed">
            {unresolvedAlerts[0].message}
          </p>
        </div>
      )}

      {/* Workers Roster List Preview */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#5D5B53] font-bold">
            Worker Exposure Status
          </h3>
          <button
            onClick={onViewWorkers}
            className="text-xs text-[#71806B] font-medium flex items-center gap-0.5 active:underline"
          >
            All Workers <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {workers.map((worker) => (
            <div
              key={worker.workerId}
              onClick={() => onSelectWorker(worker)}
              className="bg-[#EDE5D6] hover:bg-[#E2DBD0] border border-[#D8D0C2] rounded-xl p-3 flex items-center justify-between text-xs cursor-pointer transition-colors"
            >
              <div>
                <div className="font-semibold text-sm text-[#292925]">{worker.name}</div>
                <div className="text-[11px] text-[#5D5B53]">
                  {worker.department} · Band: {worker.assignedBandId}
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-mono font-bold text-xs text-[#292925]">
                  {worker.currentDose.toFixed(2)} ppm·h
                </div>
                <div>{getStatusBadge(worker.status)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Readings Stream */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#5D5B53] font-bold">
          Live Dosimeter Readings
        </h3>
        <div className="space-y-2">
          {readings.slice(0, 4).map((reading) => (
            <div
              key={reading.readingId}
              className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#292925]">{reading.workerName}</span>
                <span className="font-mono text-[10px] text-[#878377]">{reading.timestamp}</span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-mono text-xs font-semibold text-[#292925]">
                  {reading.estimatedDose.toFixed(2)} ppm·h · Band {reading.bandId}
                </span>
                <div>{getStatusBadge(reading.status)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
