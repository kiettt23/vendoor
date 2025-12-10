"use client";

import Link from "next/link";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { EmptyCart } from "@/shared/ui/feedback";
import { ROUTES } from "@/shared/lib/constants";
import {
  useCart,
  useCartStock,
  groupItemsByVendor,
  calculateCartTotals,
} from "@/entities/cart";
import { CartItemCard } from "@/features/cart";
import { formatPrice } from "@/shared/lib";

export default function CartPage() {
  const items = useCart((state) => state.items);
  useCartStock(); // Auto-sync stock từ database
  const vendorGroups = groupItemsByVendor(items);
  const totals = calculateCartTotals(items);

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 px-4 min-h-[60vh] flex items-center justify-center">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 max-w-6xl">
      <div className="mb-6 sm:mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href={ROUTES.PRODUCTS}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tiếp tục mua sắm
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold">Giỏ Hàng ({totals.itemCount})</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {vendorGroups.map((group) => (
            <Card key={group.vendorId}>
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="text-base sm:text-lg">{group.vendorName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                {group.items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <Card className="sticky top-20 sm:top-24">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg">Tóm Tắt Đơn Hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 px-4 sm:px-6">
              <div className="flex justify-between text-sm">
                <span>Tạm tính ({totals.itemCount} sản phẩm)</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển ({totals.vendorCount} shop)</span>
                <span>{formatPrice(totals.shippingFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base sm:text-lg">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {formatPrice(totals.total)}
                </span>
              </div>
              <Button className="w-full" size="lg" asChild>
                <Link href={ROUTES.CHECKOUT}>Tiến hành thanh toán</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
