import React, { useState, useRef } from 'react';
import { CameraService } from '../../services/CameraService';
import { DEMO_SAMPLES } from '../../services/DosimeterRepository';
import type { DemoSampleBadge } from '../../types/mobile';
import { Camera, Image as ImageIcon, RotateCcw, Check, X, AlertTriangle, Sparkles, ChevronDown } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoSelected: (imageData: { imageUri?: string; sample?: DemoSampleBadge }) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoSelected
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [selectedDemoSample, setSelectedDemoSample] = useState<DemoSampleBadge | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showDemoPicker, setShowDemoPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Real Camera Capture
  const handleLiveCameraCapture = async () => {
    setPermissionError(null);
    setIsCapturing(true);
    try {
      const result = await CameraService.captureFromCamera();
      if (result.success && result.dataUrl) {
        setCapturedImage(result.dataUrl);
        setSelectedDemoSample(null);
      } else {
        if (result.error) {
          setPermissionError(result.error);
        }
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
        // Fallback to standard input file
        fileInputRef.current?.click();
      }
    } catch {
      fileInputRef.current?.click();
    }
  };

  // HTML5 File Input Fallback for browsers or restricted permissions
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

  // Demo Sample Selection
  const handleSelectSample = (sample: DemoSampleBadge) => {
    setSelectedDemoSample(sample);
    setCapturedImage(null);
    setShowDemoPicker(false);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setSelectedDemoSample(null);
    setPermissionError(null);
  };

  const handleUsePhoto = () => {
    if (capturedImage) {
      onPhotoSelected({ imageUri: capturedImage });
    } else if (selectedDemoSample) {
      onPhotoSelected({ sample: selectedDemoSample });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex flex-col justify-between p-4 max-w-md mx-auto text-[#F6F1E7]">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2 pb-3 border-b border-white/15">
        <div>
          <h2 className="text-base font-serif font-bold text-white tracking-wide">
            Wristband Scanner
          </h2>
          <span className="text-[11px] text-[#C9BFAE] font-mono">
            {capturedImage || selectedDemoSample ? 'Photo Review' : 'Align Band Within Frame'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/80 active:bg-white/20"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewport: Either Photo Preview OR Live Viewfinder Prompt */}
      <div className="flex-1 flex flex-col justify-center items-center my-auto w-full relative">
        {capturedImage ? (
          /* Captured Photo Preview */
          <div className="w-full max-h-[380px] bg-[#1a1a17] rounded-xl overflow-hidden border border-white/20 relative flex items-center justify-center shadow-lg">
            <img
              src={capturedImage}
              alt="Wristband Captured"
              className="max-h-[360px] w-auto object-contain rounded-lg"
            />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono text-[#D8D0C2]">
              Image Captured
            </div>
          </div>
        ) : selectedDemoSample ? (
          /* Demo Sample Preview */
          <div className="w-full bg-[#292925] border border-[#71806B]/50 rounded-xl p-5 text-center shadow-lg">
            <div className="w-full h-32 rounded-lg bg-[#1a1a17] border border-white/10 flex flex-col items-center justify-center relative mb-4 overflow-hidden">
              <img 
                src="/band_design.png" 
                alt="Band Anatomy" 
                className="w-3/4 object-contain opacity-70"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <div 
                className="w-16 h-8 rounded border border-white/40 shadow-sm mt-1"
                style={{ backgroundColor: selectedDemoSample.colorHex }}
              ></div>
              <span className="text-[10px] font-mono text-[#C9BFAE] mt-1">Colorimetric Sensing Strip</span>
            </div>

            <div className="text-left space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#C9BFAE]">DEMO BADGE:</span>
                <span className="text-xs font-mono font-bold text-white">{selectedDemoSample.bandId}</span>
              </div>
              <div className="text-sm font-semibold text-white">{selectedDemoSample.label}</div>
              <div className="text-xs text-[#C9BFAE]">{selectedDemoSample.description}</div>
              {selectedDemoSample.isExpired && (
                <div className="mt-2 text-xs bg-[#9A6258]/30 border border-[#9A6258] text-[#F6E2DF] px-2.5 py-1 rounded">
                  ⚠️ Prototype Expiry Condition Triggered (&gt;90 days)
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Viewfinder Overlay */
          <div className="w-full h-[320px] border-2 border-dashed border-[#D8D0C2]/40 rounded-2xl flex flex-col items-center justify-center p-6 text-center relative bg-white/5">
            {/* Corner Alignment Markers */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D8D0C2]"></div>
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D8D0C2]"></div>
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D8D0C2]"></div>
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D8D0C2]"></div>

            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-3">
              <Camera className="w-8 h-8 text-[#EDE5D6]" />
            </div>

            <p className="text-sm font-medium text-white mb-1">
              Position sensing strip in view
            </p>
            <p className="text-xs text-[#C9BFAE] max-w-xs leading-relaxed">
              Hold camera ~10–15 cm from wristband. Ensure reference scale is clearly illuminated.
            </p>

            {/* Error Message banner if camera permission was denied */}
            {permissionError && (
              <div className="mt-4 bg-[#9A6258]/30 border border-[#9A6258]/70 rounded-lg p-2.5 text-xs text-[#F6E2DF] flex items-start gap-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">Camera Access Issue</span>
                  {permissionError}. Please tap 'Upload Photo' or select a demo sample below.
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden File Input for fallback gallery upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/*"
        className="hidden"
      />

      {/* Controls & Action Buttons */}
      <div className="pt-3 pb-2 space-y-3">
        {capturedImage || selectedDemoSample ? (
          /* Preview Actions: Retake vs. Use Photo */
          <div className="flex gap-3">
            <button
              onClick={handleRetake}
              className="flex-1 py-3.5 bg-white/15 hover:bg-white/20 border border-white/20 rounded-xl font-medium text-sm flex items-center justify-center gap-2 active:scale-95 transition-all text-white"
            >
              <RotateCcw className="w-4 h-4" />
              Retake
            </button>
            <button
              onClick={handleUsePhoto}
              className="flex-1 py-3.5 bg-[#5A7456] hover:bg-[#4F5D4B] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md font-semibold"
            >
              <Check className="w-4 h-4" />
              Use Photo
            </button>
          </div>
        ) : (
          /* Initial Capture Buttons */
          <div className="space-y-2">
            <button
              onClick={handleLiveCameraCapture}
              disabled={isCapturing}
              className="w-full py-3.5 bg-[#EDE5D6] hover:bg-white text-[#292925] rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all"
            >
              <Camera className="w-5 h-5 text-[#292925]" />
              {isCapturing ? 'Opening Camera...' : 'Open Rear Camera'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={handleGalleryPick}
                className="flex-1 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 rounded-lg text-xs font-medium flex items-center justify-center gap-2 text-white/90 active:scale-95 transition-all"
              >
                <ImageIcon className="w-4 h-4" />
                Upload Photo
              </button>

              <button
                onClick={() => setShowDemoPicker(!showDemoPicker)}
                className="flex-1 py-2.5 bg-[#71806B]/30 hover:bg-[#71806B]/40 border border-[#71806B]/50 rounded-lg text-xs font-medium flex items-center justify-center gap-2 text-[#EDE5D6] active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#C9BFAE]" />
                Demo Samples
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemoPicker ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Collapsible Demo Samples Drawer */}
            {showDemoPicker && (
              <div className="bg-[#1a1a17] border border-white/20 rounded-xl p-3 space-y-2 animate-in fade-in duration-150">
                <div className="text-[11px] font-mono text-[#C9BFAE] uppercase tracking-wider mb-1">
                  Select Calibrated SIH Sample:
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectSample(sample)}
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-left text-xs transition-colors flex items-center gap-2"
                    >
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/40"
                        style={{ backgroundColor: sample.colorHex }}
                      />
                      <div className="truncate">
                        <div className="font-semibold truncate text-white">{sample.bandId}</div>
                        <div className="text-[10px] text-[#C9BFAE]">{sample.estimatedDose} ppm·h</div>
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
