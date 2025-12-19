"use client";

import { OptimizedImage } from "@/shared/ui/optimized-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { OrderSummary } from "@/entities/order";
import { formatPrice } from "@/shared/lib";
import type { CartItem, VendorGroup, CartTotals } from "@/entities/cart";

interface CheckoutOrderSummaryProps {
  vendorGroups: VendorGroup[];
  totals: CartTotals;
}

/**
 * Order summary section cho checkout page
 * Hiển thị danh sách items grouped by vendor + tổng tiền
 */
export function CheckoutOrderSummary({
  vendorGroups,
  totals,
}: CheckoutOrderSummaryProps) {
  return (
    <Card className="lg:sticky lg:top-24">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">
          Đơn Hàng ({totals.itemCount} sản phẩm)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {vendorGroups.map((group) => (
          <VendorGroupItems key={group.vendorId} group={group} />
        ))}
        <div className="space-y-2 pt-2">
          <OrderSummary
            subtotal={totals.subtotal}
            shippingFee={totals.shippingFee}
            total={totals.total}
            variant="customer"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function VendorGroupItems({ group }: { group: VendorGroup }) {
  return (
    <div className="space-y-2 sm:space-y-3">
      <p className="font-semibold text-sm">{group.vendorName}</p>
      {group.items.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}
      <Separator />
    </div>
  );
}

function CartItemRow({ item }: { item: CartItem }) {
  return (
    <div className="flex gap-2 sm:gap-3">
      <div className="relative h-12 w-12 sm:h-16 sm:w-16 rounded overflow-hidden bg-muted shrink-0">
        <OptimizedImage src={item.image} alt="" fill className="object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-semibold line-clamp-1">
          {item.productName}
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground">
          x{item.quantity}
        </p>
        <p className="text-xs sm:text-sm font-semibold">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  );
}
