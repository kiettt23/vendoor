"use client";

import { useState } from "react";
import { ShoppingCart, Check, Loader2, Eye } from "lucide-react";
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

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        className="flex-1 h-9"
        onClick={(e) => e.stopPropagation()}
      >
        <Eye className="h-4 w-4 mr-1" />
        Chi tiết
      </Button>
      <Button
        size="sm"
        variant="default"
        className={`flex-1 h-9 ${
          isAdded ? "bg-green-600 hover:bg-green-600" : ""
        }`}
        onClick={handleQuickAdd}
        disabled={isAdding}
      >
        {isAdding ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isAdded ? (
          <>
            <Check className="h-4 w-4 mr-1" />
            Đã thêm
          </>
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
