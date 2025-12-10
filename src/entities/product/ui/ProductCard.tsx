"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { PriceDisplay } from "@/shared/ui/price-display";
import { calculateDiscount } from "../lib/utils";
import type { ProductListItem } from "../model/types";

export type ProductCardProps = ProductListItem;

function RatingStars({ rating, reviewCount }: { rating: number | null; reviewCount: number }) {
  if (rating === null || reviewCount === 0) {
    return <span className="text-xs text-muted-foreground">Chưa có đánh giá</span>;
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        ))}
        {/* Half star */}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-3.5 w-3.5 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} className="h-3.5 w-3.5 text-gray-300" />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">({reviewCount})</span>
    </div>
  );
}

export function ProductCard({
  name,
  slug,
  price,
  compareAtPrice,
  image,
  stock,
  vendor,
  rating,
  reviewCount,
}: ProductCardProps) {
  const discountPercent = calculateDiscount(price, compareAtPrice);
  const isOutOfStock = stock <= 0;

  return (
    <Link href={`/products/${slug}`} className="block h-full">
      <Card className="group h-full overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 p-0">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Image area */}
          <div className="relative aspect-square overflow-hidden bg-muted">
            <OptimizedImage
              src={image || "/placeholder.jpg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Out of stock overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2">
                <div className="bg-white/10 rounded-full p-3">
                  <ShoppingCart className="h-6 w-6 text-white/80" />
                </div>
                <span className="text-white font-semibold text-sm tracking-wide uppercase">
                  Hết hàng
                </span>
              </div>
            )}

            {discountPercent && (
              <Badge
                variant="destructive"
                className="absolute left-2 top-2 font-bold"
              >
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Content area */}
          <div className="flex-1 flex flex-col p-4">
            {/* Vendor name */}
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {vendor.shopName}
            </p>
            
            {/* Product name */}
            <h3 className="line-clamp-2 font-semibold group-hover:text-primary transition-colors mt-1.5">
              {name}
            </h3>
            
            {/* Rating */}
            <div className="mt-1.5">
              <RatingStars rating={rating} reviewCount={reviewCount} />
            </div>
            
            {/* Spacer */}
            <div className="flex-1" />
            
            {/* Price - Always at bottom */}
            <div className="mt-3">
              <PriceDisplay
                price={price}
                compareAtPrice={compareAtPrice}
                size="md"
                showDiscount={false}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
