"use client";

/**
 * OptimizedImage Component
 *
 * Wrapper cho next/image với Cloudinary optimization tự động.
 * Sử dụng component này thay vì import trực tiếp từ next/image
 * để tận dụng Cloudinary transformations.
 *
 * Features:
 * - Auto-detect Cloudinary URLs và thêm transformations
 * - Fallback về next/image cho non-Cloudinary URLs
 * - Tự động blur placeholder cho Cloudinary images
 * - Responsive sizes support
 *
 * @example
 * // Basic usage
 * <OptimizedImage src={cloudinaryUrl} width={400} height={400} alt="Product" />
 *
 * // With blur placeholder
 * <OptimizedImage src={cloudinaryUrl} width={400} height={400} alt="Product" placeholder="blur" />
 *
 * // Fill container
 * <OptimizedImage src={cloudinaryUrl} fill alt="Product" className="object-cover" />
 */

import Image, { type ImageProps } from "next/image";
import {
  cloudinaryLoader,
  getBlurPlaceholderUrl,
  isCloudinaryUrl,
} from "@/shared/lib/upload";

export interface OptimizedImageProps extends Omit<ImageProps, "loader"> {
  /**
   * Enable blur placeholder for Cloudinary images
   * @default true for Cloudinary URLs
   */
  enableBlur?: boolean;
}

export function OptimizedImage({
  src,
  enableBlur = true,
  placeholder,
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const srcString = typeof src === "string" ? src : "";
  const isCloudinary = isCloudinaryUrl(srcString);

  // Tự động thêm blur placeholder cho Cloudinary images
  const shouldUseBlur = isCloudinary && enableBlur && !blurDataURL;
  const finalPlaceholder = shouldUseBlur ? "blur" : placeholder;
  const finalBlurDataURL = shouldUseBlur
    ? getBlurPlaceholderUrl(srcString)
    : blurDataURL;

  return (
    <Image
      src={src}
      loader={isCloudinary ? cloudinaryLoader : undefined}
      placeholder={finalPlaceholder}
      blurDataURL={finalBlurDataURL}
      {...props}
    />
  );
}
