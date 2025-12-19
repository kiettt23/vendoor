/**
 * FormField - Reusable Form Field Wrapper
 *
 * Wraps Input/Textarea với Label và error message display.
 * Giảm boilerplate code trong form components.
 *
 * @example
 * ```tsx
 * <FormField
 *   label="Email"
 *   error={errors.email?.message}
 *   required
 * >
 *   <Input {...register("email")} type="email" />
 * </FormField>
 * ```
 */

import type { ReactNode } from "react";
import { Label } from "./label";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}

export function FormField({
  label,
  error,
  required,
  htmlFor,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-sm text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
