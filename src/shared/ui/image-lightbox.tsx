"use client";

import { useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { OptimizedImage } from "@/shared/ui/optimized-image";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Lightbox component để xem ảnh full size
 * - Navigation với arrow keys
 * - Swipe trên mobile (future)
 */
export function ImageLightbox({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  }, [images.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  }, [images.length]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") onOpenChange(false);
    },
    [handlePrev, handleNext, onOpenChange]
  );

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl w-full h-[80vh] p-0 bg-black/95 border-none"
        onKeyDown={handleKeyDown}
      >
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">Xem ảnh</DialogTitle>
        <DialogDescription className="sr-only">
          Ảnh {currentIndex + 1} / {images.length}
        </DialogDescription>

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-50 text-white hover:bg-white/20"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Main image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <OptimizedImage
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            enableBlur={false}
          />
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          </>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, index) => (
              <button
                key={img}
                onClick={() => setCurrentIndex(index)}
                className={`relative h-12 w-12 rounded overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? "border-white"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <OptimizedImage
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  enableBlur={false}
                />
              </button>
            ))}
          </div>
        )}

        {/* Counter */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      </DialogContent>
    </Dialog>
  );
}
