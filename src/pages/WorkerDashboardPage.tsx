import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Camera, 
  Clock, 
  Tag, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  ChevronRight, 
  History, 
  TrendingUp,
  CheckCircle2,
  Eye,
  Footprints
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';

export const WorkerDashboardPage: React.FC = () => {
  const { 
    currentUser, 
    workers, 
    readings, 
    setActivePage, 
    setSelectedWorker, 
    openLoginModal,
    workerLanguage,
    setWorkerLanguage
  } = useApp();

  const [showColorScaleGuide, setShowColorScaleGuide] = useState(false);

  const isHindi = workerLanguage === 'hi';

  // Match the active worker from context or fallback to first worker
  const activeWorker = workers.find(
    w => w.workerId === currentUser?.employeeId || 
         w.badgeId === currentUser?.assignedBandId || 
         w.name.toLowerCase() === currentUser?.name.toLowerCase()
  ) || workers[0];

  // Shift target threshold is 1.00 ppm·h
  const targetShiftThreshold = 1.00;
  const currentDose = activeWorker?.currentDose ?? 0.72;
  const dosePercent = Math.min(100, Math.round((currentDose / targetShiftThreshold) * 100));

  // Filter readings specific to this worker
  const personalReadings = readings.filter(
    r => r.workerId === activeWorker.workerId || 
         r.badgeId === activeWorker.badgeId ||
         r.workerName.toLowerCase() === activeWorker.name.toLowerCase()
  );

  const handleOpenScan = () => {
    setSelectedWorker(activeWorker);
    setActivePage('scan');
  };

  const handleOpenHistory = () => {
    setActivePage('history');
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Top Header & Worker Profile + Hindi/English Language Switcher */}
      <div className="bg-[#EDE5D6]/40 p-4 sm:p-5 rounded-2xl border border-[#D8D0C2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <img 
            src="/sarvas_logo_v2.png" 
            alt="SARVAS Logo" 
            className="w-12 h-12 rounded-2xl object-contain bg-white p-1 border border-[#D8D0C2] shadow-xs shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono bg-[#4F5D4B]/15 text-[#4F5D4B] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider border border-[#4F5D4B]/20">
                {isHindi ? 'कर्मचारी सुरक्षा पोर्टल' : 'Worker Safety Portal'}
              </span>
              <span className="text-[10px] font-mono text-[#878377]">
                MRPL Refinery
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#292925] tracking-tight">
              {isHindi ? `नमस्ते, ${activeWorker.name}` : `Hello, ${activeWorker.name}`}
            </h1>
            <p className="text-xs text-[#5D5B53] flex flex-wrap items-center gap-2 mt-0.5">
            <span className="font-semibold text-[#292925]">
              {isHindi ? 'ऑपरेटर (प्रक्रिया संचालक)' : (activeWorker.role || 'Process Operator')}
            </span>
            <span>·</span>
            <span>{activeWorker.department}</span>
            <span>·</span>
            <span className="font-mono text-[11px] text-[#71806B] font-bold">ID: {activeWorker.workerId}</span>
          </p>
        </div>
      </div>

        {/* Action Controls: Hindi Language Toggle + Switch Profile */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* Worker Hindi / English Switcher */}
          <div className="inline-flex p-1 bg-[#EDE5D6] rounded-xl border border-[#D8D0C2] shadow-2xs items-center gap-0.5">
            <button
              onClick={() => setWorkerLanguage('hi')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                isHindi
                  ? 'bg-[#4F5D4B] text-[#F6F1E7] shadow-xs'
                  : 'text-[#5D5B53] hover:text-[#292925]'
              }`}
              title="हिंदी में देखें"
            >
              <span>🇮🇳 हिंदी</span>
            </button>
            <button
              onClick={() => setWorkerLanguage('en')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                !isHindi
                  ? 'bg-[#4F5D4B] text-[#F6F1E7] shadow-xs'
                  : 'text-[#5D5B53] hover:text-[#292925]'
              }`}
              title="Switch to English"
            >
              <span>English</span>
            </button>
          </div>

          <button
            onClick={openLoginModal}
            className="px-3 py-1.5 rounded-lg border border-[#D8D0C2] bg-[#EDE5D6] hover:bg-[#E2D8C5] text-xs text-[#292925] font-medium transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            title="Switch Personnel Profile"
          >
            <div className="w-5 h-5 rounded-full bg-[#B08A55] text-white flex items-center justify-center text-[10px] font-bold font-mono">
              {activeWorker.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="hidden sm:inline">{isHindi ? 'भूमिका' : 'Role'}</span>
          </button>
        </div>
      </div>

      {/* Shift & Band Information Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Work Area */}
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
          <MapPin className="w-4 h-4 text-[#71806B] shrink-0 mt-0.5" />
          <div className="text-xs leading-tight">
            <span className="text-[10px] font-mono uppercase text-[#878377] block font-semibold">
              {isHindi ? 'कार्य क्षेत्र' : 'Assigned Unit'}
            </span>
            <span className="font-bold text-[#292925] mt-0.5 block">{activeWorker.department}</span>
            <span className="text-[10px] text-[#5D5B53] mt-0.5 block font-serif">
              {isHindi ? 'डेक बी · ज़ोन 1' : 'Deck B · Zone 1'}
            </span>
          </div>
        </div>

        {/* Shift Duration */}
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
          <Clock className="w-4 h-4 text-[#71806B] shrink-0 mt-0.5" />
          <div className="text-xs leading-tight">
            <span className="text-[10px] font-mono uppercase text-[#878377] block font-semibold">
              {isHindi ? 'कार्य शिफ्ट' : 'Active Shift'}
            </span>
            <span className="font-bold text-[#292925] mt-0.5 block">{activeWorker.shift}</span>
            <span className="text-[10px] text-[#5D5B53] mt-0.5 block font-serif">
              {isHindi ? `पिछला स्कैन: ${activeWorker.lastReadingTime || '11:37'}` : `Last read: ${activeWorker.lastReadingTime || '11:37'}`}
            </span>
          </div>
        </div>

        {/* Assigned Band */}
        <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-3 flex items-start gap-2.5 shadow-2xs">
          <Tag className="w-4 h-4 text-[#71806B] shrink-0 mt-0.5" />
          <div className="text-xs leading-tight flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#878377] block font-semibold">
                {isHindi ? 'रिस्टबैंड आईडी' : 'Dosimeter Band'}
              </span>
              <span className="text-[10px] font-mono text-[#4F5D4B] font-bold">
                {isHindi ? '60 दिन वैध' : '60d valid'}
              </span>
            </div>
            <span className="font-mono font-bold text-sm text-[#292925] mt-0.5 block">{activeWorker.badgeId}</span>
            <span className="text-[10px] text-[#5D5B53] mt-0.5 block font-serif">
              {isHindi ? 'Cu-PAN रासायनिक पट्टी' : 'Cu-PAN Chemical Strip'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Exposure Gauge Card — Simple, High-Clarity, Non-Overwhelming */}
      <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        
        {/* Status Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#D8D0C2] pb-3">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#5D5B53] font-bold block">
              {isHindi ? 'वर्तमान शिफ्ट में गैस का स्तर (H₂S)' : 'Shift Cumulative H₂S Exposure'}
            </span>
            <p className="text-[11px] text-[#878377] font-serif mt-0.5">
              {isHindi ? 'रिस्टबैंड के रंग पर आधारित सुरक्षा स्थिति' : 'Integrated real-time dosage based on colorimetric strip analysis'}
            </p>
          </div>
          <StatusBadge status={activeWorker.status} size="lg" />
        </div>

        {/* Big Dose Output Display */}
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl sm:text-5xl font-mono font-bold text-[#292925] tracking-tight">
              {currentDose.toFixed(2)}
            </span>
            <div>
              <span className="text-base font-serif font-bold text-[#292925] block">
                ppm·h
              </span>
              <span className="text-[11px] text-[#878377] font-mono block">
                {isHindi ? 'सुरक्षित सीमा: 1.00 ppm·h' : 'Shift Threshold: 1.00 ppm·h'}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-mono font-bold text-[#292925]">{dosePercent}%</span>
            <span className="text-[10px] text-[#878377] block font-mono uppercase">
              {isHindi ? 'सीमा का प्रतिशत' : 'OF SHIFT LIMIT'}
            </span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-[#D8D0C2] h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                activeWorker.status === 'REVIEW'
                  ? 'bg-[#9A6258]'
                  : activeWorker.status === 'MONITOR'
                  ? 'bg-[#B08A55]'
                  : 'bg-[#5A7456]'
              }`}
              style={{ width: `${dosePercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#5D5B53] font-mono pt-0.5">
            <span>{isHindi ? '0.00 सुरक्षित (Safe)' : '0.00 Safe'}</span>
            <span>{isHindi ? '0.50 सावधानी (Monitor)' : '0.50 Monitor'}</span>
            <span>{isHindi ? '1.00+ खतरा (Review)' : '1.00+ Review'}</span>
          </div>
        </div>

        {/* Clear Plain-Language Advisory in Hindi & English */}
        <div className="pt-2">
          {activeWorker.status === 'REVIEW' ? (
            <div className="flex items-start gap-3 text-[#7A342B] bg-[#9A6258]/15 p-4 rounded-xl border border-[#9A6258]/30">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#9A6258] mt-0.5" />
              <div>
                <span className="text-sm font-bold block">
                  {isHindi ? '🚨 तुरंत ध्यान दें: गैस की सुरक्षित सीमा पार हुई!' : 'Action Required: Shift Limit Exceeded'}
                </span>
                <p className="text-xs font-serif mt-1 text-[#7A342B] leading-relaxed">
                  {isHindi 
                    ? 'आपका गैस स्तर 1.00 ppm·h से ऊपर है! तुरंत कार्य क्षेत्र से बाहर सुरक्षित ताजी हवा में निकलें और सुरक्षा अधिकारी (मीरा पटेल) को सूचित करें।'
                    : 'Your cumulative exposure has exceeded 1.00 ppm·h. Report immediately to HSE Safety Officer (Mira Patel) and step out of catalytic area to clean air zone.'}
                </p>
              </div>
            </div>
          ) : activeWorker.status === 'MONITOR' ? (
            <div className="flex items-start gap-3 text-[#795726] bg-[#B08A55]/15 p-4 rounded-xl border border-[#B08A55]/30">
              <AlertTriangle className="w-5 h-5 shrink-0 text-[#B08A55] mt-0.5" />
              <div>
                <span className="text-sm font-bold block">
                  {isHindi ? '⚠️ सावधानी: गैस का प्रभाव दर्ज किया गया' : 'Advisory: Moderate Exposure Detected'}
                </span>
                <p className="text-xs font-serif mt-1 text-[#795726] leading-relaxed">
                  {isHindi
                    ? 'गैस का स्तर बढ़ रहा है। डेक बी या हाइड्रोक्रैकर क्षेत्र में काम करते समय श्वास सुरक्षा मास्क (PPE) अवश्य पहनें।'
                    : 'Cumulative shift dose is approaching the 1.00 ppm·h threshold. Wear personal breathing protection when servicing high-elevation flanges on Deck B.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3 text-[#385034] bg-[#5A7456]/15 p-4 rounded-xl border border-[#5A7456]/25">
              <ShieldCheck className="w-5 h-5 shrink-0 text-[#5A7456] mt-0.5" />
              <div>
                <span className="text-sm font-bold block">
                  {isHindi ? '✅ आप पूरी तरह सुरक्षित हैं' : 'Normal Safe Operating Range'}
                </span>
                <p className="text-xs font-serif mt-1 text-[#385034] leading-relaxed">
                  {isHindi
                    ? 'रिस्टबैंड पर कोई हानिकारक प्रभाव नहीं है। गैस स्तर सामान्य व सुरक्षित सीमा में है। अपना काम जारी रखें।'
                    : 'Dosimeter strip shows minimal chemical response. Cumulative exposure is well within safe limits. Continue standard work shift.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Big Unmissable Primary Action: Scan Wristband */}
      <div className="bg-[#292925] text-[#F6F1E7] rounded-2xl p-5 sm:p-7 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-[#3e3c36]">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-[10px] font-mono bg-[#71806B] text-[#F6F1E7] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              {isHindi ? 'स्कैन के लिए तैयार' : 'Ready to Scan'}
            </span>
            <span className="text-[11px] font-mono text-[#D8D0C2]">
              {activeWorker.badgeId} · 60d
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
            {isHindi ? 'अपना रिस्टबैंड अभी स्कैन करें' : 'Read My Wristband Now'}
          </h2>
          <p className="text-xs text-[#D8D0C2]/80 max-w-md font-serif">
            {isHindi 
              ? 'कैमरे से अपने रिस्टबैंड की फोटो लें ताकि वास्तविक रंग और गैस स्तर तुरंत पता चल सके।'
              : 'Capture a clear photo of your wristband to extract optical strip absorbance and update your live dose.'}
          </p>
        </div>

        <button
          onClick={handleOpenScan}
          className="w-full sm:w-auto px-7 py-4 bg-[#71806B] hover:bg-[#5E6D58] text-[#F6F1E7] rounded-xl font-mono text-sm font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <Camera className="w-5 h-5" />
          <span>{isHindi ? 'रिस्टबैंड स्कैन करें' : 'SCAN WRISTBAND'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Simple Action Safety Steps (Worker SOP Card in Hindi / English) */}
      <div className="bg-[#EDE5D6]/50 border border-[#D8D0C2] rounded-2xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#292925] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#4F5D4B]" />
          <span>{isHindi ? 'कर्मचारी सुरक्षा नियम (३ आसान नियम)' : 'Worker Safety Instructions (3 Simple Steps)'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#4F5D4B]/15 text-[#4F5D4B] font-mono font-bold flex items-center justify-center text-xs">
              1
            </div>
            <div className="text-xs font-bold text-[#292925]">
              {isHindi ? 'कलाई पर बाहर पहनें' : 'Wear on Outer Wrist'}
            </div>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              {isHindi 
                ? 'पट्टे को आस्तीन या दस्ताने के नीचे न दबाएं; रासायनिक पट्टी खुली हवा में रखें।'
                : 'Keep band exposed to ambient air on outer wrist; never cover with sleeves or gloves.'}
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#4F5D4B]/15 text-[#4F5D4B] font-mono font-bold flex items-center justify-center text-xs">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-[#292925]">
              {isHindi ? 'हर घंटे रंग देखें' : 'Check Color Hourly'}
            </div>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              {isHindi 
                ? 'बैंगनी = सुरक्षित | भूरा/नारंगी = सावधान | पीला/काला = खतरा।'
                : 'Violet = Safe | Amber/Orange = Caution | Yellow/Dark = Danger.'}
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-[#F6F1E7] border border-[#D8D0C2] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#9A6258]/15 text-[#9A6258] font-mono font-bold flex items-center justify-center text-xs">
              <Footprints className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-[#292925]">
              {isHindi ? 'रंग बदलने पर तुरंत हटें' : 'Retreat if Color Changes'}
            </div>
            <p className="text-[11px] text-[#5D5B53] leading-relaxed">
              {isHindi 
                ? 'सड़े अंडे जैसी गंध या गहरा रंग होने पर तुरंत ताजी हवा में बाहर निकलें।'
                : 'Exit to clean air immediately if sulfur odor is smelled or strip turns dark.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2-Column Section: 7-Day Trend & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: 7-Day Dose History Chart */}
        <div className="bg-[#EDE5D6] rounded-xl border border-[#D8D0C2] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#71806B]" />
                <h3 className="text-sm font-bold text-[#292925]">
                  {isHindi ? '७-दिन का गैस रिकॉर्ड' : '7-Day Exposure Trend'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-[#878377]">
                {isHindi ? 'सीमा: 1.00 ppm·h' : 'Limit: 1.00 ppm·h'}
              </span>
            </div>
            <p className="text-xs text-[#5D5B53] font-serif mb-3">
              {isHindi ? 'पिछली ७ कार्य शिफ्टों का दैनिक गैस स्तर' : 'Daily cumulative H₂S exposure across your last 7 work shifts'}
            </p>
          </div>

          <div className="h-44 w-full mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activeWorker.trend7Day} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D8D0C2" opacity={0.6} />
                <XAxis dataKey="day" stroke="#878377" fontSize={11} tickLine={false} />
                <YAxis stroke="#878377" fontSize={11} tickLine={false} domain={[0, 1.5]} />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toFixed(2)} ppm·h`, isHindi ? 'गैस स्तर' : 'Exposure']}
                  contentStyle={{
                    backgroundColor: '#292925',
                    borderColor: '#D8D0C2',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#F6F1E7'
                  }}
                  itemStyle={{ color: '#F6F1E7' }}
                />
                <ReferenceLine y={1.00} stroke="#9A6258" strokeDasharray="3 3" label={{ value: 'Limit', fill: '#9A6258', fontSize: 10 }} />
                <Bar 
                  dataKey="dose" 
                  fill="#71806B" 
                  radius={[4, 4, 0, 0]}
                  name="Dose (ppm·h)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-[#878377] font-mono pt-3 border-t border-[#D8D0C2] flex items-center justify-between">
            <span>{isHindi ? 'अधिकतम:' : 'Peak:'} {Math.max(...activeWorker.trend7Day.map(t => t.dose)).toFixed(2)} ppm·h</span>
            <span>{isHindi ? 'साप्ताहिक औसत:' : 'Weekly avg:'} {(activeWorker.trend7Day.reduce((a, b) => a + b.dose, 0) / activeWorker.trend7Day.length).toFixed(2)} ppm·h</span>
          </div>
        </div>

        {/* Right: Recent Scans Log */}
        <div className="bg-[#EDE5D6] rounded-xl border border-[#D8D0C2] shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-[#D8D0C2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#71806B]" />
              <div>
                <h3 className="text-sm font-bold text-[#292925]">
                  {isHindi ? 'मेरे स्कैन का इतिहास' : 'Personal Scan Log'}
                </h3>
                <p className="text-[11px] text-[#5D5B53] font-serif">
                  {isHindi ? `बैंड ${activeWorker.badgeId} का रिकॉर्ड` : `Verified readings for ${activeWorker.badgeId}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenHistory}
              className="text-xs font-semibold text-[#4F5D4B] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{isHindi ? 'सभी देखें' : 'View All'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#D8D0C2] overflow-y-auto max-h-48">
            {personalReadings.length > 0 ? (
              personalReadings.slice(0, 3).map((reading) => (
                <div key={reading.id} className="p-3 flex items-center justify-between hover:bg-[#E5DDCB]/50 transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-4 h-7 rounded-xs border border-black/20 shrink-0 shadow-xs"
                      style={{ backgroundColor: reading.stripColorHex || '#71806B' }}
                      title={`Extracted color: ${reading.stripColorHex}`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#292925]">
                          {reading.dosePpmH.toFixed(2)} ppm·h
                        </span>
                        <StatusBadge status={reading.status} size="sm" />
                      </div>
                      <span className="text-[10px] text-[#5D5B53] font-mono block mt-0.5">
                        {reading.timestamp} · {reading.tempC}°C
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono text-[#878377] block">
                      ΔE: {reading.rawDeltaE ? reading.rawDeltaE.toFixed(1) : '24.2'}
                    </span>
                    <span className="text-[9px] font-mono text-[#4F5D4B] font-bold">
                      {Math.round(reading.confidenceScore * 100)}% {isHindi ? 'सटीक' : 'Conf.'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 text-center text-xs text-[#5D5B53] font-serif">
                {isHindi 
                  ? 'इस शिफ्ट में अभी कोई स्कैन नहीं हुआ है। "स्कैन करें" बटन दबाकर पहला स्कैन करें।'
                  : 'No scans recorded yet this shift. Click "Scan Wristband" to take your initial reading.'}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-[#D8D0C2] bg-[#EDE5D6]/80 text-[11px] font-mono text-[#878377] flex items-center justify-between">
            <span>{isHindi ? `कुल रिकॉर्ड: ${personalReadings.length}` : `Logged: ${personalReadings.length}`}</span>
            <button
              onClick={handleOpenScan}
              className="text-[#4F5D4B] font-bold hover:underline cursor-pointer text-xs"
            >
              {isHindi ? '+ नया स्कैन' : '+ New Reading'}
            </button>
          </div>
        </div>

      </div>

      {/* Colorimetric Strip Threshold Accordion */}
      <div className="bg-[#EDE5D6] border border-[#D8D0C2] rounded-xl p-4 shadow-xs">
        <button
          onClick={() => setShowColorScaleGuide(!showColorScaleGuide)}
          className="w-full flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#71806B]" />
            <span className="text-xs font-serif font-bold text-[#292925]">
              {isHindi ? 'रिस्टबैंड रासायनिक रंग पहचान गाइड' : 'Cu-PAN Chemical Dosimeter Color Reference Guide'}
            </span>
          </div>
          <span className="text-xs font-mono text-[#4F5D4B] font-bold">
            {showColorScaleGuide 
              ? (isHindi ? 'गाइड छिपाएं ▲' : 'Hide Scale ▲') 
              : (isHindi ? 'गाइड देखें ▼' : 'Inspect Scale ▼')}
          </span>
        </button>

        {showColorScaleGuide && (
          <div className="mt-3 pt-3 border-t border-[#D8D0C2] space-y-2.5">
            <p className="text-xs text-[#5D5B53] font-serif">
              {isHindi
                ? 'रिस्टबैंड में Cu-PAN रसायन होता है। H₂S गैस के संपर्क में आने पर यह गहरे बैंगनी से गुलाबी, फिर भूरे और अंत में पीले रंग में बदलता है।'
                : 'The 118 wristband contains a copper-1-(2-pyridylazo)-2-naphthol (Cu-PAN) complex. Exposure to airborne H₂S breaks the complex, causing a visible shift from deep violet to yellow.'}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]">
                <div className="h-6 rounded-md bg-[#3B284C] mb-1.5 shadow-xs" />
                <span className="text-[10px] font-mono font-bold text-[#292925] block">1. {isHindi ? 'शुरुआत' : 'Baseline'}</span>
                <span className="text-[9px] text-[#5D5B53] block">{isHindi ? 'गहरा बैंगनी (0.0 ppm·h)' : 'Deep Violet (0.0 ppm·h)'}</span>
                <span className="text-[9px] text-[#4F5D4B] font-bold font-mono">{isHindi ? 'सुरक्षित' : 'NORMAL'}</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]">
                <div className="h-6 rounded-md bg-[#5A2D52] mb-1.5 shadow-xs" />
                <span className="text-[10px] font-mono font-bold text-[#292925] block">2. {isHindi ? 'हल्की गैस' : 'Low Dose'}</span>
                <span className="text-[9px] text-[#5D5B53] block">{isHindi ? 'बैंगनी-गुलाबी (0.2 ppm·h)' : 'Violet-Purple (0.2 ppm·h)'}</span>
                <span className="text-[9px] text-[#4F5D4B] font-bold font-mono">{isHindi ? 'सुरक्षित' : 'NORMAL'}</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]">
                <div className="h-6 rounded-md bg-[#843644] mb-1.5 shadow-xs" />
                <span className="text-[10px] font-mono font-bold text-[#292925] block">3. {isHindi ? 'सावधानी' : 'Elevated'}</span>
                <span className="text-[9px] text-[#5D5B53] block">{isHindi ? 'लाल-गुलाबी (0.7 ppm·h)' : 'Reddish-Pink (0.7 ppm·h)'}</span>
                <span className="text-[9px] text-[#B08A55] font-bold font-mono">{isHindi ? 'सावधान' : 'MONITOR'}</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]">
                <div className="h-6 rounded-md bg-[#B45A28] mb-1.5 shadow-xs" />
                <span className="text-[10px] font-mono font-bold text-[#292925] block">4. {isHindi ? 'खतरा' : 'High Dose'}</span>
                <span className="text-[9px] text-[#5D5B53] block">{isHindi ? 'भूरा-नारंगी (1.2 ppm·h)' : 'Amber-Orange (1.2 ppm·h)'}</span>
                <span className="text-[9px] text-[#9A6258] font-bold font-mono">{isHindi ? 'खतरा' : 'REVIEW'}</span>
              </div>

              <div className="p-2.5 rounded-lg border border-[#D8D0C2] bg-[#F6F1E7]">
                <div className="h-6 rounded-md bg-[#D48818] mb-1.5 shadow-xs" />
                <span className="text-[10px] font-mono font-bold text-[#292925] block">5. {isHindi ? 'गंभीर' : 'Critical'}</span>
                <span className="text-[9px] text-[#5D5B53] block">{isHindi ? 'पीला (&gt;2.0 ppm·h)' : 'Yellow (&gt;2.0 ppm·h)'}</span>
                <span className="text-[9px] text-[#9A6258] font-bold font-mono">{isHindi ? 'खतरा' : 'REVIEW'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
