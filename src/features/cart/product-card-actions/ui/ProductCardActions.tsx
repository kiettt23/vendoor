"use client";

import { useState } from "react";
import { ShoppingCart, Check, Loader2, Heart } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useCart } from "@/entities/cart";
import type { ProductListItem } from "@/entities/product";

interface ProductCardActionsProps {
  product: ProductListItem;
  isOutOfStock: boolean;
}

/**
 * Quick add to cart actions for ProductCard.
 * This component should be passed to ProductCard's renderActions prop.
 */
export function ProductCardActions({
  product,
  isOutOfStock,
}: ProductCardActionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || isAdded || isOutOfStock) return;

    setIsAdding(true);

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      variantId: product.variantId,
      variantName: null,
      price: product.price,
      quantity: 1,
      image: product.image || "/placeholder.jpg",
      stock: product.stock,
      vendorId: product.vendor.id,
      vendorName: product.vendor.name,
    });

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }, 300);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Toggle local state only - wishlist is managed by server actions
    setIsLiked(!isLiked);
  };

  return (
    <>
      <Button
        size="sm"
        variant={isLiked ? "default" : "secondary"}
        className={`flex-1 h-9 cursor-pointer ${isLiked ? "bg-red-500 hover:bg-red-600" : ""}`}
        onClick={handleWishlistToggle}
      >
        <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
        {isLiked ? "Đã thích" : "Thích"}
      </Button>
      <Button
        size="sm"
        variant="default"
        className={`flex-1 h-9 cursor-pointer ${
          isAdded ? "bg-green-600 hover:bg-green-600" : ""
        }`}
        onClick={handleQuickAdd}
        disabled={isAdding || isOutOfStock}
      >
        {isAdding ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isAdded ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            Đã thêm
          </>
        ) : isOutOfStock ? (
          "Hết hàng"
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-1" />
            Thêm
          </>
        )}
      </Button>
    </>
  );
}
