"use client";

import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { formatPrice } from "@/shared/lib";
import { calculateDiscount } from "../lib/utils";
import type { ProductListItem } from "../model/types";

export interface ProductCardProps extends ProductListItem {
  /**
   * Custom action buttons to render in the quick actions overlay.
   * Use this to inject cart functionality from features layer.
   */
  renderActions?: (props: {
    product: ProductListItem;
    isOutOfStock: boolean;
  }) => React.ReactNode;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  compareAtPrice,
  image,
  stock,
  variantId,
  vendor,
  category,
  renderActions,
}: ProductCardProps) {
  const discountPercent = calculateDiscount(price, compareAtPrice);
  const isOutOfStock = stock <= 0;

  const productData: ProductListItem = {
    id,
    name,
    slug,
    price,
    compareAtPrice,
    image,
    stock,
    variantId,
    vendor,
    category,
  };

  return (
    <Link href={`/products/${slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden border border-border/50 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 p-0">
        <CardContent className="p-0 flex flex-col h-full">
          <div className="relative aspect-square overflow-hidden bg-muted">
            <OptimizedImage
              src={image || "/placeholder.jpg"}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

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

            {/* Quick actions overlay - use custom actions or default */}
            {!isOutOfStock && (
              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform">
                <div className="flex gap-1 p-2 bg-black/60 backdrop-blur">
                  {renderActions ? (
                    renderActions({ product: productData, isOutOfStock })
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1 h-9 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Heart className="h-4 w-4 mr-1" />
                        Thích
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-1 h-9 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Thêm
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {discountPercent && (
              <Badge
                variant="destructive"
                className="absolute right-2 top-2 font-bold"
              >
                -{discountPercent}%
              </Badge>
            )}
            <Badge
              variant="secondary"
              className="absolute bottom-2 left-2 bg-white/95 text-xs group-hover:opacity-0 transition-opacity"
            >
              {category.name}
            </Badge>
          </div>
          <div className="flex-1 flex flex-col gap-2 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {vendor.name}
            </p>
            <h3 className="line-clamp-2 font-semibold group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex-1" />
            <div className="flex items-baseline gap-2 pt-2">
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
