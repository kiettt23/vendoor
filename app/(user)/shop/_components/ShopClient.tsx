"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/features/product/ProductCard";
import { MoveLeftIcon } from "lucide-react";
import { vi } from "@/lib/i18n";

export default function ShopClient({ products, initialSearch }) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  // Client-side filtering
  const filteredProducts = search
    ? products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  const handleClearSearch = () => {
    setSearch("");
    router.push("/shop");
  };

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto">
        <h1
          onClick={handleClearSearch}
          className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer"
        >
          {search && <MoveLeftIcon size={20} />}
          {vi.categories.all}{" "}
          <span className="text-slate-700 font-medium">
            {vi.product.products}
          </span>
        </h1>

        <div className="grid grid-cols-2 sm:flex flex-wrap gap-6 xl:gap-12 mx-auto mb-32">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-500">
              Không tìm thấy sản phẩm
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
