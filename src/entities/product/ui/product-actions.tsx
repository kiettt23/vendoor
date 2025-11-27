"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, Check, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useCart } from "@/entities/cart";
import type { ProductVariant } from "../model/types";

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    slug: string;
  };
  vendor: {
    vendorProfileId: string;
    shopName: string;
  };
  variant: ProductVariant;
  image: string;
}

export function ProductActions({
  product,
  vendor,
  variant,
  image,
}: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    if (variant.stock === 0 || isAdding) return;

    setIsAdding(true);

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: variant.id,
      variantName: variant.name,
      price: variant.price,
      quantity,
      image,
      stock: variant.stock,
      vendorId: vendor.vendorProfileId, // VendorProfile.id, not User.id
      vendorName: vendor.shopName,
    });

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setQuantity(1);
      setTimeout(() => setIsAdded(false), 2000);
    }, 300);
  };

  const incrementQuantity = () => {
    if (quantity < variant.stock) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const isDisabled = variant.stock === 0 || isAdding;

  return (
    <div className="space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Số lượng:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isDisabled}
            className="h-10 w-10"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={incrementQuantity}
            disabled={quantity >= variant.stock || isDisabled}
            className="h-10 w-10"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          (Còn {variant.stock} sản phẩm)
        </span>
      </div>

      {/* Add to Cart Button */}
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={isDisabled}
      >
        {isAdding ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Đang thêm...
          </>
        ) : isAdded ? (
          <>
            <Check className="mr-2 h-5 w-5" />
            Đã thêm vào giỏ!
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {variant.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
          </>
        )}
      </Button>
    </div>
  );
}
