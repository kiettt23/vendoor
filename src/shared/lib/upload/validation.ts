/**
 * File Validation Utilities
 * Centralized file validation logic
 */

import { FILE_UPLOAD } from "../constants";
import { formatFileSize } from "../utils/format";
import type { FileValidationResult } from "./types";

/**
 * Validate image file (type + size)
 *
 * @example
 * const result = validateImageFile(file);
 * if (!result.valid) {
 *   toast.error(result.error);
 *   return;
 * }
 */
export function validateImageFile(file: File): FileValidationResult {
  // Check file type
  if (
    !(FILE_UPLOAD.ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)
  ) {
    return {
      valid: false,
      error: `Chỉ chấp nhận các định dạng: ${FILE_UPLOAD.ALLOWED_IMAGE_TYPES.map(
        (t) => t.replace("image/", "").toUpperCase()
      ).join(", ")}`,
    };
  }

  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE_BYTES) {
    return {
      valid: false,
      error: `File quá lớn (${formatFileSize(file.size)}). Tối đa ${
        FILE_UPLOAD.MAX_SIZE_MB
      }MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate file size only
 */
export function validateFileSize(
  file: File,
  maxSizeMB: number = FILE_UPLOAD.MAX_SIZE_MB
): FileValidationResult {
  const maxBytes = maxSizeMB * 1024 * 1024;

  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File quá lớn (${formatFileSize(
        file.size
      )}). Tối đa ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validate file type only
 */
export function validateFileType(
  file: File,
  allowedTypes: readonly string[] = FILE_UPLOAD.ALLOWED_IMAGE_TYPES
): FileValidationResult {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Định dạng không hỗ trợ. Chỉ chấp nhận: ${allowedTypes
        .map((t) => t.split("/")[1]?.toUpperCase())
        .join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Validate multiple files
 */
export function validateImageFiles(files: File[]): FileValidationResult {
  for (const file of files) {
    const result = validateImageFile(file);
    if (!result.valid) {
      return {
        valid: false,
        error: `${file.name}: ${result.error}`,
      };
    }
  }

  return { valid: true };
}
