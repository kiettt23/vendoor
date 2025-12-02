import { getProducts, ProductCard } from "@/entities/product";
import { getCategoriesWithCount } from "@/entities/category";
import { Button } from "@/shared/ui/button";
import { PackageSearch } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ category?: string; search?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const categorySlug = params.category;
  const search = params.search;

  const [{ products, pagination }, categories] = await Promise.all([
    getProducts({ categorySlug, search, page, limit: 12 }),
    getCategoriesWithCount(),
  ]);

  return (
    <div className="container mx-auto py-12 lg:py-16 px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Sản Phẩm</h1>
        <p className="text-muted-foreground mt-2">
          {pagination.total} sản phẩm
        </p>
      </div>

      <div className="mb-10">
        <div className="flex flex-wrap gap-2">
          <Link href="/products">
            <Button variant={!categorySlug ? "default" : "outline"} size="sm">
              Tất cả ({pagination.total})
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
