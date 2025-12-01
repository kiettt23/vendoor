/**
 * Form Validation Utilities
 *
 * Enhanced form handling with Vietnamese error messages.
 * Usage: import { formatZodErrors, ValidationMessages } from "@/lib/validation"
 */

import { REGEX_PATTERNS } from "@/shared/lib/constants";
import type { UseFormReturn, FieldErrors, FieldPath } from "react-hook-form";
import type { ZodError } from "zod";

/**
 * Format Zod validation errors for React Hook Form
 *
 * @example
 * const result = schema.safeParse(data);
 * if (!result.success) {
 *   const errors = formatZodErrors(result.error);
 *   // Set errors in form
 * }
 */
export function formatZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};

  error.issues.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });

  return errors;
}

/**
 * Get first error message from form errors
 */
export function getFirstError(errors: FieldErrors): string | undefined {
  const firstErrorKey = Object.keys(errors)[0];
  if (!firstErrorKey) return undefined;

  const error = errors[firstErrorKey];
  return error?.message as string | undefined;
}

/**
 * Check if form has errors
 */
export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/**
 * Get error message for a specific field
 */
export function getFieldError<T extends Record<string, unknown>>(
  errors: FieldErrors<T>,
  field: FieldPath<T>
): string | undefined {
  const error = errors[field];
  return error?.message as string | undefined;
}

/**
 * Validate field on blur
 */
export function validateOnBlur<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  field: FieldPath<T>
) {
  return async () => {
    await form.trigger(field);
  };
}

/**
 * Clear errors for specific fields
 */
export function clearFieldErrors<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  fields: FieldPath<T>[]
) {
  fields.forEach((field) => {
    form.clearErrors(field);
  });
}

/**
 * Custom validation messages (Vietnamese)
 */
export const ValidationMessages = {
  required: (field: string) => `${field} là bắt buộc`,
  email: "Email không hợp lệ",
  min: (field: string, min: number) => `${field} phải có ít nhất ${min} ký tự`,
  max: (field: string, max: number) =>
    `${field} không được vượt quá ${max} ký tự`,
  minValue: (field: string, min: number) =>
    `${field} phải lớn hơn hoặc bằng ${min}`,
  maxValue: (field: string, max: number) =>
    `${field} phải nhỏ hơn hoặc bằng ${max}`,
  pattern: (field: string) => `${field} không đúng định dạng`,
  phone: "Số điện thoại không hợp lệ",
  url: "URL không hợp lệ",
  match: (field1: string, field2: string) =>
    `${field1} và ${field2} không khớp`,
  unique: (field: string) => `${field} đã tồn tại`,
  weakPassword:
    "Mật khẩu quá yếu. Cần có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
};

/**
 * Validate phone number (Vietnam)
 */
export function validatePhone(phone: string): boolean {
  return REGEX_PATTERNS.PHONE_VN.test(phone);
}

/**
 * Validate email
 */
export function validateEmail(email: string): boolean {
  return REGEX_PATTERNS.EMAIL.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): boolean {
  return REGEX_PATTERNS.PASSWORD.test(password);
}

/**
 * Validate slug
 */
export function validateSlug(slug: string): boolean {
  return REGEX_PATTERNS.SLUG.test(slug);
}

/**
 * Create Zod refinement for unique check
 *
 * @example
 * const schema = z.object({
 *   email: z.string().email().refine(
 *     uniqueCheck(async (email) => {
 *       const exists = await checkEmailExists(email);
 *       return !exists;
 *     }),
 *     { message: "Email đã tồn tại" }
 *   )
 * })
 */
export function uniqueCheck<T>(
  checkFn: (value: T) => Promise<boolean>
): (value: T) => Promise<boolean> {
  return async (value: T) => {
    try {
      return await checkFn(value);
    } catch {
      return true; // Allow on error (will show network error instead)
    }
  };
}

/**
 * Debounce validation
 */
export function debounceValidation(
  fn: (...args: unknown[]) => void,
  delay: number = 300
) {
  let timeoutId: NodeJS.Timeout;

  return (...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
