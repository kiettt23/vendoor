"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getCloudinarySignature } from "@/features/product/actions/get-cloudinary-signature";
import { createLogger } from "@/shared/lib/logger";

// ============================================
// TYPES
// ============================================

interface UploadedImage {
  url: string;
  order: number;
}

interface ImageUploaderProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
}

// ============================================
// IMAGE UPLOADER
// ============================================

export function ImageUploader({
  images,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file selection
  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      // Check max images
      if (images.length + files.length > maxImages) {
        toast.error(`Chỉ được upload tối đa ${maxImages} ảnh`);
        return;
      }

      // Validate files
      const validFiles: File[] = [];
      for (const file of Array.from(files)) {
        // Check file type
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} không phải file ảnh`);
          continue;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} quá lớn (tối đa 5MB)`);
          continue;
        }

        validFiles.push(file);
      }

      if (validFiles.length === 0) return;

      // Upload files
      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Get signature from server
        const signatureResult = await getCloudinarySignature();
        if (!signatureResult.success || !signatureResult.signature) {
          throw new Error(signatureResult.error || "Failed to get signature");
        }

        const { signature, timestamp, apiKey, cloudName, folder } =
          signatureResult.signature;

        // Upload each file
        const uploadedUrls: string[] = [];
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];

          // Create form data
          const formData = new FormData();
          formData.append("file", file);
          formData.append("signature", signature);
          formData.append("timestamp", timestamp.toString());
          formData.append("api_key", apiKey);
          formData.append("folder", folder);

          // Upload to Cloudinary
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error(`Upload failed for ${file.name}`);
          }

          const result = await response.json();
          uploadedUrls.push(result.secure_url);

          // Update progress
          setUploadProgress(((i + 1) / validFiles.length) * 100);
        }

        // Add to images array
        const newImages: UploadedImage[] = uploadedUrls.map((url, index) => ({
          url,
          order: images.length + index,
        }));

        onChange([...images, ...newImages]);
        toast.success(`Đã upload ${validFiles.length} ảnh`);
      } catch (error) {
        const logger = createLogger("ImageUploader");
        logger.error("Upload failed", error);
        toast.error(
          error instanceof Error ? error.message : "Có lỗi khi upload ảnh"
        );
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
        // Reset input
        e.target.value = "";
      }
    },
    [images, maxImages, onChange]
  );

  // Remove image
  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // Re-order images
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
  };

  // Move image up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    [newImages[index - 1], newImages[index]] = [
      newImages[index],
      newImages[index - 1],
    ];
    // Re-order
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
  };

  // Move image down
  const handleMoveDown = (index: number) => {
    if (index === images.length - 1) return;
    const newImages = [...images];
    [newImages[index], newImages[index + 1]] = [
      newImages[index + 1],
      newImages[index],
    ];
    // Re-order
    const reorderedImages = newImages.map((img, i) => ({ ...img, order: i }));
    onChange(reorderedImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <div>
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading || images.length >= maxImages}
          className="hidden"
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading || images.length >= maxImages}
            asChild
          >
            <span className="cursor-pointer">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang upload ({Math.round(uploadProgress)}%)
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Chọn ảnh ({images.length}/{maxImages})
                </>
              )}
            </span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-2">
          Tối đa {maxImages} ảnh, mỗi ảnh không quá 5MB
        </p>
      </div>

      {/* Image grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative overflow-hidden group">
              {/* Image */}
              <div className="relative aspect-square bg-muted">
                <Image
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>

              {/* Order badge */}
              <div className="absolute top-2 left-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-black/70 text-white text-xs font-medium">
                  {index + 1}
                </span>
              </div>

              {/* Actions (show on hover) */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move up */}
                {index > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleMoveUp(index)}
                  >
                    ↑
                  </Button>
                )}

                {/* Move down */}
                {index < images.length - 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleMoveDown(index)}
                  >
                    ↓
                  </Button>
                )}

                {/* Remove */}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-dashed">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">
            Chưa có ảnh nào. Click &quot;Chọn ảnh&quot; để upload.
          </p>
        </Card>
      )}
    </div>
  );
}
