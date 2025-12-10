"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/lib/constants";

interface ErrorPageProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
  showHome?: boolean;
  homeHref?: string;
  homeLabel?: string;
  className?: string;
}

export function ErrorPage({
  icon: Icon = AlertCircle,
  title = "Đã xảy ra lỗi",
  description = "Đã có lỗi xảy ra. Vui lòng thử lại.",
  error,
  reset,
  showHome = true,
  homeHref = "/",
  homeLabel = "Về trang chủ",
  className,
}: ErrorPageProps) {
  return (
    <div className={className ?? "p-6"}>
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <Icon className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-3">{title}</h2>

        <p className="text-muted-foreground mb-6">{description}</p>

        {process.env.NODE_ENV === "development" && error && (
          <details className="mb-6 p-4 bg-destructive/5 border border-destructive/20 rounded-lg text-left text-sm">
            <summary className="cursor-pointer font-medium">
              Chi tiết lỗi (dev only)
            </summary>
            <pre className="mt-2 overflow-auto text-xs">
              {error.message}
              {error.digest && `\nDigest: ${error.digest}`}
            </pre>
          </details>
        )}

        <div className="flex gap-3 justify-center">
          {reset && (
            <Button onClick={reset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Thử lại
            </Button>
          )}
          {showHome && (
            <Button variant={reset ? "outline" : "default"} asChild>
              <Link href={homeHref}>
                <Home className="mr-2 h-4 w-4" />
                {homeLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export function VendorErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      title="Không thể tải dashboard"
      description="Đã có lỗi xảy ra khi tải thông tin dashboard. Vui lòng thử lại."
      error={error}
      reset={reset}
    />
  );
}

export function AdminErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage
      title="Lỗi quản trị"
      description="Đã có lỗi xảy ra khi tải trang quản trị. Vui lòng thử lại."
      error={error}
      reset={reset}
      homeHref={ROUTES.ADMIN_DASHBOARD}
      homeLabel="Về Admin Dashboard"
    />
  );
}
