import { getVendorProducts } from "@/features/product/actions/get-vendor-products";
import { VendorProductList } from "./VendorProductList";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

// ============================================
// VENDOR PRODUCTS PAGE
// ============================================

interface VendorProductsPageProps {
  searchParams?: Promise<{
    search?: string;
    status?: "all" | "active" | "inactive";
    page?: string;
  }>;
}

export async function VendorProductsPage({
  searchParams,
}: VendorProductsPageProps) {
  // Parse search params
  const params = await searchParams;
  const search = params?.search;
  const status = params?.status ?? "all";
  const page = parseInt(params?.page ?? "1", 10);

  // Fetch products
  const result = await getVendorProducts({
    search,
    status,
    page,
    limit: 10,
  });

  // Handle error
  if (!result.success || !result.products) {
    return (
      <div className="container py-8">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-sm text-destructive">
            {result.error ?? "Có lỗi xảy ra khi tải danh sách sản phẩm"}
          </p>
        </div>
      </div>
    );
  }

  const { products, pagination } = result;

  // TypeScript guard - pagination should always exist if products exist
  if (!pagination) {
    return null;
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sản phẩm</h1>
          <p className="text-muted-foreground mt-1">
            Danh sách sản phẩm của shop bạn
          </p>
        </div>
        <Button asChild>
          <Link href="/vendor/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Link>
        </Button>
      </div>

      {/* Product List */}
      <VendorProductList
        products={products}
        pagination={pagination}
        currentStatus={status}
        currentSearch={search}
      />
    </div>
  );
}
