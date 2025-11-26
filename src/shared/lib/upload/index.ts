/**
 * Upload Module - Client-safe exports
 *
 * ⚠️ CHÚ Ý: File này CHỈ export những gì an toàn cho client.
 * Server-only functions (cloudinary SDK) được export từ "./cloudinary" trực tiếp.
 *
 * Client Components: import từ "@/shared/lib/upload"
 * Server Actions: import từ "@/shared/lib/upload/cloudinary"
 */

// Types (safe for both client and server)
export type {
  UploadOptions,
  UploadResult,
  CloudinarySignature,
  FileValidationResult,
} from "./types";

// Validation (safe for client - no Node.js dependencies)
export {
  validateImageFile,
  validateFileSize,
  validateFileType,
  validateImageFiles,
} from "./validation";

// Client helpers (safe for client)
export {
  uploadImageViaAPI,
  uploadImagesViaAPI,
  uploadWithSignature,
} from "./client";
export type { CloudinaryDirectUploadParams } from "./client";

// ⚠️ KHÔNG export cloudinary SDK ở đây!
// Server-only: import { cloudinary, uploadImage, ... } from "@/shared/lib/upload/cloudinary"
