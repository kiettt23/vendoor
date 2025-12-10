"use client";

import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface NotFoundPageProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  variant?: "fancy" | "simple";
  helpfulLinks?: Array<{ href: string; label: string }>;
}

export function NotFoundPage({
  icon,
  title = "Không tìm thấy trang",
  description = "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.",
  backHref = "/",
  backLabel = "Về trang chủ",
  variant = "simple",
  helpfulLinks,
}: NotFoundPageProps) {
  if (variant === "fancy") {
    return (
      <div className="flex min-h-screen items-center justify-center px-component relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="text-center max-w-lg space-y-content">
          <div className="flex justify-center mb-content">
            <div className="rounded-full bg-brand-primary/10 p-content animate-pulse">
              {icon || <FileQuestion className="size-16 text-brand-primary" />}
            </div>
          </div>

          <h1 className="text-[120px] font-bold leading-none bg-clip-text text-transparent bg-linear-to-r from-brand-primary to-brand-accent">
            404
          </h1>

          <h2 className="text-heading-xl font-bold">{title}</h2>

          <p className="text-body-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            {description}
          </p>

          <div className="flex gap-component justify-center pt-component">
            <Button size="lg" asChild>
              <Link href={backHref}>{backLabel}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Quay lại
            </Button>
          </div>

          {helpfulLinks && helpfulLinks.length > 0 && (
            <div className="pt-content text-body-sm text-muted-foreground">
              <p className="mb-tight">Hoặc thử các trang phổ biến:</p>
              <div className="flex gap-tight justify-center flex-wrap">
                {helpfulLinks.map((link, index) => (
                  <span key={link.href}>
                    {index > 0 && <span className="mx-1">•</span>}
                    <Link
                      href={link.href}
                      className="text-brand-primary hover:underline"
                    >
                      {link.label}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 text-center">
      {icon && (
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-muted p-6">{icon}</div>
        </div>
      )}
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {description}
      </p>
      <Button asChild>
        <Link href={backHref}>{backLabel}</Link>
      </Button>
    </div>
  );
}

const DEFAULT_HELPFUL_LINKS = [
  { href: "/products", label: "Sản phẩm" },
  { href: "/cart", label: "Giỏ hàng" },
  { href: "/login", label: "Đăng nhập" },
];

export function GlobalNotFoundPage() {
  return (
    <NotFoundPage
      variant="fancy"
      description="Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Hãy kiểm tra lại đường dẫn hoặc quay về trang chủ."
      helpfulLinks={DEFAULT_HELPFUL_LINKS}
    />
  );
}

