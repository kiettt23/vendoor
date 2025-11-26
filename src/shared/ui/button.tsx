import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-(--spacing-tight) whitespace-nowrap rounded-md text-body-sm font-medium transition-all duration-(--timing-base) disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-brand-primary text-white shadow-md hover:bg-brand-primary-hover hover:shadow-lg active:shadow-sm active:scale-[0.98]",
        destructive:
          "bg-error text-white shadow-md hover:bg-error/90 hover:shadow-lg active:shadow-sm active:scale-[0.98] focus-visible:ring-error/20 dark:focus-visible:ring-error/40",
        outline:
          "border-2 border-border bg-background shadow-sm hover:bg-brand-primary/5 hover:border-brand-primary hover:text-brand-primary active:scale-[0.98]",
        secondary:
          "bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20 hover:bg-brand-secondary/20 hover:border-brand-secondary/30 active:scale-[0.98]",
        ghost:
          "hover:bg-brand-primary/10 hover:text-brand-primary active:bg-brand-primary/20",
        link: "text-brand-primary underline-offset-4 hover:underline hover:text-brand-primary-hover",
      },
      size: {
        default:
          "h-10 px-(--spacing-component) py-(--spacing-tight) has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-(--spacing-xs) px-(--spacing-tight) text-body-sm has-[>svg]:px-2",
        lg: "h-12 rounded-md px-(--spacing-content) text-body-lg has-[>svg]:px-4",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
