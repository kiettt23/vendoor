"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { createLogger } from "@/shared/lib/utils/logger";

const logger = createLogger("CheckoutError");

/**
 * Error boundary for checkout page
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Checkout error caught by error boundary", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3">Không thể xử lý thanh toán</h2>

        <p className="text-muted-foreground mb-6">
          Đã có lỗi xảy ra trong quá trình thanh toán. Đơn hàng của bạn chưa
          được tạo.
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" asChild>
            <Link href="/cart">Quay về giỏ hàng</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
