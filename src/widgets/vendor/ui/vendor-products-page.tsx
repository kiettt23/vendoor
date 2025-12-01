import Link from "next/link";
import Image from "next/image";
import { Plus, Package } from "lucide-react";
import { headers } from "next/headers";

import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { auth } from "@/shared/lib/auth/config";
import { formatPrice } from "@/shared/lib";
import { getVendorProducts } from "@/entities/product";

export async function VendorProductsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  const products = await getVendorProducts(session.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sản Phẩm</h1>
          <p className="text-muted-foreground">{products.length} sản phẩm</p>
        </div>
        <Button asChild>
          <Link href="/vendor/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Thêm sản phẩm
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có sản phẩm</h3>
            <p className="text-muted-foreground mb-4">
              Bắt đầu bán hàng bằng cách thêm sản phẩm đầu tiên
            </p>
            <Button asChild>
              <Link href="/vendor/products/new">Thêm sản phẩm</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Link key={product.id} href={`/vendor/products/${product.id}/edit`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative h-20 w-20 rounded overflow-hidden bg-muted shrink-0">
                      {product.images[0] && (
                        <Image
                          src={product.images[0].url}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold truncate">
                            {product.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {product.category.name}
                          </p>
                        </div>
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                        >
                          {product.isActive ? "Đang bán" : "Ẩn"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="font-bold text-primary">
                          {formatPrice(product.variants[0]?.price || 0)}
                        </span>
                        <span className="text-sm text-muted-foreground">
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
