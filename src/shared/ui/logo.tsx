"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface LogoProps {
  /** Kích thước logo: sm (auth), md (mobile menu), lg (header) */
  size?: "sm" | "md" | "lg";
  /** Có hiện text "Vendoor" không */
  showText?: boolean;
  /** Có link về trang chủ không */
  asLink?: boolean;
  /** Custom className cho container */
  className?: string;
}

const sizeConfig = {
  sm: {
    container: "h-8 w-8 rounded-lg",
    icon: "h-4 w-4",
    text: "text-xl",
  },
  md: {
    container: "h-9 w-9 rounded-xl",
    icon: "h-5 w-5",
    text: "text-xl",
  },
  lg: {
    container: "h-10 w-10 rounded-xl",
    icon: "h-5 w-5",
    text: "text-2xl",
  },
};

export function Logo({
  size = "md",
  showText = true,
  asLink = true,
  className,
}: LogoProps) {
  const config = sizeConfig[size];

  const content = (
    <>
      <div
        className={cn(
          "bg-primary flex items-center justify-center",
          config.container
        )}
      >
        <ShoppingBag className={cn("text-primary-foreground", config.icon)} />
      </div>
      {showText && (
        <span className={cn("font-bold", config.text)}>Vendoor</span>
      )}
    </>
  );

  const containerClass = cn("flex items-center gap-2", className);

  if (asLink) {
    return (
      <Link href="/" className={containerClass}>
        {content}
      </Link>
    );
  }

  return <div className={containerClass}>{content}</div>;
}
