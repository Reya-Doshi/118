import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { UserRole, UserProfile } from '../types';
import { 
  X, 
  Check, 
  LogIn, 
  ArrowRight
} from 'lucide-react';

const PRESET_ACCOUNTS: UserProfile[] = [
  {
    id: 'usr_worker_01',
    name: 'Rajesh Kumar',
    role: 'WORKER',
    employeeId: 'EMP-9021',
    department: 'Hydrocracker Unit 2',
    assignedBandId: 'DS-1088',
    avatarText: 'RK'
  },
  {
    id: 'usr_officer_01',
    name: 'Kavita Sharma',
    role: 'OFFICER',
    employeeId: 'HSE-4012',
    department: 'Plant HSE & Safety Audit',
    avatarText: 'KS'
  },
  {
    id: 'usr_admin_01',
    name: 'Vikram Malhotra',
    role: 'ADMIN',
    employeeId: 'ADM-1001',
    department: 'Plant Operations Directorate',
    avatarText: 'VM'
  }
];

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, currentUser, setCurrentUser, showToast, setActivePage } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('WORKER');
  const [customEmpId, setCustomEmpId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customDept, setCustomDept] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSelectPreset = (account: UserProfile) => {
    setCurrentUser(account);
    showToast(`Logged in as ${account.name} (${account.role})`);
    closeLoginModal();
    if (account.role === 'WORKER') {
      setActivePage('scan');
    } else {
      setActivePage('dashboard');
    }
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) {
      showToast('Please enter an employee name');
      return;
    }

    const initials = customName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'OP';
    const profile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: customName.trim(),
      role: selectedRole,
      employeeId: customEmpId.trim() || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      department: customDept.trim() || (selectedRole === 'WORKER' ? 'Refinery Unit' : 'HSE Team'),
      assignedBandId: selectedRole === 'WORKER' ? 'DS-1088' : undefined,
      avatarText: initials
    };

    setCurrentUser(profile);
    showToast(`Logged in as ${profile.name}`);
    closeLoginModal();
    if (profile.role === 'WORKER') {
      setActivePage('scan');
    } else {
      setActivePage('dashboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#F6F1E7] border border-[#D8D0C2] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-[#292925]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#D8D0C2] bg-[#EDE5D6]/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#292925] text-[#F6F1E7] flex items-center justify-center font-mono font-bold text-xs">
              118
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono tracking-tight text-[#292925]">
                Account & Role Access
              </h3>
              <p className="text-[10px] text-[#5D5B53] font-serif">
                Select your refinery operational role or sign in
              </p>
            </div>
          </div>
          <button
            onClick={closeLoginModal}
            className="p-1.5 rounded-lg text-[#5D5B53] hover:text-[#292925] hover:bg-[#D8D0C2]/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          
          {/* Quick Demo Access Presets */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#71806B] font-bold block mb-2">
              1-Click Demo Profiles
            </span>
            <div className="space-y-2">
              {PRESET_ACCOUNTS.map((acc) => {
                const isCurrent = currentUser?.id === acc.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleSelectPreset(acc)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-[#71806B] bg-[#71806B]/10 shadow-xs'
                        : 'border-[#D8D0C2] bg-[#EDE5D6]/50 hover:bg-[#EDE5D6] hover:border-[#B08A55]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        acc.role === 'WORKER'
                          ? 'bg-[#B08A55] text-white'
                          : acc.role === 'OFFICER'
                          ? 'bg-[#4F5D4B] text-white'
                          : 'bg-[#292925] text-white'
                      }`}>
                        {acc.avatarText}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-[#292925]">{acc.name}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded border border-[#D8D0C2] text-[#5D5B53]">
                            {acc.role}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#5D5B53] block font-serif">
                          {acc.employeeId} · {acc.department}
                        </span>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#4F5D4B] font-bold">
                        <Check className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-[#878377]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D8D0C2]" />
            </div>
            <span className="relative px-3 bg-[#F6F1E7] text-[10px] font-mono text-[#878377] uppercase">
              Or Custom Sign-In
            </span>
          </div>

          {/* Custom Login Form */}
          <form onSubmit={handleCustomLogin} className="space-y-3">
            {/* Role Radio Group */}
            <div className="grid grid-cols-3 gap-2">
              {(['WORKER', 'OFFICER', 'ADMIN'] as UserRole[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`py-1.5 rounded-lg text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                    selectedRole === r
                      ? 'border-[#292925] bg-[#292925] text-[#F6F1E7]'
                      : 'border-[#D8D0C2] bg-[#EDE5D6]/60 text-[#5D5B53] hover:bg-[#EDE5D6]'
                  }`}
                >
                  {r === 'WORKER' ? 'Worker' : r === 'OFFICER' ? 'Safety Officer' : 'Site Admin'}
                </button>
              ))}
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#5D5B53] block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                placeholder="e.g. Ramesh Patel"
                className="w-full px-3 py-1.5 rounded-lg border border-[#D8D0C2] bg-white text-xs text-[#292925] focus:outline-none focus:border-[#71806B]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-mono text-[#5D5B53] block mb-1">
                  Employee ID (Optional)
                </label>
                <input
                  type="text"
                  value={customEmpId}
                  onChange={e => setCustomEmpId(e.target.value)}
                  placeholder="EMP-XXXX"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#D8D0C2] bg-white text-xs text-[#292925] focus:outline-none focus:border-[#71806B]"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#5D5B53] block mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={customDept}
                  onChange={e => setCustomDept(e.target.value)}
                  placeholder="e.g. Crude Distillation"
                  className="w-full px-3 py-1.5 rounded-lg border border-[#D8D0C2] bg-white text-xs text-[#292925] focus:outline-none focus:border-[#71806B]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-2 rounded-xl bg-[#4F5D4B] hover:bg-[#3E4A3B] text-[#F6F1E7] font-mono font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Enter 118 Portal</span>
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
