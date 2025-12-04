"use client";

import { ProductDetailClient, type AddToCartData } from "@/entities/product/ui";
import { useCart } from "@/entities/cart";
import type { ProductVariant } from "@/entities/product/model";

interface ProductDetailWithCartProps {
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

/**
 * ProductDetailClient wrapper that injects cart functionality.
 * This lives in features layer to bridge entities (product) with entities (cart).
 */
export function ProductDetailWithCart(props: ProductDetailWithCartProps) {
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = (data: AddToCartData) => {
    addItem({
      productId: data.productId,
      productName: data.productName,
      productSlug: data.productSlug,
      variantId: data.variantId,
      variantName: data.variantName,
      price: data.price,
      quantity: data.quantity,
      image: data.image,
      stock: data.stock,
      vendorId: data.vendorId,
      vendorName: data.vendorName,
    });
  };

  return <ProductDetailClient {...props} onAddToCart={handleAddToCart} />;
}
