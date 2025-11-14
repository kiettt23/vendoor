"use client";

import { useState } from "react";
import { useCart } from "@/features/cart/hooks/useCart";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Minus, Plus, ShoppingCart, Store } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatPrice, calculateDiscount } from "../lib/utils";

// ============================================
// TYPES
// ============================================

interface ProductVariant {
  id: string;
  name: string | null;
  sku: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  color: string | null;
  size: string | null;
  isDefault: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  vendor: {
    id: string;
    name: string;
    shopName: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
  variants: ProductVariant[];
  images: { id: string; url: string; altText: string | null; order: number }[];
  createdAt: Date;
}

interface ProductInfoProps {
  product: Product;
  defaultVariant: ProductVariant;
}

// ============================================
// PRODUCT INFO COMPONENT
// ============================================

export function ProductInfo({ product, defaultVariant }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>(defaultVariant);
  const [quantity, setQuantity] = useState(1);

  const discountPercent = calculateDiscount(
    selectedVariant.price,
    selectedVariant.compareAtPrice
  );

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= selectedVariant.stock) {
      setQuantity(newQuantity);
    }
  };

  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: selectedVariant.id,
      variantName: selectedVariant.name,
      price: selectedVariant.price,
      quantity,
      image: product.images[0]?.url,
      stock: selectedVariant.stock,
      vendorId: product.vendor.id,
      vendorName: product.vendor.shopName,
    });
    toast.success(
      `Đã thêm ${quantity}x ${product.name} (${selectedVariant.name}) vào giỏ hàng!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        {/* Vendor */}
        <Link
          href={`/vendors/${product.vendor.slug}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <Store className="h-4 w-4" />
          <span>{product.vendor.shopName}</span>
        </Link>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-primary">
          {formatPrice(selectedVariant.price)}
        </span>
        {discountPercent !== null && selectedVariant.compareAtPrice && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              {formatPrice(selectedVariant.compareAtPrice)}
            </span>
            <Badge variant="destructive">-{discountPercent}%</Badge>
          </>
        )}
      </div>

      {/* Variants */}
      {product.variants.length > 1 && (
        <div>
          <h3 className="font-semibold mb-3">Chọn Phiên Bản:</h3>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <Button
                key={variant.id}
                variant={
                  selectedVariant.id === variant.id ? "default" : "outline"
                }
                onClick={() => {
                  setSelectedVariant(variant);
                  setQuantity(1); // Reset quantity khi đổi variant
                }}
                disabled={variant.stock === 0}
                className="relative"
              >
                {variant.name || "Default"}
                {variant.stock === 0 && (
                  <span className="absolute inset-0 bg-gray-200/80 flex items-center justify-center text-xs">
                    Hết hàng
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Stock */}
      <div>
        <span className="text-sm text-muted-foreground">
          Còn lại:{" "}
          <span className="font-semibold text-foreground">
            {selectedVariant.stock}
          </span>{" "}
          sản phẩm
        </span>
      </div>

      {/* Quantity */}
      <div>
        <h3 className="font-semibold mb-3">Số Lượng:</h3>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-xl font-semibold w-12 text-center">
            {quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= selectedVariant.stock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={selectedVariant.stock === 0}
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Thêm Vào Giỏ
        </Button>
        <Button size="lg" variant="outline" className="flex-1">
          Mua Ngay
        </Button>
      </div>

      {/* Additional Info */}
      <div className="pt-6 border-t space-y-2 text-sm text-muted-foreground">
        <div className="flex justify-between">
          <span>SKU:</span>
          <span className="font-medium text-foreground">
            {selectedVariant.sku || "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Tình trạng:</span>
          <Badge variant={selectedVariant.stock > 0 ? "default" : "secondary"}>
            {selectedVariant.stock > 0 ? "Còn hàng" : "Hết hàng"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
