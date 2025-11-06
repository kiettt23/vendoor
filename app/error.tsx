"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OctagonXIcon, RefreshCwIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { vi } from "@/lib/i18n";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50 px-6">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-16 pb-12 text-center">
          {/* Error Icon */}
          <div className="relative mb-8 flex justify-center">
            <div className="relative">
              <OctagonXIcon
                className="size-24 text-red-500"
                strokeWidth={1.5}
              />
              <div className="absolute inset-0 blur-3xl opacity-20 bg-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Đã có lỗi xảy ra!
          </h1>
          <p className="text-slate-600 mb-2 max-w-md mx-auto">
            Rất tiếc, đã có lỗi xảy ra khi xử lý yêu cầu của bạn.
          </p>
          <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
            Vui lòng thử lại hoặc quay về trang chủ.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg max-w-md mx-auto">
              <p className="text-xs text-red-800 font-mono text-left break-words">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={reset} size="lg" className="gap-2">
              <RefreshCwIcon size={18} />
              {vi.common.yes}, thử lại
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/">
                <HomeIcon size={18} />
                {vi.common.goHome}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
