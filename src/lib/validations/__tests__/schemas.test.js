import { describe, it, expect } from "vitest";
import {
  createProductSchema,
  createOrderSchema,
  createStoreSchema,
  createRatingSchema,
} from "../schemas";

/**
 * UNIT TESTS cho Zod Schemas
 *
 * Test validation rules:
 * - Valid data should pass
 * - Invalid data should fail với error message đúng
 *
 * Dùng safeParse() thay vì parse():
 * - safeParse() return { success, data, error }
 * - parse() throw error (không tốt cho tests)
 */

describe("createProductSchema", () => {
  it("should validate valid product data", () => {
    const validProduct = {
      name: "iPhone 15 Pro",
      description: "Latest iPhone with A17 Pro chip",
      price: 25000000,
      mrp: 30000000,
      category: "SMARTPHONE",
      images: ["https://example.com/image1.jpg"],
      storeId: "store-123",
    };

    const result = createProductSchema.safeParse(validProduct);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("iPhone 15 Pro");
      expect(result.data.price).toBe(25000000);
    }
  });

  it("should reject product with short name", () => {
    const invalidProduct = {
      name: "AB", // ❌ Quá ngắn (< 3 ký tự)
      description: "Valid description",
      price: 1000,
      mrp: 1500,
      category: "SMARTPHONE",
      images: ["image.jpg"],
      storeId: "store-123",
    };

    const result = createProductSchema.safeParse(invalidProduct);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("should reject product with negative price", () => {
    const invalidProduct = {
      name: "Valid Product",
      description: "Valid description",
      price: -100, // ❌ Giá âm
      mrp: 200,
      category: "SMARTPHONE",
      images: ["image.jpg"],
      storeId: "store-123",
    };

    const result = createProductSchema.safeParse(invalidProduct);

    expect(result.success).toBe(false);
  });

  it("should reject when mrp < price", () => {
    const invalidProduct = {
      name: "Valid Product",
      description: "Valid description",
      price: 1000,
      mrp: 500, // ❌ MRP phải >= price
      category: "SMARTPHONE",
      images: ["image.jpg"],
      storeId: "store-123",
    };

    const result = createProductSchema.safeParse(invalidProduct);

    expect(result.success).toBe(false);
  });

  it("should reject product without images", () => {
    const invalidProduct = {
      name: "Valid Product",
      description: "Valid description",
      price: 1000,
      mrp: 1500,
      category: "SMARTPHONE",
      images: [], // ❌ Empty array
      storeId: "store-123",
    };

    const result = createProductSchema.safeParse(invalidProduct);

    expect(result.success).toBe(false);
  });
});

describe("createOrderSchema", () => {
  it("should validate valid order data", () => {
    const validOrder = {
      addressId: "addr-123",
      items: [
        { id: "prod-1", quantity: 2 },
        { id: "prod-2", quantity: 1 },
      ],
      paymentMethod: "COD",
      couponCode: "SAVE10",
    };

    const result = createOrderSchema.safeParse(validOrder);

    expect(result.success).toBe(true);
  });

  it("should reject order without address", () => {
    const invalidOrder = {
      addressId: "", // ❌ Empty
      items: [{ id: "prod-1", quantity: 1 }],
      paymentMethod: "COD",
    };

    const result = createOrderSchema.safeParse(invalidOrder);

    expect(result.success).toBe(false);
  });

  it("should reject order with empty cart", () => {
    const invalidOrder = {
      addressId: "addr-123",
      items: [], // ❌ Empty cart
      paymentMethod: "COD",
    };

    const result = createOrderSchema.safeParse(invalidOrder);

    expect(result.success).toBe(false);
  });

  it("should reject order with invalid payment method", () => {
    const invalidOrder = {
      addressId: "addr-123",
      items: [{ id: "prod-1", quantity: 1 }],
      paymentMethod: "BITCOIN", // ❌ Invalid (chỉ cho phép COD, STRIPE)
    };

    const result = createOrderSchema.safeParse(invalidOrder);

    expect(result.success).toBe(false);
  });

  it("should reject order with zero quantity", () => {
    const invalidOrder = {
      addressId: "addr-123",
      items: [{ id: "prod-1", quantity: 0 }], // ❌ Quantity = 0
      paymentMethod: "COD",
    };

    const result = createOrderSchema.safeParse(invalidOrder);

    expect(result.success).toBe(false);
  });
});

describe("createStoreSchema", () => {
  it("should validate valid store data", () => {
    const validStore = {
      name: "My Store",
      username: "mystore123",
      description: "This is a test store with valid description length",
      email: "store@example.com",
      contact: "0123456789",
      address: "123 Test Street, Hanoi",
      logo: "https://example.com/logo.png",
    };

    const result = createStoreSchema.safeParse(validStore);

    expect(result.success).toBe(true);
  });

  it("should reject store with invalid username (uppercase)", () => {
    const invalidStore = {
      name: "My Store",
      username: "MyStore123", // ❌ Có chữ hoa
      description: "This is a test store with valid description",
      email: "store@example.com",
      contact: "0123456789",
      address: "123 Test Street",
      logo: "https://example.com/logo.png",
    };

    const result = createStoreSchema.safeParse(invalidStore);

    expect(result.success).toBe(false);
  });

  it("should reject store with invalid email", () => {
    const invalidStore = {
      name: "My Store",
      username: "mystore",
      description: "This is a test store",
      email: "not-an-email", // ❌ Invalid email
      contact: "0123456789",
      address: "123 Test Street",
      logo: "https://example.com/logo.png",
    };

    const result = createStoreSchema.safeParse(invalidStore);

    expect(result.success).toBe(false);
  });

  it("should reject store with invalid phone", () => {
    const invalidStore = {
      name: "My Store",
      username: "mystore",
      description: "This is a test store",
      email: "store@example.com",
      contact: "123456", // ❌ Không đủ 10 số
      address: "123 Test Street",
      logo: "https://example.com/logo.png",
    };

    const result = createStoreSchema.safeParse(invalidStore);

    expect(result.success).toBe(false);
  });
});

describe("createRatingSchema", () => {
  it("should validate valid rating data", () => {
    const validRating = {
      productId: "prod-123",
      orderId: "order-456",
      rating: 5,
      comment: "Great product!",
    };

    const result = createRatingSchema.safeParse(validRating);

    expect(result.success).toBe(true);
  });

  it("should reject rating below 1", () => {
    const invalidRating = {
      productId: "prod-123",
      orderId: "order-456",
      rating: 0, // ❌ < 1
    };

    const result = createRatingSchema.safeParse(invalidRating);

    expect(result.success).toBe(false);
  });

  it("should reject rating above 5", () => {
    const invalidRating = {
      productId: "prod-123",
      orderId: "order-456",
      rating: 6, // ❌ > 5
    };

    const result = createRatingSchema.safeParse(invalidRating);

    expect(result.success).toBe(false);
  });

  it("should allow rating without comment", () => {
    const validRating = {
      productId: "prod-123",
      orderId: "order-456",
      rating: 4,
      // comment is optional
    };

    const result = createRatingSchema.safeParse(validRating);

    expect(result.success).toBe(true);
  });
});
