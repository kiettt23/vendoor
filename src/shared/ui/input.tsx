import * as React from "react";

import { cn } from "@/shared/lib/utils/cn";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-brand-primary selection:text-white dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-md border-2 bg-transparent px-(--spacing-component) py-(--spacing-tight) text-body shadow-sm transition-[border-color,box-shadow] duration-(--timing-fast) outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-body-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-[3px]",
        "hover:border-brand-primary/50",
        "aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error aria-invalid:focus-visible:border-error aria-invalid:focus-visible:ring-error/20",
        className
      )}
      {...props}
    />
  );
}

export { Input };
