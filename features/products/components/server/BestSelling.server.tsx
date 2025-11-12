import ViewMore from "@/shared/components/ui/ViewMore";
import { ProductCard } from "../client/ProductCard.client";
import type { ProductCardData } from "@/features/products/types/product.types";

export const BestSelling = ({ products }: { products: ProductCardData[] }) => {
  const displayQuantity = 8;

  const bestSellingProducts = products
    .slice()
    .sort((a, b) => b.rating.length - a.rating.length)
    .slice(0, displayQuantity);

  return (
    <div className="px-6 my-30 max-w-6xl mx-auto">
      <ViewMore
        title="Sản phẩm bán chạy"
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
