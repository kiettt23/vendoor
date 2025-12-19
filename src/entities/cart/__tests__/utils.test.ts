import { describe, it, expect } from "vitest";
import { groupItemsByVendor, calculateCartTotals } from "../lib/utils";
import { createCartItem, createMultiVendorCart } from "../../../../tests/helpers/fixtures";

// ============================================================================
// groupItemsByVendor - Nhóm items theo vendor
// ============================================================================

describe("groupItemsByVendor - Nhóm items theo vendor", () => {
  it("groups items by vendor correctly - nhóm đúng theo vendor", () => {
    const items = createMultiVendorCart();
    const groups = groupItemsByVendor(items);

    expect(groups).toHaveLength(2);
    expect(groups.find((g) => g.vendorId === "vendor-1")?.items).toHaveLength(2);
    expect(groups.find((g) => g.vendorId === "vendor-2")?.items).toHaveLength(1);
  });

  it("calculates vendor subtotals - tính subtotal từng vendor", () => {
    const items = createMultiVendorCart();
    const groups = groupItemsByVendor(items);

    // Vendor 1: (100000 * 2) + (50000 * 1) = 250000
    const vendor1 = groups.find((g) => g.vendorId === "vendor-1");
    expect(vendor1?.subtotal).toBe(250000);

    // Vendor 2: 200000 * 1 = 200000
    const vendor2 = groups.find((g) => g.vendorId === "vendor-2");
    expect(vendor2?.subtotal).toBe(200000);
  });

  it("preserves vendor name - giữ nguyên tên vendor", () => {
    const items = createMultiVendorCart();
    const groups = groupItemsByVendor(items);

    expect(groups.find((g) => g.vendorId === "vendor-1")?.vendorName).toBe("Shop A");
    expect(groups.find((g) => g.vendorId === "vendor-2")?.vendorName).toBe("Shop B");
  });

  it("handles empty cart - xử lý giỏ hàng rỗng", () => {
    const groups = groupItemsByVendor([]);
    expect(groups).toHaveLength(0);
  });

  it("handles single vendor - xử lý 1 vendor", () => {
    const items = [
      createCartItem({ vendorId: "v1", vendorName: "Shop X", price: 100000, quantity: 2 }),
      createCartItem({
        id: "cart-2",
        vendorId: "v1",
        vendorName: "Shop X",
        price: 50000,
        quantity: 1,
      }),
    ];
    const groups = groupItemsByVendor(items);

    expect(groups).toHaveLength(1);
    expect(groups[0].items).toHaveLength(2);
    expect(groups[0].subtotal).toBe(250000);
  });

  it("handles many vendors - xử lý nhiều vendors", () => {
    const items = Array.from({ length: 10 }, (_, i) =>
      createCartItem({
        id: `cart-${i}`,
        vendorId: `vendor-${i}`,
        vendorName: `Shop ${i}`,
        price: 100000,
        quantity: 1,
      })
    );
    const groups = groupItemsByVendor(items);

    expect(groups).toHaveLength(10);
    groups.forEach((g) => {
      expect(g.subtotal).toBe(100000);
      expect(g.items).toHaveLength(1);
    });
  });
});

// ============================================================================
// calculateCartTotals - Tính tổng giỏ hàng
// ============================================================================

