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
 * Image dimensions (dùng cho validation và display hints)
 */
export const IMAGE_DIMENSIONS = {
  PRODUCT_THUMBNAIL: { width: 400, height: 400 },
  PRODUCT_DETAIL: { width: 800, height: 800 },
  PRODUCT_CARD: { width: 300, height: 300 },
  AVATAR: { width: 200, height: 200 },
} as const;

/**
 * Cloudinary transformation presets
 * Sử dụng với transformCloudinaryUrl() hoặc OptimizedImage component
 *
 * @example
 * import { transformCloudinaryUrl } from "@/shared/lib/upload";
 * const optimizedUrl = transformCloudinaryUrl(url, CLOUDINARY_PRESETS.PRODUCT_CARD);
 */
export const CLOUDINARY_PRESETS = {
  /** Product card trong grid (300x300) */
  PRODUCT_CARD: {
    width: 300,
    height: 300,
    crop: "fill" as const,
    quality: "auto" as const,
    format: "auto" as const,
  },
  /** Product thumbnail trong cart/checkout (100x100) */
  PRODUCT_THUMBNAIL: {
    width: 100,
    height: 100,
    crop: "fill" as const,
    quality: "auto" as const,
    format: "auto" as const,
  },
  /** Product detail page (800x800) */
  PRODUCT_DETAIL: {
    width: 800,
    height: 800,
    crop: "limit" as const,
    quality: "auto:best" as const,
    format: "auto" as const,
  },
  /** Avatar (200x200 với face detection) */
  AVATAR: {
    width: 200,
    height: 200,
    crop: "fill" as const,
    gravity: "face" as const,
    quality: "auto" as const,
    format: "auto" as const,
  },
  /** Store logo/banner */
  STORE_LOGO: {
    width: 400,
    height: 400,
    crop: "fill" as const,
    quality: "auto" as const,
    format: "auto" as const,
  },
  /** Blur placeholder (rất nhỏ, dùng cho loading) */
  BLUR_PLACEHOLDER: {
    width: 10,
    quality: 30,
    format: "auto" as const,
  },
} as const;
