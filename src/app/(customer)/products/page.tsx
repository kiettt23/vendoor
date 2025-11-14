import {
  getProducts,
  getCategories,
} from "@/features/product/actions/get-products";
import { ProductCard } from "@/features/product/components/ProductCard";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";

// ============================================
// PAGE PROPS
// ============================================

interface PageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    page?: string;
  }>;
}

// ============================================
// PRODUCT LIST PAGE
// ============================================

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const page = parseInt(params.page || "1");
  const categorySlug = params.category;
  const search = params.search;

  // Fetch data
  const [{ products, pagination }, categories] = await Promise.all([
    getProducts({ categorySlug, search, page, limit: 12 }),
    getCategories(),
  ]);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sản Phẩm</h1>
        <p className="text-muted-foreground">
          Khám phá {pagination.total} sản phẩm chất lượng
        </p>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Danh Mục</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/products">
            <Button variant={!categorySlug ? "default" : "outline"} size="sm">
              Tất cả ({pagination.total})
            </Button>
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
            >
              <Button
                variant={categorySlug === category.slug ? "default" : "outline"}
                size="sm"
              >
                {category.name} ({category._count.products})
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground mb-4">
            Không tìm thấy sản phẩm nào
          </p>
          <Link href="/products">
            <Button>Xem tất cả sản phẩm</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(categorySlug && { category: categorySlug }),
                    ...(search && { search }),
                    page: String(page - 1),
                  })}`}
                >
                  <Button variant="outline">← Trang trước</Button>
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
                    page: String(page + 1),
                  })}`}
                >
                  <Button variant="outline">Trang sau →</Button>
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
