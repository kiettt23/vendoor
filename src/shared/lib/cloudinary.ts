import { v2 as cloudinary } from "cloudinary";
import { createLogger } from "./logger";

// ============================================
// CONFIG
// ============================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ============================================
// TYPES
// ============================================

interface UploadOptions {
  folder?: string; // Folder trong Cloudinary (vd: "products", "vendors")
  transformation?: {
    width?: number;
    height?: number;
    crop?: "fill" | "scale" | "fit";
    quality?: "auto" | number;
  };
}

interface UploadResult {
  url: string; // HTTPS URL
  publicId: string; // Để xóa sau này
}

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
    // 1. Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Upload to Cloudinary (sử dụng Promise wrapper)
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || "vendoor", // Default folder
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
            url: result.secure_url, // HTTPS URL
            publicId: result.public_id, // Để xóa sau này
          });
        }
      );

      // Pipe buffer vào upload stream
      uploadStream.end(buffer);
    });
  } catch (error) {
    const logger = createLogger("Cloudinary");
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
 * @param publicId - Public ID của image (lấy từ uploadImage result)
 * @returns Promise<void>
 *
 * @example
 * await deleteImage("vendoor/products/abc123");
 */
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Delete error:", error);
    throw new Error("Failed to delete image");
  }
}

// ============================================
// GENERATE PLACEHOLDER URL (cho seed script)
// ============================================

/**
 * Generate placeholder image URL (không upload thật)
 * Dùng cho seed script hoặc development
 *
 * @param seed - Seed để generate ảnh unique
 * @param width - Width của ảnh (default: 800)
 * @param height - Height của ảnh (default: 600)
 * @returns string - Placeholder URL
 *
 * @example
 * const url = getPlaceholderImageUrl("product-1", 800, 600);
 * // → "https://picsum.photos/seed/product-1/800/600"
 */
export function getPlaceholderImageUrl(seed: string): string {
  return `https://picsum.photos/seed/${seed}/800/600`;
}
