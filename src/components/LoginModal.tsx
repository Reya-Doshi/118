import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole, UserProfile } from '../types';
import { 
  X, 
  Check, 
  HardHat, 
  ShieldCheck, 
  Sliders, 
  ChevronRight, 
  User, 
  Tag, 
  LogIn,
  KeyRound,
  IdCard,
  ArrowRight
} from 'lucide-react';

interface PresetPersonnel extends UserProfile {
  title: string;
  badgeStatus?: string;
  currentDoseStr?: string;
  targetDestination: string;
}

const PRESET_PERSONNEL: PresetPersonnel[] = [
  {
    id: 'usr_worker_01',
    name: 'Rahul Shetty',
    role: 'WORKER',
    employeeId: 'WRK-2048',
    department: 'Hydrocracker Unit 2',
    assignedBandId: 'DS-1088',
    avatarText: 'RS',
    designation: 'Process Operator',
    workLocation: 'Cat-Cracking Deck B · Zone 1',
    shift: 'Morning · 06:00–14:00',
    title: 'Process Operator (Worker)',
    badgeStatus: 'MONITOR',
    currentDoseStr: '0.72 ppm·h',
    targetDestination: 'Personal Worker Dashboard'
  },
  {
    id: 'usr_worker_02',
    name: 'Sanjay Rao',
    role: 'WORKER',
    employeeId: 'WRK-3012',
    department: 'Sulfur Recovery Unit (SRU)',
    assignedBandId: 'DS-1091',
    avatarText: 'SR',
    designation: 'Maintenance Technician',
    workLocation: 'Amine Reboiler & Claus Unit',
    shift: 'Morning · 06:00–14:00',
    title: 'Maintenance Tech (Worker)',
    badgeStatus: 'REVIEW',
    currentDoseStr: '1.24 ppm·h',
    targetDestination: 'Personal Worker Dashboard'
  },
  {
    id: 'usr_officer_01',
    name: 'Kavita Sharma',
    role: 'OFFICER',
    employeeId: 'HSE-4012',
    department: 'Plant HSE & Safety Audit',
    avatarText: 'KS',
    designation: 'Lead Safety Auditor',
    workLocation: 'Central HSE Control Center',
    shift: 'General · 08:00–17:00',
    title: 'Plant Safety Officer (HSE)',
    targetDestination: 'Shift Safety Overview'
  },
  {
    id: 'usr_admin_01',
    name: 'Vikram Malhotra',
    role: 'ADMIN',
    employeeId: 'ADM-1001',
    department: 'Plant Operations Directorate',
    avatarText: 'VM',
    designation: 'Operations Director',
    workLocation: 'MRPL Plant Headquarters',
    shift: 'General · 08:00–17:00',
    title: 'Site Administrator',
    targetDestination: 'Worker Operations Directory'
  }
];

