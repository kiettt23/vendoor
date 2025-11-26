/**
 * Cloudinary Upload Service
 * Server-side upload functions
 */

import { v2 as cloudinary } from "cloudinary";
import { createLogger } from "../utils/logger";
import type { UploadOptions, UploadResult } from "./types";

const logger = createLogger("Cloudinary");

// ============================================
// CONFIG (chỉ config 1 lần)
// ============================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Export cloudinary instance để các module khác có thể dùng
export { cloudinary };

// ============================================
// UPLOAD IMAGE
// ============================================

/**
 * Upload image lên Cloudinary
 *
 * @param file - File object từ FormData
 * @param options - Upload options (folder, transformation)
 * @returns Promise<UploadResult>
 *
 * @example
 * const result = await uploadImage(file, {
 *   folder: "products",
 *   transformation: { width: 800, height: 800, crop: "fill" }
 * });
 */
export async function uploadImage(
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || "vendoor",
          transformation: options.transformation
            ? [
                {
                  width: options.transformation.width,
                  height: options.transformation.height,
                  crop: options.transformation.crop || "fill",
                  quality: options.transformation.quality || "auto",
                },
              ]
            : undefined,
        },
        (error, result) => {
          if (error || !result) {
            reject(new Error(error?.message || "Upload failed"));
            return;
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    logger.error("Upload failed", error);
    throw new Error("Failed to upload image");
  }
}

// ============================================
// DELETE IMAGE
// ============================================

/**
 * Xóa image từ Cloudinary
 *
 * @param publicId - Public ID của image
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error("Delete failed", error);
    throw new Error("Failed to delete image");
  }
}

// ============================================
// GENERATE SIGNATURE (cho client-side upload)
// ============================================

/**
 * Generate upload signature cho client-side upload
 *
 * @param folder - Folder đích trên Cloudinary
 * @returns Signature object
 */
export function generateSignature(folder: string = "vendoor/products") {
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder,
  };
}

// ============================================
// PLACEHOLDER (cho development/seed)
// ============================================

/**
 * Generate placeholder image URL
 * Dùng cho seed script hoặc development
 */
export function getPlaceholderImageUrl(seed: string): string {
  return `https://picsum.photos/seed/${seed}/800/600`;
}
