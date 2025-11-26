import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-(--spacing-tight) py-1 text-caption font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-(--spacing-xs) [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,background-color,box-shadow] duration-(--timing-fast) overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-brand-primary text-white [a&]:hover:bg-brand-primary-hover",
        secondary:
          "border-transparent bg-brand-secondary/20 text-brand-secondary border-brand-secondary/30 [a&]:hover:bg-brand-secondary/30",
        destructive:
          "border-transparent bg-error text-white [a&]:hover:bg-error/90 focus-visible:ring-error/20 dark:focus-visible:ring-error/40",
        outline:
          "bg-background text-foreground [a&]:hover:bg-brand-primary/5 [a&]:hover:border-brand-primary [a&]:hover:text-brand-primary",
        // Semantic status variants (using design tokens)
        success:
          "border-transparent bg-success text-white [a&]:hover:opacity-90",
        warning:
          "border-transparent bg-warning text-white [a&]:hover:opacity-90",
        error: "border-transparent bg-error text-white [a&]:hover:opacity-90",
        info: "border-transparent bg-info text-white [a&]:hover:opacity-90",
        // Soft variants (for non-critical info)
        "success-soft":
          "border-success/30 bg-success-bg text-success [a&]:hover:bg-success-bg/80",
        "warning-soft":
          "border-warning/30 bg-warning-bg text-warning [a&]:hover:bg-warning-bg/80",
        "error-soft":
          "border-error/30 bg-error-bg text-error [a&]:hover:bg-error-bg/80",
        "info-soft":
          "border-info/30 bg-info-bg text-info [a&]:hover:bg-info-bg/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
