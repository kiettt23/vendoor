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
  productId: string;
  className?: string;
}

export function MoveToCartButton({
  product,
  productId,
  className,
}: MoveToCartButtonProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product.stock === 0) return;

    addItem({
      id: product.variantId,
      productId,
      productName: product.name,
      productSlug: product.productSlug,
      variantId: product.variantId,
      variantName: null,
      price: product.price,
      quantity: 1,
      image: product.image || "",
      stock: product.stock,
      vendorId: product.vendor.id,
      vendorName: product.vendor.name,
    });
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
