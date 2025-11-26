/**
 * Upload Client - Client-side Upload Helpers
 *
 * Helper functions để upload files từ client thông qua API route.
 * Đây là cách được khuyến khích vì:
 * - API key không bị expose ra client
 * - Consistent validation
 * - Centralized error handling
 *
 * Usage: import { uploadImageViaAPI } from "@/lib/upload"
 */

import type { UploadResult } from "./types";

/**
 * Upload image qua API route (recommended)
 *
 * @example
 * const file = event.target.files[0];
 * const result = await uploadImageViaAPI(file);
 * console.log(result.url, result.publicId);
 */
export async function uploadImageViaAPI(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Upload thất bại");
  }

  return response.json();
}

/**
 * Upload multiple images
 * Với progress callback cho UX tốt hơn
 *
 * @example
 * const files = Array.from(event.target.files);
 * const results = await uploadImagesViaAPI(files, (completed, total) => {
 *   setProgress(Math.round((completed / total) * 100));
 * });
 */
export async function uploadImagesViaAPI(
  files: File[],
  onProgress?: (completed: number, total: number) => void
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (let i = 0; i < files.length; i++) {
    const result = await uploadImageViaAPI(files[i]);
    results.push(result);
    onProgress?.(i + 1, files.length);
  }

  return results;
}

/**
 * Upload với Cloudinary signature (direct upload)
 * Dùng khi cần signed upload trực tiếp lên Cloudinary
 *
 * @example
 * // 1. Get signature từ server
 * const signature = await getCloudinarySignature();
 *
 * // 2. Upload trực tiếp lên Cloudinary
 * const result = await uploadWithSignature(file, signature);
 */
export interface CloudinaryDirectUploadParams {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
}

export async function uploadWithSignature(
  file: File,
  params: CloudinaryDirectUploadParams
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", params.apiKey);
  formData.append("timestamp", params.timestamp.toString());
  formData.append("signature", params.signature);
  formData.append("folder", params.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${params.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Upload lên Cloudinary thất bại");
  }

  const data = await response.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}
