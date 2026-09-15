import React, { useState } from 'react';
import type { Worker, Wristband, Reading, Alert } from '../types/mobile';
import { repository } from '../services/DosimeterRepository';
import { Users, Radio, AlertTriangle, Activity, UserPlus, Check, X, ChevronRight, BarChart3, ShieldAlert } from 'lucide-react';

interface AdminDashboardProps {
  workers: Worker[];
  wristbands: Wristband[];
  readings: Reading[];
  alerts: Alert[];
  onViewWorkers: () => void;
  onViewBands: () => void;
  onViewAlerts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  workers,
  wristbands,
  readings,
  alerts,
  onViewWorkers,
  onViewBands,
  onViewAlerts
}) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedBandId, setSelectedBandId] = useState('');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [assignSuccess, setAssignSuccess] = useState(false);

  // Stats calculation
  const totalWorkers = workers.length;
  const activeBands = wristbands.filter(b => b.status === 'ACTIVE').length;
  const expiredBands = wristbands.filter(b => b.status === 'EXPIRED').length;
  const readingsCount = readings.length;
  const highAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length;

  const normalWorkers = workers.filter(w => w.status === 'NORMAL').length;
  const monitorWorkers = workers.filter(w => w.status === 'MONITOR').length;
  const reviewWorkers = workers.filter(w => w.status === 'REVIEW').length;

  const handleAssignBand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBandId || !selectedWorkerId) return;

    const ok = repository.assignBandToWorker(selectedBandId, selectedWorkerId);
    if (ok) {
      setAssignSuccess(true);
      setTimeout(() => {
        setAssignSuccess(false);
        setShowAssignModal(false);
        setSelectedBandId('');
        setSelectedWorkerId('');
      }, 1000);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="pt-1 flex items-center gap-3">
        <img 
          src="/sarvas_logo_v2.png" 
          alt="SARVAS Official Logo" 
          className="w-11 h-11 rounded-2xl object-contain bg-white p-1 border border-gray-200 shadow-xs shrink-0"
        />
        <div>
          <span className="text-[10px] font-mono text-[#71806B] uppercase tracking-wider font-semibold block">
            Operations & Supervisor Station
          </span>
          <h1 className="text-xl font-serif font-bold text-[#292925]">
            Facility Overview
          </h1>
          <p className="text-[11px] text-[#5D5B53]">
            Refinery Plant Sector 4 · Dosimeter Wristband Inventory
          </p>
        </div>
      </div>

      {/* KPI 4-Card Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-glow p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold">Total Workforce</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-mono font-bold text-gray-900">{totalWorkers}</div>
          <span className="text-[10px] text-gray-500 font-medium">All registered operators</span>
        </div>

        <div className="card-glow p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold">Wristbands</span>
            <Radio className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-mono font-bold text-gray-900">{activeBands}</div>
          <span className="text-[10px] text-red-600 font-semibold">{expiredBands} expired in stock</span>
        </div>

        <div className="card-glow p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold">Readings Today</span>
            <Activity className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-mono font-bold text-gray-900">{readingsCount}</div>
          <span className="text-[10px] text-gray-500 font-medium">AI optical estimations</span>
        </div>

        <div 
          onClick={onViewAlerts}
          className="card-glow p-3.5 cursor-pointer active:scale-98 transition-all"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-gray-500 font-semibold">High Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-mono font-bold text-red-700">{highAlertsCount}</div>
          <span className="text-[10px] text-gray-500 font-medium">Requires review</span>
        </div>
      </div>

      {/* Workforce Exposure Distribution */}
      <div className="card-glow p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-gray-900 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-emerald-700" />
            Workforce Exposure Breakdown
          </span>
          <span className="text-[10px] font-mono text-gray-500 font-semibold">Current Shift</span>
        </div>

        {/* Visual Multi-segment bar */}
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden flex border border-gray-200/60">
          <div 
            className="bg-emerald-600 h-full transition-all" 
            style={{ width: `${(normalWorkers / totalWorkers) * 100}%` }}
            title="Normal"
          />
          <div 
            className="bg-amber-500 h-full transition-all" 
            style={{ width: `${(monitorWorkers / totalWorkers) * 100}%` }}
            title="Monitor"
          />
          <div 
            className="bg-red-500 h-full transition-all" 
            style={{ width: `${(reviewWorkers / totalWorkers) * 100}%` }}
            title="Review"
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>
            <div>
              <div className="font-mono font-bold text-gray-900">{normalWorkers}</div>
              <div className="text-[10px] text-gray-500 font-medium">Normal</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
            <div>
              <div className="font-mono font-bold text-gray-900">{monitorWorkers}</div>
              <div className="text-[10px] text-gray-500 font-medium">Monitor</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div>
              <div className="font-mono font-bold text-gray-900">{reviewWorkers}</div>
              <div className="text-[10px] text-gray-500 font-medium">Review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setShowAssignModal(true)}
          className="p-3 bg-gray-950 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md border border-gray-800"
        >
          <UserPlus className="w-4 h-4 text-emerald-400" />
          Assign Wristband
        </button>
        <button
          onClick={onViewBands}
          className="card-glow p-3 text-gray-900 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:border-emerald-500/40"
        >
          <Radio className="w-4 h-4 text-emerald-700" />
          Band Inventory ({wristbands.length})
        </button>
      </div>

      {/* Admin Precautionary Directives & Safety Escalations */}
      <div className="card-glow p-4 space-y-3 border-red-500/30">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center text-red-700 border border-red-200">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-serif font-bold text-gray-900 leading-tight">Admin Precautionary Directives</h3>
              <span className="text-[9px] font-mono text-emerald-700 font-bold">OSHA / DGMS REFINERY COMPLIANCE</span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold border border-red-200">
            MANDATORY SOP
          </span>
        </div>

        <div className="space-y-2 text-xs text-gray-900">
          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
            <div>
              <div className="font-bold text-gray-900 text-[11px]">Action Level (0.50 – 1.00 ppm·h): Immediate Personnel Rotation</div>
              <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                Immediately rotate operator out of active battery (SRU/CDU) to pressurized control room. Cap remaining shift exposure.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-red-100 text-red-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
            <div>
              <div className="font-bold text-gray-900 text-[11px]">Overexposure (&gt; 1.00 ppm·h): Shift Suspension &amp; OHC Triage</div>
              <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                Suspend shift immediately. Escort operator to Occupational Health Center for vitals &amp; peak flow. Mandatory 24h rest before next shift.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
            <div>
              <div className="font-bold text-gray-900 text-[11px]">Chemical Matrix Lifecycle &amp; Batch Quarantine</div>
              <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                Decommission and physically quarantine any Cu-PAN wristband older than 90 days or showing bleaching/matrix degradation.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-800 font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
            <div>
              <div className="font-bold text-gray-900 text-[11px]">Environmental Storage Standards</div>
              <p className="text-[10px] text-gray-600 mt-0.5 leading-relaxed font-medium">
                Store unissued dosimeters in sealed foil pouches below 25°C and &lt;50% RH. Never store near open chemical solvent vents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wristbands Lifecycle Overview */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#5D5B53] font-bold">
            Wristband Lifecycle Log
          </h3>
          <button
            onClick={onViewBands}
            className="text-xs text-[#71806B] font-medium flex items-center gap-0.5 active:underline"
          >
            Manage All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {wristbands.slice(0, 4).map((band) => (
            <div
              key={band.bandId}
              className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3 flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-mono font-bold text-sm text-[#292925]">{band.bandId}</div>
                <div className="text-[11px] text-[#5D5B53]">
                  {band.workerName ? `Assigned to: ${band.workerName}` : 'Unassigned (In Storage)'}
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`subtle-badge ${
                    band.status === 'ACTIVE'
                      ? 'badge-normal'
                      : 'badge-review'
                  }`}
                >
                  {band.status}
                </span>
                <div className="text-[10px] text-[#878377] font-mono mt-0.5">
                  Age: {band.shelfAgeDays} days
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Wristband Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#F6F1E7] border border-[#D8D0C2] rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8D0C2] pb-2">
              <h3 className="font-serif font-bold text-[#292925]">
                Assign Wristband to Operator
              </h3>
              <button onClick={() => setShowAssignModal(false)} className="text-[#878377]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {assignSuccess ? (
              <div className="p-4 bg-[#E2EBDC] text-[#385034] rounded-xl flex items-center gap-2 font-medium text-xs">
                <Check className="w-5 h-5" />
                Wristband successfully assigned!
              </div>
            ) : (
              <form onSubmit={handleAssignBand} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#5D5B53] mb-1">
                    Select Wristband ID
                  </label>
                  <select
                    value={selectedBandId}
                    onChange={(e) => setSelectedBandId(e.target.value)}
                    required
                    className="w-full bg-[#EDE5D6] border border-[#D8D0C2] rounded-lg p-2.5 text-xs text-[#292925] focus:outline-none"
                  >
                    <option value="">-- Choose Active Band --</option>
                    {wristbands.filter(b => b.status === 'ACTIVE').map((b) => (
                      <option key={b.bandId} value={b.bandId}>
                        {b.bandId} (Age: {b.shelfAgeDays}d) {b.workerName ? `[${b.workerName}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#5D5B53] mb-1">
                    Select Worker
                  </label>
                  <select
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                    required
                    className="w-full bg-[#EDE5D6] border border-[#D8D0C2] rounded-lg p-2.5 text-xs text-[#292925] focus:outline-none"
                  >
                    <option value="">-- Choose Operator --</option>
                    {workers.map((w) => (
                      <option key={w.workerId} value={w.workerId}>
                        {w.name} ({w.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAssignModal(false)}
                    className="flex-1 py-2.5 bg-[#EDE5D6] border border-[#D8D0C2] rounded-lg text-xs font-medium text-[#5D5B53]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#292925] text-[#F6F1E7] rounded-lg text-xs font-semibold hover:bg-[#1a1a17]"
                  >
                    Confirm Assignment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
