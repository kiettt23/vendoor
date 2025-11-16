"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { ProductQuickActions } from "./ProductQuickActions";

// ============================================
// TYPES
// ============================================

interface VendorProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    category: {
      name: string;
    };
    priceRange: {
      min: number;
      max: number;
    };
    totalStock: number;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

// ============================================
// VENDOR PRODUCT CARD
// ============================================

export function VendorProductCard({ product }: VendorProductCardProps) {
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Price range display
  const priceDisplay =
    product.priceRange.min === product.priceRange.max
      ? formatPrice(product.priceRange.min)
      : `${formatPrice(product.priceRange.min)} - ${formatPrice(
          product.priceRange.max
        )}`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <Link href={`/vendor/products/${product.id}/edit`}>
        <div className="relative aspect-square bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-muted-foreground text-sm">Chưa có ảnh</span>
            </div>
          )}

          {/* Status badge overlay */}
          <div className="absolute top-2 right-2">
            <Badge variant={product.isActive ? "success" : "secondary"}>
              {product.isActive ? "Đang bán" : "Đã ẩn"}
            </Badge>
          </div>
        </div>
      </Link>

      {/* Content */}
      <CardContent className="p-4 space-y-2">
        <Link href={`/vendor/products/${product.id}/edit`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{product.category.name}</span>
          <span className="font-medium">
            Kho:{" "}
            <span
              className={
                product.totalStock > 0 ? "text-success" : "text-destructive"
              }
            >
              {product.totalStock}
            </span>
          </span>
        </div>

        <div className="text-lg font-bold text-primary">{priceDisplay}</div>
      </CardContent>

      {/* Actions */}
      <CardFooter className="p-4 pt-0">
        <ProductQuickActions product={product} />
      </CardFooter>
    </Card>
  );
}
