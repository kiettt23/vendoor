"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("CartError");

/**
 * Error boundary for cart page
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Cart error caught by error boundary", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3">Không thể tải giỏ hàng</h2>

        <p className="text-muted-foreground mb-6">
          Đã có lỗi xảy ra khi tải giỏ hàng của bạn. Vui lòng thử lại.
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" asChild>
            <Link href="/products">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
