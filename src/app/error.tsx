"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ServerCrash } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

/**
 * Global error boundary
 * Catches all unhandled errors in the app
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ServerCrash className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-3">Đã xảy ra lỗi</h1>

        <p className="text-muted-foreground mb-2">
          Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại.
        </p>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 p-4 bg-muted rounded-lg text-left text-sm">
            <summary className="cursor-pointer font-semibold mb-2">
              Chi tiết lỗi (chỉ hiện trong dev mode)
            </summary>
            <pre className="whitespace-pre-wrap text-xs overflow-auto">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div className="mt-6 flex gap-3 justify-center">
          <Button onClick={reset}>Thử lại</Button>
          <Button variant="outline" asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>

        {error.digest && (
          <p className="mt-4 text-xs text-muted-foreground">
            Mã lỗi: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
