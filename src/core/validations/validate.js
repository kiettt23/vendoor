import { z } from "zod";
import { ValidationError } from "@/errors/AppError";

export function validateData(schema, data) {
  try {
    // parse() sẽ throw error nếu data không hợp lệ
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Kiểm tra error.errors tồn tại và là array
      if (!error.errors || !Array.isArray(error.errors)) {
        throw new ValidationError("Dữ liệu không hợp lệ");
      }

      // Chuyển Zod errors thành message dễ đọc
      const messages = error.errors
        .map((err) => {
          const path =
            err.path && err.path.length > 0 ? err.path.join(".") + ": " : "";
          return `${path}${err.message}`;
        })
        .join(", ");

      throw new ValidationError(messages);
    }

    // Log lỗi để debug
    console.error("[Validation] Unexpected error:", error);
    throw error;
  }
}

export function safeValidateData(schema, data) {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  // Kiểm tra result.error.errors tồn tại
  const errors = result.error?.errors || [];

  return {
    success: false,
    errors: errors.map((err) => {
      const path =
        err.path && err.path.length > 0 ? err.path.join(".") + ": " : "";
      return `${path}${err.message}`;
    }),
  };
}
