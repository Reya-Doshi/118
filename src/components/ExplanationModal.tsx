import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Activity, Camera, BarChart3, AlertTriangle, HelpCircle, Database } from 'lucide-react';

export const ExplanationModal: React.FC = () => {
  const { isExplanationOpen, closeExplanation, setActivePage } = useApp();

  if (!isExplanationOpen) return null;

  const steps = [
    {
      num: '01',
      title: 'WEAR',
      desc: 'Worker wears the passive wristband during the shift.',
      icon: ShieldCheck,
      color: 'text-[#4F5D4B] bg-[#E5EADF]'
    },
    {
      num: '02',
      title: 'RESPOND',
      desc: 'The chemical strip changes color progressively with cumulative H₂S exposure.',
      icon: Activity,
      color: 'text-[#826235] bg-[#F3EDE2]'
    },
    {
      num: '03',
      title: 'SCAN',
      desc: 'Safety officer photographs the strip beside its reference scale.',
      icon: Camera,
      color: 'text-[#292925] bg-[#EDE5D6]'
    },
    {
      num: '04',
      title: 'QUANTIFY',
      desc: '118 extracts CIE L*a*b*, calculates ΔE, applies environmental compensation, and records dosage.',
      icon: BarChart3,
      color: 'text-[#4F5D4B] bg-[#E5EADF]'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="command-card text-[var(--text-primary)] rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[var(--card-border)] relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={closeExplanation}
          className="absolute top-4 right-4 p-2 rounded-full border border-[var(--card-border)] text-[var(--text-secondary)] hover:bg-[var(--card-surface-subtle)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DFFF00] to-[#FF9500] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#080A0C] rounded-[10px] flex items-center justify-center text-[#DFFF00]">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-heading tracking-tight text-[var(--text-primary)]">How does 118 work?</h2>
              <span className="px-2 py-0.5 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/40 text-[var(--accent-primary)] text-[10px] font-mono font-bold">
                Prototype / Simulated Data
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-mono">4-step occupational safety dosimetry workflow</p>
          </div>
        </div>

        {/* 4-Step Visual Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="command-card p-4 rounded-xl border border-[var(--card-border)] flex items-start gap-3 bg-[var(--card-surface-subtle)]">
                <div className="p-2 rounded-lg font-mono font-bold text-xs shrink-0 bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[var(--accent-secondary)] font-bold">{step.num}</span>
                    <span className="text-xs font-bold tracking-wider uppercase text-[var(--text-primary)] font-mono">{step.title}</span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Not Normal Gas Detector */}
        <div className="command-card p-4 rounded-xl border border-[var(--card-border)] mb-4 bg-[var(--card-surface-subtle)]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] mb-1.5 flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            Why not a normal gas detector?
          </h4>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Electronic detectors are excellent for detecting immediate peaks. 118 is designed to visualize 
            <strong className="text-[var(--text-primary)] font-semibold"> cumulative exposure over time</strong> across shift operations, helping identify low-level chronic risks that real-time alarms miss.
          </p>
        </div>

        {/* 120-Row Simulated Calibration Dataset Note */}
        <div className="command-card p-4 rounded-xl border border-[var(--accent-primary)]/40 mb-4 text-[var(--text-primary)] flex items-start justify-between gap-4 bg-[var(--accent-primary)]/5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono text-[var(--accent-primary)]">
              <Database className="w-3.5 h-3.5" />
              Simulated Calibration Dataset (120 Samples)
            </h4>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              118 is wired to a 120-row synthetic dataset mapping target doses (0–160 ppm·h), gas concentrations, CIE L*a*b* coordinates, and reference target ΔEab* values with temperature and humidity compensation factors.
            </p>
          </div>
          <button
            onClick={() => {
              closeExplanation();
              setActivePage('calibration');
            }}
            className="px-3 py-1.5 rounded-full bg-[var(--accent-primary)] text-black text-[10px] font-mono font-bold shrink-0 hover:bg-[#CCFF00] cursor-pointer shadow-xs"
          >
            View Dataset
          </button>
        </div>

        {/* Important Disclaimer Notice */}
        <div className="command-card p-4 rounded-xl border border-[#FF9500]/40 mb-6 text-[#FF9500] bg-[#FF9500]/5">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1 font-mono">
            <AlertTriangle className="w-4 h-4 text-[#FF9500]" />
            Important Notice
          </div>
          <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
            Readings shown by this prototype are <strong>simulated estimates</strong> derived from the prototype calibration dataset. <strong>Requires laboratory validation before deployment</strong> in a controlled environmental chamber with chemical sensor calibration.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-3 border-t border-[var(--card-border)]">
          <button
            onClick={closeExplanation}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#FF9500] to-[#F59E0B] text-black text-xs font-mono font-bold tracking-wide hover:shadow-[0_0_15px_rgba(255,149,0,0.5)] transition-all cursor-pointer"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
