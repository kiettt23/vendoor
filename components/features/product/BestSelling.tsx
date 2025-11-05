"use client";
import ViewMore from "@/components/ui/ViewMore";
import ProductCard from "./ProductCard";
import { vi } from "@/lib/i18n";

const BestSelling = ({ products }) => {
  const displayQuantity = 8;

  // ✅ Products come from Server Component
  const bestSellingProducts = products
    .slice()
    .sort((a, b) => b.rating.length - a.rating.length)
    .slice(0, displayQuantity);

  return (
    <div className="px-6 my-30 max-w-6xl mx-auto">
      <ViewMore
        title={vi.product.bestSelling}
        description={`Hiển thị ${
          products.length < displayQuantity ? products.length : displayQuantity
        } trong ${products.length} sản phẩm`}
        href="/shop"
      />
      <div className="mt-12  grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12">
        {bestSellingProducts.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

export default BestSelling;
