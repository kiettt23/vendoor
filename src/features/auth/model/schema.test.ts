/**
 * Unit Tests cho Auth Schemas
 *
 * 📚 Test Zod schemas để đảm bảo validation rules đúng
 */

import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema } from "./schema";

// loginSchema - Schema đăng nhập
describe("loginSchema", () => {
  describe("valid cases", () => {
    it("should accept valid login data", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "123456",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("email validation", () => {
    it("should reject invalid email", () => {
      const result = loginSchema.safeParse({
        email: "invalid-email",
        password: "123456",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Email không hợp lệ");
      }
    });

    it("should reject empty email", () => {
      const result = loginSchema.safeParse({
        email: "",
        password: "123456",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("password validation", () => {
    it("should reject password shorter than 6 chars", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "12345",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Mật khẩu phải có ít nhất 6 ký tự"
        );
      }
    });

    it("should accept password with exactly 6 chars", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "123456",
      });

      expect(result.success).toBe(true);
    });
  });
});

// registerSchema - Schema đăng ký
describe("registerSchema", () => {
  const validData = {
    name: "Nguyễn Văn A",
    email: "user@example.com",
    password: "123456",
    confirmPassword: "123456",
  };

  describe("valid cases", () => {
    it("should accept valid registration data", () => {
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("name validation", () => {
    it("should reject name shorter than 2 chars", () => {
      const result = registerSchema.safeParse({
        ...validData,
        name: "A",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Tên phải có ít nhất 2 ký tự"
        );
      }
    });

    it("should accept Vietnamese name", () => {
      const result = registerSchema.safeParse({
        ...validData,
        name: "Trần Thị Bình",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("password confirmation", () => {
    it("should reject when passwords do not match", () => {
      const result = registerSchema.safeParse({
        ...validData,
        confirmPassword: "different",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        // The refine error should be on confirmPassword
        const confirmError = result.error.issues.find(
          (issue) => issue.path[0] === "confirmPassword"
        );
        expect(confirmError?.message).toBe("Mật khẩu không khớp");
      }
    });

    it("should accept matching passwords", () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: "securePass123",
        confirmPassword: "securePass123",
      });

      expect(result.success).toBe(true);
    });
  });
});
