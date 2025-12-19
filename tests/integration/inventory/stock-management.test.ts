import { describe, it, expect, vi, beforeEach } from "vitest";

// ============================================================================
// Mock Setup - Sử dụng vi.hoisted() để tránh lỗi hoisting
// ============================================================================

vi.mock("server-only", () => ({}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

const mockPrisma = vi.hoisted(() => ({
  productVariant: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn(),
}));
vi.mock("@/shared/lib/db", () => ({
  prisma: mockPrisma,
}));

// Import sau khi mock
import {
  updateStock,
  bulkUpdateStock,
} from "@/features/inventory-management/api/actions";
import { getStockStatus } from "@/features/inventory-management/lib/utils";

// ============================================================================
// Tests: getStockStatus utility
// ============================================================================

describe("getStockStatus - Xác định trạng thái tồn kho", () => {
  it("returns 'out_of_stock' when stock = 0 - hết hàng", () => {
    expect(getStockStatus(0)).toBe("out_of_stock");
  });

  it("returns 'low_stock' when stock = 1 - sắp hết", () => {
    expect(getStockStatus(1)).toBe("low_stock");
  });

  it("returns 'low_stock' when stock = 10 - ngưỡng sắp hết", () => {
    expect(getStockStatus(10)).toBe("low_stock");
  });

  it("returns 'in_stock' when stock = 11 - còn hàng", () => {
    expect(getStockStatus(11)).toBe("in_stock");
  });

  it("returns 'in_stock' when stock = 100 - còn nhiều hàng", () => {
    expect(getStockStatus(100)).toBe("in_stock");
  });

  it("handles edge case stock = 5 - giữa ngưỡng", () => {
    expect(getStockStatus(5)).toBe("low_stock");
  });
});

// ============================================================================
// Tests: updateStock action
// ============================================================================

describe("updateStock - Cập nhật tồn kho đơn lẻ", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Input validation - Validate input", () => {
    it("returns error when variantId is empty - thiếu variantId", async () => {
      const result = await updateStock("vendor-1", {
        variantId: "",
        stock: 10,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("returns error when stock is negative - số âm", async () => {
      const result = await updateStock("vendor-1", {
        variantId: "variant-1",
        stock: -5,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("không được âm");
    });

    it("returns error when stock is decimal - số thập phân", async () => {
      const result = await updateStock("vendor-1", {
        variantId: "variant-1",
        stock: 10.5,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Authorization - Kiểm tra quyền", () => {
    it("returns error when variant not found - không tìm thấy variant", async () => {
      mockPrisma.productVariant.findFirst.mockResolvedValue(null);

      const result = await updateStock("vendor-1", {
        variantId: "non-existent",
        stock: 10,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Không tìm thấy");
    });

    it("returns error when variant belongs to another vendor - vendor khác", async () => {
      // findFirst with vendorId filter returns null (not owned)
      mockPrisma.productVariant.findFirst.mockResolvedValue(null);

      const result = await updateStock("vendor-1", {
        variantId: "variant-of-vendor-2",
        stock: 10,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("không có quyền");
    });

    it("checks vendor ownership correctly - kiểm tra đúng vendorId", async () => {
      mockPrisma.productVariant.findFirst.mockResolvedValue({
        id: "variant-1",
        stock: 5,
      });
      mockPrisma.productVariant.update.mockResolvedValue({ id: "variant-1" });

      await updateStock("vendor-1", {
        variantId: "variant-1",
        stock: 20,
      });

      expect(mockPrisma.productVariant.findFirst).toHaveBeenCalledWith({
        where: {
          id: "variant-1",
          product: { vendorId: "vendor-1" },
        },
      });
    });
  });

  describe("Successful updates - Cập nhật thành công", () => {
    it("updates stock successfully - cập nhật thành công", async () => {
      mockPrisma.productVariant.findFirst.mockResolvedValue({
        id: "variant-1",
        stock: 5,
      });
      mockPrisma.productVariant.update.mockResolvedValue({ id: "variant-1" });

      const result = await updateStock("vendor-1", {
        variantId: "variant-1",
        stock: 50,
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.productVariant.update).toHaveBeenCalledWith({
        where: { id: "variant-1" },
        data: { stock: 50 },
      });
    });

    it("allows updating stock to 0 - cập nhật về 0", async () => {
      mockPrisma.productVariant.findFirst.mockResolvedValue({
        id: "variant-1",
        stock: 10,
      });
      mockPrisma.productVariant.update.mockResolvedValue({ id: "variant-1" });

      const result = await updateStock("vendor-1", {
        variantId: "variant-1",
        stock: 0,
      });

      expect(result.success).toBe(true);
      expect(mockPrisma.productVariant.update).toHaveBeenCalledWith({
        where: { id: "variant-1" },
        data: { stock: 0 },
      });
    });

    it("allows large stock values - số lượng lớn", async () => {
      mockPrisma.productVariant.findFirst.mockResolvedValue({
        id: "variant-1",
        stock: 0,
      });
      mockPrisma.productVariant.update.mockResolvedValue({ id: "variant-1" });

      const result = await updateStock("vendor-1", {
        variantId: "variant-1",
        stock: 999999,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Error handling - Xử lý lỗi", () => {
    it("handles database error gracefully - lỗi database", async () => {
      mockPrisma.productVariant.findFirst.mockResolvedValue({
        id: "variant-1",
        stock: 5,
      });
      mockPrisma.productVariant.update.mockRejectedValue(
        new Error("Database error")
      );

      const result = await updateStock("vendor-1", {
        variantId: "variant-1",
        stock: 50,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Không thể cập nhật");
    });
  });
});

// ============================================================================
// Tests: bulkUpdateStock action
// ============================================================================

describe("bulkUpdateStock - Cập nhật tồn kho hàng loạt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Input validation - Validate input", () => {
    it("returns error when updates array is empty - danh sách rỗng", async () => {
      const result = await bulkUpdateStock("vendor-1", { updates: [] });

      expect(result.success).toBe(false);
      expect(result.error).toContain("ít nhất 1");
    });

    it("returns error when any stock is negative - có stock âm", async () => {
      const result = await bulkUpdateStock("vendor-1", {
        updates: [
          { variantId: "v1", stock: 10 },
          { variantId: "v2", stock: -5 },
        ],
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("không được âm");
    });

    it("returns error when any variantId is empty - có variantId rỗng", async () => {
      const result = await bulkUpdateStock("vendor-1", {
        updates: [
          { variantId: "v1", stock: 10 },
          { variantId: "", stock: 5 },
        ],
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Authorization - Kiểm tra quyền", () => {
    it("returns error when any variant not owned - có variant không sở hữu", async () => {
      // Only variant-1 belongs to vendor-1
      mockPrisma.productVariant.findMany.mockResolvedValue([{ id: "v1" }]);

      const result = await bulkUpdateStock("vendor-1", {
        updates: [
          { variantId: "v1", stock: 10 },
          { variantId: "v2", stock: 20 }, // Not owned
        ],
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Không có quyền cập nhật 1 sản phẩm");
    });

    it("returns error with count of unauthorized variants - số lượng không có quyền", async () => {
      // None belong to vendor-1
      mockPrisma.productVariant.findMany.mockResolvedValue([]);

      const result = await bulkUpdateStock("vendor-1", {
        updates: [
          { variantId: "v1", stock: 10 },
          { variantId: "v2", stock: 20 },
          { variantId: "v3", stock: 30 },
        ],
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("3 sản phẩm");
    });

    it("checks all variant IDs for ownership - kiểm tra tất cả variantIds", async () => {
      mockPrisma.productVariant.findMany.mockResolvedValue([
        { id: "v1" },
        { id: "v2" },
      ]);
      mockPrisma.$transaction.mockResolvedValue([]);

      await bulkUpdateStock("vendor-1", {
        updates: [
          { variantId: "v1", stock: 10 },
          { variantId: "v2", stock: 20 },
        ],
      });

      expect(mockPrisma.productVariant.findMany).toHaveBeenCalledWith({
        where: {
          id: { in: ["v1", "v2"] },
          product: { vendorId: "vendor-1" },
        },
        select: { id: true },
      });
    });
  });

  describe("Successful bulk updates - Cập nhật hàng loạt thành công", () => {
    it("updates all stocks successfully - cập nhật tất cả thành công", async () => {
      mockPrisma.productVariant.findMany.mockResolvedValue([
        { id: "v1" },
        { id: "v2" },
        { id: "v3" },
      ]);
      mockPrisma.$transaction.mockResolvedValue([]);

      const result = await bulkUpdateStock("vendor-1", {
        updates: [
          { variantId: "v1", stock: 10 },
          { variantId: "v2", stock: 20 },
          { variantId: "v3", stock: 30 },
        ],
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ updated: 3 });
    });

    it("updates single item successfully - cập nhật 1 item", async () => {
      mockPrisma.productVariant.findMany.mockResolvedValue([{ id: "v1" }]);
      mockPrisma.$transaction.mockResolvedValue([]);

      const result = await bulkUpdateStock("vendor-1", {
        updates: [{ variantId: "v1", stock: 100 }],
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ updated: 1 });
    });

    it("uses transaction for atomicity - sử dụng transaction", async () => {
      mockPrisma.productVariant.findMany.mockResolvedValue([
        { id: "v1" },
        { id: "v2" },
      ]);
      mockPrisma.$transaction.mockResolvedValue([]);

      await bulkUpdateStock("vendor-1", {
        updates: [
          { variantId: "v1", stock: 10 },
          { variantId: "v2", stock: 20 },
        ],
      });

      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });
  });

  describe("Error handling - Xử lý lỗi", () => {
    it("handles transaction error gracefully - lỗi transaction", async () => {
      mockPrisma.productVariant.findMany.mockResolvedValue([{ id: "v1" }]);
      mockPrisma.$transaction.mockRejectedValue(new Error("Transaction failed"));

      const result = await bulkUpdateStock("vendor-1", {
        updates: [{ variantId: "v1", stock: 10 }],
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain("Không thể cập nhật");
    });

    it("handles findMany error gracefully - lỗi truy vấn", async () => {
      mockPrisma.productVariant.findMany.mockRejectedValue(
        new Error("Database error")
      );

      const result = await bulkUpdateStock("vendor-1", {
        updates: [{ variantId: "v1", stock: 10 }],
      });

      expect(result.success).toBe(false);
    });
  });
});

// ============================================================================
// Tests: Integration scenarios
// ============================================================================

describe("Integration Scenarios - Kịch bản tích hợp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("vendor can update their own products only - chỉ cập nhật sản phẩm của mình", async () => {
    // Vendor 1's product
    mockPrisma.productVariant.findFirst.mockImplementation(({ where }) => {
      if (where.product.vendorId === "vendor-1" && where.id === "v1") {
        return Promise.resolve({ id: "v1", stock: 5 });
      }
      return Promise.resolve(null);
    });
    mockPrisma.productVariant.update.mockResolvedValue({ id: "v1" });

    // Should succeed for own product
    const result1 = await updateStock("vendor-1", {
      variantId: "v1",
      stock: 10,
    });
    expect(result1.success).toBe(true);

    // Should fail for other vendor's product
    const result2 = await updateStock("vendor-2", {
      variantId: "v1",
      stock: 10,
    });
    expect(result2.success).toBe(false);
  });

  it("stock status transitions correctly - chuyển đổi trạng thái đúng", () => {
    // Simulate stock decreasing
    expect(getStockStatus(100)).toBe("in_stock");
    expect(getStockStatus(50)).toBe("in_stock");
    expect(getStockStatus(11)).toBe("in_stock");
    expect(getStockStatus(10)).toBe("low_stock"); // Threshold
    expect(getStockStatus(5)).toBe("low_stock");
    expect(getStockStatus(1)).toBe("low_stock");
    expect(getStockStatus(0)).toBe("out_of_stock");
  });

  it("bulk update maintains consistency - cập nhật hàng loạt giữ nhất quán", async () => {
    // All variants belong to vendor
    mockPrisma.productVariant.findMany.mockResolvedValue([
      { id: "v1" },
      { id: "v2" },
      { id: "v3" },
    ]);
    mockPrisma.$transaction.mockResolvedValue([]);

    const updates = [
      { variantId: "v1", stock: 0 }, // out_of_stock
      { variantId: "v2", stock: 5 }, // low_stock
      { variantId: "v3", stock: 100 }, // in_stock
    ];

    const result = await bulkUpdateStock("vendor-1", { updates });

    expect(result.success).toBe(true);
    expect(result.data?.updated).toBe(3);
  });
});
