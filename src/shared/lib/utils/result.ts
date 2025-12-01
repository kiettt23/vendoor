/**
 * Result Type - Unified Error Handling
 *
 * Pattern để xử lý kết quả action một cách nhất quán.
 * Tránh throw error và try-catch scattered khắp nơi.
 *
 * @example
 * // Trong action
 * export async function createProduct(data): Promise<Result<string>> {
 *   if (!valid) return err("Invalid data");
 *   const id = await db.create(data);
 *   return ok(id);
 * }
 *
 * // Trong component
 * const result = await createProduct(data);
 * if (!result.success) {
 *   toast.error(result.error);
 *   return;
 * }
 * redirect(`/products/${result.data}`);
 */

// ============================================
// Types
// ============================================

export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E };

export type AsyncResult<T, E = string> = Promise<Result<T, E>>;

// Result không cần trả data (chỉ cần success/fail)
export type VoidResult<E = string> = Result<void, E>;
export type AsyncVoidResult<E = string> = Promise<VoidResult<E>>;

// ============================================
// Constructors
// ============================================

/**
 * Tạo Result thành công với data
 */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Tạo Result thành công không có data
 */
export function okVoid(): VoidResult<never> {
  return { success: true, data: undefined };
}

/**
 * Tạo Result thất bại với error message
 */
export function err<E = string>(error: E): Result<never, E> {
  return { success: false, error };
}

// ============================================
// Utilities
// ============================================

/**
 * Wrap async function trong try-catch và trả về Result
 */
export async function tryCatch<T>(
  fn: () => Promise<T>,
  errorMessage = "Đã có lỗi xảy ra"
): AsyncResult<T> {
  try {
    const data = await fn();
    return ok(data);
  } catch (error) {
    console.error(error);
    return err(errorMessage);
  }
}

/**
 * Kiểm tra Result có phải Ok không (type guard)
 */
export function isOk<T, E>(
  result: Result<T, E>
): result is { success: true; data: T } {
  return result.success;
}

/**
 * Kiểm tra Result có phải Err không (type guard)
 */
export function isErr<T, E>(
  result: Result<T, E>
): result is { success: false; error: E } {
  return !result.success;
}
