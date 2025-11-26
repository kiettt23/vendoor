"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/shared/ui/button";

/**
 * Global 404 page
 * Shown when no route matches
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-(--spacing-component) relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="text-center max-w-lg space-y-(--spacing-content)">
        {/* Icon */}
        <div className="flex justify-center mb-(--spacing-content)">
          <div className="rounded-full bg-brand-primary/10 p-(--spacing-content) animate-pulse">
            <FileQuestion className="size-16 text-brand-primary" />
          </div>
        </div>

        {/* 404 Number */}
        <h1 className="text-[120px] font-bold leading-none bg-clip-text text-transparent bg-linear-to-r from-brand-primary to-brand-accent">
          404
        </h1>

        {/* Title */}
        <h2 className="text-heading-xl font-bold">Không tìm thấy trang</h2>

        {/* Description */}
        <p className="text-body-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Hãy kiểm
          tra lại đường dẫn hoặc quay về trang chủ.
        </p>

        {/* Actions */}
        <div className="flex gap-(--spacing-component) justify-center pt-(--spacing-component)">
          <Button size="lg" asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Quay lại
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="pt-(--spacing-content) text-body-sm text-muted-foreground">
          <p className="mb-(--spacing-tight)">Hoặc thử các trang phổ biến:</p>
          <div className="flex gap-(--spacing-tight) justify-center flex-wrap">
            <Link
              href="/products"
              className="text-brand-primary hover:underline"
            >
              Sản phẩm
            </Link>
            <span>•</span>
            <Link href="/cart" className="text-brand-primary hover:underline">
              Giỏ hàng
            </Link>
            <span>•</span>
            <Link href="/login" className="text-brand-primary hover:underline">
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
