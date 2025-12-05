"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useCart } from "@/entities/cart";

interface MoveToCartButtonProps {
  product: {
    variantId: string;
    productSlug: string;
    name: string;
    price: number;
    image: string | null;
    stock: number;
    vendor: {
      id: string;
      name: string;
    };
  };
  onSuccess?: () => void;
  className?: string;
}

export function MoveToCartButton({
  product,
  onSuccess,
  className,
}: MoveToCartButtonProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product.stock === 0) return;

    addItem({
      id: product.variantId,
      variantId: product.variantId,
      productSlug: product.productSlug,
      name: product.name,
      price: product.price,
      image: product.image || "",
      quantity: 1,
      stock: product.stock,
      vendorId: product.vendor.id,
      vendorName: product.vendor.name,
    });

    onSuccess?.();
  };

  const isOutOfStock = product.stock === 0;

  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleAddToCart}
      disabled={isOutOfStock}
      className={className}
    >
      <ShoppingCart className="h-4 w-4 mr-1" />
      {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
    </Button>
  );
}
