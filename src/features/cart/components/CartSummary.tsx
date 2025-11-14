"use client";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { formatPrice } from "@/features/product/lib/utils";

// ============================================
// TYPES
// ============================================

interface CartSummaryProps {
  subtotal: number;
  itemCount: number;
  onCheckout: () => void;
}

// ============================================
// COMPONENT
// ============================================

/**
 * Cart summary sidebar
 * - Subtotal, shipping, platform fee calculations
 * - Checkout button
 *
 * TODO: Add shipping fee, platform fee calculations
 */
export function CartSummary({
  subtotal,
  itemCount,
  onCheckout,
}: CartSummaryProps) {
  // Placeholder fees (TODO: Calculate dynamically)
  const shippingFee = 30000;
  const platformFee = Math.round(subtotal * 0.02); // 2% platform commission
  const total = subtotal + shippingFee + platformFee;

  return (
    <Card className="p-6 sticky top-4">
      <h3 className="font-semibold text-lg mb-4">Tóm tắt đơn hàng</h3>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Tạm tính ({itemCount} sản phẩm)
          </span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Phí dịch vụ</span>
          <span>{formatPrice(platformFee)}</span>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-between font-semibold text-base">
          <span>Tổng cộng</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      <Button className="w-full mt-6" size="lg" onClick={onCheckout}>
        Tiến hành thanh toán
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Bạn sẽ thanh toán qua VNPay
      </p>
    </Card>
  );
}
