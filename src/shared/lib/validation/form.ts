import { REGEX_PATTERNS } from "@/shared/lib/constants";
import type { UseFormReturn, FieldErrors, FieldPath } from "react-hook-form";
import type { ZodError, ZodType } from "zod";

/** Lấy error message đầu tiên từ Zod validation error */
export function getZodFirstError(
  error: ZodError,
  fallback = "Dữ liệu không hợp lệ"
): string {
  return error.issues[0]?.message || fallback;
}

/** Parse data với schema, trả về data hoặc error message */
export function safeParseWithError<T>(
  schema: ZodType<T>,
  data: unknown,
  fallback = "Dữ liệu không hợp lệ"
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: getZodFirstError(result.error, fallback) };
}

/** Convert Zod errors thành object { fieldPath: message } cho React Hook Form */
export function formatZodErrors(error: ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}

/** Lấy error message đầu tiên từ form errors */
export function getFirstError(errors: FieldErrors): string | undefined {
  const firstKey = Object.keys(errors)[0];
  return firstKey ? (errors[firstKey]?.message as string) : undefined;
}

/** Check form có errors không */
export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

/** Lấy error message cho 1 field cụ thể */
export function getFieldError<T extends Record<string, unknown>>(
  errors: FieldErrors<T>,
  field: FieldPath<T>
): string | undefined {
  return errors[field]?.message as string | undefined;
}

/** Tạo handler validate field khi blur */
export function validateOnBlur<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  field: FieldPath<T>
) {
  return () => form.trigger(field);
}

/** Clear errors cho nhiều fields */
export function clearFieldErrors<T extends Record<string, unknown>>(
  form: UseFormReturn<T>,
  fields: FieldPath<T>[]
) {
  fields.forEach((field) => form.clearErrors(field));
}

/** Vietnamese validation messages */
export const ValidationMessages = {
  required: (field: string) => `${field} là bắt buộc`,
  email: "Email không hợp lệ",
  phone: "Số điện thoại không hợp lệ",
  url: "URL không hợp lệ",
  min: (field: string, min: number) => `${field} phải có ít nhất ${min} ký tự`,
  max: (field: string, max: number) =>
    `${field} không được vượt quá ${max} ký tự`,
  minValue: (field: string, min: number) =>
    `${field} phải lớn hơn hoặc bằng ${min}`,
  maxValue: (field: string, max: number) =>
    `${field} phải nhỏ hơn hoặc bằng ${max}`,
  pattern: (field: string) => `${field} không đúng định dạng`,
  match: (field1: string, field2: string) =>
    `${field1} và ${field2} không khớp`,
  unique: (field: string) => `${field} đã tồn tại`,
  weakPassword:
    "Mật khẩu quá yếu. Cần có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số",
} as const;

/** Validate phone Vietnam (0xxxxxxxxx) */
export const validatePhone = (phone: string) =>
  REGEX_PATTERNS.PHONE_VN.test(phone);

/** Validate email format */
export const validateEmail = (email: string) =>
  REGEX_PATTERNS.EMAIL.test(email);

/** Validate password strength */
export const validatePassword = (password: string) =>
  REGEX_PATTERNS.PASSWORD.test(password);

/** Validate slug format */
export const validateSlug = (slug: string) => REGEX_PATTERNS.SLUG.test(slug);

/**
 * Wrapper cho async unique check trong Zod refine
 * @example
 * z.string().refine(uniqueCheck(checkEmailExists), { message: "Email đã tồn tại" })
 */
export function uniqueCheck<T>(
  checkFn: (value: T) => Promise<boolean>
): (value: T) => Promise<boolean> {
  return async (value: T) => {
    try {
      return await checkFn(value);
    } catch {
      return true; // Allow on error để hiện network error thay vì validation error
    }
  };
}

/** Debounce function cho validation real-time */
export function debounceValidation<T extends unknown[]>(
  fn: (...args: T) => void,
  delay = 300
) {
  let timeoutId: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
