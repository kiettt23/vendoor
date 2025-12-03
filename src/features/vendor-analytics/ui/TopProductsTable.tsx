"use client";

import Link from "next/link";
import { Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { formatPrice } from "@/shared/lib/utils";

import type { ProductPerformance } from "../model/types";

interface TopProductsTableProps {
  products: ProductPerformance[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm bán chạy</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center text-muted-foreground">
          Chưa có dữ liệu
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="size-5" />
          Sản phẩm bán chạy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product, index) => (
          <Link
            key={product.productId}
            href={`/vendor/products/${product.productId}/edit`}
            className="flex items-center gap-4 rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {index + 1}
            </span>
            {product.image ? (
              <OptimizedImage
                src={product.image}
                alt={product.productName}
                width={48}
                height={48}
                className="size-12 rounded object-cover"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded bg-muted">
                <Package className="size-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate font-medium">{product.productName}</p>
              <p className="text-sm text-muted-foreground">
                Đã bán: {product.totalSold}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">
                {formatPrice(product.totalRevenue)}
              </p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
