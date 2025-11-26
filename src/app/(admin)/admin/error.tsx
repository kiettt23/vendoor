"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { createLogger } from "@/shared/lib/utils/logger";

const logger = createLogger("AdminError");

/**
 * Error boundary for admin panel
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Admin panel error caught by error boundary", error);
  }, [error]);

  return (
    <div className="p-6">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3">Không thể tải admin panel</h2>

        <p className="text-muted-foreground mb-6">
          Đã có lỗi xảy ra khi tải trang quản trị. Vui lòng thử lại.
        </p>

        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
