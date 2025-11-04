"use client";
import React from "react";
import ViewMore from "@/components/ui/ViewMore";
import ProductCard from "./ProductCard";
import { vi } from "@/lib/i18n";

const LatestProducts = ({ products }) => {
  const displayQuantity = 4;

  // ✅ Products come from Server Component
  const latestProducts = products
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, displayQuantity);

  return (
    <div className="px-6 my-30 max-w-6xl mx-auto">
      <ViewMore
        title={vi.product.latestProducts}
        description={`Hiển thị ${
          products.length < displayQuantity ? products.length : displayQuantity
        } trong ${products.length} sản phẩm`}
        href="/shop"
      />
      <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between">
        {latestProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
