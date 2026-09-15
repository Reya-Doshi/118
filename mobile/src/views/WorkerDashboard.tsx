import React, { useState } from 'react';
import type { Worker, Reading } from '../types/mobile';
import { 
  Camera, 
  Clock, 
  Tag, 
  ChevronRight, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Activity, 
  HelpCircle, 
  Flame,
  CheckCircle2,
  Eye,
  Footprints
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
          <span className="subtle-badge badge-normal">
            {isHindi ? 'सुरक्षित (SAFE)' : 'NORMAL'}
          </span>
        );
      case 'MONITOR':
        return (
          <span className="subtle-badge badge-monitor">
            {isHindi ? 'सावधानी (CAUTION)' : 'MONITOR'}
          </span>
        );
      case 'REVIEW':
        return (
          <span className="subtle-badge badge-review">
            {isHindi ? 'खतरा (DANGER)' : 'REVIEW'}
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
      {/* Top Header Card with Hindi / English Language Switcher */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <img 
            src="/sarvas_logo_v2.png" 
            alt="RageB8 Official Logo" 
            className="w-11 h-11 rounded-2xl object-contain bg-white p-1 border border-gray-200 shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] font-mono bg-[#4F5D4B]/20 text-[#2F6B38] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {isHindi ? 'कर्मचारी सुरक्षा साथी' : 'Active Worker Session'}
              </span>
              <span className="text-[10px] font-mono text-gray-500">
                {isHindi ? 'रिफाइनरी प्रभाग' : 'MRPL Sector'}
              </span>
            </div>
            <h1 className="text-xl font-serif font-bold text-gray-950 tracking-tight">
              {isHindi ? `नमस्ते, ${worker.name}` : `Hello, ${worker.name}`}
            </h1>
            <p className="text-xs text-gray-600 flex items-center gap-1.5 mt-0.5">
              <span className="font-semibold text-gray-900">
                {isHindi ? 'प्रक्रिया संचालक' : worker.designation}
              </span>
              <span>·</span>
              <span>{worker.department}</span>
            </p>
          </div>
        </div>

        {/* Language Switcher & Profile Initials */}
        <div className="flex items-center gap-2">
          <div className="inline-flex p-0.5 bg-gray-200/80 rounded-xl border border-gray-300 shadow-2xs items-center">
            <button
              onClick={() => handleLangChange('hi')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                isHindi
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
              title="हिंदी"
            >
              🇮🇳 हिं
            </button>
            <button
              onClick={() => handleLangChange('en')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                !isHindi
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-gray-700 hover:text-black'
              }`}
              title="English"
            >
              EN
            </button>
          </div>

          <button
            onClick={onViewProfile}
            className="w-10 h-10 rounded-2xl bg-gray-950 text-white border border-gray-800 flex items-center justify-center text-xs font-serif font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            title="Profile"
          >
            {worker.name.slice(0, 2).toUpperCase()}
          </button>
        </div>
      </div>

      {/* Workplace Location & Hazard Zone Banner */}
      <div className="card-glow p-3.5 space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-xs leading-tight">
            <span className="text-[10px] font-mono uppercase text-gray-500 block font-semibold">
              {isHindi ? 'तैनात कार्य क्षेत्र' : 'Assigned Work Area'}
            </span>
            <span className="font-bold text-gray-900 block mt-0.5">{worker.workLocation}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 text-[11px]">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate max-w-[210px] font-medium">{worker.hazardZone}</span>
          </div>
          <span className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded-md ${
            worker.riskLevel === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            {isHindi ? (worker.riskLevel === 'HIGH' ? 'उच्च जोखिम' : 'सामान्य') : `${worker.riskLevel} RISK`}
          </span>
        </div>
      </div>

      {/* Shift Progress & Assigned Band ID Strip (60-DAY SHELF LIFE) */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        <div className="card-glow p-3 flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
          <div>
            <span className="text-[10px] text-gray-500 block font-mono uppercase font-semibold">
              {isHindi ? 'शिफ्ट समय' : 'Shift Time'}
            </span>
            <span className="font-bold text-gray-900">{worker.shift.split('·')[1]?.trim() || worker.shift}</span>
          </div>
        </div>

        <div className="card-glow p-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-500 block font-mono uppercase font-semibold">
                {isHindi ? 'रिस्टबैंड' : 'Band ID'}
              </span>
              <span className="text-[9px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1 rounded">
                {isHindi ? '६० दिन वैध' : '60d Valid'}
              </span>
            </div>
            <span className="font-mono font-bold text-gray-900">{worker.assignedBandId}</span>
          </div>
          <Tag className="w-4 h-4 text-emerald-700" />
        </div>
      </div>

      {/* Current Shift Cumulative Exposure Card */}
      <div className={`rounded-2xl p-5 relative overflow-hidden ${
        worker.status === 'REVIEW'
          ? 'card-glow-review'
          : worker.status === 'MONITOR'
          ? 'card-glow-monitor'
          : 'card-glow-safe'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-gray-600 font-bold">
            {isHindi ? 'शिफ्ट में गैस स्तर (H₂S कुल संचयी)' : 'Shift Cumulative Exposure (ppm·h)'}
          </span>
          {getStatusBadge(worker.status)}
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-4xl font-mono font-bold text-gray-900 tracking-tight">
            {worker.currentDose.toFixed(2)}
          </span>
          <span className="text-sm font-serif text-gray-600 font-medium">
            ppm·h
          </span>
          <span className="text-[11px] text-gray-500 ml-auto font-mono">
            {isHindi ? 'सुरक्षित सीमा: 1.00 ppm·h' : 'Limit: 1.00 ppm·h'}
          </span>
        </div>

        {/* Progress Bar towards Shift Target Limit */}
        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2 border border-gray-200/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              worker.status === 'REVIEW'
                ? 'bg-red-600'
                : worker.status === 'MONITOR'
                ? 'bg-amber-600'
                : 'bg-emerald-600'
            }`}
            style={{ width: `${dosePercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-600 pt-1 font-medium">
          <span>{dosePercent}% {isHindi ? 'सीमा का उपयोग' : 'of Action Level'}</span>
          <span className="font-semibold text-gray-900">
            {isHindi ? `अंतिम स्कैन: ${worker.lastReadingTime || '11:37'}` : `Last scan: ${worker.lastReadingTime || '11:37 AM'}`}
          </span>
        </div>

        {/* Safety Recommendation Banner based on dose */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 text-xs leading-relaxed">
          {worker.status === 'REVIEW' ? (
            <div className="flex items-start gap-1.5 text-red-700 font-semibold">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>
                {isHindi 
                  ? '🚨 तुरंत बाहर निकलें! गैस स्तर सुरक्षित सीमा (1.00 ppm·h) से अधिक है। सुरक्षा अधिकारी को सूचित करें।'
                  : 'Shift dose threshold exceeded. Report to safety officer Meera Patel and step out of catalytic area.'}
              </span>
            </div>
          ) : worker.status === 'MONITOR' ? (
            <div className="flex items-start gap-1.5 text-amber-800 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>
                {isHindi
                  ? '⚠️ चेतावनी: गैस का प्रभाव दर्ज हुआ। डेक बी या हाइड्रोक्रैकर पर काम करते समय श्वास सुरक्षा मास्क (PPE) पहनें।'
                  : 'Elevated exposure. Wear breathing protection if servicing high-elevation flanges on Deck B.'}
              </span>
            </div>
          ) : (
            <div className="flex items-start gap-1.5 text-emerald-800 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <span>
                {isHindi
                  ? '✅ आप सुरक्षित हैं। रिस्टबैंड का रंग सामान्य है। अपना कार्य सामान्य रूप से जारी रखें।'
                  : 'Within safe 8-hour shift limits. Continue routine monitoring protocol.'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Prominent High-Contrast Tactile SCAN WRISTBAND CTA */}
      <div>
        <button
          onClick={onOpenScan}
          className="w-full py-4 bg-gray-950 hover:bg-black text-white rounded-2xl font-serif text-base font-bold flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-all border border-gray-800 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-sm">
            <Camera className="w-4 h-4" />
          </div>
          <span className="tracking-wide">
            {isHindi ? `रिस्टबैंड स्कैन करें (${worker.assignedBandId})` : `SCAN MY WRISTBAND (${worker.assignedBandId})`}
          </span>
        </button>
        <p className="text-center text-[10px] text-gray-500 font-mono mt-1.5 font-medium">
          {isHindi ? 'रासायनिक रंग विश्लेषण · प्रकाश सुधार तकनीक' : 'Reads chemical color response · AI-assisted illumination correction'}
        </p>
      </div>

      {/* 3 Simple Action Safety Steps (Worker SOP in Hindi/English) */}
      <div className="card-glow p-4 space-y-2.5">
        <h3 className="text-xs font-serif font-bold text-gray-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{isHindi ? 'कर्मचारी सुरक्षा के ३ आसान नियम' : 'Worker Safety Instructions (3 Steps)'}</span>
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          {/* Step 1 */}
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex flex-col items-center">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-xs mb-1">
              1
            </div>
            <span className="font-bold text-[10px] text-gray-900 block leading-tight">
              {isHindi ? 'कलाई पर पहनें' : 'Wear Outer Wrist'}
            </span>
            <span className="text-[9px] text-gray-500 mt-0.5 block leading-tight">
              {isHindi ? 'कपड़ों से न ढकें' : 'Never cover with sleeve'}
            </span>
          </div>

          {/* Step 2 */}
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex flex-col items-center">
            <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold flex items-center justify-center text-xs mb-1">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[10px] text-gray-900 block leading-tight">
              {isHindi ? 'हर घंटे रंग देखें' : 'Check Hourly'}
            </span>
            <span className="text-[9px] text-gray-500 mt-0.5 block leading-tight">
              {isHindi ? 'बैंगनी = सुरक्षित' : 'Violet = Safe'}
            </span>
          </div>

          {/* Step 3 */}
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 flex flex-col items-center">
            <div className="w-6 h-6 rounded-md bg-red-100 text-red-800 font-mono font-bold flex items-center justify-center text-xs mb-1">
              <Footprints className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[10px] text-gray-900 block leading-tight">
              {isHindi ? 'तुरंत निकलें' : 'Retreat if Dark'}
            </span>
            <span className="text-[9px] text-gray-500 mt-0.5 block leading-tight">
              {isHindi ? 'रंग बदलने पर' : 'Go to fresh air'}
            </span>
          </div>
        </div>
      </div>

      {/* Color Scale Strip Reference Accordion */}
      <div className="card-glow p-4 space-y-2">
        <div
          onClick={() => setShowColorScaleGuide(!showColorScaleGuide)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <span className="text-xs font-serif font-bold text-gray-900 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-700" />
            {isHindi ? 'रंग पैमाना और खुराक स्तर' : 'Colorimetric Strip Threshold Guide'}
          </span>
          <span className="text-[11px] text-emerald-700 font-bold hover:underline">
            {showColorScaleGuide ? (isHindi ? 'छिपाएं' : 'Hide') : (isHindi ? 'पैमाना देखें' : 'View Scale')}
          </span>
        </div>

        {showColorScaleGuide && (
          <div className="pt-2 border-t border-gray-100 space-y-2 text-xs">
            <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
              {isHindi 
                ? 'H₂S गैस के संपर्क में आने पर रिस्टबैंड की पट्टी बैंगनी से भूरी/काली हो जाती है:'
                : 'The sensing strip changes color from purple to brown/dark as H₂S reacts with Cu-PAN:'}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="w-full h-4 rounded bg-[#d4c5a9] mb-1.5 border border-black/10 shadow-xs"></div>
                <span className="font-mono font-bold text-[11px] text-emerald-800">0.0 – 0.50</span>
                <span className="block text-[10px] text-gray-600 font-bold uppercase mt-0.5">
                  {isHindi ? 'सुरक्षित (Safe)' : 'NORMAL'}
                </span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="w-full h-4 rounded bg-[#8c6d48] mb-1.5 border border-black/10 shadow-xs"></div>
                <span className="font-mono font-bold text-[11px] text-amber-800">0.50 – 1.00</span>
                <span className="block text-[10px] text-gray-600 font-bold uppercase mt-0.5">
                  {isHindi ? 'सावधानी (Warn)' : 'MONITOR'}
                </span>
              </div>
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <div className="w-full h-4 rounded bg-[#3a2e2b] mb-1.5 border border-black/10 shadow-xs"></div>
                <span className="font-mono font-bold text-[11px] text-red-800">&gt; 1.00 ppm·h</span>
                <span className="block text-[10px] text-gray-600 font-bold uppercase mt-0.5">
                  {isHindi ? 'खतरा (Danger)' : 'REVIEW'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7-Day Exposure Trend Chart Preview */}
      <div className="card-glow p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-serif font-bold text-gray-900 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-700" />
            {isHindi ? '७-दिवसीय व्यक्तिगत रुझान' : '7-Day Personal Exposure Trend'}
          </span>
          <span className="text-[10px] font-mono text-gray-500 font-semibold">
            {isHindi ? 'साप्ताहिक' : 'Weekly Log'}
          </span>
        </div>

        <div className="flex items-end justify-between gap-2 h-20 pt-2 px-1">
          {worker.trend7Day.map((item) => {
            const barHeight = Math.max(12, Math.round((item.dose / 1.5) * 64));

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
                <span className="text-[9px] font-mono font-bold text-gray-700">{item.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Scans List */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-gray-600 font-bold">
            {isHindi ? 'आज के हालिया स्कैन' : 'Recent Scans Today'}
          </h3>
          <button
            onClick={onViewHistory}
            className="text-xs text-emerald-700 font-bold flex items-center gap-0.5 active:underline cursor-pointer"
          >
            {isHindi ? 'सभी देखें' : 'All Logs'} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {recentReadings.slice(0, 3).map((reading) => (
            <div
              key={reading.readingId}
              className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between text-xs shadow-xs"
            >
              <div className="space-y-0.5">
                <div className="font-mono font-semibold text-gray-900">
                  {reading.estimatedDose.toFixed(2)} ppm·h
                </div>
                <div className="text-[11px] text-gray-500 font-mono">
                  {reading.timestamp} · {reading.scanType === 'OFFICER_FIELD_AUDIT' ? (isHindi ? 'अधिकारी ऑडिट' : 'Inspector Audit') : (isHindi ? 'स्वयं स्कैन' : 'Self Scan')}
                </div>
              </div>
              <div>{getStatusBadge(reading.status)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
