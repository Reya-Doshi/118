import React, { useState } from 'react';
import type { Wristband } from '../types/mobile';
import { ArrowLeft, Radio, Search, AlertCircle, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

interface BandsManagementViewProps {
  wristbands: Wristband[];
  onBack: () => void;
}

export const BandsManagementView: React.FC<BandsManagementViewProps> = ({
  wristbands,
  onBack
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = wristbands.filter(b => 
    b.bandId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.workerName && b.workerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            Wristband Inventory
          </h1>
          <span className="text-[11px] font-mono text-[#71806B]">
            Hardware Life Cycle & Expiry Tracker
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-3 text-[#878377]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by Band ID or Operator..."
          className="w-full bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#292925] placeholder-[#878377] focus:outline-none"
        />
      </div>

      {/* Wristbands List */}
      <div className="space-y-2.5">
        {filtered.map((band) => {
          const isExpired = band.status === 'EXPIRED' || band.shelfAgeDays > 90;

          return (
            <div
              key={band.bandId}
              className={`border rounded-xl p-3.5 space-y-2 shadow-xs ${
                isExpired
                  ? 'bg-[#F6E2DF]/60 border-[#E4B5AF]'
                  : 'bg-[#EDE5D6] border-[#D8D0C2]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#292925] text-white flex items-center justify-center font-mono font-bold text-xs">
                    {band.bandId.slice(-4)}
                  </div>
                  <div>
                    <div className="font-mono font-bold text-sm text-[#292925]">
                      {band.bandId}
                    </div>
                    <div className="text-[11px] text-[#5D5B53]">
                      {band.workerName ? `Assigned: ${band.workerName}` : 'Unassigned (In Storage)'}
                    </div>
                  </div>
                </div>

                <div>
                  <span
                    className={`subtle-badge ${
                      isExpired ? 'badge-review' : 'badge-normal'
                    }`}
                  >
                    {isExpired ? 'EXPIRED (>90d)' : 'ACTIVE'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#5D5B53] pt-1 border-t border-[#D8D0C2]/50">
                <div>
                  <span className="text-[10px] text-[#878377] block uppercase">Batch</span>
                  <span>{band.batchNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#878377] block uppercase">Shelf Age</span>
                  <span>{band.shelfAgeDays} days (Max 90d)</span>
                </div>
              </div>

              {isExpired && (
                <div className="p-2 bg-[#9A6258]/15 rounded text-[11px] text-[#7A342B] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>Sensing strip degraded. Discard and re-issue.</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
