import { describe, it, expect } from "vitest";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../model/schema";

// ============================================================================
// loginSchema - Validate đăng nhập
// ============================================================================

describe("loginSchema - Validate đăng nhập", () => {
  const validData = {
    email: "test@example.com",
    password: "password123",
  };

  it("accepts valid credentials - thông tin hợp lệ", () => {
    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe("Email validation", () => {
    it("rejects invalid email format", () => {
      const result = loginSchema.safeParse({
        ...validData,
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("không hợp lệ");
      }
    });

    it("rejects empty email", () => {
      const result = loginSchema.safeParse({
        ...validData,
        email: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Password validation", () => {
    it("rejects password < 6 chars - mật khẩu quá ngắn", () => {
      const result = loginSchema.safeParse({
        ...validData,
        password: "12345",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("6 ký tự");
      }
    });

    it("accepts password = 6 chars - mật khẩu đúng 6 ký tự", () => {
      const result = loginSchema.safeParse({
        ...validData,
        password: "123456",
      });
      expect(result.success).toBe(true);
    });

    it("accepts long password", () => {
      const result = loginSchema.safeParse({
        ...validData,
        password: "a".repeat(100),
      });
      expect(result.success).toBe(true);
    });
  });
});

// ============================================================================
// registerSchema - Validate đăng ký
// ============================================================================

describe("registerSchema - Validate đăng ký", () => {
  const validData = {
    name: "Nguyễn Văn A",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
  };

  it("accepts valid registration data - dữ liệu đăng ký hợp lệ", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe("Name validation", () => {
    it("rejects name < 2 chars - tên quá ngắn", () => {
      const result = registerSchema.safeParse({
        ...validData,
        name: "A",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("2 ký tự");
      }
    });

    it("accepts name = 2 chars", () => {
      const result = registerSchema.safeParse({
        ...validData,
        name: "AB",
      });
      expect(result.success).toBe(true);
    });

    it("accepts Vietnamese name - tên tiếng Việt", () => {
      const result = registerSchema.safeParse({
        ...validData,
        name: "Nguyễn Văn Ánh",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Password confirmation - Xác nhận mật khẩu", () => {
    it("rejects mismatched passwords - mật khẩu không khớp", () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: "password123",
        confirmPassword: "differentpassword",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("không khớp");
        expect(result.error.issues[0].path).toContain("confirmPassword");
      }
    });

    it("accepts matching passwords - mật khẩu khớp", () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: "mypassword123",
        confirmPassword: "mypassword123",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Email validation", () => {
    it("rejects invalid email", () => {
      const result = registerSchema.safeParse({
        ...validData,
        email: "not-an-email",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Password validation", () => {
    it("rejects password < 6 chars", () => {
      const result = registerSchema.safeParse({
        ...validData,
        password: "12345",
        confirmPassword: "12345",
      });
      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// forgotPasswordSchema - Validate quên mật khẩu
// ============================================================================

describe("forgotPasswordSchema - Validate quên mật khẩu", () => {
  it("accepts valid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "test@example.com",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "invalid-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("không hợp lệ");
    }
  });

  it("rejects empty email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing email", () => {
    const result = forgotPasswordSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

// ============================================================================
// resetPasswordSchema - Validate đặt lại mật khẩu
// ============================================================================

describe("resetPasswordSchema - Validate đặt lại mật khẩu", () => {
  const validData = {
    password: "newpassword123",
    confirmPassword: "newpassword123",
  };

  it("accepts valid reset data - dữ liệu đặt lại hợp lệ", () => {
    const result = resetPasswordSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  describe("Password validation - min 8 chars", () => {
    it("rejects password < 8 chars - mật khẩu mới quá ngắn", () => {
      const result = resetPasswordSchema.safeParse({
        password: "1234567",
        confirmPassword: "1234567",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("8 ký tự");
      }
    });

    it("accepts password = 8 chars - mật khẩu đúng 8 ký tự", () => {
      const result = resetPasswordSchema.safeParse({
        password: "12345678",
        confirmPassword: "12345678",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Password confirmation", () => {
    it("rejects mismatched passwords - mật khẩu không khớp", () => {
      const result = resetPasswordSchema.safeParse({
        password: "newpassword123",
        confirmPassword: "differentpassword",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("không khớp");
      }
    });
  });

  describe("Missing fields", () => {
    it("rejects missing password", () => {
      const result = resetPasswordSchema.safeParse({
        confirmPassword: "newpassword123",
      });
      expect(result.success).toBe(false);
    });

    it("rejects missing confirmPassword", () => {
      const result = resetPasswordSchema.safeParse({
        password: "newpassword123",
      });
      expect(result.success).toBe(false);
    });
  });
});
