/**
 * Unit Tests cho Cart Utilities
 */

import { describe, it, expect } from "vitest";
import { groupItemsByVendor, calculateCartTotals } from "./utils";
import type { CartItem } from "../model/types";

const createCartItem = (overrides: Partial<CartItem> = {}): CartItem => ({
  id: "item-1",
  productId: "prod-1",
  productName: "Test Product",
  productSlug: "test-product",
  variantId: "var-1",
  variantName: "Default",
  price: 100000,
  quantity: 1,
  stock: 10,
  image: "https://example.com/image.jpg",
  vendorId: "vendor-1",
  vendorName: "Test Vendor",
  ...overrides,
});

describe("Cart Utilities", () => {
  describe("groupItemsByVendor", () => {
    it("should group items by vendor", () => {
      const items: CartItem[] = [
        createCartItem({ vendorId: "v1", vendorName: "Vendor 1" }),
        createCartItem({
          vendorId: "v1",
          vendorName: "Vendor 1",
          productId: "prod-2",
        }),
        createCartItem({ vendorId: "v2", vendorName: "Vendor 2" }),
      ];

      const groups = groupItemsByVendor(items);

      expect(groups).toHaveLength(2);
      expect(groups.find((g) => g.vendorId === "v1")?.items).toHaveLength(2);
      expect(groups.find((g) => g.vendorId === "v2")?.items).toHaveLength(1);
    });

    it("should calculate subtotal for each vendor", () => {
      const items: CartItem[] = [
        createCartItem({
          vendorId: "v1",
          vendorName: "Vendor 1",
          price: 100000,
          quantity: 2,
        }),
        createCartItem({
          vendorId: "v1",
          vendorName: "Vendor 1",
          productId: "prod-2",
          price: 50000,
          quantity: 1,
        }),
      ];

      const groups = groupItemsByVendor(items);
      const vendorGroup = groups.find((g) => g.vendorId === "v1");

      // 100000 * 2 + 50000 * 1 = 250000
      expect(vendorGroup?.subtotal).toBe(250000);
    });

    it("should return empty array for empty input", () => {
      const groups = groupItemsByVendor([]);
      expect(groups).toEqual([]);
    });

    it("should preserve vendor information", () => {
      const items: CartItem[] = [
        createCartItem({ vendorId: "v1", vendorName: "Tech Store" }),
      ];

      const groups = groupItemsByVendor(items);

      expect(groups[0].vendorId).toBe("v1");
      expect(groups[0].vendorName).toBe("Tech Store");
    });
  });

  describe("calculateCartTotals", () => {
    it("should calculate subtotal correctly", () => {
      const items: CartItem[] = [
        createCartItem({ price: 100000, quantity: 2 }),
        createCartItem({ productId: "p2", price: 50000, quantity: 3 }),
      ];

      const totals = calculateCartTotals(items);

      // 100000 * 2 + 50000 * 3 = 350000
      expect(totals.subtotal).toBe(350000);
    });

    it("should calculate shipping fee based on vendor count", () => {
      const items: CartItem[] = [
        createCartItem({ vendorId: "v1", vendorName: "Vendor 1" }),
        createCartItem({ vendorId: "v2", vendorName: "Vendor 2" }),
        createCartItem({ vendorId: "v3", vendorName: "Vendor 3" }),
      ];

      const totals = calculateCartTotals(items);

      // 3 vendors * 30000 (SHIPPING_FEE_PER_VENDOR) = 90000
      expect(totals.shippingFee).toBe(90000);
      expect(totals.vendorCount).toBe(3);
    });

    it("should calculate total = subtotal + shippingFee", () => {
      const items: CartItem[] = [
        createCartItem({ price: 100000, quantity: 1 }),
      ];

      const totals = calculateCartTotals(items);

      // subtotal: 100000, shipping: 30000 (1 vendor)
      expect(totals.total).toBe(totals.subtotal + totals.shippingFee);
    });

    it("should calculate platform fee (for admin/vendor display)", () => {
      const items: CartItem[] = [
        createCartItem({ price: 1000000, quantity: 1 }),
      ];

      const totals = calculateCartTotals(items);

      // Platform fee = 2% of subtotal = 20000
      expect(totals.platformFee).toBe(20000);
    });

    it("should count total items", () => {
      const items: CartItem[] = [
        createCartItem({ quantity: 2 }),
        createCartItem({ productId: "p2", quantity: 3 }),
        createCartItem({ productId: "p3", quantity: 5 }),
      ];

      const totals = calculateCartTotals(items);

      expect(totals.itemCount).toBe(10);
    });

    it("should handle empty cart", () => {
      const totals = calculateCartTotals([]);

      expect(totals.subtotal).toBe(0);
      expect(totals.shippingFee).toBe(0);
      expect(totals.total).toBe(0);
      expect(totals.vendorCount).toBe(0);
      expect(totals.itemCount).toBe(0);
    });
  });
});
