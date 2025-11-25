/**
 * API Error Handling Utilities
 * Centralized error handling for Server Actions and API routes
 */

import { toast } from "sonner";
import { createLogger } from "./logger";

/**
 * Standard API error response
 */
export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * Standard API success response
 */
export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

/**
 * Error codes for different error types
 */
export const ErrorCodes = {
  // Authentication errors
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  SESSION_EXPIRED: "SESSION_EXPIRED",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",

  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",

  // Database errors
  DATABASE_ERROR: "DATABASE_ERROR",
  CONSTRAINT_VIOLATION: "CONSTRAINT_VIOLATION",

  // Business logic errors
  INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK",
  CART_EMPTY: "CART_EMPTY",
  ORDER_ALREADY_PAID: "ORDER_ALREADY_PAID",

  // External service errors
  PAYMENT_ERROR: "PAYMENT_ERROR",
  UPLOAD_ERROR: "UPLOAD_ERROR",

  // Generic errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

/**
 * Error messages mapping
 */
export const ErrorMessages: Record<string, string> = {
  // Auth
  [ErrorCodes.UNAUTHORIZED]: "Bạn cần đăng nhập để thực hiện hành động này",
  [ErrorCodes.FORBIDDEN]: "Bạn không có quyền thực hiện hành động này",
  [ErrorCodes.SESSION_EXPIRED]:
    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại",

  // Validation
  [ErrorCodes.VALIDATION_ERROR]: "Dữ liệu không hợp lệ",
  [ErrorCodes.INVALID_INPUT]: "Thông tin nhập vào không đúng",

  // Resources
  [ErrorCodes.NOT_FOUND]: "Không tìm thấy dữ liệu",
  [ErrorCodes.ALREADY_EXISTS]: "Dữ liệu đã tồn tại",

  // Database
  [ErrorCodes.DATABASE_ERROR]: "Lỗi cơ sở dữ liệu",
  [ErrorCodes.CONSTRAINT_VIOLATION]: "Vi phạm ràng buộc dữ liệu",

  // Business
  [ErrorCodes.INSUFFICIENT_STOCK]: "Sản phẩm không đủ số lượng",
  [ErrorCodes.CART_EMPTY]: "Giỏ hàng trống",
  [ErrorCodes.ORDER_ALREADY_PAID]: "Đơn hàng đã được thanh toán",

  // External
  [ErrorCodes.PAYMENT_ERROR]: "Lỗi thanh toán",
  [ErrorCodes.UPLOAD_ERROR]: "Lỗi tải file lên",

  // Generic
  [ErrorCodes.INTERNAL_ERROR]: "Lỗi hệ thống",
  [ErrorCodes.UNKNOWN_ERROR]: "Đã xảy ra lỗi không xác định",
};

/**
 * Create error response
 */
export function createError(
  code: string,
  customMessage?: string,
  details?: unknown
): ApiError {
  return {
    success: false,
    error: customMessage || ErrorMessages[code] || ErrorMessages.UNKNOWN_ERROR,
    code,
    details: process.env.NODE_ENV === "development" ? details : undefined,
  };
}

/**
 * Create success response
 */
export function createSuccess<T>(data: T, message?: string): ApiSuccess<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Handle API error and show toast
 */
export function handleApiError(error: ApiError, fallbackMessage?: string) {
  const message = error.error || fallbackMessage || "Đã xảy ra lỗi";

  toast.error(message, {
    description:
      process.env.NODE_ENV === "development" && error.details
        ? String(error.details)
        : undefined,
  });

  // Log error
  const logger = createLogger("API");
  logger.error("API Error", {
    code: error.code,
    message: error.error,
    details: error.details,
  });
}

/**
 * Handle API success and show toast
 */
export function handleApiSuccess(
  message: string,
  options?: { description?: string }
) {
  toast.success(message, options);
}

/**
 * Wrap async Server Action with error handling
 *
 * @example
 * export const createProduct = withErrorHandling(async (formData) => {
 *   // Your logic here
 *   return createSuccess(product, "Sản phẩm đã được tạo");
 * });
 */
export function withErrorHandling<
  T extends (...args: never[]) => Promise<ApiResponse>
>(action: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await action(...args);
    } catch (error) {
      console.error("[Server Action Error]", error);

      // Handle Zod validation errors
      if (error instanceof Error && error.name === "ZodError") {
        return createError(
          ErrorCodes.VALIDATION_ERROR,
          "Dữ liệu không hợp lệ",
          error.message
        );
      }

      // Handle Prisma errors
      if (error instanceof Error && error.message.includes("Prisma")) {
        return createError(
          ErrorCodes.DATABASE_ERROR,
          "Lỗi cơ sở dữ liệu",
          error.message
        );
      }

      // Generic error
      return createError(
        ErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : "Đã xảy ra lỗi",
        error
      );
    }
  }) as T;
}

/**
 * Check if response is an error
 */
export function isApiError(response: ApiResponse): response is ApiError {
  return !response.success;
}

/**
 * Assert response is success (throws if error)
 */
export function assertSuccess<T>(
  response: ApiResponse<T>
): asserts response is ApiSuccess<T> {
  if (!response.success) {
    throw new Error(response.error);
  }
}
