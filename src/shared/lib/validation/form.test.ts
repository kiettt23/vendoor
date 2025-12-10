/**
 * Unit Tests cho Form Validation Utilities
 *
 * 📚 Test các helper functions xử lý form validation
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  formatZodErrors,
  getFirstError,
  hasErrors,
  validatePhone,
  validateEmail,
  validatePassword,
  validateSlug,
  ValidationMessages,
} from "./form";

// formatZodErrors - Convert Zod errors sang object
describe("formatZodErrors", () => {
  it("should format single field error", () => {
    const schema = z.object({
      email: z.string().email("Email không hợp lệ"),
    });

    const result = schema.safeParse({ email: "invalid" });
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      expect(errors).toEqual({ email: "Email không hợp lệ" });
    }
  });

  it("should format multiple field errors", () => {
    const schema = z.object({
      email: z.string().email("Email không hợp lệ"),
      name: z.string().min(2, "Tên quá ngắn"),
    });

    const result = schema.safeParse({ email: "bad", name: "a" });
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      expect(errors).toHaveProperty("email");
      expect(errors).toHaveProperty("name");
    }
  });

  it("should handle nested field paths", () => {
    const schema = z.object({
      address: z.object({
        city: z.string().min(1, "City required"),
      }),
    });

    const result = schema.safeParse({ address: { city: "" } });
    if (!result.success) {
      const errors = formatZodErrors(result.error);
      // Nested path becomes "address.city"
      expect(errors["address.city"]).toBe("City required");
    }
  });
});

// getFirstError - Lấy error message đầu tiên
describe("getFirstError", () => {
  it("should return first error message", () => {
    const errors = {
      email: { message: "Email không hợp lệ", type: "validation" },
      name: { message: "Tên quá ngắn", type: "validation" },
    };

    const result = getFirstError(errors);
    expect(result).toBe("Email không hợp lệ");
  });

  it("should return undefined for empty errors", () => {
    const result = getFirstError({});
    expect(result).toBeUndefined();
  });
});

// hasErrors - Kiểm tra có lỗi không
describe("hasErrors", () => {
  it("should return true when errors exist", () => {
    const errors = {
      email: { message: "Email không hợp lệ", type: "validation" },
    };
    expect(hasErrors(errors)).toBe(true);
  });

  it("should return false when no errors", () => {
    expect(hasErrors({})).toBe(false);
  });
});

// validatePhone - Validate số điện thoại VN
describe("validatePhone", () => {
  // Valid cases
  it("should accept valid phone starting with 0", () => {
    expect(validatePhone("0901234567")).toBe(true);
    expect(validatePhone("0123456789")).toBe(true);
  });

  it("should accept phone starting with +84", () => {
    expect(validatePhone("+84901234567")).toBe(true);
  });

  // Invalid cases
  it("should reject phone without leading 0 or +84", () => {
    expect(validatePhone("901234567")).toBe(false);
  });

  it("should reject phone with wrong length", () => {
    expect(validatePhone("012345678")).toBe(false); // 9 digits
    expect(validatePhone("012345678901")).toBe(false); // 12 digits
  });

  it("should reject phone with letters", () => {
    expect(validatePhone("0901234abc")).toBe(false);
  });
});

// validateEmail - Validate email
describe("validateEmail", () => {
  it("should accept valid email", () => {
    expect(validateEmail("test@example.com")).toBe(true);
    expect(validateEmail("user.name@domain.co")).toBe(true);
    expect(validateEmail("user+tag@example.org")).toBe(true);
  });

  it("should reject invalid email", () => {
    expect(validateEmail("invalid")).toBe(false);
    expect(validateEmail("@domain.com")).toBe(false);
    expect(validateEmail("user@")).toBe(false);
    expect(validateEmail("user@domain")).toBe(false);
  });
});

// validatePassword - Validate password strength
describe("validatePassword", () => {
  it("should accept strong password", () => {
    expect(validatePassword("Password123")).toBe(true);
    expect(validatePassword("StrongPass1")).toBe(true);
  });

  it("should reject password without uppercase", () => {
    expect(validatePassword("password123")).toBe(false);
  });

  it("should reject password without lowercase", () => {
    expect(validatePassword("PASSWORD123")).toBe(false);
  });

  it("should reject password without number", () => {
    expect(validatePassword("PasswordOnly")).toBe(false);
  });

  it("should reject password shorter than 8 chars", () => {
    expect(validatePassword("Pass1")).toBe(false);
  });
});

// validateSlug - Validate URL slug
describe("validateSlug", () => {
  it("should accept valid slug", () => {
    expect(validateSlug("valid-slug")).toBe(true);
    expect(validateSlug("product-name-123")).toBe(true);
    expect(validateSlug("simple")).toBe(true);
  });

  it("should reject slug with uppercase", () => {
    expect(validateSlug("Invalid-Slug")).toBe(false);
  });

  it("should reject slug with spaces", () => {
    expect(validateSlug("invalid slug")).toBe(false);
  });

  it("should reject slug with special chars", () => {
    expect(validateSlug("invalid_slug")).toBe(false);
    expect(validateSlug("invalid.slug")).toBe(false);
  });

  it("should reject slug starting/ending with hyphen", () => {
    expect(validateSlug("-invalid")).toBe(false);
    expect(validateSlug("invalid-")).toBe(false);
  });
});

// ValidationMessages - Vietnamese messages
describe("ValidationMessages", () => {
  it("should generate required message", () => {
    expect(ValidationMessages.required("Email")).toBe("Email là bắt buộc");
  });

  it("should generate min length message", () => {
    expect(ValidationMessages.min("Mật khẩu", 6)).toBe(
      "Mật khẩu phải có ít nhất 6 ký tự"
    );
  });

  it("should generate max length message", () => {
    expect(ValidationMessages.max("Tên", 100)).toBe(
      "Tên không được vượt quá 100 ký tự"
    );
  });

  it("should generate match message", () => {
    expect(ValidationMessages.match("Mật khẩu", "Xác nhận")).toBe(
      "Mật khẩu và Xác nhận không khớp"
    );
  });
});
