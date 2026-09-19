import React from 'react';
import { useApp } from '../context/AppContext';
import type { PageView } from '../types';
import {
  ExternalLink,
  BookOpen,
  ShieldCheck,
  FlaskConical,
  Cpu,
  Database,
  ArrowRight,
  Bookmark
} from 'lucide-react';

interface ReferenceLinkItem {
  id: string;
  category: 'STATUTORY' | 'CHEMICAL' | 'VISION' | 'PROJECT';
  title: string;
  subtitle: string;
  citation: string;
  description: string;
  url: string;
  tag: string;
  isExternal: boolean;
  internalPage?: PageView;
}

const REFERENCE_ITEMS: ReferenceLinkItem[] = [
  // 1. STATUTORY STANDARDS
  {
    id: 'ref-osha-1910',
    category: 'STATUTORY',
    title: 'OSHA 1910.1000 Table Z-2 — Toxic and Hazardous Substances',
    subtitle: 'United States Occupational Safety and Health Administration',
    citation: '29 CFR 1910.1000 Table Z-2 (Hydrogen Sulfide Permissible Exposure Limits)',
    description: 'Defines the statutory 20 ppm ceiling limit and 50 ppm peak exposure threshold for industrial workers in refining, mining, and oil operations.',
    url: 'https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.1000tableZ2',
    tag: 'OSHA Standard',
    isExternal: true
  },
  {
    id: 'ref-acgih-tlv',
    category: 'STATUTORY',
    title: 'ACGIH TLV-TWA & STEL Standards (2024)',
    subtitle: 'American Conference of Governmental Industrial Hygienists',
    citation: 'ACGIH Threshold Limit Values for Chemical Substances: H₂S (CAS 7783-06-4)',
    description: 'Establishes the stringent 1 ppm (8-hour TWA) and 5 ppm (STEL) workplace exposure limits mandated for continuous personal monitoring.',
    url: 'https://www.acgih.org/science/tlv-sei-resources/',
    tag: 'ACGIH Standard',
    isExternal: true
  },
  {
    id: 'ref-niosh-guide',
    category: 'STATUTORY',
    title: 'NIOSH Pocket Guide to Chemical Hazards — Hydrogen Sulfide',
    subtitle: 'National Institute for Occupational Safety and Health (CDC)',
    citation: 'NIOSH Publication No. 2005-149 / H₂S IDLH Threshold',
    description: 'Defines the Immediately Dangerous to Life or Health (IDLH) limit of 100 ppm and occupational respiratory protection protocols.',
    url: 'https://www.cdc.gov/niosh/npg/npgd0337.html',
    tag: 'NIOSH / CDC',
    isExternal: true
  },
  {
    id: 'ref-oisd-113',
    category: 'STATUTORY',
    title: 'OISD-STD-113 — Petroleum Refinery Gas Monitoring Code',
    subtitle: 'Oil Industry Safety Directorate (Ministry of Petroleum & Natural Gas, India)',
    citation: 'OISD-STD-113: Classification & Monitoring of Hazardous Gas Areas in Refineries',
    description: 'Mandates personal gas detection and daily audit logging for petroleum refinery personnel in hydrocarbon processing units.',
    url: 'https://www.oisd.gov.in/',
    tag: 'OISD India',
    isExternal: true
  },
  {
    id: 'ref-dgms-mining',
    category: 'STATUTORY',
    title: 'DGMS Safety Circular No. 02/2019 — Underground Gas Safety',
    subtitle: 'Directorate General of Mines Safety (Ministry of Labour & Employment, India)',
    citation: 'DGMS (Tech) Circular: Monitoring Harmful Gases in Underground Mines',
    description: 'Statutory requirements for passive colorimetric badges and zero-power chemical detection in hazardous mining operations.',
    url: 'https://www.dgms.gov.in/',
    tag: 'DGMS Mining',
    isExternal: true
  },
  {
    id: 'ref-iso-45001',
    category: 'STATUTORY',
    title: 'ISO 45001:2018 — Occupational Health & Safety Management Systems',
    subtitle: 'International Organization for Standardization',
    citation: 'ISO 45001:2018 Requirements with Guidance for Use',
    description: 'Global benchmark framework for industrial worker hazard mitigation, shift auditing, and automated compliance logging.',
    url: 'https://www.iso.org/standard/63787.html',
    tag: 'ISO Standard',
    isExternal: true
  },

  // 2. CHEMICAL REACTION KINETICS
  {
    id: 'ref-astm-d4323',
    category: 'CHEMICAL',
    title: 'ASTM D4323-15 — Standard Test Method for H₂S in Atmosphere',
    subtitle: 'ASTM International Standards Organization',
    citation: 'ASTM D4323-15: Colorimetric Reaction Rate Method for Hydrogen Sulfide',
    description: 'Peer-reviewed standard for colorimetric gas absorption kinetics using solid-state metal salt impregnated paper substrates.',
    url: 'https://www.astm.org/d4323-15.html',
    tag: 'ASTM Standard',
    isExternal: true
  },
  {
    id: 'ref-ksp-sulfides',
    category: 'CHEMICAL',
    title: 'Inorganic Sulfide Solubility Product Constants (Ksp Kinetics)',
    subtitle: 'CRC Handbook of Chemistry and Physics (104th Edition)',
    citation: 'Solubility Product Constants of Inorganic Sulfides: Ag₂S & CuS Phase Kinetics',
    description: 'Thermodynamic basis for zero-fading irreversible precipitation: Ag₂S (Ksp ≈ 6.3 × 10⁻⁵⁰) and CuS (Ksp ≈ 6.3 × 10⁻³⁶).',
    url: 'https://hbcp.chemnetbase.com/',
    tag: 'CRC Handbook',
    isExternal: true
  },
  {
    id: 'ref-arrhenius-kinetics',
    category: 'CHEMICAL',
    title: 'Arrhenius Environmental Kinetics & Matrix Swelling Compensation',
    subtitle: 'Journal of Physical Chemistry A',
    citation: 'Arrhenius Activation Energy (Ea ≈ 42.5 kJ/mol) for Gas-Solid Phase Sulfidation',
    description: 'Empirical formulation used by SARVAS to adjust colorimetric deltaE values for ambient temperature (15–50°C) and relative humidity (20–90%).',
    url: 'https://pubs.acs.org/journal/jpcafh',
    tag: 'ACS Chemistry',
    isExternal: true
  },

  // 3. COMPUTER VISION & COLORIMETRY
  {
    id: 'ref-cie-lab',
    category: 'VISION',
    title: 'ISO/CIE 11664-4:2019 — CIE 1976 L*a*b* Color Space Standard',
    subtitle: 'International Commission on Illumination (CIE)',
    citation: 'ISO/CIE 11664-4: Colorimetry — Part 4: CIE 1976 L*a*b* Colour Space',
    description: 'Perceptually uniform color representation standard used to extract precise L*, a*, b* coordinates from optical sensing strip images.',
    url: 'https://www.cie.co.at/publications/colorimetry-part-4-cie-1976-lab-colour-space-0',
    tag: 'CIE Standard',
    isExternal: true
  },
  {
    id: 'ref-ciede2000',
    category: 'VISION',
    title: 'ISO/CIE 11664-6:2022 — CIEDE2000 Color Difference Formula',
    subtitle: 'International Commission on Illumination (CIE)',
    citation: 'ISO/CIE 11664-6: Colorimetry — Part 6: CIEDE2000 Colour Difference Formula',
    description: 'Precision formula (ΔE*00) for calculating optical strip darkening relative to pristine unreacted reference swatches.',
    url: 'https://www.cie.co.at/publications/colorimetry-part-6-ciede2000-colour-difference-formula',
    tag: 'CIE Standard',
    isExternal: true
  },
  {
    id: 'ref-vk-adaptation',
    category: 'VISION',
    title: 'von Kries Chromatic Adaptation Transform for Color Constancy',
    subtitle: 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
    citation: 'Computational Color Constancy & Sensor Normalization under Ambient Light Drift',
    description: 'Algorithmic pipeline for normalizing optical band photos under outdoor sunlight, shadow, fluorescent, or LED lighting.',
    url: 'https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34',
    tag: 'IEEE PAMI',
    isExternal: true
  },
  {
    id: 'ref-gemini-vision',
    category: 'VISION',
    title: 'Google Gemini 2.5 Flash Vision REST API Reference',
    subtitle: 'Google AI for Developers',
    citation: 'Gemini Multimodal REST API: Optical Quality Audits & Bounding Box Localization',
    description: 'Direct REST client architecture used for on-device localization of the dual-zone sensing strip and printed reference step-wedge scale.',
    url: 'https://ai.google.dev/docs',
    tag: 'Google AI',
    isExternal: true
  },

  // 4. PROJECT NAV & TECHNICAL LINKS
  {
    id: 'ref-project-dossier',
    category: 'PROJECT',
    title: 'SARVAS Project Dossier & Roadmap',
    subtitle: 'Passive Chemical Dosimeter Technical Blueprint',
    citation: 'SARVAS Technical Specification & Prototype Dossier',
    description: 'Comprehensive overview of hardware anatomy, dual-zone chemical physics, software stack, and commercial deployment roadmap.',
    url: '#overview',
    tag: 'Project Overview',
    isExternal: false,
    internalPage: 'overview'
  },
  {
    id: 'ref-303-matrix',
    category: 'PROJECT',
    title: '303-Sample Empirical Dual-Zone Calibration Matrix',
    subtitle: 'Empirical Validation Dataset',
    citation: 'AgNO₃ + CuSO₄ 303-Sample Matrix (0.125 – 160.0 ppm·h)',
    description: 'Full empirical calibration dataset covering 9 validation blocks, dual-zone color swatches, L*a*b* coordinates, and temperature factors.',
    url: '#calibration',
    tag: 'Calibration Dataset',
    isExternal: false,
    internalPage: 'calibration'
  },
  {
    id: 'ref-scanner',
    category: 'PROJECT',
    title: 'Optical Camera Scanner & Analyzer Engine',
    subtitle: 'Interactive Prototype',
    citation: 'Dual Scanning Camera & Benchmark Badge Uploader',
    description: 'Live interactive camera scanner interface supporting on-device spatial inspection, sample badge presets, and environmental sliders.',
    url: '#scan',
    tag: 'Live Scanner',
    isExternal: false,
    internalPage: 'scan'
  },
  {
    id: 'ref-ml-explainability',
    category: 'PROJECT',
    title: 'ML Pipeline & Explainability Architecture',
    subtitle: 'Gradient Boosting Regressor Model',
    citation: 'Scikit-Learn Gradient Boosting Regressor & Arrhenius Physics Fusion',
    description: 'Interactive step-by-step walkthrough of raw photo capture, L*a*b* extraction, fiducial normalization, and dosage prediction.',
    url: '#explainability',
    tag: 'ML Pipeline',
    isExternal: false,
    internalPage: 'explainability'
  },
  {
    id: 'ref-kiosk-protocol',
    category: 'PROJECT',
    title: 'Shift Kiosk Operator Protocol & Shift Check-In',
    subtitle: 'Plant Operator Workflow',
    citation: 'Kiosk 4-Step Operator Shift Check-In & Check-Out Protocol',
    description: 'Interactive kiosk demo simulating daily shift worker wristband scans, dosage logging, and automated worker safety clearance.',
    url: '#kiosk',
    tag: 'Kiosk Demo',
    isExternal: false,
    internalPage: 'kiosk'
  }
];

