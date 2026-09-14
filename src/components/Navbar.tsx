import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { PageView } from '../types';
import {
  Scan,
  LayoutDashboard,
  Info,
  RotateCcw,
  Menu,
  X,
  Sun,
  Moon,
  Layers,
  Cpu,
  Users
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activePage, 
    setActivePage, 
    openExplanation, 
    resetDemoData, 
    currentUser, 
    openLoginModal,
    theme,
    toggleTheme
  } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-none">
      {/* 1. Edge-to-Edge Statutory Strip */}
      <div className="pointer-events-auto w-full bg-[#05070A] text-[#DFFF00] border-b border-[var(--card-border)] py-1 px-3 sm:px-6 text-[9px] sm:text-[10.5px] font-mono tracking-wider flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap w-full justify-between">
          <div className="flex items-center gap-2.5 font-mono truncate">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF9500] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DFFF00]" />
            </span>
            <span className="font-bold text-[#FF9500] shrink-0">STATUTORY PROTOCOL:</span>
            <span className="text-[#A4ACB8] dark:text-[#DFFF00]/85 font-medium">
              MINISTRY OF PETROLEUM & NATURAL GAS / MRPL MANGALORE REFINERY / SEC. 41F FACTORIES ACT COMPLIANT • PASSIVE H₂S DOSIMETRY PROTOCOL • SHIFT A: ACTIVE TELEMETRY • EMERGENCY REFINERY EXT: 4422
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-3 shrink-0 text-[10px] text-[#DFFF00] font-mono font-semibold">
            <span>IS:41F CERTIFIED</span>
            <span className="text-white/20">•</span>
            <span className="text-[#FF9500]">ATEX ZONE 0 // ZERO SPARK</span>
          </div>
        </div>
      </div>

      {/* 2. Floating Glass Capsule Navigation Bar */}
      <div className={`pointer-events-auto max-w-7xl mx-auto px-3 sm:px-6 transition-all duration-300 ${
        isScrolled ? 'pt-2' : 'pt-3'
      }`}>
        <div className="command-card rounded-2xl sm:rounded-full px-3 sm:px-5 py-2 flex items-center justify-between shadow-2xl border border-[var(--card-border)] backdrop-blur-xl">
          
          {/* Left: Brand mark 118 with glowing sulfur-to-amber badge + MRPL INDUSTRIAL SAFETY */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#DFFF00] via-[#F59E0B] to-[#FF9500] p-[1.5px] shadow-[0_0_12px_rgba(223,255,0,0.35)] group-hover:shadow-[0_0_20px_rgba(255,149,0,0.6)] transition-all">
                <div className="w-full h-full bg-[#080A0C] rounded-[10px] flex items-center justify-center font-mono font-black text-xs sm:text-sm text-[#DFFF00]">
                  118
                </div>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF9500] animate-ping-slow border border-[#080A0C]" />
            </div>
            
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-[var(--text-primary)]">
                  118
                </span>
                <span className="text-[8.5px] font-mono px-1 py-0.2 rounded bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] font-bold border border-[var(--accent-primary)]/30">
                  MRPL
                </span>
              </div>
              <span className="text-[8.5px] sm:text-[9.5px] font-mono tracking-widest text-[var(--text-secondary)] block uppercase font-semibold">
                MRPL INDUSTRIAL SAFETY
              </span>
            </div>
          </button>

          {/* Center: 4 Clean Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--card-surface-subtle)] border border-[var(--card-border)]">
            <button
              onClick={() => handleNavClick('landing', 'the-band')}
              className="px-3 py-1.5 rounded-full text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10 transition-all cursor-pointer"
            >
              [Dosimeter Anatomy]
            </button>
            <button
              onClick={() => handleNavClick('landing', 'how-it-works')}
              className="px-3 py-1.5 rounded-full text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10 transition-all cursor-pointer"
            >
              [Optical Pipeline]
            </button>
            <button
              onClick={() => handleNavClick('dashboard')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                activePage === 'dashboard'
                  ? 'bg-[var(--accent-primary)] text-black font-bold shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10'
              }`}
            >
              [Plant Safety]
            </button>
            <button
              onClick={() => handleNavClick(currentUser?.role === 'WORKER' ? 'worker-dashboard' : 'workers')}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                activePage === 'worker-dashboard' || activePage === 'workers'
                  ? 'bg-[var(--accent-primary)] text-black font-bold shadow-xs'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10'
              }`}
            >
              [Worker Dossier]
            </button>
          </nav>

          {/* Right Controls: Theme Toggle, Live Shift Pill, Worker Badge, Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={toggleTheme}
              aria-label={`Toggle to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="p-1.5 sm:p-2 rounded-full border border-[var(--card-border)] bg-[var(--card-surface-subtle)] hover:border-[var(--accent-primary)] text-[var(--accent-primary)] transition-all cursor-pointer shadow-xs active:scale-95"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#DFFF00]" />
              ) : (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D97706]" />
              )}
            </button>

            {/* Live Shift Indicator Pill */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[var(--card-surface-subtle)] border border-[var(--accent-primary)]/25 font-mono text-[10px]">
              <span className="w-2 h-2 rounded-full bg-[#DFFF00] shadow-[0_0_8px_#DFFF00] animate-pulse" />
              <span className="font-bold tracking-wider text-[var(--accent-primary)]">LIVE TELEMETRY</span>
            </div>

            {/* Worker Badge: SR | Sanjay Rao */}
            <button
              onClick={openLoginModal}
              className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full border border-[var(--card-border)] bg-[var(--card-surface-subtle)] hover:border-[var(--accent-secondary)] transition-all cursor-pointer text-left shadow-xs"
              title="Switch Operator Profile (Worker / Safety Officer / Admin)"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF9500] to-[#B38600] text-black font-black text-[9px] font-mono flex items-center justify-center shadow-xs">
                {currentUser?.avatarText || 'SR'}
              </div>
              <div className="text-[11px] font-mono leading-none flex items-center gap-1">
                <span className="font-bold text-[var(--text-primary)]">
                  {currentUser?.avatarText || 'SR'}
                </span>
                <span className="text-[var(--text-muted)]">|</span>
                <span className="text-[var(--text-secondary)] font-medium truncate max-w-[90px]">
                  {currentUser?.name || 'Sanjay Rao'}
                </span>
              </div>
            </button>

            {/* Primary CTA: Scan Wristband */}
            <button
              onClick={() => handleNavClick('scan')}
              className="px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-[#FF9500] to-[#F59E0B] text-black font-mono font-bold text-xs tracking-wide shadow-[0_0_14px_rgba(255,149,0,0.35)] hover:shadow-[0_0_22px_rgba(255,149,0,0.6)] hover:scale-[1.02] active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Scan className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Scan Wristband</span>
              <span className="sm:hidden">Scan</span>
            </button>

            {/* Understand 118 info modal */}
            <button
              onClick={openExplanation}
              className="hidden xl:flex p-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card-surface-subtle)] hover:border-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Understand 118 Architecture"
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            {/* Reset Demo Data */}
            <button
              onClick={resetDemoData}
              className="hidden xl:flex p-1.5 rounded-full border border-[var(--card-border)] bg-[var(--card-surface-subtle)] hover:border-[var(--accent-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              title="Reset Demo Data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Drawer Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="lg:hidden p-1.5 rounded-lg border border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* MOBILE SLIDE-DOWN DRAWER */}
        {isMobileMenuOpen && (
          <div className="mt-2 command-card rounded-2xl p-4 shadow-2xl border border-[var(--card-border)] space-y-3 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNavClick('landing', 'the-band')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] text-xs font-mono font-medium text-[var(--text-primary)] text-left"
              >
                <Layers className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>Dosimeter Anatomy</span>
              </button>
              <button
                onClick={() => handleNavClick('landing', 'how-it-works')}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] text-xs font-mono font-medium text-[var(--text-primary)] text-left"
              >
                <Cpu className="w-3.5 h-3.5 text-[var(--accent-secondary)]" />
                <span>Optical Pipeline</span>
              </button>
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border border-[var(--card-border)] text-xs font-mono font-medium text-left ${
                  activePage === 'dashboard'
                    ? 'bg-[var(--accent-primary)] text-black font-bold'
                    : 'bg-[var(--card-surface-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Plant Safety</span>
              </button>
              <button
                onClick={() => handleNavClick(currentUser?.role === 'WORKER' ? 'worker-dashboard' : 'workers')}
                className={`flex items-center gap-2 p-2.5 rounded-xl border border-[var(--card-border)] text-xs font-mono font-medium text-left ${
                  activePage === 'worker-dashboard' || activePage === 'workers'
                    ? 'bg-[var(--accent-primary)] text-black font-bold'
                    : 'bg-[var(--card-surface-subtle)] text-[var(--text-primary)]'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Worker Dossier</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[var(--card-border)] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--card-surface-subtle)] border border-[var(--card-border)] text-xs font-mono text-left cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#FF9500] to-[#B38600] text-black font-bold text-[9px] flex items-center justify-center">
                  {currentUser?.avatarText || 'SR'}
                </div>
                <div className="truncate">
                  <div className="font-bold text-[var(--text-primary)] leading-none">
                    {currentUser?.name || 'Sanjay Rao'}
                  </div>
                  <div className="text-[9px] text-[var(--text-secondary)] mt-0.5">
                    {currentUser?.role || 'WORKER'} · Switch
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openExplanation();
                }}
                className="p-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-[var(--text-secondary)] cursor-pointer"
                title="Understand 118"
              >
                <Info className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  resetDemoData();
                }}
                className="p-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-surface-subtle)] text-[var(--text-secondary)] cursor-pointer"
                title="Reset Demo Data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
