"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/features/product/ProductCard";
import { MoveLeftIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";
import { vi } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  getAllCategoryNamesEn,
  getAllCategoryNamesVi,
} from "@/configs/categories";

type SortOption = "newest" | "price-asc" | "price-desc" | "popular";

export default function ShopClient({ products, initialSearch }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0, 100000000,
  ]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const categoriesEn = getAllCategoryNamesEn();
  const categoriesVi = getAllCategoryNamesVi();

  console.log("[SHOP CLIENT] Products received:", products.length);
  console.log("[SHOP CLIENT] Price range:", priceRange);
  console.log(
    "[SHOP CLIENT] Products:",
    products.map((p) => ({ name: p.name, price: p.price }))
  );

  // Advanced filtering
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      result = result.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort(
          (a, b) => (b.rating?.length || 0) - (a.rating?.length || 0)
        );
        break;
      case "newest":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return result;
  }, [products, search, selectedCategory, priceRange, sortBy]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setPriceRange([0, 100000000]);
    setSortBy("newest");
    router.push("/shop");
  };

  const hasActiveFilters =
    search ||
    selectedCategory !== "all" ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000000;

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between my-6">
          <h1 className="text-2xl text-slate-500 flex items-center gap-2">
            {vi.categories.all}{" "}
            <span className="text-slate-700 font-medium">
              {vi.product.products}
            </span>
            <span className="text-sm text-slate-400">
              ({filteredProducts.length})
            </span>
          </h1>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontalIcon size={16} />
            Bộ lọc
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 bg-white border border-slate-200 rounded-lg p-6 h-fit sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-700">Bộ lọc</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="sm:hidden"
                >
                  <XIcon size={20} />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-600 mb-3">
                  Danh mục
                </p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "all"}
                      onChange={() => setSelectedCategory("all")}
                      className="accent-purple-600"
                    />
                    <span className="text-sm">Tất cả</span>
                  </label>
                  {categoriesEn.map((cat, index) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="accent-purple-600"
                      />
                      <span className="text-sm">{categoriesVi[index]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-600 mb-3">
                  Khoảng giá
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500">Từ</label>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([+e.target.value, priceRange[1]])
                      }
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
                      min={0}
                      placeholder="0"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {priceRange[0].toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Đến</label>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], +e.target.value])
                      }
                      className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
                      min={0}
                      placeholder="100000000"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      {priceRange[1].toLocaleString("vi-VN")} đ
                    </p>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <p className="text-sm font-medium text-slate-600 mb-3">
                  Sắp xếp
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full border border-slate-200 rounded px-3 py-2 text-sm"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="popular">Phổ biến nhất</option>
                </select>
              </div>

              {hasActiveFilters && (
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  className="w-full"
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-32">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-slate-400 text-lg mb-4">
                    Không tìm thấy sản phẩm
                  </p>
                  {hasActiveFilters && (
                    <Button onClick={handleClearFilters} variant="outline">
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
