import { describe, it, expect } from "vitest";
import {
  calculateDiscount,
  calculateShipping,
  calculateOrderTotal,
} from "../helpers";

/**
 * UNIT TESTS cho Helper Functions
 *
 * Testing edge cases (các trường hợp đặc biệt):
 * - Normal cases (trường hợp thông thường)
 * - Edge cases (giá trị biên: 0, max, min)
 * - Error cases (lỗi: null, undefined, negative)
 */

describe("calculateDiscount", () => {
  it("should calculate 10% discount correctly", () => {
    const amount = 1000;
    const discount = 10;

    const result = calculateDiscount(amount, discount);

    expect(result).toBe(100); // 10% of 1000 = 100
  });

  it("should calculate 50% discount", () => {
    expect(calculateDiscount(1000, 50)).toBe(500);
  });

  it("should handle 0% discount", () => {
    expect(calculateDiscount(1000, 0)).toBe(0);
  });

  it("should handle 100% discount", () => {
    expect(calculateDiscount(1000, 100)).toBe(1000);
  });

  it("should handle decimal discounts", () => {
    // 15.5% discount
    expect(calculateDiscount(1000, 15.5)).toBe(155);
  });

  it("should return 0 for zero amount", () => {
    expect(calculateDiscount(0, 10)).toBe(0);
  });
});

describe("calculateShipping", () => {
  it("should return 0 for Plus members", () => {
    const isPlusMember = true;

    const result = calculateShipping(isPlusMember);

    expect(result).toBe(0);
  });

  it("should return shipping fee for regular users", () => {
    const isPlusMember = false;

    const result = calculateShipping(isPlusMember);

    // Assuming SHIPPING_FEE = 5 VND (from your constants)
    expect(result).toBe(5);
  });

  it("should handle undefined/null membership status", () => {
    // Should treat as regular user
    expect(calculateShipping(undefined)).toBe(5);
    expect(calculateShipping(null)).toBe(5);
  });
});

describe("calculateOrderTotal", () => {
  it("should calculate total with no discount, no shipping", () => {
    const items = [
      { price: 100, quantity: 2 }, // 200
      { price: 50, quantity: 3 }, // 150
    ];
    const discount = 0;
    const shippingFee = 0;

    const result = calculateOrderTotal(items, discount, shippingFee);

    expect(result).toBe(350); // 200 + 150
  });

  it("should calculate total with discount", () => {
    const items = [
      { price: 100, quantity: 1 }, // 100
    ];
    const discount = 10; // 10 VND discount
    const shippingFee = 0;

    const result = calculateOrderTotal(items, discount, shippingFee);

    expect(result).toBe(90); // 100 - 10
  });

  it("should calculate total with shipping fee", () => {
    const items = [
      { price: 100, quantity: 1 }, // 100
    ];
    const discount = 0;
    const shippingFee = 5;

    const result = calculateOrderTotal(items, discount, shippingFee);

    expect(result).toBe(105); // 100 + 5
  });

  it("should calculate total with discount and shipping", () => {
    const items = [
      { price: 100, quantity: 2 }, // 200
    ];
    const discount = 20;
    const shippingFee = 5;

    const result = calculateOrderTotal(items, discount, shippingFee);

    expect(result).toBe(185); // 200 - 20 + 5
  });

  it("should handle empty cart", () => {
    const items = [];
    const discount = 0;
    const shippingFee = 5;

    const result = calculateOrderTotal(items, discount, shippingFee);

    expect(result).toBe(5); // Only shipping fee
  });

  it("should handle negative discount (should not happen, but test edge case)", () => {
    const items = [{ price: 100, quantity: 1 }];
    const discount = -10; // Invalid discount
    const shippingFee = 0;

    // Depending on your implementation
    // Could throw error or treat as 0
    const result = calculateOrderTotal(items, discount, shippingFee);

    expect(result).toBeGreaterThanOrEqual(0);
  });
});
