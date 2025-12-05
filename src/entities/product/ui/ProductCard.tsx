"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { formatPrice } from "@/shared/lib";
import { calculateDiscount } from "../lib/utils";
import type { ProductListItem } from "../model/types";

export type ProductCardProps = ProductListItem;

export function ProductCard({
  name,
  slug,
  price,
  compareAtPrice,
  image,
  stock,
  vendor,
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
          <div className="flex-1 flex flex-col gap-2 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {vendor.name}
            </p>
            <h3 className="line-clamp-2 font-semibold group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex-1" />
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">
                {formatPrice(price)}
              </span>
              {compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
