import { describe, it, expect } from "vitest";
import { productSchema, productVariantSchema } from "./schema";

describe("productSchema", () => {
  describe("name validation", () => {
    it("accepts valid product name", () => {
      const result = productSchema.safeParse({
        name: "iPhone 15 Pro Max",
        categoryId: "cat_123",
        price: 30000000,
        sku: "IP15PM-256-BLK",
        stock: 50,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("rejects name under 3 characters", () => {
      const result = productSchema.safeParse({
        name: "AB",
        categoryId: "cat_123",
        price: 30000000,
        sku: "SKU123",
        stock: 50,
        isActive: true,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("ít nhất 3 ký tự");
    });

    it("accepts name exactly 3 characters", () => {
      const result = productSchema.safeParse({
        name: "Pen",
        categoryId: "cat_123",
        price: 10000,
        sku: "PEN001",
        stock: 100,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts Vietnamese characters in name", () => {
      const result = productSchema.safeParse({
        name: "Áo thun cotton cao cấp",
        categoryId: "cat_123",
        price: 250000,
        sku: "AT-001",
        stock: 100,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("categoryId validation", () => {
    it("accepts valid categoryId", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_electronics_001",
        price: 100000,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("rejects empty categoryId", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "",
        price: 100000,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain(
        "Vui lòng chọn danh mục"
      );
    });
  });

  describe("price validation", () => {
    it("accepts price above 1000", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 50000,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("rejects price below 1000", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 500,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("lớn hơn 1.000₫");
    });

    it("accepts price exactly 1000", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 1000,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("rejects zero price", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 0,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(false);
    });

    it("rejects negative price", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: -5000,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("compareAtPrice validation", () => {
    it("accepts valid compareAtPrice", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 80000,
        compareAtPrice: 100000,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts undefined compareAtPrice (optional)", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 80000,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("sku validation", () => {
    it("accepts valid SKU", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 100000,
        sku: "IP15-PM-256GB-BLK",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("rejects empty SKU", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 100000,
        sku: "",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain(
        "SKU không được để trống"
      );
    });
  });

  describe("stock validation", () => {
    it("accepts positive stock", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 100000,
        sku: "SKU123",
        stock: 100,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("accepts zero stock", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 100000,
        sku: "SKU123",
        stock: 0,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });

    it("rejects negative stock", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 100000,
        sku: "SKU123",
        stock: -5,
        isActive: true,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("không hợp lệ");
    });
  });

  describe("isActive validation", () => {
    it("accepts true", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 100000,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(true);
      expect(result.data?.isActive).toBe(true);
    });

    it("accepts false", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 100000,
        sku: "SKU123",
        stock: 10,
        isActive: false,
      });

      expect(result.success).toBe(true);
      expect(result.data?.isActive).toBe(false);
    });
  });

  describe("description validation", () => {
    it("accepts valid description", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 100000,
        sku: "SKU123",
        stock: 10,
        isActive: true,
        description: "Sản phẩm chất lượng cao, nhập khẩu chính hãng.",
      });

      expect(result.success).toBe(true);
    });

    it("accepts empty description (optional)", () => {
      const result = productSchema.safeParse({
        name: "Product Name",
        categoryId: "cat_123",
        price: 100000,
        sku: "SKU123",
        stock: 10,
        isActive: true,
      });

      expect(result.success).toBe(true);
    });
  });
});

describe("productVariantSchema", () => {
  describe("price validation", () => {
    it("accepts price above 1000", () => {
      const result = productVariantSchema.safeParse({
        price: 50000,
        sku: "VAR-001",
        stock: 10,
      });

      expect(result.success).toBe(true);
    });

    it("rejects price below 1000", () => {
      const result = productVariantSchema.safeParse({
        price: 500,
        sku: "VAR-001",
        stock: 10,
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("lớn hơn 1.000₫");
    });
  });

  describe("sku validation", () => {
    it("accepts valid SKU", () => {
      const result = productVariantSchema.safeParse({
        price: 50000,
        sku: "IP15-PM-256GB",
        stock: 10,
      });

      expect(result.success).toBe(true);
    });

    it("rejects empty SKU", () => {
      const result = productVariantSchema.safeParse({
        price: 50000,
        sku: "",
        stock: 10,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("stock validation", () => {
    it("accepts zero stock", () => {
      const result = productVariantSchema.safeParse({
        price: 50000,
        sku: "VAR-001",
        stock: 0,
      });

      expect(result.success).toBe(true);
    });

    it("rejects negative stock", () => {
      const result = productVariantSchema.safeParse({
        price: 50000,
        sku: "VAR-001",
        stock: -10,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("name validation", () => {
    it("accepts variant name", () => {
      const result = productVariantSchema.safeParse({
        name: "256GB - Màu đen",
        price: 50000,
        sku: "VAR-001",
        stock: 10,
      });

      expect(result.success).toBe(true);
    });

    it("accepts undefined name (optional)", () => {
      const result = productVariantSchema.safeParse({
        price: 50000,
        sku: "VAR-001",
        stock: 10,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("isDefault validation", () => {
    it("defaults to false when not provided", () => {
      const result = productVariantSchema.safeParse({
        price: 50000,
        sku: "VAR-001",
        stock: 10,
      });

      expect(result.success).toBe(true);
      expect(result.data?.isDefault).toBe(false);
    });

    it("accepts true for default variant", () => {
      const result = productVariantSchema.safeParse({
        price: 50000,
        sku: "VAR-001",
        stock: 10,
        isDefault: true,
      });

      expect(result.success).toBe(true);
      expect(result.data?.isDefault).toBe(true);
    });
  });

  describe("compareAtPrice validation", () => {
    it("accepts compareAtPrice for sale variants", () => {
      const result = productVariantSchema.safeParse({
        price: 40000,
        compareAtPrice: 50000,
        sku: "VAR-001",
        stock: 10,
      });

      expect(result.success).toBe(true);
    });
  });
});
