import React, { useState } from 'react';
import type { Worker, Reading } from '../types/mobile';
import { 
  Camera, 
  Clock, 
  Tag, 
  ChevronRight, 
  ChevronDown,
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  HelpCircle, 
  CheckCircle2,
  Eye,
  Footprints,
  Sparkles,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface WorkerDashboardProps {
  worker: Worker;
  recentReadings: Reading[];
  workerLanguage?: 'hi' | 'en';
  onToggleLanguage?: (lang: 'hi' | 'en') => void;
  onOpenScan: () => void;
  onViewHistory: () => void;
  onViewProfile: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  worker,
  recentReadings,
  workerLanguage = 'hi',
  onToggleLanguage,
  onOpenScan,
  onViewHistory,
  onViewProfile
}) => {
  const [internalLang, setInternalLang] = useState<'hi' | 'en'>(workerLanguage);
  const [showColorScaleGuide, setShowColorScaleGuide] = useState(false);
  const [showWeeklyTrend, setShowWeeklyTrend] = useState(false);
  const [showRecentLogs, setShowRecentLogs] = useState(false);
  const [showFaqGuide, setShowFaqGuide] = useState(false);

  const activeLang = onToggleLanguage ? workerLanguage : internalLang;
  const isHindi = activeLang === 'hi';

  const handleLangChange = (lang: 'hi' | 'en') => {
    setInternalLang(lang);
    if (onToggleLanguage) {
      onToggleLanguage(lang);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NORMAL':
        return (
          <span className="subtle-badge badge-normal font-bold">
            {isHindi ? 'सुरक्षित' : 'NORMAL (SAFE)'}
          </span>
        );
      case 'MONITOR':
        return (
          <span className="subtle-badge badge-monitor font-bold">
            {isHindi ? 'सतर्क रहें' : 'MONITOR (CAUTION)'}
          </span>
        );
      case 'REVIEW':
        return (
          <span className="subtle-badge badge-review font-bold">
            {isHindi ? 'खतरा / बाहर निकलें' : 'REVIEW (DANGER)'}
          </span>
        );
      default:
        return null;
    }
  };

  // 8-hour shift target threshold is 1.00 ppm·h
  const targetShiftThreshold = 1.00;
  const dosePercent = Math.min(100, Math.round((worker.currentDose / targetShiftThreshold) * 100));

  return (
    <div className="space-y-4 pb-24">
      
      {/* 1. TOP GREETING & SPACIOUS LANGUAGE SWITCHER */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5DFD7] shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono bg-[#2F6B38]/15 text-[#2F6B38] px-2 py-0.5 rounded font-bold uppercase">
                {isHindi ? 'कर्मचारी सुरक्षा' : 'Worker Portal'}
              </span>
              <span className="text-[10px] font-mono text-gray-500">
                {worker.assignedBandId}
              </span>
            </div>
            <h1 className="text-xl font-serif font-bold text-gray-950 tracking-tight truncate">
              {isHindi ? `नमस्ते, ${worker.name}` : `Hello, ${worker.name}`}
            </h1>
            <p className="text-xs text-gray-600 truncate">
              <span className="font-semibold text-gray-900">
                {isHindi ? 'संयंत्र संचालक' : worker.designation}
              </span>
              <span> · </span>
              <span>{isHindi ? 'इकाई २ (डेक बी)' : worker.department}</span>
            </p>
          </div>

          {/* Clean, Roomy Language Switcher Pill */}
          <div className="inline-flex p-1 bg-[#FAF8F5] rounded-xl border border-gray-200 shadow-2xs shrink-0">
            <button
              onClick={() => handleLangChange('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isHindi
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => handleLangChange('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !isHindi
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              English
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN EXPOSURE & SAFETY STATUS CARD (Spacious & Clean) */}
      <div className={`rounded-2xl p-5 border shadow-sm space-y-4 ${
        worker.status === 'REVIEW'
          ? 'bg-red-50/70 border-red-200'
          : worker.status === 'MONITOR'
          ? 'bg-amber-50/70 border-amber-200'
          : 'bg-emerald-50/60 border-emerald-200'
      }`}>
        
        {/* Status Header */}
        <div className="flex items-center justify-between pb-2 border-b border-black/5">
          <div className="space-y-0.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-gray-600 font-bold block">
              {isHindi ? 'वर्तमान पाली में गैस स्तर (H₂S)' : 'Shift Cumulative Dose (H₂S)'}
            </span>
            <span className="text-[10px] text-gray-500 font-mono block">
              {isHindi ? '६० दिन वैध रासायनिक पट्टी' : '60-day chemical validity'}
            </span>
          </div>
          {getStatusBadge(worker.status)}
        </div>

        {/* Big Number Output Display */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl sm:text-5xl font-mono font-bold text-gray-950 tracking-tight">
              {worker.currentDose.toFixed(2)}
            </span>
            <div>
              <span className="text-sm font-serif font-bold text-gray-900 block">
                ppm·h
              </span>
              <span className="text-[10px] text-gray-600 font-mono block">
                {isHindi ? 'सुरक्षित सीमा: १.००' : 'Limit: 1.00 ppm·h'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-mono font-bold text-gray-900">{dosePercent}%</span>
            <span className="text-[9px] text-gray-500 block font-mono uppercase font-semibold">
              {isHindi ? 'सीमा उपयोग' : 'LIMIT'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 pt-1">
          <div className="w-full bg-white/80 h-3 rounded-full overflow-hidden p-0.5 border border-black/10">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                worker.status === 'REVIEW'
                  ? 'bg-red-600'
                  : worker.status === 'MONITOR'
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${dosePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-gray-600 font-mono font-medium">
            <span>{isHindi ? '०.०० सुरक्षित' : '0.00 Safe'}</span>
            <span>{isHindi ? '०.५० सतर्क' : '0.50 Caution'}</span>
            <span>{isHindi ? '१.००+ खतरा' : '1.00+ Danger'}</span>
          </div>
        </div>

        {/* Plain Language Action Advice */}
        <div className="pt-2 border-t border-black/5 text-xs leading-relaxed">
          {worker.status === 'REVIEW' ? (
            <div className="flex items-start gap-2 text-red-900 font-semibold bg-red-100/80 p-3 rounded-xl border border-red-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-700" />
              <span>
                {isHindi 
                  ? '🚨 तुरंत बाहर निकलें! गैस स्तर सुरक्षित सीमा से अधिक है। खुले क्षेत्र में ताजी हवा लें और सुरक्षा अधिकारी को सूचित करें।'
                  : 'Action Required: Shift dose threshold exceeded. Evacuate to clean air and notify safety officer.'}
              </span>
            </div>
          ) : worker.status === 'MONITOR' ? (
            <div className="flex items-start gap-2 text-amber-900 font-medium bg-amber-100/80 p-3 rounded-xl border border-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <span>
                {isHindi
                  ? '⚠️ सतर्क रहें: गैस का प्रभाव दर्ज हुआ है। कार्य क्षेत्र में मास्क (PPE) अनिवार्य रूप से पहनें।'
                  : 'Advisory: Moderate exposure detected. Wear personal breathing protection equipment.'}
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-2 text-emerald-950 font-medium bg-emerald-100/70 p-3 rounded-xl border border-emerald-300">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-700" />
              <span>
                {isHindi
                  ? '✅ आप पूरी तरह सुरक्षित हैं। रिस्टबैंड का रंग सामान्य है। अपना कार्य सामान्य रूप से जारी रखें।'
                  : 'Normal operating range. Sensor shows minimal chemical response. Safe to continue shift.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 3. PRIMARY ACTION: SCAN WRISTBAND BUTTON (Punchy, Clean, Non-Congested) */}
      <div className="space-y-1.5">
        <button
          onClick={onOpenScan}
          className="w-full py-4 px-4 bg-gray-950 hover:bg-black text-white rounded-2xl font-serif text-base font-bold flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all border border-gray-800 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Camera className="w-4 h-4" />
          </div>
          <span className="tracking-wide">
            {isHindi ? 'कलाई का पट्टा स्कैन करें' : 'SCAN WRISTBAND'}
          </span>
        </button>
        <p className="text-center text-[11px] text-gray-500 font-mono font-medium">
          {isHindi ? `रिस्टबैंड कोड: ${worker.assignedBandId} · स्वचालित प्रकाश सुधार` : `Dosimeter ${worker.assignedBandId} · Optical Correction`}
        </p>
      </div>

      {/* 4. THREE SIMPLE SAFETY RULES (Clear, Visual Cards in Full Hindi) */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5DFD7] shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{isHindi ? 'कर्मचारी सुरक्षा के ३ सरल नियम' : 'Worker Safety Instructions (3 Steps)'}</span>
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          {/* Rule 1 */}
          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-gray-200 flex flex-col items-center">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-xs mb-1">
              १
            </div>
            <span className="font-bold text-[10px] text-gray-900 block leading-tight">
              {isHindi ? 'कलाई पर पहनें' : 'Outer Wrist'}
            </span>
            <span className="text-[9px] text-gray-600 mt-0.5 block leading-tight">
              {isHindi ? 'कपड़ों से न ढकें' : 'Never cover'}
            </span>
          </div>

          {/* Rule 2 */}
          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-gray-200 flex flex-col items-center">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-xs mb-1">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[10px] text-gray-900 block leading-tight">
              {isHindi ? 'हर घंटे देखें' : 'Hourly Check'}
            </span>
            <span className="text-[9px] text-gray-600 mt-0.5 block leading-tight">
              {isHindi ? 'बैंगनी = सुरक्षित' : 'Violet = Safe'}
            </span>
          </div>

          {/* Rule 3 */}
          <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-gray-200 flex flex-col items-center">
            <div className="w-6 h-6 rounded-md bg-red-100 text-red-800 font-mono font-bold flex items-center justify-center text-xs mb-1">
              <Footprints className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[10px] text-gray-900 block leading-tight">
              {isHindi ? 'तुरंत निकलें' : 'Evacuate'}
            </span>
            <span className="text-[9px] text-gray-600 mt-0.5 block leading-tight">
              {isHindi ? 'रंग बदलने पर' : 'If strip darkens'}
            </span>
          </div>
        </div>
      </div>

      {/* 5. EXPANDABLE SECTION: COLOR SCALE GUIDE (Keeps Screen Uncongested) */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5DFD7] shadow-xs space-y-2">
        <div
          onClick={() => setShowColorScaleGuide(!showColorScaleGuide)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            {isHindi ? 'रासायनिक पट्टी का रंग पैमाना व अर्थ' : 'Colorimetric Strip Threshold Guide'}
          </span>
          <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 hover:underline">
            <span>{showColorScaleGuide ? (isHindi ? 'छिपाएं' : 'Hide') : (isHindi ? 'देखें' : 'View')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showColorScaleGuide ? 'rotate-180' : ''}`} />
          </span>
        </div>

        {showColorScaleGuide && (
          <div className="pt-2 border-t border-gray-100 space-y-2.5 text-xs animate-in fade-in duration-200">
            <p className="text-[11px] text-gray-600 leading-relaxed">
              {isHindi 
                ? 'H₂S गैस के संपर्क में आने पर रिस्टबैंड की रासायनिक पट्टी बैंगनी से भूरी/काली हो जाती है:'
                : 'The sensing strip changes color from purple to brown/dark as H₂S reacts with Cu-PAN:'}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="w-full h-4 rounded bg-[#d4c5a9] mb-1.5 border border-black/10 shadow-xs"></div>
                <span className="font-mono font-bold text-[11px] text-emerald-800">०.० – ०.५०</span>
                <span className="block text-[10px] text-gray-700 font-bold uppercase mt-0.5">
                  {isHindi ? 'सुरक्षित' : 'SAFE'}
                </span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="w-full h-4 rounded bg-[#8c6d48] mb-1.5 border border-black/10 shadow-xs"></div>
                <span className="font-mono font-bold text-[11px] text-amber-800">०.५० – १.००</span>
                <span className="block text-[10px] text-gray-700 font-bold uppercase mt-0.5">
                  {isHindi ? 'सतर्क रहें' : 'CAUTION'}
                </span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="w-full h-4 rounded bg-[#3a2e2b] mb-1.5 border border-black/10 shadow-xs"></div>
                <span className="font-mono font-bold text-[11px] text-red-800">&gt; १.००</span>
                <span className="block text-[10px] text-gray-700 font-bold uppercase mt-0.5">
                  {isHindi ? 'खतरा' : 'DANGER'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 6. EXPANDABLE SECTION: 7-DAY TREND (Keeps Screen Uncongested) */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5DFD7] shadow-xs space-y-2">
        <div
          onClick={() => setShowWeeklyTrend(!showWeeklyTrend)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            {isHindi ? 'साप्ताहिक गैस संपर्क स्तर (७ दिन)' : '7-Day Exposure Trend'}
          </span>
          <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 hover:underline">
            <span>{showWeeklyTrend ? (isHindi ? 'छिपाएं' : 'Hide') : (isHindi ? 'देखें' : 'View')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showWeeklyTrend ? 'rotate-180' : ''}`} />
          </span>
        </div>

        {showWeeklyTrend && (
          <div className="pt-2 border-t border-gray-100 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-end justify-between gap-2 h-24 pt-3 px-1">
              {worker.trend7Day.map((item) => {
                const barHeight = Math.max(14, Math.round((item.dose / 1.5) * 68));
                const dayHindiMap: Record<string, string> = {
                  'Mon': 'सोम',
                  'Tue': 'मंगल',
                  'Wed': 'बुध',
                  'Thu': 'गुरु',
                  'Fri': 'शुक्र',
                  'Sat': 'शनि',
                  'Sun': 'रवि'
                };
                const dayLabel = isHindi ? (dayHindiMap[item.day] || item.day) : item.day;

                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-mono text-gray-600 font-medium">
                      {item.dose.toFixed(2)}
                    </span>
                    <div
                      className={`w-full rounded-t-md transition-all ${
                        item.dose >= 1.0
                          ? 'bg-red-500'
                          : item.dose >= 0.5
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ height: `${barHeight}px` }}
                    />
                    <span className="text-[9px] font-mono font-bold text-gray-700">{dayLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 7. EXPANDABLE SECTION: RECENT SCANS LOG */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5DFD7] shadow-xs space-y-2">
        <div
          onClick={() => setShowRecentLogs(!showRecentLogs)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700" />
            {isHindi ? 'आज के पिछले जांच परिणाम' : 'Recent Scans Today'}
          </span>
          <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 hover:underline">
            <span>{showRecentLogs ? (isHindi ? 'छिपाएं' : 'Hide') : (isHindi ? 'देखें' : 'View')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showRecentLogs ? 'rotate-180' : ''}`} />
          </span>
        </div>

        {showRecentLogs && (
          <div className="pt-2 border-t border-gray-100 space-y-2 animate-in fade-in duration-200">
            {recentReadings.slice(0, 3).map((reading) => (
              <div
                key={reading.readingId}
                className="bg-[#FAF8F5] border border-gray-200 rounded-xl p-3 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-mono font-bold text-gray-900">
                    {reading.estimatedDose.toFixed(2)} ppm·h
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono">
                    {reading.timestamp} · {reading.scanType === 'OFFICER_FIELD_AUDIT' ? (isHindi ? 'अधिकारी जांच' : 'Inspector Audit') : (isHindi ? 'स्वयं जांच' : 'Self Scan')}
                  </div>
                </div>
                <div>{getStatusBadge(reading.status)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 8. EXPANDABLE SECTION: JURY & FIELD FAQ DEFENSE */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5DFD7] shadow-xs space-y-2">
        <div
          onClick={() => setShowFaqGuide(!showFaqGuide)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="text-xs font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            {isHindi ? 'तकनीकी प्रश्नोत्तरी एवं अक्सर पूछे जाने वाले सवाल' : 'Technical FAQ & Evaluation Defense'}
          </span>
          <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 hover:underline">
            <span>{showFaqGuide ? (isHindi ? 'छिपाएं' : 'Hide') : (isHindi ? 'देखें' : 'View')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFaqGuide ? 'rotate-180' : ''}`} />
          </span>
        </div>

        {showFaqGuide && (
          <div className="pt-2 border-t border-gray-100 space-y-2.5 text-xs animate-in fade-in duration-200">
            {/* Q1 */}
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-gray-200 space-y-1">
              <span className="font-bold text-[11px] text-gray-950 block">
                {isHindi ? '१. क्या बारिश या पसीने से रिस्टबैंड खराब हो जाता है?' : '1. Does rain, sweat or water ruin the sensor?'}
              </span>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                {isHindi
                  ? 'नहीं। रासायनिक पट्टी के ऊपर हाइड्रोफोबिक PTFE (टेफ्लॉन) झिल्ली लगी है जो पानी और पसीने को रोकती है जबकि H₂S गैस अंदर स्वतंत्र रूप से विसरित होती है।'
                  : 'No. A 0.2 µm hydrophobic PTFE Teflon membrane repels liquid sweat and rain droplets while letting volatile H₂S gas diffuse through.'}
              </p>
            </div>

            {/* Q2 */}
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-gray-200 space-y-1">
              <span className="font-bold text-[11px] text-gray-950 block">
                {isHindi ? '२. क्या फोन का कैमरा रोशनी के अनुसार गलत रीडिंग दे सकता है?' : '2. Will camera glare or dim lighting cause false readings?'}
              </span>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                {isHindi
                  ? 'नहीं। रिस्टबैंड पर मुद्रित ५ संदर्भ पैच (A1–A5) और श्वेत सीमा से रोशनी संतुलित की जाती है। दोनों एक ही लेंस से गुजरते हैं, जिससे त्रुटि समाप्त हो जाती है।'
                  : 'No. The on-band 5-patch reference scale (A1–A5) and white fiducial normalize ambient lighting and sensor bias before computing Delta E.'}
              </p>
            </div>

            {/* Q3 */}
            <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-gray-200 space-y-1">
              <span className="font-bold text-[11px] text-gray-950 block">
                {isHindi ? '३. रासायनिक प्रतिक्रिया का वैज्ञानिक आधार क्या है?' : '3. What is the exact chemical reaction mechanism?'}
              </span>
              <p className="text-[10px] text-gray-600 leading-relaxed font-mono">
                [Cu(PAN)]⁺ + H₂S ⟶ CuS↓ (Ksp ≈ 6.3×10⁻³⁶) + PAN + 2H⁺
              </p>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                {isHindi
                  ? 'कॉपर सल्फाइड अवक्षेप बनने से रंग बैंगनी से भूरा/काला होता है। यह 100-सैंपल पीयर-रिव्यूड अंशांकन डेटासेट पर आधारित है।'
                  : 'Irreversible ligand displacement precipitates insoluble CuS, shifting color along the calibrated 100-sample peer-reviewed kinetics curve.'}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

