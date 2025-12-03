import Link from "next/link";
import Image from "next/image";
import { Store, Package, Search } from "lucide-react";

import { getPublicVendors } from "@/entities/vendor";
import { Card, CardContent } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

export default async function StoresPage() {
  const vendors = await getPublicVendors();

  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Cửa Hàng</h1>
        <p className="text-muted-foreground mt-2">
          Khám phá {vendors.length} cửa hàng đang hoạt động
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Tìm kiếm cửa hàng..." className="pl-10" />
        </div>
      </div>

      {vendors.length === 0 ? (
        <div className="py-16 text-center">
          <Store className="text-muted-foreground mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-lg font-semibold">Chưa có cửa hàng nào</h3>
          <p className="text-muted-foreground">Hãy quay lại sau nhé!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vendors.map((vendor) => (
            <Link key={vendor.id} href={`/stores/${vendor.id}`}>
              <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="bg-muted flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                      {vendor.logo ? (
                        <Image
                          src={vendor.logo}
                          alt={vendor.shopName}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Store className="text-muted-foreground h-8 w-8" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="group-hover:text-primary truncate font-semibold transition-colors">
                        {vendor.shopName}
                      </h3>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                        {vendor.description || "Chưa có mô tả"}
                      </p>
                      <div className="text-muted-foreground mt-2 flex items-center gap-1 text-sm">
                        <Package className="h-4 w-4" />
                        <span>{vendor.productCount} sản phẩm</span>
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
