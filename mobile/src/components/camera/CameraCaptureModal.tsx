import React, { useState, useRef } from 'react';
import { CameraService } from '../../services/CameraService';
import { DEMO_SAMPLES, repository } from '../../services/DosimeterRepository';
import type { DemoSampleBadge, Worker, UserRole } from '../../types/mobile';
import { Camera, Image as ImageIcon, RotateCcw, Check, X, AlertTriangle, Sparkles, ChevronDown, User, MapPin, FileText, Info, HelpCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  userRole: UserRole;
  currentWorker?: Worker | null;
  workerLanguage?: 'hi' | 'en';
  onClose: () => void;
  onPhotoSelected: (data: {
    imageUri?: string;
    sample?: DemoSampleBadge;
    targetWorker?: Worker;
    inspectionLocation?: string;
    officerNotes?: string;
  }) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  userRole,
  currentWorker,
  workerLanguage = 'hi',
  onClose,
  onPhotoSelected
}) => {
  const isHindi = workerLanguage === 'hi';
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedDemoSample, setSelectedDemoSample] = useState<DemoSampleBadge | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showDemoPicker, setShowDemoPicker] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  // Safety Officer specific fields
  const allWorkers = repository.getWorkers();
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    currentWorker?.workerId || allWorkers[0]?.workerId || ''
  );
  const [inspectionLocation, setInspectionLocation] = useState<string>(
    currentWorker?.workLocation || 'Field Location Spot-Check'
  );
  const [officerNotes, setOfficerNotes] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isWorkerRole = userRole === 'WORKER';
  const targetWorker = allWorkers.find(w => w.workerId === selectedWorkerId) || currentWorker || allWorkers[0];

  // Real Camera Capture
  const handleLiveCameraCapture = async () => {
    setPermissionError(null);
    setIsCapturing(true);
    try {
      const result = await CameraService.captureFromCamera();
      if (result.success && result.dataUrl) {
        setCapturedImage(result.dataUrl);
        setSelectedDemoSample(null);
      } else if (result.error) {
        setPermissionError(result.error);
      }
    } catch (err: any) {
      setPermissionError(err?.message || 'Unable to open rear camera. You can upload an image instead.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Gallery Picker
  const handleGalleryPick = async () => {
    setPermissionError(null);
    try {
      const result = await CameraService.pickFromGallery();
      if (result.success && result.dataUrl) {
        setCapturedImage(result.dataUrl);
        setSelectedDemoSample(null);
      } else if (result.error) {
        fileInputRef.current?.click();
      }
    } catch {
      fileInputRef.current?.click();
    }
  };

  // File fallback
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCapturedImage(result);
          setSelectedDemoSample(null);
          setPermissionError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: DemoSampleBadge) => {
    setSelectedDemoSample(sample);
    setCapturedImage(null);
    setShowDemoPicker(false);
    if (!isWorkerRole && sample.workerId) {
      setSelectedWorkerId(sample.workerId);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setSelectedDemoSample(null);
    setPermissionError(null);
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onPhotoSelected({
        imageUri: capturedImage,
        targetWorker,
        inspectionLocation: isWorkerRole ? targetWorker?.workLocation : inspectionLocation,
        officerNotes: isWorkerRole ? undefined : officerNotes
      });
    } else if (selectedDemoSample) {
      onPhotoSelected({
        sample: selectedDemoSample,
        imageUri: selectedDemoSample.imageUri,
        targetWorker,
        inspectionLocation: isWorkerRole ? targetWorker?.workLocation : inspectionLocation,
        officerNotes: isWorkerRole ? undefined : officerNotes
      });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between p-4 max-w-md mx-auto text-[#F6F1E7] overflow-y-auto"
      style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 28px)' }}
    >
      {/* Top Header */}
      <div className="pt-1 pb-3 border-b border-white/15">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                isWorkerRole ? 'bg-[#5A7456]/40 text-[#BACDB2]' : 'bg-[#B08A55]/40 text-[#EDE5D6]'
              }`}>
                {isWorkerRole ? (isHindi ? 'कलाई का पट्टा स्कैन' : 'PERSONAL DOSIMETER SCAN') : 'OFFICER FIELD AUDIT'}
              </span>
            </div>
            <h2 className="text-base font-serif font-bold text-white tracking-wide mt-1">
              {isWorkerRole ? (isHindi ? 'अपना रिस्टबैंड स्कैन करें' : 'Scan My Wristband') : 'Field Worker Inspection'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 active:bg-white/20"
              title={isHindi ? 'स्कैन करने की विधि' : 'How to scan'}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 active:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Worker Personal Badge Bar (for Worker) */}
        {isWorkerRole ? (
          <div className="mt-2 bg-white/10 rounded-lg p-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#5A7456] flex items-center justify-center font-bold text-xs text-white">
                {targetWorker.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="font-semibold text-white block">{targetWorker.name}</span>
                <span className="text-[10px] text-[#C9BFAE] font-mono">
                  {isHindi ? 'रिस्टबैंड कोड: ' : 'Assigned Band: '}{targetWorker.assignedBandId} {isHindi ? '(६० दिन वैध)' : ''}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono bg-black/40 px-2 py-0.5 rounded text-[#EDE5D6]">
              {targetWorker.workLocation.split('(')[0]}
            </span>
          </div>
        ) : (
          /* Safety Officer / Admin Target Selector */
          <div className="mt-2 bg-[#292925] border border-white/20 rounded-xl p-3 space-y-2 text-xs">
            <div>
              <label className="text-[10px] font-mono text-[#C9BFAE] uppercase block mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-[#B08A55]" />
                Select Operator to Inspect:
              </label>
              <select
                value={selectedWorkerId}
                onChange={(e) => {
                  setSelectedWorkerId(e.target.value);
                  const w = allWorkers.find(x => x.workerId === e.target.value);
                  if (w) setInspectionLocation(w.workLocation);
                }}
                className="w-full bg-[#1a1a17] border border-white/30 rounded-lg p-2 text-xs text-white font-medium focus:outline-none"
              >
                {allWorkers.map((w) => (
                  <option key={w.workerId} value={w.workerId}>
                    {w.name} · {w.assignedBandId} ({w.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#C9BFAE] uppercase block mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#B08A55]" />
                Inspection Spot / Deck:
              </label>
              <input
                type="text"
                value={inspectionLocation}
                onChange={(e) => setInspectionLocation(e.target.value)}
                placeholder="e.g. Column 4 Platform Deck B"
                className="w-full bg-[#1a1a17] border border-white/30 rounded-lg p-2 text-xs text-white placeholder-white/40 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Interactive Scan Guide Overlay (if opened) */}
      {showGuide && (
        <div className="my-2 bg-[#1a1a17] border border-[#71806B] rounded-xl p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-white font-semibold">
            <span className="flex items-center gap-1.5 text-[#EDE5D6]">
              <Info className="w-4 h-4 text-[#71806B]" />
              Wristband Scanning Guidelines
            </span>
            <button onClick={() => setShowGuide(false)} className="text-[10px] text-[#C9BFAE] underline">
              Close
            </button>
          </div>
          <ul className="space-y-1.5 text-[11px] text-[#C9BFAE] leading-relaxed">
            <li>• <strong>Distance:</strong> Hold phone 10–15 cm directly above wristband.</li>
            <li>• <strong>Reference Scale:</strong> Ensure the printed 4-step reference color scale is in frame.</li>
            <li>• <strong>Lighting:</strong> Avoid direct flashlight glare or deep shadow across the strip.</li>
            <li>• <strong>Sensing Strip:</strong> Do not touch or scratch the chemical colorimetric zone.</li>
          </ul>
        </div>
      )}

      {/* Viewport Area */}
      <div className="flex-1 flex flex-col justify-center items-center my-3 w-full relative min-h-[260px]">
        {capturedImage ? (
          <div className="w-full max-h-[340px] bg-[#1a1a17] rounded-xl overflow-hidden border border-white/20 relative flex items-center justify-center shadow-lg">
            <img
              src={capturedImage}
              alt="Wristband Captured"
              className="max-h-[320px] w-auto object-contain rounded-lg"
            />
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-[#D8D0C2]">
              Photo Ready · Review Alignment
            </div>
          </div>
        ) : selectedDemoSample ? (
          <div className="w-full bg-[#292925] border border-[#71806B]/50 rounded-xl p-4 text-center shadow-lg">
            <div className="w-full h-44 rounded-xl bg-[#1a1a17] border border-white/15 flex items-center justify-center relative mb-3 overflow-hidden shadow-inner">
              <img 
                src={selectedDemoSample.imageUri || '/samples/sample_1_fresh.png'} 
                alt={selectedDemoSample.label} 
                className="w-full h-full object-contain p-1"
              />
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-white border border-white/20">
                {selectedDemoSample.estimatedDose} ppm·h · {selectedDemoSample.status}
              </div>
            </div>

            <div className="text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#C9BFAE]">CALIBRATION SAMPLE:</span>
                <span className="text-xs font-mono font-bold text-white">{selectedDemoSample.bandId}</span>
              </div>
              <div className="text-xs font-semibold text-white">{selectedDemoSample.label}</div>
              <div className="text-[11px] text-[#C9BFAE]">{selectedDemoSample.description}</div>
              {selectedDemoSample.id === 'sample-5' ? (
                <div className="mt-1.5 text-[10px] font-mono bg-cyan-950/80 border border-cyan-400 text-cyan-200 px-2.5 py-1 rounded-lg flex items-center gap-2 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#1E70B8] border border-blue-900 shrink-0" />
                  <span>MOISTURE SEAL BREACHED: Anhydrous CuSO₄ dot hydrated blue (#1E70B8). Rejection mandated.</span>
                </div>
              ) : (
                <div className="mt-1.5 text-[10px] font-mono bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white border border-gray-400 shrink-0" />
                  <span>MOISTURE SEAL INTACT: Anhydrous CuSO₄ dot is chalk white. Verified ready for shift.</span>
                </div>
              )}
              {selectedDemoSample.isExpired && (
                <div className="mt-1 text-[10px] bg-[#9A6258]/30 border border-[#9A6258] text-[#F6E2DF] px-2 py-0.5 rounded">
                  ⚠️ Prototype Expiry (&gt;90d shelf age)
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full h-[280px] border-2 border-dashed border-[#D8D0C2]/40 rounded-2xl flex flex-col items-center justify-center p-5 text-center relative bg-white/5">
            {/* Viewfinder Reticle */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#D8D0C2]"></div>
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#D8D0C2]"></div>
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#D8D0C2]"></div>
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#D8D0C2]"></div>

            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-2">
              <Camera className="w-7 h-7 text-[#EDE5D6]" />
            </div>

            <p className="text-sm font-semibold text-white mb-0.5">
              {isWorkerRole ? (isHindi ? 'रिस्टबैंड को कैमरे के चौखट में रखें' : 'Position your wristband in frame') : `Frame ${targetWorker.name}'s wristband`}
            </p>
            <p className="text-[11px] text-[#C9BFAE] max-w-xs leading-relaxed">
              {isHindi ? 'रासायनिक पट्टी और रंग पैमाने को चौखट के अंदर सीधा रखें।' : 'Align the sensing strip and printed reference scale within the borders.'}
            </p>

            {permissionError && (
              <div className="mt-3 bg-[#9A6258]/30 border border-[#9A6258]/70 rounded-lg p-2 text-xs text-[#F6E2DF] flex items-start gap-1.5 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">{isHindi ? 'कैमरा अनुमति त्रुटि' : 'Camera Access Issue'}</span>
                  {permissionError}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Bottom Controls */}
      <div className="pt-2 pb-2 space-y-2">
        {capturedImage || selectedDemoSample ? (
          <div className="flex gap-2.5">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 bg-white/15 hover:bg-white/20 border border-white/20 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all text-white"
            >
              <RotateCcw className="w-4 h-4" />
              {isHindi ? 'दोबारा फोटो लें' : 'Retake'}
            </button>
            <button
              onClick={handleUsePhoto}
              className="flex-1 py-3 bg-[#5A7456] hover:bg-[#4F5D4B] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md"
            >
              <Check className="w-4 h-4" />
              {isWorkerRole ? (isHindi ? 'गैस स्तर की जांच करें' : 'Analyze My Exposure') : 'Confirm & Audit Scan'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleLiveCameraCapture}
              disabled={isCapturing}
              className="w-full py-3.5 bg-[#EDE5D6] hover:bg-white text-[#292925] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
            >
              <Camera className="w-5 h-5 text-[#292925]" />
              {isCapturing 
                ? (isHindi ? 'कैमरा खुल रहा है...' : 'Opening Camera...') 
                : (isWorkerRole ? (isHindi ? 'कैमरा चालू करें' : 'Open Camera for My Band') : 'Open Camera for Inspection')}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleGalleryPick}
                className="flex-1 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 text-white/90 active:scale-95 transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                {isHindi ? 'फोटो अपलोड करें' : 'Upload Photo'}
              </button>

              <button
                onClick={() => setShowDemoPicker(!showDemoPicker)}
                className="flex-1 py-2 bg-[#71806B]/30 hover:bg-[#71806B]/40 border border-[#71806B]/50 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 text-[#EDE5D6] active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9BFAE]" />
                {isHindi ? 'परीक्षण नमूने' : 'Calibrated Samples'}
                <ChevronDown className={`w-3 h-3 transition-transform ${showDemoPicker ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showDemoPicker && (
              <div className="bg-[#1a1a17] border border-white/20 rounded-xl p-3 space-y-2 animate-in fade-in duration-150">
                <div className="text-[10px] font-mono text-[#C9BFAE] uppercase tracking-wider">
                  Select Calibrated Demo Sample:
                </div>
                <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1">
                  {DEMO_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left text-xs transition-colors flex items-center gap-2.5"
                    >
                      <img
                        src={sample.imageUri}
                        alt={sample.label}
                        className="w-14 h-9 rounded object-contain bg-black border border-white/20 shrink-0"
                      />
                      <div className="truncate flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white truncate text-[11px]">{sample.label.split(':')[1] || sample.label}</span>
                          <span className="font-mono text-[10px] font-bold text-[#EDE5D6] shrink-0 ml-1">{sample.estimatedDose} ppm·h</span>
                        </div>
                        <div className="text-[10px] text-[#C9BFAE] truncate">{sample.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
