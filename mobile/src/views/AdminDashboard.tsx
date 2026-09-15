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
      <div className="pt-1">
        <span className="text-[11px] font-mono text-[#71806B] uppercase tracking-wider font-semibold">
          Operations & Supervisor Station
        </span>
        <h1 className="text-xl font-serif font-bold text-[#292925]">
          Facility Overview
        </h1>
        <p className="text-xs text-[#5D5B53]">
          Refinery Plant Sector 4 · Dosimeter Wristband Inventory
        </p>
      </div>

      {/* KPI 4-Card Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-[#5D5B53]">Total Workforce</span>
            <Users className="w-4 h-4 text-[#71806B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#292925]">{totalWorkers}</div>
          <span className="text-[10px] text-[#878377]">All registered operators</span>
        </div>

        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-[#5D5B53]">Wristbands</span>
            <Radio className="w-4 h-4 text-[#71806B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#292925]">{activeBands}</div>
          <span className="text-[10px] text-[#9A6258] font-medium">{expiredBands} expired in stock</span>
        </div>

        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-[#5D5B53]">Readings Today</span>
            <Activity className="w-4 h-4 text-[#71806B]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#292925]">{readingsCount}</div>
          <span className="text-[10px] text-[#878377]">AI optical estimations</span>
        </div>

        <div 
          onClick={onViewAlerts}
          className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3.5 shadow-xs cursor-pointer active:bg-[#E2DBD0]"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono uppercase text-[#5D5B53]">High Alerts</span>
            <AlertTriangle className="w-4 h-4 text-[#9A6258]" />
          </div>
          <div className="text-2xl font-mono font-bold text-[#7A342B]">{highAlertsCount}</div>
          <span className="text-[10px] text-[#878377]">Requires review</span>
        </div>
      </div>

      {/* Workforce Exposure Distribution */}
      <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-[#292925] flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-[#71806B]" />
            Workforce Exposure Breakdown
          </span>
          <span className="text-[10px] font-mono text-[#878377]">Current Shift</span>
        </div>

        {/* Visual Multi-segment bar */}
        <div className="w-full h-3 bg-[#D8D0C2] rounded-full overflow-hidden flex">
          <div 
            className="bg-[#5A7456] h-full transition-all" 
            style={{ width: `${(normalWorkers / totalWorkers) * 100}%` }}
            title="Normal"
          />
          <div 
            className="bg-[#B08A55] h-full transition-all" 
            style={{ width: `${(monitorWorkers / totalWorkers) * 100}%` }}
            title="Monitor"
          />
          <div 
            className="bg-[#9A6258] h-full transition-all" 
            style={{ width: `${(reviewWorkers / totalWorkers) * 100}%` }}
            title="Review"
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#5A7456]"></div>
            <div>
              <div className="font-mono font-bold text-[#292925]">{normalWorkers}</div>
              <div className="text-[10px] text-[#5D5B53]">Normal</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#B08A55]"></div>
            <div>
              <div className="font-mono font-bold text-[#292925]">{monitorWorkers}</div>
              <div className="text-[10px] text-[#5D5B53]">Monitor</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#9A6258]"></div>
            <div>
              <div className="font-mono font-bold text-[#292925]">{reviewWorkers}</div>
              <div className="text-[10px] text-[#5D5B53]">Review</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setShowAssignModal(true)}
          className="p-3 bg-[#292925] text-[#F6F1E7] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          Assign Wristband
        </button>
        <button
          onClick={onViewBands}
          className="p-3 bg-[#EDE5D6] border border-[#D8D0C2] text-[#292925] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <Radio className="w-4 h-4 text-[#71806B]" />
          Band Inventory ({wristbands.length})
        </button>
      </div>

      {/* Admin Precautionary Directives & Safety Escalations */}
      <div className="bg-[#EDE5D6] border-2 border-[#9A6258]/40 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#D8D0C2] pb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#9A6258]/20 flex items-center justify-center text-[#9A6258]">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-serif font-bold text-[#292925] leading-tight">Admin Precautionary Directives</h3>
              <span className="text-[9px] font-mono text-[#71806B] font-semibold">OSHA / DGMS REFINERY COMPLIANCE</span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-[#9A6258]/15 text-[#9A6258] px-2 py-0.5 rounded font-bold">
            MANDATORY SOP
          </span>
        </div>

        <div className="space-y-2 text-xs text-[#292925]">
          <div className="p-2.5 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#B08A55]/20 text-[#B08A55] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">1</span>
            <div>
              <div className="font-semibold text-[#292925] text-[11px]">Action Level (0.50 – 1.00 ppm·h): Immediate Personnel Rotation</div>
              <p className="text-[10px] text-[#5D5B53] mt-0.5 leading-relaxed">
                Immediately rotate operator out of active battery (SRU/CDU) to pressurized control room. Cap remaining shift exposure.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#9A6258]/20 text-[#9A6258] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">2</span>
            <div>
              <div className="font-semibold text-[#292925] text-[11px]">Overexposure (&gt; 1.00 ppm·h): Shift Suspension &amp; OHC Triage</div>
              <p className="text-[10px] text-[#5D5B53] mt-0.5 leading-relaxed">
                Suspend shift immediately. Escort operator to Occupational Health Center for vitals &amp; peak flow. Mandatory 24h rest before next shift.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#71806B]/20 text-[#4F5D4B] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">3</span>
            <div>
              <div className="font-semibold text-[#292925] text-[11px]">Chemical Matrix Lifecycle &amp; Batch Quarantine</div>
              <p className="text-[10px] text-[#5D5B53] mt-0.5 leading-relaxed">
                Decommission and physically quarantine any Cu-PAN wristband older than 90 days or showing bleaching/matrix degradation.
              </p>
            </div>
          </div>

          <div className="p-2.5 bg-[#F6F1E7] rounded-xl border border-[#D8D0C2] flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#292925]/10 text-[#292925] font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">4</span>
            <div>
              <div className="font-semibold text-[#292925] text-[11px]">Environmental Storage Standards</div>
              <p className="text-[10px] text-[#5D5B53] mt-0.5 leading-relaxed">
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
