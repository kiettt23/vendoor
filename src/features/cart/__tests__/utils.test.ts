import { describe, it, expect } from "vitest";
import {
  calculateItemCount,
  calculateSubtotal,
  groupItemsByVendor,
  getVendorGroups,
  validateQuantity,
  findItemByVariant,
  generateCartItemId,
} from "../lib/utils";
import type { CartItem } from "../types";

// ============================================
// MOCK DATA
// ============================================

const mockItems: CartItem[] = [
  {
    id: "item-1",
    productId: "prod-1",
    productName: "Áo thun nam",
    productSlug: "ao-thun-nam",
    variantId: "var-1",
    variantName: "Đỏ / M",
    price: 200000,
    quantity: 2,
    image: "https://example.com/image1.jpg",
    stock: 10,
    vendorId: "vendor-1",
    vendorName: "Shop A",
  },
  {
    id: "item-2",
    productId: "prod-2",
    productName: "Quần jean",
    productSlug: "quan-jean",
    variantId: "var-2",
    variantName: "Xanh / L",
    price: 500000,
    quantity: 1,
    image: "https://example.com/image2.jpg",
    stock: 5,
    vendorId: "vendor-1",
    vendorName: "Shop A",
  },
  {
    id: "item-3",
    productId: "prod-3",
    productName: "Giày sneaker",
    productSlug: "giay-sneaker",
    variantId: "var-3",
    variantName: "Trắng / 42",
    price: 1000000,
    quantity: 1,
    image: "https://example.com/image3.jpg",
    stock: 3,
    vendorId: "vendor-2",
    vendorName: "Shop B",
  },
];

// ============================================
// TESTS: CALCULATIONS
// ============================================

describe("calculateItemCount", () => {
  it("should return correct total quantity", () => {
    expect(calculateItemCount(mockItems)).toBe(4); // 2 + 1 + 1
  });

  it("should return 0 for empty cart", () => {
    expect(calculateItemCount([])).toBe(0);
  });
});

describe("calculateSubtotal", () => {
  it("should calculate correct subtotal", () => {
    // (200k * 2) + (500k * 1) + (1000k * 1) = 1,900,000
    expect(calculateSubtotal(mockItems)).toBe(1900000);
  });

  it("should return 0 for empty cart", () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

// ============================================
// TESTS: VENDOR GROUPING
// ============================================

describe("groupItemsByVendor", () => {
  it("should group items by vendor correctly", () => {
    const grouped = groupItemsByVendor(mockItems);

    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped["vendor-1"]).toHaveLength(2); // Shop A: 2 items
    expect(grouped["vendor-2"]).toHaveLength(1); // Shop B: 1 item
  });

  it("should return empty object for empty cart", () => {
    expect(groupItemsByVendor([])).toEqual({});
  });
});

describe("getVendorGroups", () => {
  it("should return vendor groups with subtotals", () => {
    const groups = getVendorGroups(mockItems);

    expect(groups).toHaveLength(2);

    const shopA = groups.find((g) => g.vendorId === "vendor-1");
    const shopB = groups.find((g) => g.vendorId === "vendor-2");

    expect(shopA).toBeDefined();
    expect(shopA!.items).toHaveLength(2);
    expect(shopA!.subtotal).toBe(900000); // 200k*2 + 500k*1

    expect(shopB).toBeDefined();
    expect(shopB!.items).toHaveLength(1);
    expect(shopB!.subtotal).toBe(1000000); // 1000k*1
  });
});

// ============================================
// TESTS: VALIDATION
// ============================================

describe("validateQuantity", () => {
  it("should clamp quantity to min 1", () => {
    expect(validateQuantity(0, 10)).toBe(1);
    expect(validateQuantity(-5, 10)).toBe(1);
  });

  it("should clamp quantity to max stock", () => {
    expect(validateQuantity(100, 10)).toBe(10);
    expect(validateQuantity(15, 10)).toBe(10);
  });

  it("should return quantity if within range", () => {
    expect(validateQuantity(5, 10)).toBe(5);
  });
});

// ============================================
// TESTS: HELPERS
// ============================================

describe("findItemByVariant", () => {
  it("should find item by variantId", () => {
    const found = findItemByVariant(mockItems, "var-2");
    expect(found).toBeDefined();
    expect(found!.productName).toBe("Quần jean");
  });

  it("should return undefined if not found", () => {
    expect(findItemByVariant(mockItems, "var-999")).toBeUndefined();
  });
});

describe("generateCartItemId", () => {
  it("should generate unique IDs", () => {
    const id1 = generateCartItemId("var-1");
    const id2 = generateCartItemId("var-1");

    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^var-1-\d+$/);
  });
});
