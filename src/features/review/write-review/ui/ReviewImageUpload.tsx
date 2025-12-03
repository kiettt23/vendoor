"use client";

import { useState, useCallback } from "react";
import { X, ImagePlus, Loader2 } from "lucide-react";

import { OptimizedImage } from "@/shared/ui/optimized-image";
import {
  validateImageFile,
  uploadImageViaAPI,
  type UploadResult,
} from "@/shared/lib/upload";
import { showCustomToast } from "@/shared/lib/constants";

const MAX_IMAGES = 5;

interface ReviewImageUploadProps {
  /** Current images (Cloudinary URLs) */
  images: string[];
  /** Callback when images change */
  onChange: (images: string[]) => void;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Multi-image upload component cho review
 * - Drag & drop hoặc click để chọn
 * - Preview ảnh trước khi submit
 * - Tối đa 5 ảnh
 */
export function ReviewImageUpload({
  images,
  onChange,
  disabled,
}: ReviewImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const remainingSlots = MAX_IMAGES - images.length;
      if (remainingSlots <= 0) {
        showCustomToast.error(`Tối đa ${MAX_IMAGES} hình ảnh`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      // Validate all files first
      for (const file of filesToUpload) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          showCustomToast.error(validation.error || "File không hợp lệ");
          return;
        }
      }

      setIsUploading(true);
      setUploadingCount(filesToUpload.length);

      const uploadedUrls: string[] = [];

      for (const file of filesToUpload) {
        try {
          const result: UploadResult = await uploadImageViaAPI(file);
          uploadedUrls.push(result.url);
        } catch (error) {
          console.error("Upload error:", error);
          showCustomToast.error("Upload ảnh thất bại");
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...images, ...uploadedUrls]);
      }

      setIsUploading(false);
      setUploadingCount(0);
    },
    [images, onChange]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    },
    [images, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      if (disabled || isUploading) return;
      handleFileSelect(e.dataTransfer.files);
    },
    [disabled, isUploading, handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  }, []);

  const canAddMore = images.length < MAX_IMAGES && !disabled && !isUploading;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Hình ảnh ({images.length}/{MAX_IMAGES})
        </span>
        {images.length > 0 && (
          <span className="text-xs text-muted-foreground">
            Click ✕ để xóa ảnh
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {/* Preview existing images */}
        {images.map((url, index) => (
          <div
            key={url}
            className="relative h-20 w-20 rounded-lg overflow-hidden border bg-muted group"
          >
            <OptimizedImage
              src={url}
              alt={`Review image ${index + 1}`}
              fill
              className="object-cover"
            />
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Xóa ảnh"
              >
                <X className="h-3 w-3 text-white" />
              </button>
            )}
          </div>
        ))}

        {/* Upload button */}
        {canAddMore && (
          <label
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="h-20 w-20 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors bg-muted/30"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-1">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {uploadingCount}
                </span>
              </div>
            ) : (
              <>
                <ImagePlus className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground mt-1">
                  Thêm ảnh
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
              disabled={disabled || isUploading}
            />
          </label>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Hỗ trợ JPG, PNG, WebP. Tối đa 5MB/ảnh.
      </p>
    </div>
  );
}
