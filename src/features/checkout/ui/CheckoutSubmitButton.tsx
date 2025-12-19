"use client";

import { Loader2, ShoppingBag } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { formatPrice } from "@/shared/lib";

interface CheckoutSubmitButtonProps {
  isSubmitting: boolean;
  onSubmit: () => void;
  itemCount: number;
  total: number;
}

/**
 * Submit buttons cho checkout
 * - Desktop: Button full width trong form
 * - Mobile: Fixed bottom bar với total + button
 */
export function CheckoutSubmitButton({
  isSubmitting,
  onSubmit,
  itemCount,
  total,
}: CheckoutSubmitButtonProps) {
  const buttonContent = isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Đang xử lý...
    </>
  ) : (
    <>
      <ShoppingBag className="mr-2 h-4 w-4" />
      Đặt Hàng
    </>
  );

  return (
    <>
      {/* Desktop button */}
      <Button
        type="submit"
        size="lg"
        className="w-full hidden lg:flex"
        disabled={isSubmitting}
      >
        {buttonContent}
      </Button>

      {/* Mobile: Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 lg:hidden z-40">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Tổng cộng:</span>
          <span className="text-lg font-bold text-primary">
            {formatPrice(total)}
          </span>
        </div>
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Đặt Hàng ({itemCount})
            </>
          )}
        </Button>
      </div>
    </>
  );
}
