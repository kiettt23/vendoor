"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/shared/components/ui/card";

// ============================================
// TYPES
// ============================================

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  order: number;
}

interface ProductImagesProps {
  images: ProductImage[];
  productName: string;
}

// ============================================
// PRODUCT IMAGES COMPONENT
// ============================================

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(images[0] || null);

  if (!selectedImage) {
    return (
      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No image available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={selectedImage.url}
            alt={selectedImage.altText || productName}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </Card>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage.id === image.id
                  ? "border-primary ring-2 ring-primary ring-offset-2"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <Image
                src={image.url}
                alt={image.altText || productName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, 12vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
