import ViewMore from "@/shared/components/ui/ViewMore";
import { ProductCard } from "../client/ProductCard.client";

export const LatestProducts = ({ products }: { products: any[] }) => {
  const displayQuantity = 4;

  const latestProducts = products
    .slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, displayQuantity);

  return (
    <div className="px-6 my-30 max-w-6xl mx-auto">
      <ViewMore
        title="Sản phẩm mới nhất"
        description={`Hiển thị ${
          products.length < displayQuantity ? products.length : displayQuantity
        } trong ${products.length} sản phẩm`}
        href="/shop"
      />
      <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-between">
        {latestProducts.map((product: any, index: number) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};
