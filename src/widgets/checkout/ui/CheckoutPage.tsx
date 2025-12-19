"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/shared/lib/constants";
import { Button } from "@/shared/ui/button";
import { EmptyCart } from "@/shared/ui/feedback";
import { useCart, groupItemsByVendor, calculateCartTotals } from "@/entities/cart";
import {
  CheckoutForm,
  PaymentMethodSelect,
  CheckoutSubmitButton,
  useCheckoutForm,
} from "@/features/checkout";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";

/**
 * Checkout Page Widget
 *
 * Compose từ:
 * - features/checkout: Form, PaymentMethodSelect, SubmitButton, useCheckoutForm
 * - entities/cart: Cart state, calculations
 * - entities/order: OrderSummary
 *
 * Responsibilities:
 * - Layout orchestration
 * - Empty state handling
 * - Responsive design (mobile bottom bar vs desktop)
 */
export function CheckoutPage() {
  const items = useCart((state) => state.items);
  const { form, isSubmitting, onSubmit } = useCheckoutForm();

  // Early return for empty cart
  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 flex items-center justify-center">
        <EmptyCart />
      </div>
    );
  }

  const vendorGroups = groupItemsByVendor(items);
  const totals = calculateCartTotals(items);

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4 max-w-6xl pb-24 lg:pb-8">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="mb-4 sm:mb-6">
        <Link href={ROUTES.CART}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại giỏ hàng
        </Link>
      </Button>

      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Thanh Toán</h1>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Order Summary - Show first on mobile, second on desktop */}
        <div className="lg:order-2">
          <CheckoutOrderSummary vendorGroups={vendorGroups} totals={totals} />
        </div>

        {/* Form - Show second on mobile, first on desktop */}
        <div className="lg:order-1">
          <form onSubmit={onSubmit} className="space-y-6">
            <CheckoutForm form={form} />
            <PaymentMethodSelect form={form} />
            <CheckoutSubmitButton
              isSubmitting={isSubmitting}
              onSubmit={onSubmit}
              itemCount={totals.itemCount}
              total={totals.total}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