export const LoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    currentUser, 
    setCurrentUser, 
    showToast, 
    setActivePage,
    setSelectedWorker,
    workers 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [selectedRole, setSelectedRole] = useState<UserRole>('WORKER');
  const [customName, setCustomName] = useState('');
  const [customEmpId, setCustomEmpId] = useState('');
  const [customDept, setCustomDept] = useState('');
  const [customBandId, setCustomBandId] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSelectPreset = (personnel: PresetPersonnel) => {
    setCurrentUser(personnel);

    if (personnel.role === 'WORKER') {
      const matched = workers.find(
        w => w.workerId === personnel.employeeId || w.badgeId === personnel.assignedBandId
      );
      if (matched) {
        setSelectedWorker(matched);
      }
      setActivePage('worker-dashboard');
      showToast(`Welcome, ${personnel.name}! Opened your Personal Operator Dashboard.`);
    } else if (personnel.role === 'OFFICER') {
      setActivePage('dashboard');
      showToast(`Welcome, ${personnel.name}! Opened Plant Safety Overview.`);
    } else {
      setActivePage('workers');
      showToast(`Welcome, ${personnel.name}! Opened Operations Directory.`);
    }

    closeLoginModal();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      showToast('Please enter your name');
      return;
    }

    const initials = customName
      .trim()
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'OP';

    const empId = customEmpId.trim() || (selectedRole === 'WORKER' ? 'WRK-2048' : selectedRole === 'OFFICER' ? 'HSE-4012' : 'ADM-1001');
    const bandId = customBandId.trim() || (selectedRole === 'WORKER' ? 'DS-1088' : undefined);
    const dept = customDept.trim() || (selectedRole === 'WORKER' ? 'Hydrocracker Unit 2' : selectedRole === 'OFFICER' ? 'Plant HSE Team' : 'Plant Directorate');

    const profile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: customName.trim(),
      role: selectedRole,
      employeeId: empId,
      department: dept,
      assignedBandId: bandId,
      avatarText: initials,
      designation: selectedRole === 'WORKER' ? 'Field Operator' : selectedRole === 'OFFICER' ? 'Safety Inspector' : 'Site Administrator',
      workLocation: 'MRPL Refinery Complex',
      shift: 'Morning · 06:00–14:00'
    };

    setCurrentUser(profile);

    if (selectedRole === 'WORKER') {
      const matched = workers.find(
        w => w.workerId === empId || w.badgeId === bandId || w.name.toLowerCase() === profile.name.toLowerCase()
      );
      if (matched) {
        setSelectedWorker(matched);
      }
      setActivePage('worker-dashboard');
      showToast(`Welcome, ${profile.name}! Opened your Personal Operator Dashboard.`);
    } else if (selectedRole === 'OFFICER') {
      setActivePage('dashboard');
      showToast(`Welcome, ${profile.name}! Opened Plant Safety Overview.`);
    } else {
      setActivePage('workers');
      showToast(`Welcome, ${profile.name}! Opened Operations Directory.`);
    }

    closeLoginModal();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeLoginModal}
    >
      <div 
        className="bg-[#F6F1E7] border border-[#D8D0C2] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-[#292925] flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#D8D0C2] bg-[#EDE5D6]/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#292925] text-[#F6F1E7] flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              118
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#292925] tracking-tight flex items-center gap-2">
                <span>Personnel Authentication</span>
                <span className="text-[10px] font-mono bg-[#71806B]/20 text-[#4F5D4B] px-2 py-0.5 rounded font-semibold uppercase">
                  MRPL Refinery
                </span>
              </h3>
              <p className="text-[11px] text-[#5D5B53] font-serif">
                Select your plant credentials to access your personal dashboard
              </p>
            </div>
          </div>

          <button
            onClick={closeLoginModal}
            className="p-2 rounded-xl text-[#5D5B53] hover:text-[#292925] hover:bg-[#D8D0C2]/50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="px-6 pt-4 pb-2 border-b border-[#D8D0C2]/70 flex gap-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-[#292925] text-[#F6F1E7] shadow-xs'
                : 'bg-[#EDE5D6]/60 text-[#5D5B53] hover:bg-[#EDE5D6] hover:text-[#292925]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Operational Passes (1-Tap)</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-[#292925] text-[#F6F1E7] shadow-xs'
                : 'bg-[#EDE5D6]/60 text-[#5D5B53] hover:bg-[#EDE5D6] hover:text-[#292925]'
            }`}
          >
            <IdCard className="w-3.5 h-3.5" />
            <span>Custom Badge ID</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {activeTab === 'presets' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[#878377] font-mono">
                <span>SELECT PERSONNEL PASS TO SIGN IN</span>
                <span className="text-[#4F5D4B] font-semibold">Immediate Dashboard Routing</span>
              </div>

              {PRESET_PERSONNEL.map((personnel) => {
                const isCurrent = currentUser?.employeeId === personnel.employeeId;
                const isWorker = personnel.role === 'WORKER';
                const isOfficer = personnel.role === 'OFFICER';

                return (
                  <button
                    key={personnel.id}
                    onClick={() => handleSelectPreset(personnel)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer relative group flex items-start justify-between gap-3 ${
                      isCurrent
                        ? 'border-[#71806B] bg-[#71806B]/12 shadow-sm ring-1 ring-[#71806B]'
                        : 'border-[#D8D0C2] bg-[#EDE5D6]/60 hover:bg-[#EDE5D6] hover:border-[#B08A55]/60 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Avatar initial badge */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-xs shrink-0 ${
                        isWorker 
                          ? 'bg-[#B08A55] text-white' 
                          : isOfficer 
                          ? 'bg-[#4F5D4B] text-white' 
                          : 'bg-[#292925] text-white'
                      }`}>
                        {isWorker ? <HardHat className="w-5 h-5" /> : isOfficer ? <ShieldCheck className="w-5 h-5" /> : <Sliders className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-serif font-bold text-[#292925] group-hover:text-[#4F5D4B] transition-colors">
                            {personnel.name}
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                            isWorker
                              ? 'bg-[#B08A55]/15 border-[#B08A55]/30 text-[#795726]'
                              : isOfficer
                              ? 'bg-[#4F5D4B]/15 border-[#4F5D4B]/30 text-[#385034]'
                              : 'bg-[#292925]/10 border-[#292925]/20 text-[#292925]'
                          }`}>
                            {personnel.role}
                          </span>
                        </div>

                        <p className="text-xs text-[#5D5B53] font-serif leading-tight">
                          {personnel.employeeId} · {personnel.department}
                        </p>

                        {/* Additional status pill for workers */}
                        {isWorker && (
                          <div className="flex items-center gap-2 pt-1 text-[10px] font-mono text-[#71806B]">
                            <span className="bg-[#EDE5D6] px-2 py-0.5 rounded border border-[#D8D0C2]">
                              Band: {personnel.assignedBandId}
                            </span>
                            <span className={`font-bold ${
                              personnel.badgeStatus === 'REVIEW' 
                                ? 'text-[#9A6258]' 
                                : personnel.badgeStatus === 'MONITOR' 
                                ? 'text-[#B08A55]' 
                                : 'text-[#4F5D4B]'
                            }`}>
                              Dose: {personnel.currentDoseStr} [{personnel.badgeStatus}]
                            </span>
                          </div>
                        )}

                        <div className="text-[10px] font-mono text-[#878377] flex items-center gap-1 pt-0.5">
                          <span>Routes to:</span>
                          <span className="font-semibold text-[#292925]">{personnel.targetDestination}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right status / action indicator */}
                    <div className="shrink-0 self-center">
                      {isCurrent ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#71806B]/20 text-[#385034] text-[10px] font-mono font-bold">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#EDE5D6] border border-[#D8D0C2] flex items-center justify-center text-[#5D5B53] group-hover:bg-[#292925] group-hover:text-white group-hover:border-[#292925] transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              
              {/* Role Picker */}
              <div>
                <label className="text-[10px] font-mono font-bold text-[#5D5B53] block uppercase tracking-wider mb-2">
                  Select Authorization Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['WORKER', 'OFFICER', 'ADMIN'] as UserRole[]).map((r) => (
                    <button
                      type="button"
                      key={r}
                      onClick={() => setSelectedRole(r)}
                      className={`py-2.5 px-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        selectedRole === r
                          ? 'border-[#292925] bg-[#292925] text-[#F6F1E7] shadow-xs'
                          : 'border-[#D8D0C2] bg-[#EDE5D6]/70 text-[#5D5B53] hover:bg-[#EDE5D6]'
                      }`}
                    >
                      {r === 'WORKER' ? (
                        <>
                          <HardHat className="w-4 h-4" />
                          <span>Operator</span>
                        </>
                      ) : r === 'OFFICER' ? (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>HSE Officer</span>
                        </>
                      ) : (
                        <>
                          <Sliders className="w-4 h-4" />
                          <span>Site Admin</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-[10px] font-mono font-bold text-[#5D5B53] block uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#878377] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D8D0C2] bg-white text-xs text-[#292925] focus:outline-none focus:border-[#71806B] shadow-2xs"
                  />
                </div>
              </div>

              {/* Grid: Employee ID & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#5D5B53] block uppercase tracking-wider mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={customEmpId}
                    onChange={e => setCustomEmpId(e.target.value)}
                    placeholder={selectedRole === 'WORKER' ? 'WRK-XXXX' : 'EMP-XXXX'}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D0C2] bg-white text-xs text-[#292925] focus:outline-none focus:border-[#71806B] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[#5D5B53] block uppercase tracking-wider mb-1">
                    Department / Unit
                  </label>
                  <input
                    type="text"
                    value={customDept}
                    onChange={e => setCustomDept(e.target.value)}
                    placeholder="e.g. Hydrocracker Unit 2"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8D0C2] bg-white text-xs text-[#292925] focus:outline-none focus:border-[#71806B] shadow-2xs"
                  />
                </div>
              </div>

              {/* If Worker: Wristband ID */}
              {selectedRole === 'WORKER' && (
                <div>
                  <label className="text-[10px] font-mono font-bold text-[#5D5B53] block uppercase tracking-wider mb-1">
                    Assigned Wristband ID
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-[#878377] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customBandId}
                      onChange={e => setCustomBandId(e.target.value)}
                      placeholder="e.g. DS-1088"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#D8D0C2] bg-white text-xs text-[#292925] focus:outline-none focus:border-[#71806B] shadow-2xs"
                    />
                  </div>
                  <span className="text-[10px] text-[#878377] font-serif block mt-1">
                    Links to optical calibration curve & personal shift dose history.
                  </span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 mt-3 rounded-xl bg-[#292925] hover:bg-[#1f1f1c] text-[#F6F1E7] font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-[#71806B]" />
                <span>
                  {selectedRole === 'WORKER' 
                    ? 'AUTHORIZE & OPEN WORKER DASHBOARD' 
                    : selectedRole === 'OFFICER'
                    ? 'AUTHORIZE & OPEN PLANT SAFETY OVERVIEW'
                    : 'AUTHORIZE & OPEN SITE ROSTER'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3 border-t border-[#D8D0C2] bg-[#EDE5D6]/40 flex items-center justify-between text-[10px] font-mono text-[#878377]">
          <span>MRPL Dosimetry Network · v2.4</span>
          <span>Role-Based Access Control</span>
        </div>

      </div>
    </div>
  );
};
