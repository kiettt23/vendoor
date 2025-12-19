import { describe, it, expect } from "vitest";
import { checkoutSchema, paymentMethods } from "../model/schema";

// ============================================================================
// checkoutSchema - Validate form checkout
// ============================================================================

describe("checkoutSchema - Validate form checkout", () => {
  const validData = {
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "test@example.com",
    address: "123 Đường ABC, Tòa nhà XYZ",
    ward: "Phường 1",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    paymentMethod: "COD" as const,
  };

  it("accepts valid data - dữ liệu hợp lệ", () => {
    const result = checkoutSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts data with optional note - có ghi chú", () => {
    const result = checkoutSchema.safeParse({
      ...validData,
      note: "Giao giờ hành chính",
    });
    expect(result.success).toBe(true);
  });

  // ============================================================================
  // Name validation - Validate tên
  // ============================================================================

  describe("Name validation - Validate tên", () => {
    it("rejects name < 2 chars - tên quá ngắn", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        name: "A",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("name");
        expect(result.error.issues[0].message).toContain("2 ký tự");
      }
    });

    it("accepts name = 2 chars - tên đúng 2 ký tự", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        name: "AB",
      });
      expect(result.success).toBe(true);
    });

    it("rejects name > 100 chars - tên quá dài", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        name: "A".repeat(101),
      });
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // Phone validation - Validate SĐT
  // ============================================================================

  describe("Phone validation - Validate SĐT", () => {
    it("accepts 10-digit starting with 0 - SĐT 10 số bắt đầu bằng 0", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "0901234567",
      });
      expect(result.success).toBe(true);
    });

    it("rejects 9 digits - thiếu số", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "090123456",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("10 số");
      }
    });

    it("rejects 11 digits - thừa số", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "09012345678",
      });
      expect(result.success).toBe(false);
    });

    it("rejects not starting with 0 - không bắt đầu bằng 0", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "1901234567",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("bắt đầu bằng số 0");
      }
    });

    it("rejects phone with letters - có chữ cái", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "090123456a",
      });
      expect(result.success).toBe(false);
    });

    it("rejects phone with spaces - có khoảng trắng", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "090 123 456",
      });
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // Email validation - Validate email
  // ============================================================================

  describe("Email validation - Validate email", () => {
    it("accepts valid email formats", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.com",
        "user+tag@example.com",
        "user@subdomain.domain.com",
      ];
      validEmails.forEach((email) => {
        const result = checkoutSchema.safeParse({ ...validData, email });
        expect(result.success).toBe(true);
      });
    });

    it("rejects invalid email format - email không hợp lệ", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("không hợp lệ");
      }
    });

    it("rejects email without @", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        email: "testexample.com",
      });
      expect(result.success).toBe(false);
    });

    it("rejects email without domain", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        email: "test@",
      });
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // Address validation - Validate địa chỉ
  // ============================================================================

  describe("Address validation - Validate địa chỉ", () => {
    it("rejects address < 5 chars - địa chỉ quá ngắn", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        address: "123",
      });
      expect(result.success).toBe(false);
    });

    it("accepts address = 5 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        address: "123 A",
      });
      expect(result.success).toBe(true);
    });

    it("rejects address > 200 chars - địa chỉ quá dài", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        address: "A".repeat(201),
      });
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // Ward/District/City validation - Validate phường/quận/thành phố
  // ============================================================================

  describe("Ward/District/City validation", () => {
    it("rejects ward < 2 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        ward: "A",
      });
      expect(result.success).toBe(false);
    });

    it("rejects district < 2 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        district: "Q",
      });
      expect(result.success).toBe(false);
    });

    it("rejects city < 2 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        city: "H",
      });
      expect(result.success).toBe(false);
    });

    it("rejects ward > 50 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        ward: "A".repeat(51),
      });
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // Note validation - Validate ghi chú
  // ============================================================================

  describe("Note validation - Validate ghi chú", () => {
    it("accepts empty note (optional)", () => {
      const { note, ...dataWithoutNote } = validData;
      const result = checkoutSchema.safeParse(dataWithoutNote);
      expect(result.success).toBe(true);
    });

    it("accepts note up to 500 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        note: "A".repeat(500),
      });
      expect(result.success).toBe(true);
    });

    it("rejects note > 500 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        note: "A".repeat(501),
      });
      expect(result.success).toBe(false);
    });
  });

  // ============================================================================
  // Payment method validation - Validate phương thức thanh toán
  // ============================================================================

  describe("Payment method validation - Validate phương thức thanh toán", () => {
    it("accepts COD", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        paymentMethod: "COD",
      });
      expect(result.success).toBe(true);
    });

    it("accepts STRIPE", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        paymentMethod: "STRIPE",
      });
      expect(result.success).toBe(true);
    });

    it("rejects invalid payment method - phương thức không hợp lệ", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        paymentMethod: "INVALID",
      });
      expect(result.success).toBe(false);
    });

    it("has correct payment methods defined", () => {
      expect(paymentMethods).toContain("COD");
      expect(paymentMethods).toContain("STRIPE");
      expect(paymentMethods).toHaveLength(2);
    });
  });

  // ============================================================================
  // Missing fields validation - Validate thiếu trường
  // ============================================================================

  describe("Missing fields validation - Validate thiếu trường", () => {
    it("rejects missing name", () => {
      const { name, ...data } = validData;
      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects missing phone", () => {
      const { phone, ...data } = validData;
      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects missing email", () => {
      const { email, ...data } = validData;
      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects missing address", () => {
      const { address, ...data } = validData;
      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("rejects missing paymentMethod", () => {
      const { paymentMethod, ...data } = validData;
      const result = checkoutSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
