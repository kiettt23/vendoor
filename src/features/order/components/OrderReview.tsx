"use client";

import type { CartItem } from "@/features/cart/types";
import {
  groupItemsByVendor,
  calculateCartTotals,
} from "@/features/cart/lib/utils";
import { Separator } from "@/shared/components/ui/separator";
import { Badge } from "@/shared/components/ui/badge";
import { Store, Package, CreditCard } from "lucide-react";
import Image from "next/image";

// ============================================
// ORDER REVIEW COMPONENT
// ============================================

/**
 * Display order summary grouped by vendor
 *
 * **Features:**
 * - Group items by vendor
 * - Show item details (image, name, variant, price, quantity)
 * - Calculate totals (subtotal, shipping, platform fee, total)
 * - Explain multi-vendor checkout
 *
 * **Why separate component:**
 * - Reusable (can use in order confirmation)
 * - Clean separation (review vs form)
 */

interface OrderReviewProps {
  items: CartItem[];
}

export function OrderReview({ items }: OrderReviewProps) {
  const vendorGroups = groupItemsByVendor(items);
  const totals = calculateCartTotals(items);

  return (
    <div className="space-y-6">
      {/* Multi-vendor Notice */}
      {vendorGroups.length > 1 && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Store className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Đơn hàng từ {vendorGroups.length} cửa hàng
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Bạn sẽ nhận được {vendorGroups.length} đơn hàng riêng biệt từ
                các cửa hàng khác nhau. Mỗi cửa hàng sẽ xử lý và giao hàng độc
                lập.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Items Grouped by Vendor */}
      {vendorGroups.map((group, index) => (
        <div key={group.vendorId} className="space-y-4">
          {/* Vendor Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{group.vendorName}</span>
            </div>
            <Badge variant="outline">{group.items.length} sản phẩm</Badge>
          </div>

          {/* Vendor Items */}
          <div className="space-y-3">
            {group.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {item.productName}
                  </h4>
                  {item.variantName && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.variantName}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      x{item.quantity}
                    </span>
                    <span className="text-sm font-medium">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Separator between vendors */}
          {index < vendorGroups.length - 1 && <Separator className="my-4" />}
        </div>
      ))}

      <Separator className="my-6" />

      {/* Price Breakdown */}
      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Tạm tính ({totals.itemCount} sản phẩm)
            </span>
          </div>
          <span className="font-medium">
            {totals.subtotal.toLocaleString("vi-VN")}₫
          </span>
        </div>

        {/* Shipping Fee */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Phí vận chuyển ({vendorGroups.length} cửa hàng)
            </span>
          </div>
          <span className="font-medium">
            {totals.shippingFee.toLocaleString("vi-VN")}₫
          </span>
        </div>

        {/* Platform Fee */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Phí dịch vụ (2%)</span>
          </div>
          <span className="font-medium">
            {totals.platformFee.toLocaleString("vi-VN")}₫
          </span>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold">Tổng cộng</span>
          <span className="text-2xl font-bold text-primary">
            {totals.total.toLocaleString("vi-VN")}₫
          </span>
        </div>
      </div>
    </div>
  );
}
