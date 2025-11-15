"use client";

import { useCart } from "@/features/cart/hooks/useCart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CheckoutForm } from "./CheckoutForm";
import { OrderReview } from "./OrderReview";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ============================================
// CHECKOUT PAGE COMPONENT
// ============================================

/**
 * Main checkout page component
 *
 * **Flow:**
 * 1. Check cart not empty
 * 2. Show OrderReview (left) + CheckoutForm (right)
 * 3. On submit → Create orders → Redirect to success
 *
 * **Why client component:**
 * - Need useCart hook (Zustand)
 * - Form submission handling
 * - Router navigation
 */
export function CheckoutPage() {
  const router = useRouter();
  const items = useCart((state) => state.items);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // ============================================
  // REDIRECT IF CART EMPTY (but not during checkout)
  // ============================================
  useEffect(() => {
    // Skip redirect if currently submitting checkout
    if (items.length === 0 && !isCheckingOut) {
      router.push("/cart");
    }
  }, [items, router, isCheckingOut]);

  // ============================================
  // EMPTY STATE
  // ============================================
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // ============================================
  // CHECKOUT LAYOUT
  // ============================================
  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Thanh Toán</h1>
        <p className="text-muted-foreground">
          Điền thông tin giao hàng để hoàn tất đơn hàng
        </p>
      </div>

      {/* 2-Column Grid: Review + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT: Order Review */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Đơn Hàng Của Bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderReview items={items} />
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Checkout Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông Tin Giao Hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutForm
                items={items}
                onCheckoutStart={() => setIsCheckingOut(true)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
