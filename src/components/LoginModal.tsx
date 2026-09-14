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
    name: 'Mira Patel',
    role: 'OFFICER',
    employeeId: 'HSE-4012',
    department: 'Plant HSE & Safety Audit',
    avatarText: 'MP',
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeLoginModal}
    >
      <div 
        className="command-card rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-[var(--text-primary)] border border-[var(--card-border)] flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--card-border)] bg-[var(--card-surface-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              S118
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
                <span>Personnel Authentication</span>
                <span className="text-[10px] font-mono bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 px-2 py-0.5 rounded font-semibold uppercase">
                  MRPL Refinery
                </span>
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)] font-mono">
                Select your plant credentials to access your personal dashboard
              </p>
            </div>
          </div>

          <button
            onClick={closeLoginModal}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--card-surface)] transition-colors cursor-pointer border border-transparent hover:border-[var(--card-border)]"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="px-6 pt-4 pb-2 border-b border-[var(--card-border)] flex gap-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'presets'
                ? 'bg-[var(--accent-primary)] text-black shadow-xs font-black'
                : 'bg-[var(--card-surface-subtle)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Operational Passes (1-Tap)</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-[var(--accent-primary)] text-black shadow-xs font-black'
                : 'bg-[var(--card-surface-subtle)] border border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
              <div className="flex items-center justify-between text-[11px] text-[var(--text-secondary)] font-mono">
                <span>SELECT PERSONNEL PASS TO SIGN IN</span>
                <span className="text-[var(--accent-primary)] font-semibold">Immediate Dashboard Routing</span>
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
                        ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10 shadow-sm ring-1 ring-[var(--accent-primary)]'
                        : 'border-[var(--card-border)] bg-[var(--card-surface-subtle)] hover:bg-[var(--card-surface)] hover:border-[var(--accent-primary)]/50 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Avatar initial badge */}
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono font-bold text-sm shadow-xs shrink-0 ${
                        isWorker 
                          ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40' 
                          : isOfficer 
                          ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/40' 
                          : 'bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/40'
                      }`}>
                        {isWorker ? <HardHat className="w-5 h-5" /> : isOfficer ? <ShieldCheck className="w-5 h-5" /> : <Sliders className="w-5 h-5" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                            {personnel.name}
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                            isWorker
                              ? 'bg-[#F59E0B]/15 border-[#F59E0B]/30 text-[#F59E0B]'
                              : isOfficer
                              ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]'
                              : 'bg-[#06B6D4]/15 border-[#06B6D4]/30 text-[#06B6D4]'
                          }`}>
                            {personnel.role}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--text-secondary)] leading-tight">
                          {personnel.employeeId} · {personnel.department}
                        </p>

                        {/* Additional status pill for workers */}
                        {isWorker && (
                          <div className="flex items-center gap-2 pt-1 text-[10px] font-mono">
                            <span className="bg-[var(--card-surface)] px-2 py-0.5 rounded border border-[var(--card-border)] text-[var(--text-secondary)]">
                              Band: {personnel.assignedBandId}
                            </span>
                            <span className={`font-bold ${
                              personnel.badgeStatus === 'REVIEW' 
                                ? 'text-[#EF4444]' 
                                : personnel.badgeStatus === 'MONITOR' 
                                ? 'text-[#F59E0B]' 
                                : 'text-[#10B981]'
                            }`}>
                              Dose: {personnel.currentDoseStr} [{personnel.badgeStatus}]
                            </span>
                          </div>
                        )}

                        <div className="text-[10px] font-mono text-[var(--text-secondary)] flex items-center gap-1 pt-0.5">
                          <span>Routes to:</span>
                          <span className="font-semibold text-[var(--text-primary)]">{personnel.targetDestination}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right status / action indicator */}
                    <div className="shrink-0 self-center">
                      {isCurrent ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/40 text-[10px] font-mono font-bold">
                          <Check className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--card-surface)] border border-[var(--card-border)] flex items-center justify-center text-[var(--text-secondary)] group-hover:bg-[var(--accent-primary)] group-hover:text-black group-hover:border-[var(--accent-primary)] transition-all">
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
                <label className="text-[10px] font-mono font-bold text-[var(--text-secondary)] block uppercase tracking-wider mb-2">
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
                          ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)] text-black shadow-xs font-black'
                          : 'border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
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
                <label className="text-[10px] font-mono font-bold text-[var(--text-secondary)] block uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    placeholder="e.g. Ramesh Patel"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
                  />
                </div>
              </div>

              {/* Grid: Employee ID & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-mono font-bold text-[var(--text-secondary)] block uppercase tracking-wider mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={customEmpId}
                    onChange={e => setCustomEmpId(e.target.value)}
                    placeholder={selectedRole === 'WORKER' ? 'WRK-XXXX' : 'EMP-XXXX'}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono font-bold text-[var(--text-secondary)] block uppercase tracking-wider mb-1">
                    Department / Unit
                  </label>
                  <input
                    type="text"
                    value={customDept}
                    onChange={e => setCustomDept(e.target.value)}
                    placeholder="e.g. Hydrocracker Unit 2"
                    className="w-full px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
                  />
                </div>
              </div>

              {/* If Worker: Wristband ID */}
              {selectedRole === 'WORKER' && (
                <div>
                  <label className="text-[10px] font-mono font-bold text-[var(--text-secondary)] block uppercase tracking-wider mb-1">
                    Assigned Wristband ID
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 text-[var(--text-secondary)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customBandId}
                      onChange={e => setCustomBandId(e.target.value)}
                      placeholder="e.g. CP-088"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] shadow-2xs"
                    />
                  </div>
                  <span className="text-[10px] text-[var(--text-secondary)] font-mono block mt-1">
                    Links to optical calibration curve & personal shift dose history.
                  </span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 mt-3 rounded-xl bg-gradient-to-r from-[#FF9500] to-[#F59E0B] hover:shadow-[0_0_15px_rgba(255,149,0,0.4)] text-black font-mono font-black text-xs tracking-wider flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
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
        <div className="px-6 py-3 border-t border-[var(--card-border)] bg-[var(--card-surface-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--text-secondary)]">
          <span>MRPL Dosimetry Network · SARVAS v2.4</span>
          <span>Role-Based Access Control</span>
        </div>

      </div>
    </div>
  );
};
