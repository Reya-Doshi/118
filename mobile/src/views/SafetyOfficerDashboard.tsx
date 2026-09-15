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
        <div className="card-glow p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold">Active Workers</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-mono font-bold text-gray-900">{activeWorkersCount}</div>
          <span className="text-[10px] text-gray-500 font-medium">All shifts tracked</span>
        </div>

        <div className="card-glow p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold">Active Bands</span>
            <Radio className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-mono font-bold text-gray-900">{activeBandsCount}</div>
          <span className="text-[10px] text-gray-500 font-medium">{wristbands.length - activeBandsCount} degraded/discarded</span>
        </div>

        <div className="card-glow p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold">Readings Today</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-mono font-bold text-gray-900">{readingsTodayCount}</div>
          <span className="text-[10px] text-gray-500 font-medium">Colorimetric scans</span>
        </div>

        <div 
          onClick={onViewAlerts}
          className="card-glow p-3.5 cursor-pointer active:scale-98 transition-all"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold">Exposure Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${unresolvedAlerts.length > 0 ? 'text-red-600' : 'text-emerald-700'}`} />
          </div>
          <div className={`text-2xl font-mono font-bold ${unresolvedAlerts.length > 0 ? 'text-red-700' : 'text-gray-900'}`}>
            {unresolvedAlerts.length}
          </div>
          <span className="text-[10px] text-gray-500 font-medium">Action required</span>
        </div>
      </div>

      {/* Critical Alerts Banner (if any) */}
      {unresolvedAlerts.length > 0 && (
        <div className="card-glow-review p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-red-800">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>Pending Safety Alerts ({unresolvedAlerts.length})</span>
            </div>
            <button
              onClick={onViewAlerts}
              className="text-[11px] font-bold text-red-700 underline hover:text-red-900"
            >
              View All
            </button>
          </div>
          <p className="text-xs text-red-800/90 leading-relaxed font-medium">
            {unresolvedAlerts[0].message}
          </p>
        </div>
      )}

      {/* Workers Roster List Preview */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-gray-600 font-bold">
            Worker Exposure Status
          </h3>
          <button
            onClick={onViewWorkers}
            className="text-xs text-emerald-800 font-bold flex items-center gap-0.5 hover:underline"
          >
            All Workers <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {workers.map((worker) => (
            <div
              key={worker.workerId}
              onClick={() => onSelectWorker(worker)}
              className="card-glow p-3 flex items-center justify-between text-xs cursor-pointer transition-all hover:border-emerald-500/40 active:scale-98"
            >
              <div>
                <div className="font-bold text-sm text-gray-900">{worker.name}</div>
                <div className="text-[11px] text-gray-500 font-medium mt-0.5">
                  {worker.department} · Band: <span className="font-mono text-gray-700">{worker.assignedBandId}</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="font-mono font-bold text-xs text-gray-900">
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
        <h3 className="text-xs font-mono uppercase tracking-wider text-gray-600 font-bold">
          Live Dosimeter Readings
        </h3>
        <div className="space-y-2">
          {readings.slice(0, 4).map((reading) => (
            <div
              key={reading.readingId}
              className="card-glow p-3 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">{reading.workerName}</span>
                <span className="font-mono text-[10px] text-gray-500">{reading.timestamp}</span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="font-mono text-xs font-bold text-gray-800">
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
