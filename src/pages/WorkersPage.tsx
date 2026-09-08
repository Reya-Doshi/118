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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#D8D0C2]">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#292925]">Workers</h1>
          <p className="text-xs text-[#292925]/70 mt-0.5">Industrial Plant Personnel Exposure Roster</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#292925]/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search worker or badge ID…"
              className="w-full pl-9 pr-4 py-2 bg-[#F6F1E7] rounded-lg border border-[#D8D0C2] text-xs text-[#292925] focus:outline-none focus:border-[#4F5D4B]"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-[#F6F1E7] p-1 rounded-lg border border-[#D8D0C2] text-xs font-semibold">
            {(['ALL', 'NORMAL', 'MONITOR', 'REVIEW'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#292925] text-[#F6F1E7]'
                    : 'text-[#292925]/70 hover:bg-[#EDE5D6]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* WORKERS TABLE */}
      <div className="bg-[#EDE5D6]/30 rounded-xl border border-[#D8D0C2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EDE5D6] text-[#292925]/80 font-mono border-b border-[#D8D0C2]">
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
            <tbody className="divide-y divide-[#D8D0C2]/70">
              {filteredWorkers.map(w => (
                <tr
                  key={w.id}
                  onClick={() => setSelectedWorker(w)}
                  className="hover:bg-[#EDE5D6]/60 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 font-semibold text-[#292925]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#EDE5D6] text-[#4F5D4B] border border-[#D8D0C2] flex items-center justify-center font-mono font-bold text-xs">
                        {w.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-bold text-[#292925]">{w.name}</div>
                        <div className="text-[10px] text-[#292925]/60">{w.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[#292925]/70">{w.workerId}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#292925]">{w.badgeId}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#292925]">
                    {w.currentDose.toFixed(2)} ppm·h
                  </td>
                  <td className="py-3.5 px-4">
                    {/* Mini Sparkline Bar Preview */}
                    <div className="flex items-end gap-1 h-6 w-24">
                      {w.trend7Day.map((d, idx) => (
                        <div
                          key={idx}
                          className="flex-1 bg-[#4F5D4B] rounded-xs opacity-75 hover:opacity-100 transition-opacity"
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
                    <button className="px-3 py-1 bg-[#F6F1E7] border border-[#D8D0C2] text-[#292925] text-xs font-semibold rounded hover:bg-[#EDE5D6] transition-colors cursor-pointer">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#292925]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#F6F1E7] text-[#292925] rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#D8D0C2] relative overflow-hidden max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#D8D0C2] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#292925] text-[#F6F1E7] flex items-center justify-center font-mono text-lg font-bold">
                  {selectedWorker.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#292925]">{selectedWorker.name}</h2>
                  <div className="flex items-center gap-3 text-xs text-[#292925]/70 mt-0.5 font-medium">
                    <span className="font-mono">ID: {selectedWorker.workerId}</span>
                    <span>•</span>
                    <span>{selectedWorker.department}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedWorker(null)}
                className="p-2 rounded-full text-[#292925]/70 hover:bg-[#EDE5D6] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Profile Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#EDE5D6]/40 p-4 rounded-xl border border-[#D8D0C2]">
              <div>
                <div className="text-[10px] text-[#292925]/60 uppercase font-mono tracking-wider">Current Badge</div>
                <div className="text-sm font-mono font-bold text-[#292925]">{selectedWorker.badgeId}</div>
              </div>
              <div>
                <div className="text-[10px] text-[#292925]/60 uppercase font-mono tracking-wider">Shift Dose</div>
                <div className="text-sm font-mono font-bold text-[#292925]">{selectedWorker.currentDose.toFixed(2)} ppm·h</div>
              </div>
              <div>
                <div className="text-[10px] text-[#292925]/60 uppercase font-mono tracking-wider">Status</div>
                <div className="mt-0.5">
                  <StatusBadge status={selectedWorker.status} size="sm" />
                </div>
              </div>
              <div>
                <div className="text-[10px] text-[#292925]/60 uppercase font-mono tracking-wider">Shelf Validity</div>
                <div className="text-xs font-mono font-bold text-[#4F5D4B]">{selectedWorker.badgeValidityDays} Days Left</div>
              </div>
            </div>

            {/* 7-Day Cumulative Exposure Chart */}
            <div className="bg-[#EDE5D6]/30 p-5 rounded-xl border border-[#D8D0C2] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#4F5D4B]" />
                  <h3 className="text-sm font-bold text-[#292925]">7-Day Cumulative Exposure History</h3>
                </div>
                <span className="text-[10px] font-mono text-[#292925]/60">Target Limit: 1.00 ppm·h</span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedWorker.trend7Day} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" stroke="#292925" opacity={0.6} fontSize={11} tickLine={false} />
                    <YAxis stroke="#292925" opacity={0.6} fontSize={11} tickLine={false} unit=" ppm·h" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#292925', border: '1px solid #D8D0C2', borderRadius: '8px', color: '#F6F1E7', fontSize: '12px' }}
                    />
                    <Bar dataKey="dose" fill="#4F5D4B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Current Wristband Badge Info */}
            <div className="bg-[#EDE5D6]/30 p-5 rounded-xl border border-[#D8D0C2] space-y-3">
              <h3 className="text-sm font-bold text-[#292925]">Current Wristband Badge Details</h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#292925]/60 block text-[10px]">Issued Date</span>
                  <span className="font-bold text-[#292925]">{selectedWorker.badgeIssuedDate}</span>
                </div>
                <div>
                  <span className="text-[#292925]/60 block text-[10px]">Expiry Date</span>
                  <span className="font-bold text-[#292925]">{selectedWorker.badgeExpiryDate}</span>
                </div>
                <div>
                  <span className="text-[#292925]/60 block text-[10px]">Assigned Shift</span>
                  <span className="font-bold text-[#292925]">{selectedWorker.shift.split('·')[0]}</span>
                </div>
                <div>
                  <span className="text-[#292925]/60 block text-[10px]">Badge Status</span>
                  <span className="font-bold text-[#4F5D4B]">VALID</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedWorker(null)}
                className="px-5 py-2 bg-[#4F5D4B] text-[#F6F1E7] text-xs font-semibold rounded-lg hover:bg-[#3d493a] transition-colors cursor-pointer"
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
