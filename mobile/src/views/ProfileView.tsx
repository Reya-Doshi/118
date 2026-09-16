import React from 'react';
import { useMobileAuth } from '../context/MobileAuthContext';
import { repository } from '../services/DosimeterRepository';
import type { UserRole } from '../types/mobile';
import { User, LogOut, RefreshCw, HardHat, ShieldAlert, Sliders, ShieldCheck, Tag, Building2 } from 'lucide-react';

interface ProfileViewProps {
  onBack: () => void;
  workerLanguage?: 'hi' | 'en';
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onBack, workerLanguage = 'en' }) => {
  const { currentUser, role, loginAsDemoRole, logout } = useMobileAuth();
  const isHindi = workerLanguage === 'hi';

  const worker = currentUser?.workerId ? repository.getWorkerById(currentUser.workerId) : null;
  const band = worker ? repository.getWristbands().find(b => b.bandId === worker.assignedBandId) : null;

  const getRoleDisplay = (r?: UserRole) => {
    if (!r) return '';
    if (isHindi) {
      switch (r) {
        case 'WORKER': return 'संयंत्र संचालक / कर्मचारी';
        case 'SAFETY_OFFICER': return 'सुरक्षा अधिकारी';
        case 'ADMIN': return 'सिस्टम प्रशासक';
        default: return r;
      }
    }
    return r.replace('_', ' ');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="pt-1 border-b border-[#D8D0C2] pb-3">
        <span className="text-[11px] font-mono text-[#71806B] uppercase tracking-wider font-semibold">
          {isHindi ? 'खाता एवं डिवाइस विन्यास' : 'Account & Device Configuration'}
        </span>
        <h1 className="text-xl font-serif font-bold text-[#292925]">
          {isHindi ? 'प्रोफाइल' : 'Profile'}
        </h1>
      </div>

      {/* User Info Card */}
      <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-2xl p-5 shadow-xs flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[#292925] text-[#F6F1E7] flex items-center justify-center font-serif font-bold text-xl shadow-xs">
          {currentUser?.name.slice(0, 2).toUpperCase() || 'OP'}
        </div>
        <div>
          <h2 className="font-serif font-bold text-base text-[#292925]">
            {currentUser?.name}
          </h2>
          <div className="text-xs text-[#5D5B53] font-mono font-medium">
            {getRoleDisplay(currentUser?.role)}
          </div>
          <div className="text-[11px] text-[#878377] mt-0.5">
            {currentUser?.email}
          </div>
        </div>
      </div>

      {/* Assigned Hardware Wristband (for Workers) */}
      {worker && (
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-bold text-[#292925] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#71806B]" />
              {isHindi ? 'आवंटित स्मार्ट रिस्टबैंड' : 'Assigned Hardware Wristband'}
            </span>
            <span className="subtle-badge badge-normal font-bold">
              {isHindi ? 'सक्रिय' : (band?.status || 'ACTIVE')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="bg-[#F6F1E7] p-2.5 rounded-lg border border-[#D8D0C2]">
              <span className="text-[10px] text-[#878377] block">
                {isHindi ? 'बैंड क्रमांक' : 'Band Identifier'}
              </span>
              <span className="font-mono font-bold text-[#292925]">{worker.assignedBandId}</span>
            </div>
            <div className="bg-[#F6F1E7] p-2.5 rounded-lg border border-[#D8D0C2]">
              <span className="text-[10px] text-[#878377] block">
                {isHindi ? 'उपयोग अवधि (आयु)' : 'Shelf Age'}
              </span>
              <span className="font-mono font-bold text-[#292925]">
                {band?.shelfAgeDays || 24} {isHindi ? 'दिन' : 'days'}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-[#878377] font-mono">
            {isHindi 
              ? `वैधता: ${band?.expiryDate || '27 Sep 2026'} · रासायनिक प्रमाणीकृत` 
              : `Valid until ${band?.expiryDate || '27 Sep 2026'} · Chemistry certified`}
          </p>
        </div>
      )}

      {/* Quick Switch Demo Role (for Judges and Evaluators) */}
      <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-[#292925]">
            {isHindi ? 'भूमिका बदलें (डेमो एक्सेस)' : 'Switch Active Role (Demo Access)'}
          </span>
          <span className="text-[10px] font-mono bg-[#71806B]/20 text-[#4F5D4B] px-1.5 py-0.5 rounded font-bold">
            SIH 2026
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => loginAsDemoRole('WORKER')}
            className={`p-2.5 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
              role === 'WORKER'
                ? 'bg-[#292925] text-white shadow-xs font-bold'
                : 'bg-[#F6F1E7] border border-[#D8D0C2] text-[#292925]'
            }`}
          >
            <HardHat className="w-4 h-4" />
            <span>{isHindi ? 'कर्मचारी' : 'Worker'}</span>
          </button>

          <button
            onClick={() => loginAsDemoRole('SAFETY_OFFICER')}
            className={`p-2.5 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
              role === 'SAFETY_OFFICER'
                ? 'bg-[#292925] text-white shadow-xs font-bold'
                : 'bg-[#F6F1E7] border border-[#D8D0C2] text-[#292925]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isHindi ? 'अधिकारी' : 'Officer'}</span>
          </button>

          <button
            onClick={() => loginAsDemoRole('ADMIN')}
            className={`p-2.5 rounded-lg text-xs font-medium flex flex-col items-center gap-1 transition-all cursor-pointer ${
              role === 'ADMIN'
                ? 'bg-[#292925] text-white shadow-xs font-bold'
                : 'bg-[#F6F1E7] border border-[#D8D0C2] text-[#292925]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{isHindi ? 'व्यवस्थापक' : 'Admin'}</span>
          </button>
        </div>
      </div>

      {/* Logout Action */}
      <div className="pt-3">
        <button
          onClick={logout}
          className="w-full py-3 bg-[#F6F1E7] border border-[#9A6258]/60 text-[#7A342B] rounded-xl font-medium text-xs flex items-center justify-center gap-2 active:bg-[#F6E2DF] transition-all cursor-pointer font-bold"
        >
          <LogOut className="w-4 h-4" />
          {isHindi ? 'सत्र समाप्त / लॉग आउट' : 'Sign Out of Session'}
        </button>
      </div>
    </div>
  );
};
