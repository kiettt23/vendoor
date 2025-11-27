import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90",
        outline:
          "bg-background text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        // Semantic status variants
        success:
          "border-transparent bg-green-500 text-white [a&]:hover:bg-green-600",
        warning:
          "border-transparent bg-yellow-500 text-white [a&]:hover:bg-yellow-600",
        error: "border-transparent bg-red-500 text-white [a&]:hover:bg-red-600",
        info: "border-transparent bg-blue-500 text-white [a&]:hover:bg-blue-600",
        // Soft variants
        "success-soft":
          "border-green-200 bg-green-50 text-green-700 [a&]:hover:bg-green-100",
        "warning-soft":
          "border-yellow-200 bg-yellow-50 text-yellow-700 [a&]:hover:bg-yellow-100",
        "error-soft":
          "border-red-200 bg-red-50 text-red-700 [a&]:hover:bg-red-100",
        "info-soft":
          "border-blue-200 bg-blue-50 text-blue-700 [a&]:hover:bg-blue-100",
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
