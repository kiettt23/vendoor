"use client";

import { Package, ShoppingBag, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import Link from "next/link";
import { useCart } from "../hooks/useCart";
import { useCartStockValidation } from "../hooks/useCartStockValidation";
import { groupItemsByVendor } from "../lib/utils";
import { formatPrice } from "@/features/product/lib/utils";
import { CartItem } from "./CartItem";

// ============================================
// COMPONENT
// ============================================

/**
 * CartList - Display all cart items grouped by vendor
 *
 * Features:
 * - Group items by vendor (1 Order = 1 Vendor rule)
 * - Server-side stock validation (React Query)
 * - Show vendor subtotals
 * - Empty state with CTA
 * - Loading skeleton
 * - Error handling
 *
 * Architecture:
 * - Fetches items from Zustand (client state)
 * - Validates stock via React Query (server state)
 * - Hybrid approach (Q1 decision)
 */
export function CartList() {
  const items = useCart((state) => state.items);

  // Server-side stock validation (React Query)
  const {
    data: stockValidation,
    isLoading,
    isError,
  } = useCartStockValidation(items);

  // Group items by vendor
  const vendorGroups = groupItemsByVendor(items);

  // ============================================
  // EMPTY STATE
  // ============================================
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-4">
          <ShoppingBag className="h-24 w-24 text-muted-foreground/30" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Giỏ Hàng Trống</h3>
        <p className="text-muted-foreground mb-6">
          Chưa có sản phẩm nào trong giỏ hàng của bạn
        </p>
        <Button asChild>
          <Link href="/products">Khám Phá Sản Phẩm</Link>
        </Button>
      </div>
    );
  }

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Không thể xác minh tồn kho. Vui lòng thử lại sau.
        </AlertDescription>
      </Alert>
    );
  }

  // ============================================
  // STOCK VALIDATION WARNINGS
  // ============================================
  const hasStockWarnings = stockValidation?.hasWarnings;

  // Create validation lookup map
  const validationMap = new Map(
    stockValidation?.items.map((item) => [item.variantId, item])
  );

  // ============================================
  // RENDER CART ITEMS
  // ============================================
  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <Alert>
        <Package className="h-4 w-4" />
        <AlertDescription>
          Sản phẩm được nhóm theo cửa hàng. Mỗi đơn hàng chỉ chứa sản phẩm từ
          một cửa hàng.
        </AlertDescription>
      </Alert>

      {/* Stock Warning Alert */}
      {hasStockWarnings && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Một số sản phẩm không đủ hàng hoặc đã hết. Vui lòng kiểm tra lại
            trước khi thanh toán.
          </AlertDescription>
        </Alert>
      )}

      {/* Items Grouped by Vendor */}
      {vendorGroups.map((group, index) => (
        <div key={group.vendorId} className="space-y-4">
          {/* Vendor Header */}
          <div className="flex items-center justify-between pb-2 border-b">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{group.vendorName}</h3>
              <span className="text-sm text-muted-foreground">
                ({group.items.length} sản phẩm)
              </span>
            </div>

            {/* Vendor Subtotal */}
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tạm tính</p>
              <p className="font-semibold text-lg text-primary">
                {formatPrice(group.subtotal)}
              </p>
            </div>
          </div>

          {/* Items from this Vendor */}
          <div className="space-y-3">
            {group.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                stockValidation={validationMap.get(item.variantId)}
              />
            ))}
          </div>

          {/* Separator between vendors */}
          {index < vendorGroups.length - 1 && <Separator className="my-6" />}
        </div>
      ))}
    </div>
  );
}
