"use client";

import { ImagePlus, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import type { ImageUploadProps, ProductImageData } from "../model/types";

interface ImageUploadCardProps extends ImageUploadProps {
  title?: string;
  existingImages?: ProductImageData[];
  headerAction?: React.ReactNode;
}

export function ImageUploadCard({
  title = "Hình Ảnh Sản Phẩm",
  imagePreview,
  onImageChange,
  onRemove,
  disabled,
  existingImages,
  headerAction,
}: ImageUploadCardProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {headerAction}
      </CardHeader>
      <CardContent>
        {imagePreview ? (
          <div className="relative w-64 h-64 mx-auto">
            <OptimizedImage
              src={imagePreview}
              alt="Product preview"
              fill
              sizes="256px"
              className="object-cover rounded-lg"
              enableBlur={false}
              unoptimized
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={onRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : existingImages && existingImages.length > 0 ? (
          <div className="flex gap-4 flex-wrap">
            {existingImages.map((img) => (
              <div
                key={img.id}
                className="relative h-24 w-24 rounded overflow-hidden bg-muted"
              >
                <OptimizedImage
                  src={img.url}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground text-sm mb-2">
                Nhấn để chọn hình ảnh
              </p>
              <p className="text-muted-foreground/70 text-xs">
                JPG, PNG, WebP, GIF (tối đa 10MB)
              </p>
            </div>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </label>
        )}
      </CardContent>
    </Card>
  );
}