describe("calculateCartTotals - Tính tổng giỏ hàng", () => {
  it("calculates subtotal - tính tổng tiền hàng", () => {
    const items = createMultiVendorCart();
    const totals = calculateCartTotals(items);

    // (100000 * 2) + (50000 * 1) + (200000 * 1) = 450000
    expect(totals.subtotal).toBe(450000);
  });

  it("calculates shipping per vendor - tính phí ship theo vendor", () => {
    const items = createMultiVendorCart(); // 2 vendors
    const totals = calculateCartTotals(items);

    // 2 vendors × 30,000 = 60,000
    expect(totals.shippingFee).toBe(60000);
  });

  it("calculates platform fee (2%) - tính phí platform 2%", () => {
    const items = createMultiVendorCart();
    const totals = calculateCartTotals(items);

    // 450000 * 0.02 = 9000
    expect(totals.platformFee).toBe(9000);
  });

  it("calculates total (subtotal + shipping) - tính tổng thanh toán", () => {
    const items = createMultiVendorCart();
    const totals = calculateCartTotals(items);

    // 450000 + 60000 = 510000 (không bao gồm platform fee)
    expect(totals.total).toBe(510000);
  });

  it("counts vendors correctly - đếm số vendors", () => {
    const items = createMultiVendorCart();
    const totals = calculateCartTotals(items);

    expect(totals.vendorCount).toBe(2);
  });

  it("counts items correctly - đếm số items", () => {
    const items = createMultiVendorCart();
    const totals = calculateCartTotals(items);

    // 2 + 1 + 1 = 4
    expect(totals.itemCount).toBe(4);
  });

  it("handles empty cart - xử lý giỏ hàng rỗng", () => {
    const totals = calculateCartTotals([]);

    expect(totals.subtotal).toBe(0);
    expect(totals.shippingFee).toBe(0);
    expect(totals.platformFee).toBe(0);
    expect(totals.total).toBe(0);
    expect(totals.vendorCount).toBe(0);
    expect(totals.itemCount).toBe(0);
  });

  it("handles single item - xử lý 1 item", () => {
    const items = [createCartItem({ price: 100000, quantity: 1 })];
    const totals = calculateCartTotals(items);

    expect(totals.subtotal).toBe(100000);
    expect(totals.shippingFee).toBe(30000); // 1 vendor
    expect(totals.platformFee).toBe(2000); // 100000 * 0.02
    expect(totals.total).toBe(130000);
    expect(totals.vendorCount).toBe(1);
    expect(totals.itemCount).toBe(1);
  });

  it("handles large quantities - xử lý số lượng lớn", () => {
    const items = [createCartItem({ price: 100000, quantity: 100 })];
    const totals = calculateCartTotals(items);

    expect(totals.subtotal).toBe(10000000); // 10 triệu
    expect(totals.platformFee).toBe(200000); // 200k
  });

  it("rounds platform fee to nearest VND - làm tròn phí platform", () => {
    // Test với số tiền lẻ
    const items = [createCartItem({ price: 12345, quantity: 1 })];
    const totals = calculateCartTotals(items);

    // 12345 * 0.02 = 246.9 → 247
    expect(totals.platformFee).toBe(247);
  });

  describe("Real-world scenarios - Các tình huống thực tế", () => {
    it("typical order with 3 vendors - đơn hàng điển hình 3 vendors", () => {
      const items = [
        createCartItem({
          id: "1",
          vendorId: "v1",
          vendorName: "Fashion Store",
          price: 350000,
          quantity: 2,
        }),
        createCartItem({
          id: "2",
          vendorId: "v2",
          vendorName: "Tech Shop",
          price: 1500000,
          quantity: 1,
        }),
        createCartItem({
          id: "3",
          vendorId: "v3",
          vendorName: "Home Decor",
          price: 250000,
          quantity: 3,
        }),
      ];
      const totals = calculateCartTotals(items);

      // Subtotal: (350000 * 2) + 1500000 + (250000 * 3) = 2950000
      expect(totals.subtotal).toBe(2950000);
      // Shipping: 3 vendors × 30000 = 90000
      expect(totals.shippingFee).toBe(90000);
      // Platform fee: 2950000 * 0.02 = 59000
      expect(totals.platformFee).toBe(59000);
      // Total: 2950000 + 90000 = 3040000
      expect(totals.total).toBe(3040000);
      expect(totals.vendorCount).toBe(3);
      // Item count: 2 + 1 + 3 = 6
      expect(totals.itemCount).toBe(6);
    });
  });
});
