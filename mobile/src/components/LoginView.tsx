import React, { useState } from 'react';
import { useMobileAuth } from '../context/MobileAuthContext';
import type { UserRole } from '../types/mobile';
import { ShieldCheck, HardHat, ShieldAlert, Sliders, ChevronRight, Lock, Mail } from 'lucide-react';

export const LoginView: React.FC = () => {
  const { loginAsDemoRole } = useMobileAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default fallback to Worker if email contains worker or default
    if (email.toLowerCase().includes('safety')) {
      loginAsDemoRole('SAFETY_OFFICER');
    } else if (email.toLowerCase().includes('admin')) {
      loginAsDemoRole('ADMIN');
    } else {
      loginAsDemoRole('WORKER');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E7] flex flex-col justify-between p-6 max-w-md mx-auto">
      {/* Top Header */}
      <div className="pt-8 pb-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-[#292925] flex items-center justify-center text-[#F6F1E7]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-serif font-bold text-[#292925] leading-none">118 Companion</h2>
            <span className="text-[10px] text-[#71806B] font-mono tracking-wider font-semibold">DOSIMETER PLATFORM</span>
          </div>
        </div>
        <h1 className="text-2xl font-serif font-bold text-[#292925] tracking-tight">
          Sign In
        </h1>
        <p className="text-xs text-[#5D5B53] mt-1">
          Access your personal exposure dashboard and colorimetric scanner.
        </p>
      </div>

      {/* Quick Demo Access Section (Recommended for SIH Demonstration) */}
      <div className="my-auto space-y-4">
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-[#D8D0C2] pb-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#292925]">
              Demo Access (One-Tap Selection)
            </span>
            <span className="text-[10px] bg-[#71806B]/15 text-[#4F5D4B] px-2 py-0.5 rounded font-mono font-medium">
              SIH 2026
            </span>
          </div>

          <div className="space-y-2.5">
            {/* Worker Demo Option */}
            <button
              onClick={() => loginAsDemoRole('WORKER')}
              className="w-full flex items-center justify-between p-3 bg-[#F6F1E7] hover:bg-white border border-[#D8D0C2] rounded-lg text-left transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#5A7456]/15 text-[#385034] flex items-center justify-center">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#292925]">Worker Demo</div>
                  <div className="text-xs text-[#5D5B53]">Rahul Shetty · Hydrocracker Unit 2</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#878377]" />
            </button>

            {/* Safety Officer Demo Option */}
            <button
              onClick={() => loginAsDemoRole('SAFETY_OFFICER')}
              className="w-full flex items-center justify-between p-3 bg-[#F6F1E7] hover:bg-white border border-[#D8D0C2] rounded-lg text-left transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#B08A55]/15 text-[#795726] flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#292925]">Safety Officer Demo</div>
                  <div className="text-xs text-[#5D5B53]">Mira Patel · Safety Audit Team</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#878377]" />
            </button>

            {/* Admin Demo Option */}
            <button
              onClick={() => loginAsDemoRole('ADMIN')}
              className="w-full flex items-center justify-between p-3 bg-[#F6F1E7] hover:bg-white border border-[#D8D0C2] rounded-lg text-left transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#292925]/10 text-[#292925] flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#292925]">Admin / Supervisor Demo</div>
                  <div className="text-xs text-[#5D5B53]">Anand Verma · Plant Operations</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#878377]" />
            </button>
          </div>
        </div>

        {/* Regular Sign-in Form */}
        <form onSubmit={handleStandardLogin} className="space-y-3 pt-2">
          <div>
            <label className="block text-[11px] font-mono uppercase text-[#5D5B53] mb-1">
              Employee Email / ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-[#878377]" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul.shetty@refinery-safety.io"
                className="w-full bg-[#EDE5D6] border border-[#D8D0C2] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#292925] placeholder-[#878377] focus:outline-none focus:border-[#4F5D4B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-[#5D5B53] mb-1">
              PIN / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3 text-[#878377]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#EDE5D6] border border-[#D8D0C2] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#292925] placeholder-[#878377] focus:outline-none focus:border-[#4F5D4B]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#292925] text-[#F6F1E7] font-medium text-sm rounded-lg hover:bg-[#1a1a17] active:scale-[0.99] transition-all mt-1"
          >
            Authenticate & Proceed
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="pt-6 text-center">
        <p className="text-[11px] text-[#878377]">
          Autonomous SIH Dosimeter Companion · Hardware Version 1.2
        </p>
      </div>
    </div>
  );
};
