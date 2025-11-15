"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, CreditCard, Info, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { useCart } from "../hooks/useCart";
import { useCartStockValidation } from "../hooks/useCartStockValidation";
import { calculateCartTotals, SHIPPING_FEE_PER_VENDOR } from "../lib/utils";
import { formatPrice } from "@/features/product/lib/utils";

// ============================================
// COMPONENT
// ============================================

/**
 * CartSummary - Order summary sidebar with checkout button
 *
 * Features:
 * - Subtotal, shipping, platform fee breakdown
 * - Dynamic shipping (per vendor)
 * - Checkout button
 * - Disable checkout if stock issues
 * - Payment method info
 * - Tooltip explanations
 *
 * Architecture:
 * - Reads from Zustand (client state)
 * - Checks React Query validation (server state)
 * - Blocks checkout if hasWarnings
 */
export function CartSummary() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const { data: stockValidation } = useCartStockValidation(items);

  // Calculate totals
  const totals = calculateCartTotals(items);

  // Check if can checkout
  const hasStockIssues = stockValidation?.hasWarnings ?? false;
  const canCheckout = items.length > 0 && !hasStockIssues;

  const handleCheckout = () => {
    if (!canCheckout) return;
    router.push("/checkout");
  };

  // Don't render if cart is empty
  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="sticky top-4 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Tóm tắt đơn hàng
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Details */}
        <div className="space-y-3 text-sm">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">
              Tạm tính ({totals.itemCount} sản phẩm)
            </span>
            <span className="font-medium">{formatPrice(totals.subtotal)}</span>
          </div>

          {/* Shipping Fee */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Phí vận chuyển</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">
                      {formatPrice(SHIPPING_FEE_PER_VENDOR)} ×{" "}
                      {totals.vendorCount} cửa hàng
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium">
              {formatPrice(totals.shippingFee)}
            </span>
          </div>

          {/* Platform Fee */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Phí dịch vụ</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">2% phí nền tảng</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium">
              {formatPrice(totals.platformFee)}
            </span>
          </div>

          <Separator className="my-3" />

          {/* Total */}
          <div className="flex justify-between items-center font-semibold text-base">
            <span>Tổng cộng</span>
            <span className="text-2xl text-primary">
              {formatPrice(totals.total)}
            </span>
          </div>
        </div>

        {/* Stock Warning */}
        {hasStockIssues && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2 text-sm">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <p className="text-destructive font-medium">
                Không thể thanh toán do một số sản phẩm không đủ hàng. Vui lòng
                cập nhật số lượng.
              </p>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={!canCheckout}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          {hasStockIssues ? "Không thể thanh toán" : "Tiến hành thanh toán"}
        </Button>

        {/* Payment Info */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Phương thức thanh toán:</p>
              <Badge variant="outline" className="text-xs">
                VNPay
              </Badge>
              <p className="mt-2">Hỗ trợ: ATM, Visa, MasterCard, QR Code</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
