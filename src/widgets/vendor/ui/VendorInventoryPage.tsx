import Link from "next/link";
import { Package } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/lib/constants";
import { requireVendor } from "@/entities/vendor";

import {
  getVendorInventory,
  type InventoryFilter,
  StockTable,
  InventoryFilterBar,
  LowStockAlert,
} from "@/features/inventory-management";

interface VendorInventoryPageProps {
  filter?: InventoryFilter;
  search?: string;
  page?: number;
}

export async function VendorInventoryPage({
  filter = "all",
  search,
  page = 1,
}: VendorInventoryPageProps) {
  const { user } = await requireVendor();

  const { items, total, stats } = await getVendorInventory({
    vendorId: user.id,
    filter,
    search,
    page,
    limit: 20,
  });

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản Lý Tồn Kho</h1>
          <p className="text-muted-foreground">
            {stats.totalVariants} biến thể từ {stats.totalProducts} sản phẩm
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href={ROUTES.VENDOR_PRODUCTS}>
            <Package className="mr-2 size-4" />
            Quản lý sản phẩm
          </Link>
        </Button>
      </div>

      {/* Low stock alert */}
      <LowStockAlert
        lowStockCount={stats.lowStock}
        outOfStockCount={stats.outOfStock}
      />

      {/* Filters */}
      <InventoryFilterBar stats={stats} />

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <StockTable items={items} vendorId={user.id} />
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === page ? "default" : "outline"}
                size="sm"
                asChild
              >
                <Link
                  href={`?${new URLSearchParams({
                    ...(filter !== "all" ? { filter } : {}),
                    ...(search ? { search } : {}),
                    ...(pageNum > 1 ? { page: pageNum.toString() } : {}),
                  }).toString()}`}
                >
                  {pageNum}
                </Link>
              </Button>
            )
          )}
        </div>
      )}
    </div>
  );
}
