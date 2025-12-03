/**
 * Cloudinary Image Loader
 *
 * Custom loader cho Next.js Image component.
 * Tự động thêm Cloudinary transformations vào URL để:
 * - Resize đúng size cần thiết
 * - Auto format (WebP/AVIF tùy browser)
 * - Auto quality (AI-optimized)
 *
 * @see https://cloudinary.com/documentation/image_transformations
 */

import type { ImageLoaderProps } from "next/image";

/**
 * Cloudinary transformation params
 */
export interface CloudinaryTransformOptions {
  /** Width (pixels) */
  width?: number;
  /** Height (pixels) */
  height?: number;
  /** Crop mode */
  crop?: "fill" | "scale" | "fit" | "limit" | "thumb" | "crop";
  /** Gravity for crop */
  gravity?: "auto" | "face" | "center" | "north" | "south" | "east" | "west";
  /** Quality (1-100 or "auto") */
  quality?:
    | number
    | "auto"
    | "auto:best"
    | "auto:good"
    | "auto:eco"
    | "auto:low";
  /** Format */
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  /** DPR (device pixel ratio) */
  dpr?: number | "auto";
}

/**
 * Build Cloudinary transformation string
 *
 * @example
 * buildTransformString({ width: 400, quality: 'auto', format: 'auto' })
 * // Returns: "w_400,q_auto,f_auto"
 */
export function buildTransformString(
  options: CloudinaryTransformOptions
): string {
  const params: string[] = [];

  if (options.width) params.push(`w_${options.width}`);
  if (options.height) params.push(`h_${options.height}`);
  if (options.crop) params.push(`c_${options.crop}`);
  if (options.gravity) params.push(`g_${options.gravity}`);
  if (options.quality) params.push(`q_${options.quality}`);
  if (options.format) params.push(`f_${options.format}`);
  if (options.dpr) params.push(`dpr_${options.dpr}`);

  return params.join(",");
}

/**
 * Check if URL is a Cloudinary URL
 */
export function isCloudinaryUrl(src: string): boolean {
  return src.includes("res.cloudinary.com");
}

/**
 * Add transformations to Cloudinary URL
 *
 * @example
 * transformCloudinaryUrl(
 *   "https://res.cloudinary.com/demo/image/upload/sample.jpg",
 *   { width: 400, quality: "auto", format: "auto" }
 * )
 * // Returns: "https://res.cloudinary.com/demo/image/upload/w_400,q_auto,f_auto/sample.jpg"
 */
export function transformCloudinaryUrl(
  src: string,
  options: CloudinaryTransformOptions
): string {
  if (!isCloudinaryUrl(src)) {
    return src;
  }

  const transformString = buildTransformString(options);

  if (!transformString) {
    return src;
  }

  // Insert transformations after /upload/
  // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
  return src.replace("/upload/", `/upload/${transformString}/`);
}

/**
 * Next.js Image Loader for Cloudinary
 *
 * Được dùng trong next.config.ts:
 * ```ts
 * images: {
 *   loader: 'custom',
 *   loaderFile: './src/shared/lib/upload/cloudinary-loader.ts',
 * }
 * ```
 *
 * Hoặc dùng trực tiếp với Image component:
 * ```tsx
 * <Image loader={cloudinaryLoader} src={url} width={400} height={400} />
 * ```
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  // Nếu không phải Cloudinary URL, trả về nguyên bản
  if (!isCloudinaryUrl(src)) {
    return src;
  }

  return transformCloudinaryUrl(src, {
    width,
    quality: quality || "auto",
    format: "auto", // WebP/AVIF tùy browser
  });
}

/**
 * Generate blur placeholder URL (low quality image)
 *
 * @example
 * const blurUrl = getBlurPlaceholderUrl(imageUrl);
 * <Image src={imageUrl} blurDataURL={blurUrl} placeholder="blur" />
 */
export function getBlurPlaceholderUrl(src: string): string {
  if (!isCloudinaryUrl(src)) {
    return src;
  }

  return transformCloudinaryUrl(src, {
    width: 10,
    quality: 30,
    format: "auto",
  });
}
