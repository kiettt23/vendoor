/**
 * Integration Tests cho Inventory Management
 *
 * Test flow: queries và actions với mocked Prisma
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    productVariant: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
      groupBy: vi.fn(),
    },
    product: {
      count: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

// Mock Next.js cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { prisma } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import {
  updateStock,
  bulkUpdateStock,
} from "@/features/inventory-management/api/actions";
import { getInventoryStats } from "@/features/inventory-management/api/queries";

describe("Inventory Management - Integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateStock", () => {
    it("should update stock successfully", async () => {
      // Arrange
      vi.mocked(prisma.productVariant.findFirst).mockResolvedValue({
        id: "var-1",
        productId: "prod-1",
        name: "Default",
        sku: "SKU-001",
        color: null,
        size: null,
        price: 100000,
        compareAtPrice: null,
        stock: 10,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.mocked(prisma.productVariant.update).mockResolvedValue({
        id: "var-1",
        productId: "prod-1",
        name: "Default",
        sku: "SKU-001",
        color: null,
        size: null,
        price: 100000,
        compareAtPrice: null,
        stock: 50,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Act
      const result = await updateStock("vendor-1", {
        variantId: "var-1",
        stock: 50,
      });

      // Assert
      expect(result.success).toBe(true);
      expect(prisma.productVariant.update).toHaveBeenCalledWith({
        where: { id: "var-1" },
        data: { stock: 50 },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/vendor/inventory");
    });

    it("should fail when variant not found", async () => {
      vi.mocked(prisma.productVariant.findFirst).mockResolvedValue(null);

      const result = await updateStock("vendor-1", {
        variantId: "non-existent",
        stock: 50,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toMatch(
          /không tìm thấy|không có quyền/
        );
      }
    });

    it("should fail with negative stock", async () => {
      const result = await updateStock("vendor-1", {
        variantId: "var-1",
        stock: -5,
      });

      expect(result.success).toBe(false);
    });
  });

  describe("bulkUpdateStock", () => {
    it("should update multiple variants", async () => {
      vi.mocked(prisma.productVariant.findMany).mockResolvedValue([
        { id: "var-1" },
        { id: "var-2" },
      ] as any);

      vi.mocked(prisma.$transaction).mockResolvedValue([{}, {}]);

      const result = await bulkUpdateStock("vendor-1", {
        updates: [
          { variantId: "var-1", stock: 10 },
          { variantId: "var-2", stock: 20 },
        ],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.updated).toBe(2);
      }
    });

    it("should fail if some variants not owned", async () => {
      // Only var-1 is owned
      vi.mocked(prisma.productVariant.findMany).mockResolvedValue([
        { id: "var-1" },
      ] as any);

      const result = await bulkUpdateStock("vendor-1", {
        updates: [
          { variantId: "var-1", stock: 10 },
          { variantId: "var-2", stock: 20 }, // Not owned
        ],
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.toLowerCase()).toMatch(/không có quyền|không thể/);
      }
    });
  });

  describe("getInventoryStats", () => {
    it("should calculate inventory statistics", async () => {
      vi.mocked(prisma.product.count).mockResolvedValue(10);
      vi.mocked(prisma.productVariant.groupBy).mockResolvedValue([
        { stock: 0, _count: 2 },
        { stock: 5, _count: 3 },
        { stock: 20, _count: 15 },
      ] as any);

      const stats = await getInventoryStats("vendor-1");

      expect(stats.totalProducts).toBe(10);
      expect(stats.totalVariants).toBe(20);
      expect(stats.outOfStock).toBe(2);
      expect(stats.lowStock).toBe(3);
      expect(stats.inStock).toBe(15);
    });
  });
});
