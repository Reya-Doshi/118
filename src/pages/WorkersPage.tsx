import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { Search, X, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export const WorkersPage: React.FC = () => {
  const { workers, selectedWorker, setSelectedWorker } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NORMAL' | 'MONITOR' | 'REVIEW'>('ALL');

  const filteredWorkers = workers.filter(w => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.workerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.badgeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Title & Search Filter */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[var(--card-border)]">
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-[var(--text-primary)]">Workers Dossier</h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">Industrial Plant Personnel Exposure Roster · SARVAS</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search worker or badge ID…"
              className="w-full pl-9 pr-4 py-2 bg-[var(--card-surface-subtle)] rounded-lg border border-[var(--card-border)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] font-mono"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-[var(--card-surface-subtle)] p-1 rounded-lg border border-[var(--card-border)] text-xs font-semibold font-mono">
            {(['ALL', 'NORMAL', 'MONITOR', 'REVIEW'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[var(--accent-primary)] text-black font-black'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-surface)]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WORKERS TABLE */}
      <div className="command-card rounded-xl border border-[var(--card-border)] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[var(--card-surface-subtle)] text-[var(--text-secondary)] font-mono border-b border-[var(--card-border)]">
              <tr>
                <th className="py-3 px-4 font-semibold">Worker</th>
                <th className="py-3 px-4 font-semibold">Worker ID</th>
                <th className="py-3 px-4 font-semibold">Badge</th>
                <th className="py-3 px-4 font-semibold">Current Dose</th>
                <th className="py-3 px-4 font-semibold">7-Day Dose Preview</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--card-border)]">
              {filteredWorkers.map(w => (
                <tr
                  key={w.id}
                  onClick={() => setSelectedWorker(w)}
                  className="hover:bg-[var(--card-surface-subtle)] cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-[var(--text-primary)]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[var(--card-surface)] text-[var(--accent-primary)] border border-[var(--card-border)] flex items-center justify-center font-mono font-bold text-xs">
                        {w.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{w.name}</div>
                        <div className="text-[10px] text-[var(--text-secondary)]">{w.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[var(--text-secondary)]">{w.workerId}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-primary)]">{w.badgeId}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[var(--text-primary)]">
                    {w.currentDose.toFixed(2)} ppm·h
                  </td>
                  <td className="py-3.5 px-4">
                    {/* Mini Sparkline Bar Preview */}
                    <div className="flex items-end gap-1 h-6 w-24">
                      {w.trend7Day.map((d, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-[var(--accent-primary)] rounded-xs opacity-75 hover:opacity-100 transition-opacity"
                          style={{ height: `${Math.min(100, Math.max(15, (d.dose / 1.5) * 100))}%` }}
                          title={`${d.day}: ${d.dose} ppm·h`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={w.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1 bg-[var(--card-surface)] border border-[var(--card-border)] text-[var(--text-primary)] text-xs font-mono font-semibold rounded hover:border-[var(--accent-primary)] transition-colors cursor-pointer">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED WORKER PROFILE MODAL / DRAWER */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
          <div className="command-card text-[var(--text-primary)] rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[var(--card-border)] relative overflow-hidden max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[var(--card-border)] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/20 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] flex items-center justify-center font-mono text-lg font-bold">
                  {selectedWorker.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold font-heading text-[var(--text-primary)]">{selectedWorker.name}</h2>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
                    <span>ID: {selectedWorker.workerId}</span>
                    <span>•</span>
                    <span>{selectedWorker.department}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedWorker(null)}
                className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-surface-subtle)] transition-colors cursor-pointer border border-transparent hover:border-[var(--card-border)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Profile Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[var(--card-surface-subtle)] p-4 rounded-xl border border-[var(--card-border)]">
              <div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase font-mono tracking-wider">Current Badge</div>
                <div className="text-sm font-mono font-bold text-[var(--text-primary)]">{selectedWorker.badgeId}</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase font-mono tracking-wider">Shift Dose</div>
                <div className="text-sm font-mono font-bold text-[var(--text-primary)]">{selectedWorker.currentDose.toFixed(2)} ppm·h</div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase font-mono tracking-wider">Status</div>
                <div className="mt-0.5">
                  <StatusBadge status={selectedWorker.status} size="sm" />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[var(--text-secondary)] uppercase font-mono tracking-wider">Shelf Validity</div>
                <div className="text-xs font-mono font-bold text-[var(--accent-primary)]">{selectedWorker.badgeValidityDays} Days Left</div>
              </div>
            </div>

            {/* 7-Day Cumulative Exposure Chart */}
            <div className="command-card p-5 rounded-xl border border-[var(--card-border)] space-y-3 bg-[var(--card-surface-subtle)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[var(--accent-primary)]" />
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">7-Day Cumulative Exposure History</h3>
                </div>
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">Target Limit: 1.00 ppm·h</span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedWorker.trend7Day} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="currentColor" className="text-[var(--text-secondary)]" fontSize={11} tickLine={false} />
                    <YAxis stroke="currentColor" className="text-[var(--text-secondary)]" fontSize={11} tickLine={false} unit=" ppm·h" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0c0f12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      itemStyle={{ color: '#DFFF00' }}
                    />
                    <Bar dataKey="dose" fill="#FF9500" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Current Wristband Badge Info */}
            <div className="command-card p-5 rounded-xl border border-[var(--card-border)] space-y-3 bg-[var(--card-surface-subtle)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Current Wristband Badge Details</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[var(--text-secondary)] block text-[10px]">Issued Date</span>
                  <span className="font-bold text-[var(--text-primary)]">{selectedWorker.badgeIssuedDate}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)] block text-[10px]">Expiry Date</span>
                  <span className="font-bold text-[var(--text-primary)]">{selectedWorker.badgeExpiryDate}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)] block text-[10px]">Assigned Shift</span>
                  <span className="font-bold text-[var(--text-primary)]">{selectedWorker.shift.split('·')[0]}</span>
                </div>
                <div>
                  <span className="text-[var(--text-secondary)] block text-[10px]">Badge Status</span>
                  <span className="font-bold text-[#10B981]">VALID</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-5 py-2 bg-[var(--accent-primary)] text-black text-xs font-mono font-bold rounded-lg hover:bg-[var(--accent-secondary)] transition-colors cursor-pointer"
              >
                Close Worker Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
