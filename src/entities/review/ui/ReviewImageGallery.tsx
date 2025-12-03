"use client";

import { useState } from "react";

import { OptimizedImage } from "@/shared/ui/optimized-image";
import { ImageLightbox } from "@/shared/ui/image-lightbox";

interface ReviewImageGalleryProps {
  images: string[];
  maxVisible?: number;
}

/**
 * Gallery hiển thị ảnh review với lightbox
 * - Click vào ảnh để xem full size
 * - Hiện "+N" nếu có nhiều ảnh hơn maxVisible
 */
export function ReviewImageGallery({
  images,
  maxVisible = 4,
}: ReviewImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) return null;

  const visibleImages = images.slice(0, maxVisible);
  const remainingCount = images.length - maxVisible;

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {visibleImages.map((image, index) => (
          <button
            key={image}
            onClick={() => handleImageClick(index)}
            className="relative h-16 w-16 rounded-lg overflow-hidden border hover:border-primary transition-colors"
          >
            <OptimizedImage
              src={image}
              alt={`Review image ${index + 1}`}
              fill
              className="object-cover"
            />
            {/* Show remaining count on last visible image */}
            {index === maxVisible - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  +{remainingCount}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      <ImageLightbox
        images={images}
        initialIndex={selectedIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  );
}
