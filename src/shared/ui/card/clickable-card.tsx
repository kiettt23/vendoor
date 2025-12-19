/**
 * ClickableCard - Reusable Card Wrapper với hover effects
 *
 * Card component có hover shadow effect và cursor pointer.
 * Dùng cho list items có thể click (products, orders, vendors, etc.)
 *
 * @example
 * ```tsx
 * <ClickableCard href="/products/123">
 *   <p>Product content...</p>
 * </ClickableCard>
 * ```
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { Card, CardContent } from "./card";
import { cn } from "@/shared/lib";

interface ClickableCardProps {
  href: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ClickableCard({
  href,
  children,
  className,
  contentClassName,
}: ClickableCardProps) {
  return (
    <Link href={href}>
      <Card
        className={cn(
          "hover:shadow-md transition-shadow cursor-pointer",
          className
        )}
      >
        <CardContent className={cn("p-3 sm:p-4", contentClassName)}>
          {children}
        </CardContent>
      </Card>
    </Link>
  );
}
