"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { formatPrice } from "@/shared/lib";
import type { ProductVariant } from "../model/types";
import { ProductActions } from "./product-actions";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    slug: string;
  };
  vendor: {
    vendorProfileId: string;
    shopName: string;
  };
  variants: ProductVariant[];
  defaultVariant: ProductVariant;
  image: string;
}

export function ProductDetailClient({
  product,
  vendor,
  variants,
  defaultVariant,
  image,
}: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>(defaultVariant);

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">
          {formatPrice(selectedVariant.price)}
        </span>
        {selectedVariant.compareAtPrice && (
          <span className="text-xl text-muted-foreground line-through">
            {formatPrice(selectedVariant.compareAtPrice)}
          </span>
        )}
      </div>

      {/* Variant Selector - chỉ hiển thị khi có nhiều hơn 1 variant */}
      {variants.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Phân loại</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <Badge
                  key={v.id}
                  variant={selectedVariant.id === v.id ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/90 hover:text-primary-foreground transition-colors"
                  onClick={() => setSelectedVariant(v)}
                >
                  {v.name || "Mặc định"} - {formatPrice(v.price)}
                  {v.stock === 0 && " (Hết hàng)"}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Actions - truyền variant đã chọn */}
      <ProductActions
        product={product}
        vendor={vendor}
        variant={selectedVariant}
        image={image}
      />
    </div>
  );
}
