import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Store, Package, Calendar, ChevronLeft } from "lucide-react";

import { getPublicVendorById } from "@/entities/vendor";
import { getProducts, ProductCard } from "@/entities/product";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function StoreDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = parseInt(pageParam || "1");

  const vendor = await getPublicVendorById(id);

  if (!vendor) {
    notFound();
  }

  // Get vendor's products using userId (vendorId in Product table is User.id)
  const { products, pagination } = await getProducts({
    vendorId: vendor.userId,
    page,
    limit: 12,
  });

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      {/* Back button */}
      <Link href="/stores">
        <Button variant="ghost" size="sm" className="mb-6">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Tất cả cửa hàng
        </Button>
      </Link>

      {/* Store Header */}
      <Card className="mb-10">
        <CardContent className="p-8">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            {/* Logo */}
            <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl">
              {vendor.logo ? (
                <Image
                  src={vendor.logo}
                  alt={vendor.shopName}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Store className="text-muted-foreground h-12 w-12" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{vendor.shopName}</h1>
              {vendor.description && (
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  {vendor.description}
                </p>
              )}
              <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{vendor.productCount} sản phẩm</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Tham gia từ{" "}
                    {new Date(vendor.createdAt).toLocaleDateString("vi-VN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Sản phẩm của cửa hàng</h2>
        <p className="text-muted-foreground mt-1">
          {pagination.total} sản phẩm
        </p>
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center">
          <Package className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">Chưa có sản phẩm nào</h3>
          <p className="text-muted-foreground">
            Cửa hàng này chưa đăng bán sản phẩm nào
          </p>
          <Link href="/products">
            <Button className="mt-4">Xem sản phẩm khác</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {page > 1 && (
                <Link href={`/stores/${id}?page=${page - 1}`}>
                  <Button variant="outline">← Trước</Button>
                </Link>
              )}
              <span className="flex items-center px-4">
                Trang {page} / {pagination.totalPages}
              </span>
              {page < pagination.totalPages && (
                <Link href={`/stores/${id}?page=${page + 1}`}>
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
