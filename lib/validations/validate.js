import { z } from "zod";
import { ValidationError } from "@/lib/errors/AppError";

/**
 * Validate data với Zod schema
 *
 * Cách dùng:
 * const validatedData = validateData(createProductSchema, requestData);
 *
 * Nếu data không hợp lệ, sẽ throw ValidationError với message chi tiết
 *
 * @param {z.ZodSchema} schema - Zod schema để validate
 * @param {any} data - Data cần validate
 * @returns {any} Validated data
 * @throws {ValidationError} Nếu validation fails
 */
export function validateData(schema, data) {
  try {
    // parse() sẽ throw error nếu data không hợp lệ
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Chuyển Zod errors thành message dễ đọc
      // Ví dụ: "name: Tên sản phẩm phải có ít nhất 3 ký tự"
      const messages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      throw new ValidationError(messages);
    }
    throw error;
  }
}

/**
 * Validate data và return { success, data, errors }
 * Không throw error, dùng khi muốn handle errors manually
 *
 * @param {z.ZodSchema} schema - Zod schema để validate
 * @param {any} data - Data cần validate
 * @returns {{ success: boolean, data?: any, errors?: string[] }}
 */
export function safeValidateData(schema, data) {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  return {
    success: false,
    errors: result.error.errors.map(
      (err) => `${err.path.join(".")}: ${err.message}`
    ),
  };
}
