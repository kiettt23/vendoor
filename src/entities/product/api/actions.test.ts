/**
 * Unit Tests cho Product Actions
 *
 * Test CRUD operations cho products
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    product: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { prisma } from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import { createProduct, updateProduct, deleteProduct } from "./actions";
import type { ProductFormInput } from "../model";

const mockProductInput: ProductFormInput = {
  name: "Test Product",
  categoryId: "cat-1",
  price: 100000,
  sku: "TEST-001",
  stock: 10,
  isActive: true,
  description: "Test description",
};

describe("Product Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // createProduct - Tạo sản phẩm mới
  // ============================================================
  describe("createProduct", () => {
    it("should create product with generated slug", async () => {
      vi.mocked(prisma.product.create).mockResolvedValueOnce({
        id: "prod-1",
        name: "Test Product",
        slug: "test-product-abc123",
      } as never);

      const result = await createProduct("vendor-1", mockProductInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("prod-1");
      }
      expect(prisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: "Test Product",
            vendorId: "vendor-1",
            isActive: true,
          }),
        })
      );
    });

    it("should create product with image when provided", async () => {
      const inputWithImage: ProductFormInput = {
        ...mockProductInput,
        imageUrl: "https://example.com/image.jpg",
      };

      vi.mocked(prisma.product.create).mockResolvedValueOnce({
        id: "prod-1",
      } as never);

      await createProduct("vendor-1", inputWithImage);

      expect(prisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            images: {
              create: {
                url: "https://example.com/image.jpg",
                order: 0,
              },
            },
          }),
        })
      );
    });

    it("should revalidate vendor products path", async () => {
      vi.mocked(prisma.product.create).mockResolvedValueOnce({
        id: "prod-1",
      } as never);

      await createProduct("vendor-1", mockProductInput);

      expect(revalidatePath).toHaveBeenCalledWith("/vendor/products");
    });

    it("should return error on failure", async () => {
      vi.mocked(prisma.product.create).mockRejectedValueOnce(
        new Error("DB Error")
      );

      const result = await createProduct("vendor-1", mockProductInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Không thể tạo sản phẩm");
      }
    });

    it("should create default variant with price and stock", async () => {
      vi.mocked(prisma.product.create).mockResolvedValueOnce({
        id: "prod-1",
      } as never);

      await createProduct("vendor-1", mockProductInput);

      expect(prisma.product.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            variants: {
              create: {
                name: null,
                price: 100000,
                compareAtPrice: null,
                sku: "TEST-001",
                stock: 10,
                isDefault: true,
              },
            },
          }),
        })
      );
    });
  });

  // ============================================================
  // updateProduct - Cập nhật sản phẩm
  // ============================================================
  describe("updateProduct", () => {
    it("should update product successfully", async () => {
      vi.mocked(prisma.product.update).mockResolvedValueOnce({
        id: "prod-1",
        name: "Updated Product",
      } as never);

      const result = await updateProduct("prod-1", {
        ...mockProductInput,
        name: "Updated Product",
      });

      expect(result.success).toBe(true);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: "prod-1" },
        data: expect.objectContaining({
          name: "Updated Product",
        }),
      });
    });

    it("should update default variant", async () => {
      vi.mocked(prisma.product.update).mockResolvedValueOnce({
        id: "prod-1",
      } as never);

      await updateProduct("prod-1", {
        ...mockProductInput,
        price: 150000,
        stock: 20,
      });

      expect(prisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            variants: {
              updateMany: {
                where: { isDefault: true },
                data: expect.objectContaining({
                  price: 150000,
                  stock: 20,
                }),
              },
            },
          }),
        })
      );
    });

    it("should revalidate path after update", async () => {
      vi.mocked(prisma.product.update).mockResolvedValueOnce({
        id: "prod-1",
      } as never);

      await updateProduct("prod-1", mockProductInput);

      expect(revalidatePath).toHaveBeenCalledWith("/vendor/products");
    });

    it("should return error on failure", async () => {
      vi.mocked(prisma.product.update).mockRejectedValueOnce(
        new Error("Not found")
      );

      const result = await updateProduct("prod-1", mockProductInput);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Không thể cập nhật sản phẩm");
      }
    });
  });

  // ============================================================
  // deleteProduct - Xóa sản phẩm
  // ============================================================
  describe("deleteProduct", () => {
    it("should delete product successfully", async () => {
      vi.mocked(prisma.product.delete).mockResolvedValueOnce({
        id: "prod-1",
      } as never);

      const result = await deleteProduct("prod-1");

      expect(result.success).toBe(true);
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: "prod-1" },
      });
    });

    it("should revalidate path after delete", async () => {
      vi.mocked(prisma.product.delete).mockResolvedValueOnce({
        id: "prod-1",
      } as never);

      await deleteProduct("prod-1");

      expect(revalidatePath).toHaveBeenCalledWith("/vendor/products");
    });

    it("should return error on failure", async () => {
      vi.mocked(prisma.product.delete).mockRejectedValueOnce(
        new Error("Constraint violation")
      );

      const result = await deleteProduct("prod-1");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Không thể xóa sản phẩm");
      }
    });
  });
});
