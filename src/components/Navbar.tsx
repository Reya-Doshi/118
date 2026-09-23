import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { PageView } from '../types';
import {
  Scan,
  LayoutDashboard,
  Database,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  LogOut,
  Users,
  User,
  Clock,
  Sparkles,
  Info,
  FileText
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
  const [isDemosOpen, setIsDemosOpen] = useState(false);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('#demos-dropdown-container')) {
        setIsDemosOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

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
      if (window.innerWidth >= 1024) {
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
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
          
          {/* Left: Product Name "SARVAS" & Desktop Nav */}
          <div className="flex items-center gap-3 xl:gap-6 min-w-0">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none cursor-pointer shrink-0"
            >
              <img
                src="/sarvas_logo_v2.png"
                alt="SARVAS Emblem"
                className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-[#D8D0C2] shadow-2xs group-hover:scale-105 transition-transform"
              />
              <div className="shrink-0">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xl font-bold tracking-tight block font-mono leading-none">
                    SARVAS
                  </span>
                </div>
                <span className={`text-[9px] font-mono tracking-wider mt-0.5 block ${
                  isTransparentOnHero ? 'text-[#EDE5D6]/80' : 'text-[#878377]'
                }`}>
                  Chemical Dosimeter
                </span>
              </div>
            </button>

            {/* Desktop Navigation Tabs */}
            <nav className={`hidden lg:flex items-center gap-0.5 xl:gap-1.5 ml-2 xl:ml-3 border-l pl-2.5 xl:pl-4 transition-colors shrink-0 ${
              isTransparentOnHero ? 'border-white/20' : 'border-[#D8D0C2]'
            }`}>
              {!currentUser ? (
                <>
                  <button
                    onClick={() => handleNavClick('landing', 'the-band')}
                    className={`px-2 xl:px-2.5 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isTransparentOnHero
                        ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    The Band
                  </button>

                  <button
                    onClick={() => handleNavClick('landing', 'how-it-works')}
                    className={`px-2 xl:px-2.5 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isTransparentOnHero
                        ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    How It Works
                  </button>

                  <button
                    onClick={() => handleNavClick('landing', 'ehs-showcase')}
                    className={`px-2 xl:px-2.5 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      isTransparentOnHero
                        ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10'
                        : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    EHS Dashboard
                  </button>

                  <button
                    onClick={() => handleNavClick('calibration')}
                    className={`px-2 xl:px-2.5 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      activePage === 'calibration'
                        ? isTransparentOnHero ? 'bg-white/90 text-[#292925] font-semibold' : 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : isTransparentOnHero ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10' : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    Validation
                  </button>

                  <button
                    onClick={() => handleNavClick('overview')}
                    className={`hidden lg:inline-block px-2 xl:px-2.5 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      activePage === 'overview'
                        ? isTransparentOnHero ? 'bg-white/90 text-[#292925] font-semibold' : 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : isTransparentOnHero ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10' : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    Dossier
                  </button>

                  <button
                    onClick={() => handleNavClick('references')}
                    className={`hidden 2xl:inline-block px-2 xl:px-2.5 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                      activePage === 'references'
                        ? isTransparentOnHero ? 'bg-white/90 text-[#292925] font-semibold' : 'bg-[#4F5D4B] text-[#F6F1E7] font-semibold'
                        : isTransparentOnHero ? 'text-[#EDE5D6] hover:text-white hover:bg-white/10' : 'text-[#5D5B53] hover:text-[#292925] hover:bg-[#EDE5D6]'
                    }`}
                  >
                    References
                  </button>
                </>
              ) : currentUser.role === 'WORKER' ? (
                <>
                  <button
                    onClick={() => handleNavClick('worker-dashboard')}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-md text-xs font-medium tracking-wide whitespace-nowrap shrink-0 transition-all cursor-pointer ${
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
          <div className={`flex items-center gap-2 sm:gap-3 ml-2 border-l pl-2 sm:pl-3 shrink-0 transition-colors ${
            isTransparentOnHero ? 'border-white/20' : 'border-[#D8D0C2]'
          }`}>
            {/* Interactive Demos & AI Dropdown */}
            <div id="demos-dropdown-container" className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDemosOpen(prev => !prev);
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
                  isDemosOpen || activePage === 'kiosk' || activePage === 'explainability'
                    ? 'bg-[#292925] text-white border-[#292925]'
                    : isTransparentOnHero
                    ? 'border-white/30 bg-white/10 text-[#F6F1E7] hover:bg-white/20'
                    : 'border-[#D8D0C2] bg-white text-[#292925] hover:bg-[#EDE5D6]'
                }`}
                title="Explore interactive demos and AI features"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Demos &amp; AI</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDemosOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDemosOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#292925] text-[#EDE5D6] border border-[#3E3C36] shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Item 1: Kiosk Prototype */}
                  <button
                    onClick={() => {
                      setIsDemosOpen(false);
                      handleNavClick('kiosk');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#383630] transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
                        <Scan className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                          Kiosk Prototype
                        </div>
                        <div className="text-[10px] text-[#A69F91]">
                          Simulate shift-end gate turnstile
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                      FLOW
                    </span>
                  </button>

                  {/* Item 2: ML Pipeline */}
                  <button
                    onClick={() => {
                      setIsDemosOpen(false);
                      handleNavClick('explainability');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#383630] transition-colors text-left group cursor-pointer mt-0.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-amber-950/80 border border-amber-600/40 flex items-center justify-center text-amber-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                          ML Pipeline
                        </div>
                        <div className="text-[10px] text-[#A69F91]">
                          Color-to-dose model architecture
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-amber-500 text-[#1C1C19] px-1.5 py-0.5 rounded font-bold uppercase">
                      AI
                    </span>
                  </button>

                  {/* Item 3: Understand SARVAS */}
                  <button
                    onClick={() => {
                      setIsDemosOpen(false);
                      openExplanation();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#383630] transition-colors text-left group cursor-pointer border-t border-[#3E3C36] mt-1 pt-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-[#383630] border border-[#4E4C44] flex items-center justify-center text-[#C2CBBF]">
                        <Info className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-[#C2CBBF] transition-colors">
                          Understand SARVAS
                        </div>
                        <div className="text-[10px] text-[#A69F91]">
                          Interactive guided explainer
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-[#4F5D4B] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                      INFO
                    </span>
                  </button>

                  {/* Item 4: Dossier & BOM */}
                  <button
                    onClick={() => {
                      setIsDemosOpen(false);
                      handleNavClick('overview');
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-[#383630] transition-colors text-left group cursor-pointer border-t border-[#3E3C36] mt-1 pt-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-emerald-950/80 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                          Project Dossier
                        </div>
                        <div className="text-[10px] text-[#A69F91]">
                          Technical specs, BOM &amp; architecture
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono bg-emerald-700 text-white px-1.5 py-0.5 rounded font-bold uppercase">
                      DOC
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action: Read Wristband */}
            <button
              onClick={() => handleNavClick('scan')}
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 ${
                activePage === 'scan'
                  ? 'bg-[#4F5D4B] text-white font-bold'
                  : isTransparentOnHero
                  ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                  : 'bg-[#4F5D4B] text-[#F6F1E7] hover:bg-[#3D493A]'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Read Wristband</span>
            </button>

            {/* Top Login / Account Option (Desktop & Mobile) */}
            <button
              onClick={openLoginModal}
              className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs active:scale-95 ${
                isTransparentOnHero
                  ? 'border-white/35 bg-white/15 text-[#F6F1E7] hover:bg-white/25'
                  : 'border-[#D8D0C2] bg-white text-[#292925] hover:border-[#71806B]'
              }`}
              title="Click to Switch Account or Role (Worker, Safety Officer, Admin)"
            >
              <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold font-mono shadow-xs shrink-0 ${
                currentUser?.role === 'WORKER'
                  ? 'bg-[#B08A55] text-white'
                  : currentUser?.role === 'ADMIN'
                  ? 'bg-[#292925] text-white'
                  : 'bg-[#4F5D4B] text-white'
              }`}>
                {currentUser?.avatarText || 'OP'}
              </div>
              <div className="text-left hidden sm:block">
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
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className={`lg:hidden p-2 rounded-lg border transition-colors cursor-pointer ${
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
        <div className="lg:hidden bg-[#F6F1E7] border-b border-[#D8D0C2] shadow-xl text-[#292925] animate-in slide-in-from-top duration-200">
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
                    onClick={() => handleNavClick('landing', 'ehs-showcase')}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold text-[#5D5B53] hover:bg-[#EDE5D6]/60 transition-colors cursor-pointer"
                  >
                    <span>EHS Exposure Dashboard &amp; Simulator</span>
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
                    <span>Project Dossier (Team, Tech &amp; Roadmap)</span>
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
                    onClick={() => handleNavClick('references')}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      activePage === 'references'
                        ? 'bg-[#4F5D4B] text-[#F6F1E7]'
                        : 'text-[#5D5B53] hover:bg-[#EDE5D6]/60'
                    }`}
                  >
                    <span>Reference Links &amp; Bibliography</span>
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
