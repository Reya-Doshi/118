import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { PageView } from '../types';
import {
  Scan,
  LayoutDashboard,
  Info,
  Database,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Users,
  User,
  Clock,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    openExplanation, 
    currentUser, 
    openLoginModal,
    logout
  } = useApp();
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
        <div className="flex items-center justify-between gap-4 lg:gap-8 h-16">
          
          {/* Left: Product Name "118" + Minimal Mark */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer"
            >
              <img
                src="/sarvas_logo_v2.png"
                alt="SARVAS by RageB8 Emblem"
                className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-[#D8D0C2] shadow-2xs group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl font-bold tracking-tight block font-mono leading-none">
                    SARVAS
                  </span>
                  <span className="text-[9px] font-mono bg-[#4F5D4B]/20 text-[#4F5D4B] px-1.5 py-0.5 rounded font-bold">
                    by RageB8
                  </span>
                </div>
                <span className={`text-[9px] font-mono tracking-wider mt-0.5 block ${
                  isTransparentOnHero ? 'text-[#EDE5D6]/80' : 'text-[#878377]'
                }`}>
                  SIH 2026 · PS-118
                </span>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className={`hidden md:flex items-center gap-1 ml-4 border-l pl-5 transition-colors ${
              isTransparentOnHero ? 'border-white/20' : 'border-[#D8D0C2]'
            }`}>
              {!currentUser ? (
                <>
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
                    onClick={() => handleNavClick('overview')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'overview'
                        ? isTransparentOnHero ? 'bg-white/90 text-[#292925] font-semibold' : 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : isTransparentOnHero ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10' : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    Project Dossier
                  </button>

                  <button
                    onClick={() => handleNavClick('calibration')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'calibration'
                        ? isTransparentOnHero ? 'bg-white/90 text-[#292925] font-semibold' : 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : isTransparentOnHero ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10' : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    Validation & Dataset
                  </button>

                  <button
                    onClick={() => handleNavClick('landing', 'faq')}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      isTransparentOnHero
                        ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    FAQ
                  </button>

                  <button
                    onClick={() => handleNavClick('scan')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer mr-1 lg:mr-2 ${
                      activePage === 'scan'
                        ? isTransparentOnHero ? 'bg-white/90 text-[#292925] font-semibold' : 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : isTransparentOnHero ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10' : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>Read Wristband</span>
                  </button>
                </>
              ) : currentUser.role === 'WORKER' ? (
                <>
                  <button
                    onClick={() => handleNavClick('worker-dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'worker-dashboard'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Dashboard</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('scan')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'scan'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>Read Wristband</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('history')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'history'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Shift History</span>
                  </button>
                </>
              ) : currentUser.role === 'OFFICER' ? (
                <>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'dashboard'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Plant Safety Dashboard</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('scan')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'scan'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <Scan className="w-3.5 h-3.5" />
                    <span>Read Wristband</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('workers')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'workers'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Workers</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('history')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'history'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Shift History</span>
                  </button>
                </>
              ) : (
                /* ADMIN */
                <>
                  <button
                    onClick={() => handleNavClick('dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'dashboard'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Facility Overview</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('workers')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'workers'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Worker Directory</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('calibration')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'calibration'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Calibration Matrix</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('history')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all cursor-pointer ${
                      activePage === 'history'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Audit Logs</span>
                  </button>
                </>
              )}
            </nav>
          </div>

          {/* Right: Desktop Controls + Mobile Hamburger */}
          <div className={`flex items-center gap-2 sm:gap-2.5 ml-3 sm:ml-4 lg:ml-6 pl-3 sm:pl-4 lg:pl-5 border-l shrink-0 transition-colors ${
            isTransparentOnHero ? 'border-white/20' : 'border-[#D8D0C2]'
          }`}>
            {/* Interactive Kiosk Prototype Nav Button */}
            <button
              onClick={() => handleNavClick('kiosk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                activePage === 'kiosk'
                  ? 'bg-[#292925] text-white border-[#292925]'
                  : isTransparentOnHero
                  ? 'border-emerald-400/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
              title="Open Interactive Kiosk Flow (Start Shift -> Scan -> Dose -> Close)"
            >
              <Scan className="w-3.5 h-3.5 text-emerald-500" />
              <span>Kiosk Prototype</span>
              <span className="text-[9px] font-mono bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold uppercase">
                Flow
              </span>
            </button>

            {/* ML Explainability Video Nav Button */}
            <button
              onClick={() => handleNavClick('explainability')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 ${
                activePage === 'explainability'
                  ? 'bg-[#4F5D4B] text-white border-[#4F5D4B]'
                  : isTransparentOnHero
                  ? 'border-white/30 bg-white/10 text-[#F6F1E7] hover:bg-white/20'
                  : 'border-[#D8D0C2] bg-white text-[#292925] hover:bg-[#EDE5D6]'
              }`}
              title="View Color-to-Dose ML Pipeline Diagram"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden lg:inline">ML Pipeline</span>
              <span className="text-[9px] font-mono bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                AI
              </span>
            </button>

            {!currentUser && (
              <button
                onClick={openExplanation}
                className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                  isTransparentOnHero
                    ? 'border-white/30 bg-white/10 text-[#F6F1E7] hover:bg-white/20'
                    : 'border-[#D8D0C2] bg-[#EDE5D6] text-[#292925] hover:bg-[#E5DDCB]'
                }`}
                title="How 118 Works"
              >
                <Info className="w-3.5 h-3.5 text-[#71806B]" />
                <span>Understand 118</span>
              </button>
            )}

            {/* Top Login / Account Option (Desktop) */}
            <button
              onClick={openLoginModal}
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
                isTransparentOnHero
                  ? 'border-white/35 bg-white/15 text-[#F6F1E7] hover:bg-white/25'
                  : 'border-[#D8D0C2] bg-white text-[#292925] hover:border-[#71806B]'
              }`}
              title="Click to Switch Account or Role (Worker, Safety Officer, Admin)"
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold font-mono shadow-xs ${
                currentUser?.role === 'WORKER'
                  ? 'bg-[#B08A55] text-white'
                  : currentUser?.role === 'ADMIN'
                  ? 'bg-[#292925] text-white'
                  : 'bg-[#4F5D4B] text-white'
              }`}>
                {currentUser?.avatarText || 'OP'}
              </div>
              <div className="text-left">
                <div className={`text-xs font-bold leading-none flex items-center gap-1 ${isTransparentOnHero ? 'text-[#F6F1E7]' : 'text-[#292925]'}`}>
                  <span>{currentUser?.name || 'Sign In'}</span>
                </div>
                <div className={`text-[9px] font-mono leading-tight mt-0.5 ${isTransparentOnHero ? 'text-[#EDE5D6]/80' : 'text-[#71806B] font-bold'}`}>
                  {currentUser ? `${currentUser.role}` : 'Choose Role'}
                </div>
              </div>
            </button>

            {/* Dedicated Sign Out Button */}
            {currentUser && (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
                title="Sign out of RageB8"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

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
            
            {/* Interactive Prototypes Mobile Quick Actions */}
            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#D8D0C2]">
              <button
                onClick={() => handleNavClick('kiosk')}
                className="p-2.5 rounded-xl bg-[#292925] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Scan className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kiosk Prototype</span>
              </button>
              <button
                onClick={() => handleNavClick('explainability')}
                className="p-2.5 rounded-xl bg-[#4F5D4B] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>ML Pipeline</span>
              </button>
            </div>

            {/* Primary Navigation Links */}
            <div className="space-y-1">
              {!currentUser ? (
                <>
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
                    onClick={() => handleNavClick('overview')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activePage === 'overview'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                        : 'text-[#5D5B53] hover:bg-[#EDE5D6]/60'
                    }`}
                  >
                    <span>Project Dossier (Team, Tech & Roadmap)</span>
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
                    <span>Validation & Calibration Matrix</span>
                    <ChevronRight className="w-4 h-4 text-[#878377]" />
                  </button>

                  <button
                    onClick={() => handleNavClick('landing', 'faq')}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-[#5D5B53] hover:bg-[#EDE5D6]/60 transition-colors cursor-pointer"
                  >
                    <span>Frequently Asked Questions (FAQ)</span>
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
                </>
              ) : currentUser.role === 'WORKER' ? (
                <>
                  <button
                    onClick={() => handleNavClick('worker-dashboard')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      activePage === 'worker-dashboard'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                        : 'text-[#292925] bg-[#EDE5D6]/50 hover:bg-[#EDE5D6]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#71806B]" />
                      <span>My Operator Dashboard</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-70" />
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
                    onClick={() => handleNavClick('history')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activePage === 'history'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                        : 'text-[#5D5B53] hover:bg-[#EDE5D6]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Shift Exposure History</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#878377]" />
                  </button>
                </>
              ) : currentUser.role === 'OFFICER' ? (
                <>
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
                      <span>Plant Safety Dashboard</span>
                    </div>
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
                    onClick={() => handleNavClick('workers')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activePage === 'workers'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                        : 'text-[#5D5B53] hover:bg-[#EDE5D6]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Workers Roster</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#878377]" />
                  </button>

                  <button
                    onClick={() => handleNavClick('history')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activePage === 'history'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                        : 'text-[#5D5B53] hover:bg-[#EDE5D6]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Shift History</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#878377]" />
                  </button>
                </>
              ) : (
                /* ADMIN */
                <>
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
                      <span>Facility Overview</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#878377]" />
                  </button>

                  <button
                    onClick={() => handleNavClick('workers')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activePage === 'workers'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                        : 'text-[#5D5B53] hover:bg-[#EDE5D6]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Workers Directory</span>
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
                      <span>Calibration Matrix</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#878377]" />
                  </button>

                  <button
                    onClick={() => handleNavClick('history')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activePage === 'history'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                        : 'text-[#5D5B53] hover:bg-[#EDE5D6]/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Audit Logs</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#878377]" />
                  </button>
                </>
              )}
            </div>

            {/* Mobile Account / Sign Out Section */}
            <div className="pt-3 border-t border-[#D8D0C2] space-y-2">
              <button
                onClick={() => {
                  openLoginModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white border border-[#D8D0C2] text-xs font-semibold"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold font-mono text-white ${
                    currentUser?.role === 'WORKER'
                      ? 'bg-[#B08A55]'
                      : currentUser?.role === 'ADMIN'
                      ? 'bg-[#292925]'
                      : 'bg-[#4F5D4B]'
                  }`}>
                    {currentUser?.avatarText || 'OP'}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{currentUser?.name || 'Sign In / Select Role'}</div>
                    <div className="text-[10px] text-gray-500">{currentUser ? `Role: ${currentUser.role}` : 'Tap to choose profile'}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              {currentUser && (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
