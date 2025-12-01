/**
 * File Upload Constants
 */
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_IMAGE_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
} as const;

/**
 * Image dimensions
 */
export const IMAGE_DIMENSIONS = {
  PRODUCT_THUMBNAIL: { width: 400, height: 400 },
  PRODUCT_DETAIL: { width: 800, height: 800 },
  PRODUCT_CARD: { width: 300, height: 300 },
  AVATAR: { width: 200, height: 200 },
} as const;
