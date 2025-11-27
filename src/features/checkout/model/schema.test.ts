/**
 * Unit Tests cho Checkout Schema
 *
 * 📚 Test validation rules cho checkout form
 */

import { describe, it, expect } from "vitest";
import { checkoutSchema } from "./schema";

describe("checkoutSchema", () => {
  // Valid data để dùng làm base
  const validData = {
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "customer@example.com",
    address: "123 Đường ABC",
    ward: "Phường 1",
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
  };

  describe("valid cases", () => {
    it("should accept valid checkout data", () => {
      const result = checkoutSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should accept data with optional note", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        note: "Giao hàng giờ hành chính",
      });
      expect(result.success).toBe(true);
    });

    it("should accept data without note", () => {
      const result = checkoutSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.note).toBeUndefined();
      }
    });
  });

  describe("name validation", () => {
    it("should reject name shorter than 2 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        name: "A",
      });

      expect(result.success).toBe(false);
    });

    it("should reject name longer than 100 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        name: "A".repeat(101),
      });

      expect(result.success).toBe(false);
    });
  });

  describe("phone validation", () => {
    it("should accept valid VN phone starting with 0", () => {
      const validPhones = ["0901234567", "0123456789", "0987654321"];

      validPhones.forEach((phone) => {
        const result = checkoutSchema.safeParse({
          ...validData,
          phone,
        });
        expect(result.success).toBe(true);
      });
    });

    it("should reject phone not starting with 0", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "1234567890",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe(
          "Số điện thoại không hợp lệ"
        );
      }
    });

    it("should reject phone with wrong length", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "090123456", // 9 digits
      });

      expect(result.success).toBe(false);
    });

    it("should reject phone with letters", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        phone: "090123456a",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("email validation", () => {
    it("should reject invalid email", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        email: "not-an-email",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Email không hợp lệ");
      }
    });
  });

  describe("address validation", () => {
    it("should reject address shorter than 5 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        address: "123",
      });

      expect(result.success).toBe(false);
    });

    it("should reject address longer than 200 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        address: "A".repeat(201),
      });

      expect(result.success).toBe(false);
    });
  });

  describe("location fields", () => {
    it("should reject empty ward", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        ward: "",
      });

      expect(result.success).toBe(false);
    });

    it("should reject empty district", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        district: "",
      });

      expect(result.success).toBe(false);
    });

    it("should reject empty city", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        city: "",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("note validation", () => {
    it("should reject note longer than 500 chars", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        note: "A".repeat(501),
      });

      expect(result.success).toBe(false);
    });

    it("should accept empty note", () => {
      const result = checkoutSchema.safeParse({
        ...validData,
        note: "",
      });

      expect(result.success).toBe(true);
    });
  });
});
