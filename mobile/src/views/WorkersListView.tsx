import React, { useState } from 'react';
import type { Worker, Reading } from '../types/mobile';
import { ArrowLeft, Search, Filter, ShieldCheck, ChevronRight, Clock, Tag } from 'lucide-react';

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
  const [inspectedWorker, setInspectedWorker] = useState<Worker | null>(null);

  const filtered = workers.filter((w) => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.assignedBandId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
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
            {inspectedWorker ? inspectedWorker.name : `${workers.length} Registered Operators`}
          </span>
        </div>
      </div>

      {inspectedWorker ? (
        /* Worker Detail Inspection Screen */
        <div className="space-y-4">
          <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-serif font-bold text-[#292925]">{inspectedWorker.name}</h2>
                <div className="text-xs text-[#5D5B53]">{inspectedWorker.department} · {inspectedWorker.designation}</div>
              </div>
              <div>{getStatusBadge(inspectedWorker.status)}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D8D0C2] text-xs">
              <div>
                <span className="text-[10px] text-[#878377] uppercase block">Assigned Band</span>
                <span className="font-mono font-bold text-[#292925]">{inspectedWorker.assignedBandId}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#878377] uppercase block">Cumulative Dose</span>
                <span className="font-mono font-bold text-[#292925]">{inspectedWorker.currentDose.toFixed(2)} ppm·h</span>
              </div>
            </div>
          </div>

          {/* Reading Log for this Worker */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#5D5B53] font-bold">
              Shift Reading Log
            </h3>
            {readings.filter(r => r.workerId === inspectedWorker.workerId).length === 0 ? (
              <div className="p-4 bg-[#EDE5D6] rounded-xl text-center text-xs text-[#878377]">
                No recorded readings for this worker yet.
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
                      <span>{reading.timestamp}</span>
                      <span>Confidence: {reading.confidence}%</span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      ) : (
        /* Full Workers List */
        <>
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#878377]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by worker name, dept, band..."
              className="w-full bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#292925] placeholder-[#878377] focus:outline-none"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2">
            {['ALL', 'NORMAL', 'MONITOR', 'REVIEW'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  statusFilter === status
                    ? 'bg-[#292925] text-[#F6F1E7]'
                    : 'bg-[#EDE5D6] border border-[#D8D0C2] text-[#5D5B53]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-2">
            {filtered.map((worker) => (
              <div
                key={worker.workerId}
                onClick={() => setInspectedWorker(worker)}
                className="bg-[#EDE5D6] hover:bg-[#E2DBD0] border border-[#D8D0C2] rounded-xl p-3 flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div>
                  <div className="font-semibold text-sm text-[#292925]">{worker.name}</div>
                  <div className="text-[11px] text-[#5D5B53]">
                    {worker.department} · {worker.assignedBandId}
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
        </>
      )}
    </div>
  );
};
