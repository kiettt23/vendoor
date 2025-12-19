"use client";

import { useState } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Alert, AlertDescription } from "@/shared/ui/alert";
import { PriceDisplay } from "@/shared/ui/price-display";
import { AlertCircle } from "lucide-react";
import { formatPrice, cn } from "@/shared/lib";
import type { ProductVariant, AddToCartData } from "../model/types";
import { ProductActions } from "./ProductActions";

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
  /**
   * Callback when user adds to cart. Inject from parent component.
   */
  onAddToCart?: (data: AddToCartData) => void;
}

export function ProductDetailClient({
  product,
  vendor,
  variants,
  defaultVariant,
  image,
  onAddToCart,
}: ProductDetailClientProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>(defaultVariant);

  return (
    <div className="space-y-6">
      {/* Out of stock alert */}
      {selectedVariant.stock === 0 && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>
            Sản phẩm này hiện đã hết hàng. Vui lòng chọn phân loại khác hoặc
            quay lại sau.
          </AlertDescription>
        </Alert>
      )}

      {/* Price Display */}
      <PriceDisplay
        price={selectedVariant.price}
        compareAtPrice={selectedVariant.compareAtPrice}
        size="lg"
      />

      {/* Variant Selector - chỉ hiển thị khi có nhiều hơn 1 variant */}
      {variants.length > 1 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Phân loại</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => {
                const isOutOfStock = v.stock === 0;
                const isSelected = selectedVariant.id === v.id;
                return (
                  <Badge
                    key={v.id}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors",
                      isOutOfStock
                        ? "opacity-60"
                        : "hover:bg-primary/90 hover:text-primary-foreground"
                    )}
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v.name || "Mặc định"} - {formatPrice(v.price)}
                    {isOutOfStock && " (Hết hàng)"}
                  </Badge>
                );
              })}
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
        onAddToCart={onAddToCart}
      />
    </div>
  );
}
