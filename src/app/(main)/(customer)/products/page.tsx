import Link from "next/link";
import { PackageSearch } from "lucide-react";

import { getProducts } from "@/entities/product/api/queries";
import { ProductCard } from "@/entities/product";
import { getCategoriesWithCount } from "@/entities/category/api/queries";
import { getApprovedVendors } from "@/entities/vendor/api/queries";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/lib/constants";
import {
  ProductFilterBar,
  ActiveFilterTags,
  CategoryTabs,
  Pagination,
  parseFilterParams,
  normalizeSearchText,
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
  // Normalize search text để match cả "lap top" và "laptop"
  const search = params.search ? normalizeSearchText(params.search) : undefined;

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
  // Dùng userId vì Product.vendorId tham chiếu đến User.id, không phải VendorProfile.id
  const vendorsForFilter = vendors.map((v) => ({ id: v.userId, name: v.shopName }));

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Sản Phẩm</h1>
      </div>

      {/* Category tabs */}
      <div className="mb-6">
        <CategoryTabs
          categories={categories}
          currentCategorySlug={categorySlug}
          totalAllProducts={totalAllProducts}
        />
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
            <Link href={ROUTES.PRODUCTS}>Xem tất cả</Link>
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
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
            />
          )}
        </>
      )}
    </div>
  );
}
