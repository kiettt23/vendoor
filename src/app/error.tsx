"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ServerCrash, RefreshCw, Home } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { createLogger } from "@/shared/lib/utils/logger";

const logger = createLogger("GlobalError");

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
    logger.error("Unhandled error caught by error boundary", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-(--spacing-component) relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-error/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-warning/5 rounded-full blur-3xl" />
      </div>

      <div className="text-center max-w-lg space-y-(--spacing-content)">
        {/* Icon */}
        <div className="flex justify-center mb-(--spacing-component)">
          <div className="rounded-full bg-error/10 p-(--spacing-content) animate-pulse">
            <ServerCrash className="size-16 text-error" />
          </div>
        </div>

        {/* Error Badge */}
        <div className="flex justify-center">
          <Badge variant="error-soft">Lỗi hệ thống</Badge>
        </div>

        {/* Title */}
        <h1 className="text-heading-xl font-bold">Đã xảy ra lỗi</h1>

        {/* Description */}
        <p className="text-body-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          Rất tiếc, đã có lỗi không mong muốn xảy ra. 
          Chúng tôi đã ghi nhận và sẽ khắc phục sớm nhất.
        </p>

        {/* Dev Error Details */}
        {process.env.NODE_ENV === "development" && (
          <details className="p-(--spacing-component) bg-error-bg border-2 border-error/20 rounded-lg text-left">
            <summary className="cursor-pointer font-semibold text-body mb-(--spacing-tight) text-error">
              Chi tiết lỗi (dev mode only)
            </summary>
            <div className="space-y-(--spacing-tight) text-caption">
              <div>
                <p className="font-semibold text-muted-foreground">Message:</p>
                <pre className="whitespace-pre-wrap text-error">{error.message}</pre>
              </div>
              {error.digest && (
                <div>
                  <p className="font-semibold text-muted-foreground">Digest:</p>
                  <code className="text-error">{error.digest}</code>
                </div>
              )}
              {error.stack && (
                <div>
                  <p className="font-semibold text-muted-foreground">Stack:</p>
                  <pre className="whitespace-pre-wrap text-xs text-muted-foreground overflow-auto max-h-40">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Actions */}
        <div className="flex gap-(--spacing-component) justify-center pt-(--spacing-component)">
          <Button size="lg" onClick={reset}>
            <RefreshCw className="size-4" />
            Thử lại
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/">
              <Home className="size-4" />
              Về trang chủ
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-body-sm text-muted-foreground pt-(--spacing-component)">
          Nếu lỗi vẫn tiếp diễn, vui lòng{" "}
          <a href="mailto:support@vendoor.com" className="text-brand-primary hover:underline">
            liên hệ hỗ trợ
          </a>
        </p>

        {error.digest && (
          <p className="mt-4 text-xs text-muted-foreground">
            Mã lỗi: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
