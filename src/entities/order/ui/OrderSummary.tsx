import { Separator } from "@/shared/ui/separator";
import { formatPrice } from "@/shared/lib";

interface OrderSummaryProps {
  subtotal: number;
  shippingFee: number;
  total: number;
  platformFee?: number;
  platformFeeRate?: number;
  vendorEarnings?: number;
  /**
   * Variant hiển thị:
   * - customer: Hiện subtotal, shipping, total
   * - vendor: Hiện subtotal, shipping, vendorEarnings, total
   * - admin: Hiện tất cả (bao gồm platformFee)
   */
  variant?: "customer" | "vendor" | "admin";
  className?: string;
}

export function OrderSummary({
  subtotal,
  shippingFee,
  total,
  platformFee,
  platformFeeRate,
  vendorEarnings,
  variant = "customer",
  className,
}: OrderSummaryProps) {
  return (
    <div className={className}>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Phí vận chuyển</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>

        {variant === "admin" && platformFee !== undefined && (
          <div className="flex justify-between text-sm text-blue-600">
            <span>
              Phí nền tảng
              {platformFeeRate !== undefined &&
                ` (${(platformFeeRate * 100).toFixed(0)}%)`}
            </span>
            <span>{formatPrice(platformFee)}</span>
          </div>
        )}

        {(variant === "vendor" || variant === "admin") &&
          vendorEarnings !== undefined && (
            <div className="flex justify-between text-sm text-green-600">
              <span>
                {variant === "vendor" ? "Thu nhập (sau phí nền tảng)" : "Vendor thu"}
              </span>
              <span>{formatPrice(vendorEarnings)}</span>
            </div>
          )}

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Tổng cộng</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
