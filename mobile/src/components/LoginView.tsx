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
    <div 
      className="min-h-screen bg-[#F6F1E7] flex flex-col justify-between p-6 max-w-md mx-auto"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 28px)' }}
    >
      {/* Top Header */}
      <div className="pt-2 pb-4">
        <div className="flex items-center gap-2.5 mb-3">
          <img 
            src="/sarvas_logo_v2.png" 
            alt="RageB8 Emblem" 
            className="w-10 h-10 rounded-xl object-contain bg-white p-1 border border-[#D8D0C2] shadow-xs" 
          />
          <div>
            <h2 className="text-lg font-serif font-bold text-[#292925] leading-none">RageB8</h2>
            <span className="text-[10px] text-[#71806B] font-mono tracking-wider font-semibold">PS-118 · SIH 2026</span>
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
              className="w-full flex items-center justify-between p-3 bg-[#F6F1E7] hover:bg-white border border-[#D8D0C2] rounded-xl text-left transition-all active:scale-[0.98] shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#5A7456]/20 text-[#385034] flex items-center justify-center shrink-0">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#292925]">Worker (Operator)</span>
                    <span className="text-[9px] font-mono bg-[#5A7456]/20 text-[#385034] px-1.5 py-0.2 rounded font-bold uppercase">Frontline</span>
                  </div>
                  <div className="text-xs text-[#5D5B53] font-medium">Rahul Shetty · Hydrocracker Unit 2</div>
                  <div className="text-[10px] text-[#71806B] font-mono mt-0.5">Scope: Personal band scan &amp; shift exposure dose</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#878377] shrink-0" />
            </button>

            {/* Safety Officer Demo Option */}
            <button
              onClick={() => loginAsDemoRole('SAFETY_OFFICER')}
              className="w-full flex items-center justify-between p-3 bg-[#F6F1E7] hover:bg-white border border-[#D8D0C2] rounded-xl text-left transition-all active:scale-[0.98] shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#B08A55]/20 text-[#795726] flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#292925]">Safety Officer (HSE)</span>
                    <span className="text-[9px] font-mono bg-[#B08A55]/20 text-[#795726] px-1.5 py-0.2 rounded font-bold uppercase">Auditor</span>
                  </div>
                  <div className="text-xs text-[#5D5B53] font-medium">Mira Patel · Safety Audit Team</div>
                  <div className="text-[10px] text-[#795726] font-mono mt-0.5">Scope: Multi-worker field audits &amp; gas alerts</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#878377] shrink-0" />
            </button>

            {/* Admin Demo Option */}
            <button
              onClick={() => loginAsDemoRole('ADMIN')}
              className="w-full flex items-center justify-between p-3 bg-[#F6F1E7] hover:bg-white border border-[#D8D0C2] rounded-xl text-left transition-all active:scale-[0.98] shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#292925]/15 text-[#292925] flex items-center justify-center shrink-0">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#292925]">Admin (Supervisor)</span>
                    <span className="text-[9px] font-mono bg-[#292925]/15 text-[#292925] px-1.5 py-0.2 rounded font-bold uppercase">Executive</span>
                  </div>
                  <div className="text-xs text-[#5D5B53] font-medium">Anand Verma · Plant Operations</div>
                  <div className="text-[10px] text-[#292925]/70 font-mono mt-0.5">Scope: Plant precautions, band inventory &amp; triage</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#878377] shrink-0" />
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
