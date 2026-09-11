import React, { useState } from 'react';
import type { Worker, Reading } from '../types/mobile';
import { ArrowLeft, Search, Filter, ShieldCheck, ChevronRight, Clock, Tag, MapPin, Flame, AlertTriangle } from 'lucide-react';

interface WorkersListViewProps {
  workers: Worker[];
  readings: Reading[];
  onBack: () => void;
  onSelectWorker?: (worker: Worker) => void;
}

export const WorkersListView: React.FC<WorkersListViewProps> = ({
  workers,
  readings,
  onBack,
  onSelectWorker
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [inspectedWorker, setInspectedWorker] = useState<Worker | null>(null);

  const departments = ['ALL', ...Array.from(new Set(workers.map(w => w.department)))];

  const filtered = workers.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.workLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.assignedBandId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    const matchesDept = deptFilter === 'ALL' || w.department === deptFilter;
    return matchesSearch && matchesStatus && matchesDept;
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
    <div className="space-y-4 pb-24">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-1 border-b border-[#D8D0C2] pb-3">
        <button
          onClick={() => {
            if (inspectedWorker) {
              setInspectedWorker(null);
            } else {
              onBack();
            }
          }}
          className="w-9 h-9 rounded-full bg-[#EDE5D6] border border-[#D8D0C2] flex items-center justify-center text-[#292925] active:bg-[#E2DBD0]"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl font-serif font-bold text-[#292925]">
            {inspectedWorker ? 'Worker Dossier' : 'Monitored Workforce'}
          </h1>
          <span className="text-[11px] font-mono text-[#71806B]">
            {inspectedWorker ? inspectedWorker.name : `${workers.length} Plant Operators Active`}
          </span>
        </div>
      </div>

      {inspectedWorker ? (
        /* Detailed Individual Worker Dossier */
        <div className="space-y-4">
          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#292925]">{inspectedWorker.name}</h2>
                <div className="text-xs text-[#5D5B53]">{inspectedWorker.designation} · {inspectedWorker.department}</div>
                <div className="text-[11px] font-mono text-[#878377]">{inspectedWorker.employeeId}</div>
              </div>
              <div>{getStatusBadge(inspectedWorker.status)}</div>
            </div>

            <div className="p-3 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] space-y-1.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#71806B] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] text-[#878377] uppercase font-mono block">Work Location</span>
                  <span className="font-semibold text-[#292925]">{inspectedWorker.workLocation}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-[#D8D0C2]/50">
                <Flame className="w-3.5 h-3.5 text-[#B08A55] shrink-0" />
                <span className="text-[11px] text-[#5D5B53]">{inspectedWorker.hazardZone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-[#F6F1E7] p-2.5 rounded-lg border border-[#D8D0C2]">
                <span className="text-[10px] text-[#878377] uppercase font-mono block">Assigned Band</span>
                <span className="font-mono font-bold text-sm text-[#292925]">{inspectedWorker.assignedBandId}</span>
              </div>
              <div className="bg-[#F6F1E7] p-2.5 rounded-lg border border-[#D8D0C2]">
                <span className="text-[10px] text-[#878377] uppercase font-mono block">Cumulative Dose</span>
                <span className="font-mono font-bold text-sm text-[#292925]">{inspectedWorker.currentDose.toFixed(2)} ppm·h</span>
              </div>
            </div>
          </div>

          {/* 7-Day Trend Chart */}
          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-4 space-y-2">
            <span className="text-xs font-serif font-bold text-[#292925] block">
              7-Day Shift Exposure Trend
            </span>
            <div className="flex items-end justify-between gap-1.5 h-16 pt-2">
              {inspectedWorker.trend7Day.map((t) => (
                <div key={t.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t ${
                      t.dose >= 1.0 ? 'bg-[#9A6258]' : t.dose >= 0.5 ? 'bg-[#B08A55]' : 'bg-[#5A7456]'
                    }`}
                    style={{ height: `${Math.max(8, Math.round((t.dose / 1.5) * 48))}px` }}
                  />
                  <span className="text-[9px] font-mono text-[#878377]">{t.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reading Log for this Worker */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#5D5B53] font-bold">
              Recorded Readings Log
            </h3>
            {readings.filter(r => r.workerId === inspectedWorker.workerId).length === 0 ? (
              <div className="p-4 bg-[#EDE5D6] rounded-xl text-center text-xs text-[#878377]">
                No recorded readings for this operator today.
              </div>
            ) : (
              readings
                .filter(r => r.workerId === inspectedWorker.workerId)
                .map((reading) => (
                  <div
                    key={reading.readingId}
                    className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#292925]">
                        {reading.estimatedDose.toFixed(2)} ppm·h
                      </span>
                      <div>{getStatusBadge(reading.status)}</div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#878377] font-mono">
                      <span>{reading.timestamp} · {reading.scanType === 'OFFICER_FIELD_AUDIT' ? 'Officer Audit' : 'Personal Scan'}</span>
                      <span>Confidence: {reading.confidence}%</span>
                    </div>
                    {reading.notes && (
                      <p className="text-[11px] text-[#5D5B53] italic pt-0.5">"{reading.notes}"</p>
                    )}
                  </div>
                ))
            )}
          </div>
        </div>
      ) : (
        /* Monitored Workforce Roster */
        <>
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#878377]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search operator, unit, work area, band..."
              className="w-full bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#292925] placeholder-[#878377] focus:outline-none"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {['ALL', 'NORMAL', 'MONITOR', 'REVIEW'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-mono shrink-0 transition-all ${
                  statusFilter === status
                    ? 'bg-[#292925] text-[#F6F1E7]'
                    : 'bg-[#EDE5D6] border border-[#D8D0C2] text-[#5D5B53]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Department Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono shrink-0 ${
                  deptFilter === dept
                    ? 'bg-[#71806B] text-white'
                    : 'bg-[#EDE5D6] text-[#5D5B53] border border-[#D8D0C2]'
                }`}
              >
                {dept === 'ALL' ? 'All Units' : dept}
              </button>
            ))}
          </div>

          {/* Employee Cards List */}
          <div className="space-y-2">
            {filtered.map((worker) => (
              <div
                key={worker.workerId}
                onClick={() => setInspectedWorker(worker)}
                className="bg-[#EDE5D6] hover:bg-[#E2DBD0] border border-[#D8D0C2] rounded-xl p-3.5 space-y-1.5 cursor-pointer transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-[#292925]">{worker.name}</div>
                    <div className="text-[11px] text-[#5D5B53]">
                      {worker.department} · <span className="font-mono font-medium">{worker.assignedBandId}</span>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-mono font-bold text-xs text-[#292925]">
                      {worker.currentDose.toFixed(2)} ppm·h
                    </div>
                    <div>{getStatusBadge(worker.status)}</div>
                  </div>
                </div>

                {/* Location snippet */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#71806B] pt-1 border-t border-[#D8D0C2]/50">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{worker.workLocation}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
