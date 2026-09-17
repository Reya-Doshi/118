import React, { useState } from 'react';
import type { Worker, Wristband, Reading, Alert } from '../types/mobile';
import { repository } from '../services/DosimeterRepository';
import { 
  Users, 
  Radio, 
  AlertTriangle, 
  Activity, 
  UserPlus, 
  Check, 
  X, 
  ChevronRight, 
  BarChart3, 
  ShieldAlert,
  Download,
  Search,
  History,
  FileSpreadsheet,
  FileCheck2,
  ShieldCheck
} from 'lucide-react';

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

  // Deliverable 3 State: Exposure Logs & Worker History
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NORMAL' | 'MONITOR' | 'REVIEW'>('ALL');
  const [inspectorWorker, setInspectorWorker] = useState<Worker | null>(null);

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

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Worker Name', 'Worker ID', 'Badge ID', 'Shift', 'Dose (ppm·h)', 'Status', 'Location'];
    const rows = readings.map(r => [
      r.timestamp,
      `"${r.workerName}"`,
      r.workerId,
      r.bandId,
      `"${r.shiftId}"`,
      r.estimatedDose.toFixed(2),
      r.status,
      `"${r.inspectionLocation || 'Refinery Plant'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SARVAS_Mobile_Exposure_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportOISD = () => {
    const oisdContent = `====================================================================================\n` +
      `OIL INDUSTRY SAFETY DIRECTORATE (OISD-STD-113) & DGMS STATUTORY SHIFT REPORT\n` +
      `SARVAS Mobile Supervisor Station - Refinery Chemical Dosimetry Monitoring\n` +
      `====================================================================================\n\n` +
      `Statutory Reference: OISD-113 & DGMS Tech. Cir. 04 (Shift Exposure Surveillance)\n` +
      `Refinery Complex: Mangalore Refinery & Petrochemicals Ltd (Sector 4)\n` +
      `Inspection Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}\n` +
      `Lead Safety Auditor: Mira Patel (HSE-4012)\n` +
      `Colorimetric Engine: CIEDE2000 Conformal with Locus Vector Verification\n\n` +
      `STATUTORY THRESHOLDS:\n` +
      `- DGMS Action Level: 0.50 ppm·h\n` +
      `- OISD TWA Limit: 1.00 ppm·h\n` +
      `- Critical IDLH Saturated Black CuS: >= 10.00 ppm·h\n\n` +
      `SHIFT READINGS LOGS (${readings.length} Total):\n` +
      `------------------------------------------------------------------------------------\n` +
      readings.map((r, i) => `${(i + 1).toString().padStart(2, '0')}. [${r.timestamp}] ${r.workerName.padEnd(16)} | ID: ${r.workerId} | Band: ${r.bandId} | Dose: ${r.estimatedDose.toFixed(2)} ppm·h | Status: ${r.status}`).join('\n') +
      `\n\nStatutory Electronic Signature: Chief Safety Officer Mira Patel\n`;

    const blob = new Blob([oisdContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OISD_STD_113_Mobile_Shift_Log_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="pt-1 flex items-center gap-3">
        <img 
          src="/sarvas_logo_v2.png" 
          alt="RageB8 Official Logo" 
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

      {/* Quick Actions Bar with Export Suite */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setShowAssignModal(true)}
          className="p-2.5 bg-gray-950 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-md border border-gray-800"
        >
          <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Assign</span>
        </button>
        <button
          onClick={onViewBands}
          className="card-glow p-2.5 text-gray-900 text-xs font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-700" />
          <span>Bands ({wristbands.length})</span>
        </button>
        <button
          onClick={handleExportCSV}
          className="card-glow p-2.5 bg-emerald-50 text-emerald-900 border-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
        >
          <Download className="w-3.5 h-3.5 text-emerald-700" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* SHIFT EXPOSURE LOGS & WORKER HISTORY SECTION (Deliverable 3) */}
      <div className="card-glow p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-emerald-700 border border-emerald-200">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-serif font-bold text-gray-900 leading-tight">Shift Exposure Logs</h3>
              <span className="text-[9px] font-mono text-gray-500">Tap worker to inspect history</span>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-gray-700">
            {readings.length} Scans
          </span>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search worker or badge ID..."
              className="w-full pl-8 pr-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-900 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div className="grid grid-cols-4 gap-1 text-[10px] font-mono font-bold text-center">
            {(['ALL', 'NORMAL', 'MONITOR', 'REVIEW'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`py-1 rounded-md transition-all ${
                  statusFilter === st ? 'bg-[#292925] text-white shadow-2xs' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Readings List */}
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {readings
            .filter(r => {
              const matchesSearch = r.workerName.toLowerCase().includes(searchTerm.toLowerCase()) || r.bandId.toLowerCase().includes(searchTerm.toLowerCase());
              const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
              return matchesSearch && matchesStatus;
            })
            .slice(0, 10)
            .map(r => {
              const matchedWorker = workers.find(w => w.workerId === r.workerId) || workers[0];
              return (
                <div
                  key={r.readingId}
                  onClick={() => setInspectorWorker(matchedWorker)}
                  className="p-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-between text-xs cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs shrink-0"
                      style={{ backgroundColor: r.rgb?.hex || '#B8728A' }}
                    />
                    <div>
                      <div className="font-bold text-gray-900 leading-tight">{r.workerName}</div>
                      <div className="text-[9px] font-mono text-gray-500">Badge #{r.bandId} · {r.inspectionLocation || 'Refinery Sector'}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-gray-900">{r.estimatedDose.toFixed(2)} ppm·h</div>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      r.status === 'NORMAL' ? 'bg-emerald-100 text-emerald-800' : r.status === 'MONITOR' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Mobile Export Suite */}
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={handleExportCSV}
            className="flex-1 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-semibold text-gray-800 flex items-center justify-center gap-1.5 shadow-2xs active:scale-98"
          >
            <Download className="w-3.5 h-3.5 text-gray-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleExportOISD}
            className="flex-1 py-2 bg-[#292925] text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>OISD / DGMS Log</span>
          </button>
        </div>
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
                Decommission and physically quarantine any dual-zone Ag/Cu wristband older than 90 days or showing seal breach (blue indicator dot).
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

      {/* WORKER HISTORY INSPECTOR MODAL (Deliverable 3) */}
      {inspectorWorker && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F6F1E7] w-full max-w-sm rounded-2xl border border-[#D8D0C2] shadow-2xl overflow-hidden max-h-[85vh] flex flex-col animate-in zoom-in-95">
            <div className="p-4 bg-[#EDE5D6] border-b border-[#D8D0C2] flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-[#292925]">{inspectorWorker.name}</h3>
                <span className="text-[10px] font-mono text-gray-600">
                  {inspectorWorker.workerId} · Badge #{inspectorWorker.assignedBandId}
                </span>
              </div>
              <button
                onClick={() => setInspectorWorker(null)}
                className="w-7 h-7 rounded-full bg-white border border-[#D8D0C2] flex items-center justify-center text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                  <div className="text-[9px] font-mono text-gray-500 uppercase">Current Dose</div>
                  <div className="font-mono font-bold text-base text-gray-900">{inspectorWorker.currentDose.toFixed(2)} ppm·h</div>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-gray-200">
                  <div className="text-[9px] font-mono text-gray-500 uppercase">Status</div>
                  <div className={`font-mono font-bold text-xs mt-1 ${
                    inspectorWorker.status === 'NORMAL' ? 'text-emerald-700' : inspectorWorker.status === 'MONITOR' ? 'text-amber-700' : 'text-red-700'
                  }`}>
                    {inspectorWorker.status}
                  </div>
                </div>
              </div>

              <div>
                <div className="font-bold text-[#292925] mb-1.5 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-[#4F5D4B]" />
                  <span>Recent Scans ({inspectorWorker.name})</span>
                </div>
                <div className="space-y-1.5">
                  {readings
                    .filter(r => r.workerId === inspectorWorker.workerId || r.workerName === inspectorWorker.name)
                    .slice(0, 5)
                    .map(r => (
                      <div key={r.readingId} className="p-2 bg-white rounded-lg border border-gray-200 flex items-center justify-between text-[11px]">
                        <div>
                          <div className="font-mono text-gray-500 text-[10px]">{r.timestamp}</div>
                          <div className="font-medium text-gray-800">{r.inspectionLocation || 'Refinery Sector'}</div>
                        </div>
                        <div className="text-right font-mono font-bold text-gray-900">
                          {r.estimatedDose.toFixed(2)} ppm·h
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-gray-200 text-[10px] text-gray-600 space-y-0.5">
                <div><strong>Department:</strong> {inspectorWorker.department}</div>
                <div><strong>Current Shift:</strong> {inspectorWorker.shift}</div>
                <div><strong>OSHA Limit:</strong> 1.00 ppm·h (8-hr TWA)</div>
              </div>
            </div>

            <div className="p-3 bg-[#EDE5D6] border-t border-[#D8D0C2]">
              <button
                onClick={() => setInspectorWorker(null)}
                className="w-full py-2 bg-[#292925] text-white rounded-xl font-bold text-xs"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
