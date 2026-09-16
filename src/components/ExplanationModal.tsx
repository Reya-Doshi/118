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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#F6F1E7] text-[#292925] rounded-xl max-w-2xl w-full p-6 md:p-8 shadow-xl border border-[#D8D0C2] relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={closeExplanation}
          className="absolute top-4 right-4 p-2 rounded text-[#5D5B53] hover:bg-[#EDE5D6] hover:text-[#292925] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded bg-[#292925] text-[#EDE5D6] flex items-center justify-center">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-[#292925]">How does SARVAS work?</h2>
              <span className="px-2 py-0.5 rounded bg-[#F3EDE2] text-[#826235] text-[10px] font-mono font-bold">
                by RageB8
              </span>
            </div>
            <p className="text-xs text-[#5D5B53]">4-step occupational safety dosimetry workflow</p>
          </div>
        </div>

        {/* 4-Step Visual Flow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {steps.map(step => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="bg-[#EDE5D6] p-4 rounded-lg border border-[#D8D0C2] flex items-start gap-3">
                <div className={`p-2 rounded font-mono font-bold text-xs shrink-0 ${step.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#878377] font-bold">{step.num}</span>
                    <span className="text-xs font-bold tracking-wider uppercase text-[#292925] font-mono">{step.title}</span>
                  </div>
                  <p className="text-xs text-[#5D5B53] mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Why Not Normal Gas Detector */}
        <div className="bg-[#EDE5D6] p-4 rounded-lg border border-[#D8D0C2] mb-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#292925] mb-1.5 flex items-center gap-2 font-mono">
            <span className="w-2 h-2 rounded-full bg-[#4F5D4B]" />
            Why not a normal gas detector?
          </h4>
          <p className="text-xs text-[#5D5B53] leading-relaxed">
            Electronic detectors are excellent for detecting immediate peaks. SARVAS is designed to visualize 
            <strong className="text-[#292925] font-semibold"> cumulative exposure over time</strong> across shift operations, helping identify low-level chronic risks that real-time alarms miss.
          </p>
        </div>

        {/* 100-Row Peer-Reviewed Calibration Dataset Note */}
        <div className="bg-[#E5EADF] p-4 rounded-lg border border-[#C5CEC0] mb-4 text-[#4F5D4B] flex items-start justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
              <Database className="w-3.5 h-3.5" />
              Validated Calibration Dataset (100 Samples)
            </h4>
            <p className="text-xs leading-relaxed text-[#374234]">
              SARVAS is wired to a 100-sample peer-reviewed dataset grounded in Norwegian occupational worker exposure studies (2013–2021) and OSHA standards, mapping target doses (0–45 ppm·h), gas concentrations, CIE L*a*b* coordinates, and reference target ΔEab* values with temperature and humidity compensation factors.
            </p>
          </div>
          <button
            onClick={() => {
              closeExplanation();
              setActivePage('calibration');
            }}
            className="px-3 py-1.5 rounded bg-[#4F5D4B] text-[#F6F1E7] text-[10px] font-bold shrink-0 hover:bg-[#3D493A]"
          >
            View Dataset
          </button>
        </div>

        {/* Important Disclaimer Notice */}
        <div className="bg-[#F3EDE2] p-4 rounded-lg border border-[#E0D4C0] mb-6 text-[#826235]">
          <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-1 font-mono">
            <AlertTriangle className="w-4 h-4 text-[#B08A55]" />
            Important Notice
          </div>
          <p className="text-xs leading-relaxed text-[#664D28]">
            Readings shown by this prototype are <strong>simulated estimates</strong> derived from the prototype calibration dataset. <strong>Requires laboratory validation before deployment</strong> in a controlled environmental chamber with chemical sensor calibration.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#D8D0C2]">
          <button
            onClick={() => {
              closeExplanation();
              setActivePage('explainability');
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#292925] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Watch ML Pipeline Video &amp; Architecture →</span>
          </button>

          <button
            onClick={closeExplanation}
            className="w-full sm:w-auto px-5 py-2 rounded-lg bg-[#4F5D4B] text-[#F6F1E7] text-xs font-semibold tracking-wide hover:bg-[#3D493A] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
