"use client";

import Link from "next/link";
import { cn } from "@/shared/lib/utils";
import { DoorOpen } from "lucide-react";

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
    container: "h-9 w-9 rounded-lg",
    icon: "h-5 w-5",
    text: "text-xl",
  },
  md: {
    container: "h-10 w-10 rounded-xl",
    icon: "h-6 w-6",
    text: "text-xl",
  },
  lg: {
    container: "h-11 w-11 rounded-xl",
    icon: "h-6 w-6",
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
        <DoorOpen className={cn("text-primary-foreground", config.icon)} />
      </div>
      {showText && (
        <span className={cn("font-bold tracking-tight", config.text)}>
          <span className="text-primary">Ven</span>
          <span>door</span>
        </span>
      )}
    </>
  );

  const containerClass = cn("flex items-center gap-2", className);

  if (asLink) {
    return (
      <Link
        href="/"
        className={containerClass}
        aria-label={!showText ? "Trang chủ Vendoor" : undefined}
      >
        {content}
      </Link>
    );
  }

  return <div className={containerClass}>{content}</div>;
}
