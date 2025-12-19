import Link from "next/link";
import { Plus } from "lucide-react";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { EmptyVendorProducts } from "@/shared/ui/feedback";
import { ROUTES } from "@/shared/lib/constants";
import { getVendorProducts } from "@/entities/product/api/vendor-product.queries";
import { VendorProductCard } from "@/entities/product/ui";
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
            <VendorProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
