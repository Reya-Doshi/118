import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { PageView } from '../types';
import {
  Scan,
  LayoutDashboard,
  Info,
  RotateCcw,
  Database,
  Menu,
  X,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activePage, setActivePage, openExplanation, resetDemoData } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key or resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isTransparentOnHero = activePage === 'landing' && !isScrolled && !isMobileMenuOpen;

  const handleNavClick = (pageId: PageView, sectionId?: string) => {
    setIsMobileMenuOpen(false);
    if (activePage === 'landing' && sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparentOnHero
          ? 'bg-gradient-to-b from-black/70 via-black/30 to-transparent text-[#F6F1E7] border-b border-white/10'
          : 'bg-[#F6F1E7]/95 backdrop-blur-md border-b border-[#D8D0C2] text-[#292925] shadow-xs'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Product Name "118" + Minimal Mark */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
            >
              <div
                className={`w-7 h-7 rounded flex items-center justify-center relative overflow-hidden transition-transform group-hover:scale-105 ${
                  isTransparentOnHero ? 'bg-white/20 border border-white/30' : 'bg-[#292925]'
                }`}
              >
                <div className="w-4 h-1.5 bg-[#71806B] rounded-xs flex items-center justify-between px-0.5">
                  <div className="w-0.5 h-0.5 bg-[#EDE5D6] rounded-full" />
                  <div className="w-0.5 h-0.5 bg-[#B08A55] rounded-full" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight block font-mono leading-none">
                  118
                </span>
                <span className={`text-[9px] font-mono tracking-wider mt-0.5 block ${
                  isTransparentOnHero ? 'text-[#EDE5D6]/80' : 'text-[#878377]'
                }`}>
                  by RAGEBYTERS
                </span>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className={`hidden md:flex items-center gap-1 ml-4 border-l pl-5 transition-colors ${
              isTransparentOnHero ? 'border-white/20' : 'border-[#D8D0C2]'
            }`}>
              <button
                onClick={() => handleNavClick('landing', 'the-band')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  isTransparentOnHero
                    ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10'
                    : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                }`}
              >
                The Band
              </button>

              <button
                onClick={() => handleNavClick('landing', 'how-it-works')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  isTransparentOnHero
                    ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10'
                    : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                }`}
              >
                How It Works
              </button>

              <button
                onClick={() => handleNavClick('scan')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  activePage === 'scan'
                    ? isTransparentOnHero ? 'bg-white/90 text-[#292925] font-semibold' : 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                    : isTransparentOnHero ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10' : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                }`}
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Read Wristband</span>
              </button>

              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  activePage === 'dashboard'
                    ? isTransparentOnHero ? 'bg-white/90 text-[#292925] font-semibold' : 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                    : isTransparentOnHero ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10' : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleNavClick('calibration')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  activePage === 'calibration'
                    ? isTransparentOnHero ? 'bg-white/90 text-[#292925] font-semibold' : 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                    : isTransparentOnHero ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10' : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Calibration Data</span>
              </button>
            </nav>
          </div>

          {/* Right: Desktop Controls + Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={openExplanation}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
                isTransparentOnHero
                  ? 'border-white/30 bg-white/10 text-[#F6F1E7] hover:bg-white/20'
                  : 'border-[#D8D0C2] bg-[#EDE5D6] text-[#292925] hover:bg-[#E5DDCB]'
              }`}
              title="How 118 Works"
            >
              <Info className="w-3.5 h-3.5 text-[#71806B]" />
              <span>Understand 118</span>
            </button>

            {/* Reset Demo State (Desktop) */}
            <button
              onClick={resetDemoData}
              className={`hidden sm:flex p-1.5 rounded border transition-colors cursor-pointer ${
                isTransparentOnHero
                  ? 'border-white/30 text-[#EDE5D6] hover:bg-white/10'
                  : 'border-[#D8D0C2] text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
              }`}
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Demo Mode Badge */}
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
              isTransparentOnHero
                ? 'bg-black/30 border-[#B08A55]/40 text-[#EDE5D6]'
                : 'bg-[#EDE5D6] border-[#D8D0C2] text-[#826235]'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B08A55]" />
              <span>Demo</span>
            </div>

            {/* User Avatar / Safety Officer (Desktop) */}
            <div className={`hidden sm:flex items-center gap-2 pl-2 border-l ${
              isTransparentOnHero ? 'border-white/20' : 'border-[#D8D0C2]'
            }`}>
              <div className="w-6 h-6 rounded bg-[#4F5D4B] text-[#F6F1E7] flex items-center justify-center text-[10px] font-bold font-mono">
                KS
              </div>
              <div className="hidden xl:block text-left">
                <div className={`text-xs font-semibold leading-none ${isTransparentOnHero ? 'text-[#F6F1E7]' : 'text-[#292925]'}`}>
                  K. Sharma
                </div>
                <div className={`text-[10px] leading-tight ${isTransparentOnHero ? 'text-[#EDE5D6]/70' : 'text-[#878377]'}`}>
                  Safety Officer
                </div>
              </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`md:hidden p-2 rounded-lg border transition-colors cursor-pointer ${
                isTransparentOnHero
                  ? 'border-white/25 bg-black/25 text-[#F6F1E7] hover:bg-white/10'
                  : 'border-[#D8D0C2] bg-[#EDE5D6] text-[#292925] hover:bg-[#E5DDCB]'
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE FULL-WIDTH SLIDE-DOWN DRAWER */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#F6F1E7] border-b border-[#D8D0C2] shadow-xl text-[#292925] animate-in slide-in-from-top duration-200">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            
            {/* Primary Navigation Links */}
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('landing')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activePage === 'landing'
                    ? 'bg-[#EDE5D6] text-[#292925]'
                    : 'text-[#5D5B53] hover:bg-[#EDE5D6]/60'
                }`}
              >
                <span>Overview (Home)</span>
                <ChevronRight className="w-4 h-4 text-[#878377]" />
              </button>

              <button
                onClick={() => handleNavClick('landing', 'the-band')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-[#5D5B53] hover:bg-[#EDE5D6]/60 transition-colors cursor-pointer"
              >
                <span>The Band (Hardware Anatomy)</span>
                <ChevronRight className="w-4 h-4 text-[#878377]" />
              </button>

              <button
                onClick={() => handleNavClick('landing', 'how-it-works')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-[#5D5B53] hover:bg-[#EDE5D6]/60 transition-colors cursor-pointer"
              >
                <span>How It Works (Workflow)</span>
                <ChevronRight className="w-4 h-4 text-[#878377]" />
              </button>

              <button
                onClick={() => handleNavClick('scan')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activePage === 'scan'
                    ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                    : 'text-[#292925] bg-[#EDE5D6]/40 hover:bg-[#EDE5D6]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Scan className="w-4 h-4" />
                  <span>Read Wristband</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activePage === 'dashboard'
                    ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                    : 'text-[#5D5B53] hover:bg-[#EDE5D6]/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Safety Dashboard</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#878377]" />
              </button>

              <button
                onClick={() => handleNavClick('calibration')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activePage === 'calibration'
                    ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                    : 'text-[#5D5B53] hover:bg-[#EDE5D6]/60'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  <span>Calibration Dataset (120 Rows)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#878377]" />
              </button>
            </div>

            {/* Quick Actions & Profile */}
            <div className="pt-3 border-t border-[#D8D0C2] flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openExplanation();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#EDE5D6] text-xs font-semibold text-[#292925] hover:bg-[#E5DDCB] transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-[#71806B]" />
                  <span>Understand 118</span>
                </button>

                <button
                  onClick={() => {
                    resetDemoData();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-[#D8D0C2] text-xs font-semibold text-[#5D5B53] hover:bg-[#EDE5D6] transition-colors cursor-pointer"
                  title="Reset Demo Data"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Safety Officer Card on mobile */}
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#EDE5D6]/40 border border-[#D8D0C2] text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#4F5D4B] text-[#F6F1E7] flex items-center justify-center text-[10px] font-bold font-mono">
                    KS
                  </div>
                  <div>
                    <div className="font-semibold text-[#292925]">K. Sharma</div>
                    <div className="text-[10px] text-[#878377]">Safety Officer · Plant Zone A</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#71806B] font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Active</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
