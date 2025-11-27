"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/shared/lib/utils/cn";

// ============================================
// PASSWORD INPUT COMPONENT
// ============================================

/**
 * Password Input với toggle hiển thị/ẩn password
 *
 * **Features:**
 * - Toggle button để show/hide password
 * - Icon eye/eye-off
 * - Kế thừa styling từ Input component
 */

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-brand-primary selection:text-white dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-md border-2 bg-transparent px-component py-tight pr-10 text-body shadow-sm transition-[border-color,box-shadow] duration-(--timing-fast) outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-body-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:border-brand-primary focus-visible:ring-brand-primary/20 focus-visible:ring-[3px]",
          "hover:border-brand-primary/50",
          "aria-invalid:ring-error/20 dark:aria-invalid:ring-error/40 aria-invalid:border-error aria-invalid:focus-visible:border-error aria-invalid:focus-visible:ring-error/20",
          className
        )}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
