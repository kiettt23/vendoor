/**
 * Upload Types
 * Định nghĩa types cho file upload
 */

export interface UploadOptions {
  folder?: string;
  transformation?: {
    width?: number;
    height?: number;
    crop?: "fill" | "scale" | "fit";
    quality?: "auto" | number;
  };
}

export interface UploadResult {
  url: string;
  publicId: string;
}

export interface CloudinarySignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}
