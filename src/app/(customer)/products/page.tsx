import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { getProducts, ProductCard } from "@/entities/product";
import { getCategoriesWithCount } from "@/entities/category";
import { getApprovedVendors } from "@/entities/vendor";
import { Button } from "@/shared/ui/button";
import {
  ProductFilterBar,
  ActiveFilterTags,
  parseFilterParams,
} from "@/features/product-filter";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
    // Filter params
    minPrice?: string;
    maxPrice?: string;
    minRating?: string;
    vendorId?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const categorySlug = params.category;
  const search = params.search;

  // Parse filter params từ URL
  const urlSearchParams = new URLSearchParams(params as Record<string, string>);
  const filterParams = parseFilterParams(urlSearchParams);

  const [{ products, pagination }, categories, vendors] = await Promise.all([
    getProducts({
      categorySlug,
      search,
      page,
      limit: 12,
      minPrice: filterParams.minPrice,
      maxPrice: filterParams.maxPrice,
      minRating: filterParams.minRating,
      vendorId: filterParams.vendorId,
      inStock: filterParams.inStock,
      sort: filterParams.sort as
        | "newest"
        | "oldest"
        | "price-asc"
        | "price-desc"
        | "name-asc"
        | "name-desc"
        | undefined,
    }),
    getCategoriesWithCount(),
    getApprovedVendors(),
  ]);

  // Tổng số sản phẩm từ tất cả categories (không đổi khi filter)
  const totalAllProducts = categories.reduce(
    (sum, cat) => sum + cat._count.products,
    0
  );

  // Map vendors cho filter component
  const vendorsForFilter = vendors.map((v) => ({ id: v.id, name: v.shopName }));

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Sản Phẩm</h1>
      </div>

      {/* Category tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <Link href="/products">
            <Button variant={!categorySlug ? "default" : "outline"} size="sm">
              Tất cả ({totalAllProducts})
            </Button>
          </Link>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`}>
              <Button
                variant={categorySlug === cat.slug ? "default" : "outline"}
                size="sm"
              >
                {cat.name} ({cat._count.products})
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-4">
        <ProductFilterBar
          totalProducts={pagination.total}
          showVendorFilter
          vendors={vendorsForFilter}
        />
      </div>

      {/* Active filter tags */}
      <div className="mb-6">
        <ActiveFilterTags vendors={vendorsForFilter} />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <PackageSearch className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Không tìm thấy sản phẩm
          </h3>
          <p className="text-muted-foreground mb-4">
            Thử tìm kiếm với từ khóa khác
          </p>
          <Button asChild>
            <Link href="/products">Xem tất cả</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(categorySlug && { category: categorySlug }),
                    ...(search && { search }),
                    ...(params.minPrice && { minPrice: params.minPrice }),
                    ...(params.maxPrice && { maxPrice: params.maxPrice }),
                    ...(params.minRating && { minRating: params.minRating }),
                    ...(params.vendorId && { vendorId: params.vendorId }),
                    ...(params.inStock && { inStock: params.inStock }),
                    ...(params.sort && { sort: params.sort }),
                    page: String(page - 1),
                  })}`}
                >
                  <Button variant="outline">← Trước</Button>
                </Link>
              )}
              <span className="flex items-center px-4">
                Trang {page} / {pagination.totalPages}
              </span>
              {page < pagination.totalPages && (
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(categorySlug && { category: categorySlug }),
                    ...(search && { search }),
                    ...(params.minPrice && { minPrice: params.minPrice }),
                    ...(params.maxPrice && { maxPrice: params.maxPrice }),
                    ...(params.minRating && { minRating: params.minRating }),
                    ...(params.vendorId && { vendorId: params.vendorId }),
                    ...(params.inStock && { inStock: params.inStock }),
                    ...(params.sort && { sort: params.sort }),
                    page: String(page + 1),
                  })}`}
                >
                  <Button variant="outline">Sau →</Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
