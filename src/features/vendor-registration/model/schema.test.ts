import { describe, it, expect } from "vitest";
import { vendorRegistrationSchema } from "./schema";

describe("vendorRegistrationSchema", () => {
  describe("shopName validation", () => {
    it("accepts valid shop name", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
      });

      expect(result.success).toBe(true);
    });

    it("rejects shop name under 3 characters", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "AB",
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("ít nhất 3 ký tự");
    });

    it("accepts shop name exactly 3 characters", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "ABC",
      });

      expect(result.success).toBe(true);
    });

    it("rejects shop name over 50 characters", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "a".repeat(51),
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("tối đa 50");
    });

    it("accepts shop name exactly 50 characters", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "a".repeat(50),
      });

      expect(result.success).toBe(true);
    });

    it("accepts Vietnamese characters in shop name", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop Thời Trang Việt",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("description validation", () => {
    it("accepts valid description", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        description: "Chuyên cung cấp các sản phẩm chất lượng cao",
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty description (optional)", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
      });

      expect(result.success).toBe(true);
    });

    it("rejects description over 500 characters", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        description: "a".repeat(501),
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("tối đa 500");
    });

    it("accepts description exactly 500 characters", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        description: "a".repeat(500),
      });

      expect(result.success).toBe(true);
    });
  });

  describe("businessAddress validation", () => {
    it("accepts valid business address", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessAddress: "123 Nguyễn Văn A, Quận 1, TP.HCM",
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty business address (optional)", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
      });

      expect(result.success).toBe(true);
    });

    it("rejects business address under 10 characters", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessAddress: "123 ABC",
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("ít nhất 10 ký tự");
    });

    it("accepts business address exactly 10 characters", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessAddress: "1234567890",
      });

      expect(result.success).toBe(true);
    });

    it("rejects business address over 200 characters", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessAddress: "a".repeat(201),
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("tối đa 200");
    });
  });

  describe("businessPhone validation", () => {
    it("accepts valid Vietnam phone number (10 digits)", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessPhone: "0901234567",
      });

      expect(result.success).toBe(true);
    });

    it("accepts valid Vietnam phone number starting with 03", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessPhone: "0321234567",
      });

      expect(result.success).toBe(true);
    });

    it("accepts valid Vietnam phone number starting with 08", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessPhone: "0812345678",
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty phone (optional)", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty string for phone", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessPhone: "",
      });

      expect(result.success).toBe(true);
    });

    it("rejects invalid phone format", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessPhone: "12345",
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("không hợp lệ");
    });

    it("rejects phone with letters", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessPhone: "090abc1234",
      });

      expect(result.success).toBe(false);
    });

    it("rejects phone with invalid length", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessPhone: "090123", // quá ngắn
      });

      expect(result.success).toBe(false);
    });
  });

  describe("businessEmail validation", () => {
    it("accepts valid email", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessEmail: "shop@example.com",
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty email (optional)", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty string for email", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessEmail: "",
      });

      expect(result.success).toBe(true);
    });

    it("rejects invalid email format", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessEmail: "invalid-email",
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("không hợp lệ");
    });

    it("rejects email without @", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessEmail: "shopexample.com",
      });

      expect(result.success).toBe(false);
    });

    it("rejects email without domain", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        businessEmail: "shop@",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("complete registration validation", () => {
    it("accepts minimal registration (only required fields)", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        shopName: "Shop ABC",
      });
    });

    it("accepts complete registration with all fields", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop Thời Trang ABC",
        description: "Chuyên cung cấp quần áo thời trang nam nữ chất lượng cao",
        businessAddress: "123 Nguyễn Văn A, Phường 1, Quận 1, TP.HCM",
        businessPhone: "0901234567",
        businessEmail: "contact@shopabc.vn",
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        shopName: "Shop Thời Trang ABC",
        description: "Chuyên cung cấp quần áo thời trang nam nữ chất lượng cao",
        businessAddress: "123 Nguyễn Văn A, Phường 1, Quận 1, TP.HCM",
        businessPhone: "0901234567",
        businessEmail: "contact@shopabc.vn",
      });
    });

    it("handles partial optional fields", () => {
      const result = vendorRegistrationSchema.safeParse({
        shopName: "Shop ABC",
        description: "Mô tả ngắn",
        businessPhone: "0901234567",
      });

      expect(result.success).toBe(true);
    });
  });
});
