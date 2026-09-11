import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export interface PhotoCaptureResult {
  dataUrl?: string;
  source: 'CAMERA' | 'GALLERY' | 'DEMO';
  success: boolean;
  error?: string;
}

export class CameraService {
  /**
   * Request camera permission and capture image via rear camera.
   */
  public static async captureFromCamera(): Promise<PhotoCaptureResult> {
    try {
      // Check if running in Capacitor native environment or browser with camera
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        saveToGallery: false,
        promptLabelHeader: 'Scan Wristband',
        promptLabelPhoto: 'From Photo Library',
        promptLabelPicture: 'Take Live Photo'
      });

      if (photo && photo.dataUrl) {
        return {
          dataUrl: photo.dataUrl,
          source: 'CAMERA',
          success: true
        };
      }

      return {
        success: false,
        source: 'CAMERA',
        error: 'No photo captured'
      };
    } catch (err: any) {
      console.warn('Native camera capture failed or cancelled:', err);
      return {
        success: false,
        source: 'CAMERA',
        error: err?.message || 'Camera permission denied or camera cancelled.'
      };
    }
  }

  /**
   * Select a photo from the device photo gallery.
   */
  public static async pickFromGallery(): Promise<PhotoCaptureResult> {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      if (photo && photo.dataUrl) {
        return {
          dataUrl: photo.dataUrl,
          source: 'GALLERY',
          success: true
        };
      }

      return {
        success: false,
        source: 'GALLERY',
        error: 'No photo selected from gallery'
      };
    } catch (err: any) {
      console.warn('Gallery pick failed or cancelled:', err);
      return {
        success: false,
        source: 'GALLERY',
        error: err?.message || 'Gallery access cancelled.'
      };
    }
  }
}
