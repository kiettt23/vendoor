"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import {
  useCart,
  groupItemsByVendor,
  calculateCartTotals,
} from "@/entities/cart";
import { CartItemCard } from "@/features/cart";
import { formatPrice } from "@/shared/lib";

export default function CartPage() {
  const items = useCart((state) => state.items);
  const vendorGroups = groupItemsByVendor(items);
  const totals = calculateCartTotals(items);

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingCart className="h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
        <p className="text-muted-foreground mb-8">
          Hãy thêm sản phẩm vào giỏ hàng
        </p>
        <Button size="lg" asChild>
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tiếp tục mua sắm
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Giỏ Hàng ({totals.itemCount})</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {vendorGroups.map((group) => (
            <Card key={group.vendorId}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{group.vendorName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {group.items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Tóm Tắt Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Tạm tính ({totals.itemCount} sản phẩm)</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển ({totals.vendorCount} shop)</span>
                <span>{formatPrice(totals.shippingFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {formatPrice(totals.total)}
                </span>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href="/checkout">Tiến hành thanh toán</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