export const ReferencesPage: React.FC = () => {
  const { setActivePage } = useApp();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('ALL');

  const handleLinkClick = (item: ReferenceLinkItem) => {
    if (item.isExternal) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else if (item.internalPage) {
      setActivePage(item.internalPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredItems = REFERENCE_ITEMS.filter(
    item => selectedCategory === 'ALL' || item.category === selectedCategory
  );

  return (
    <div className="space-y-8 pb-12">
      
      {/* Page Header Banner */}
      <div className="bg-[#292925] text-[#F6F1E7] rounded-3xl p-6 sm:p-10 border border-[#3E3C36] shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-[#4F5D4B] text-[#F6F1E7] text-[10px] font-mono font-bold uppercase tracking-wider">
              SARVAS Technical Bibliography
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white/10 text-[#C2CBBF] text-[10px] font-mono">
              {REFERENCE_ITEMS.length} Citations &amp; Links
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
            Reference Links &amp; Statutory Bibliography
          </h1>

          <p className="text-xs sm:text-sm text-[#A69F91] leading-relaxed font-sans">
            Authoritative documentation repository detailing statutory exposure limits (OSHA, ACGIH, NIOSH, OISD, DGMS), peer-reviewed inorganic chemistry literature, CIE colorimetry standards, and internal SARVAS project dossiers.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#D8D0C2] scrollbar-none">
        {[
          { id: 'ALL', label: 'All References', count: REFERENCE_ITEMS.length, icon: Bookmark },
          { id: 'STATUTORY', label: 'Statutory Standards', count: REFERENCE_ITEMS.filter(i => i.category === 'STATUTORY').length, icon: ShieldCheck },
          { id: 'CHEMICAL', label: 'Chemical Kinetics', count: REFERENCE_ITEMS.filter(i => i.category === 'CHEMICAL').length, icon: FlaskConical },
          { id: 'VISION', label: 'Colorimetry & AI', count: REFERENCE_ITEMS.filter(i => i.category === 'VISION').length, icon: Cpu },
          { id: 'PROJECT', label: 'Project Navigation', count: REFERENCE_ITEMS.filter(i => i.category === 'PROJECT').length, icon: BookOpen }
        ].map(tab => {
          const Icon = tab.icon;
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#292925] text-[#F6F1E7] shadow-xs'
                  : 'bg-[#EDE5D6]/60 text-[#5D5B53] hover:bg-[#EDE5D6] hover:text-[#292925]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected ? 'bg-white/20 text-[#F6F1E7]' : 'bg-[#D8D0C2] text-[#292925]'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reference Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => handleLinkClick(item)}
            className="bg-[#EDE5D6]/40 hover:bg-[#EDE5D6]/80 rounded-2xl p-5 border border-[#D8D0C2] hover:border-[#4F5D4B] shadow-2xs hover:shadow-md transition-all space-y-3 cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded bg-[#4F5D4B]/15 text-[#4F5D4B] font-mono text-[10px] font-bold uppercase tracking-wider">
                  {item.tag}
                </span>

                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-[#4F5D4B] group-hover:translate-x-0.5 transition-transform">
                  <span>{item.isExternal ? 'External Link' : 'Open Page'}</span>
                  {item.isExternal ? (
                    <ExternalLink className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold text-[#292925] group-hover:text-[#4F5D4B] transition-colors leading-snug">
                {item.title}
              </h3>

              <div className="text-[11px] font-mono text-[#71806B] font-bold">
                {item.subtitle}
              </div>

              <div className="text-[10px] font-mono text-[#878377] bg-white/70 p-2 rounded-lg border border-[#D8D0C2]/60">
                {item.citation}
              </div>

              <p className="text-xs text-[#5D5B53] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-2 border-t border-[#D8D0C2]/60 flex items-center justify-between text-[11px] font-mono text-[#878377]">
              <span className="truncate max-w-[280px]">{item.url}</span>
              <span className="text-[#4F5D4B] font-bold group-hover:underline">Access Documentation →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="p-5 rounded-2xl bg-white border border-[#D8D0C2] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-5 h-5 text-[#4F5D4B] shrink-0" />
          <div>
            <div className="font-bold text-[#292925]">Need additional raw dataset links or calibration formulas?</div>
            <div className="text-[11px] text-[#5D5B53]">Explore the full 303-sample empirical matrix and Arrhenius compensation model.</div>
          </div>
        </div>

        <button
          onClick={() => {
            setActivePage('calibration');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-4 py-2 rounded-xl bg-[#4F5D4B] text-white text-xs font-bold hover:bg-[#3D493A] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Open 303 Matrix</span>
        </button>
      </div>

    </div>
  );
};
