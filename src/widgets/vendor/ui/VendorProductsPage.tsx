import Link from "next/link";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { Plus } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { EmptyVendorProducts } from "@/shared/ui/feedback";
import { formatPrice } from "@/shared/lib";
import { ROUTES, getProductStatusBadge } from "@/shared/lib/constants";
import { getVendorProducts } from "@/entities/product/api/queries";
import { requireVendor } from "@/entities/vendor";

export async function VendorProductsPage() {
  const { user } = await requireVendor();

  const products = await getVendorProducts(user.id);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Sản Phẩm</h1>
          <p className="text-muted-foreground">{products.length} sản phẩm</p>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href={ROUTES.VENDOR_PRODUCT_CREATE}>
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <EmptyVendorProducts />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {products.map((product) => (
            <Link key={product.id} href={ROUTES.VENDOR_PRODUCT_EDIT(product.id)}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex gap-3 sm:gap-4">
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded overflow-hidden bg-muted shrink-0">
                      {product.images[0] && (
                        <OptimizedImage
                          src={product.images[0].url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-semibold truncate text-sm sm:text-base">
                            {product.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {product.category.name}
                          </p>
                        </div>
                        {(() => {
                          const statusBadge = getProductStatusBadge(product.isActive);
                          return (
                            <Badge
                              variant={statusBadge.variant}
                              className="shrink-0 text-xs"
                            >
                              {statusBadge.label}
                            </Badge>
                          );
                        })()}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                        <span className="font-bold text-primary text-sm sm:text-base">
                          {formatPrice(product.variants[0]?.price || 0)}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Kho: {product.variants[0]?.stock || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
