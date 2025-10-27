import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError } from "@/lib/errors/AppError";

vi.mock("@/lib/prisma", () => ({
  default: {
    product: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";
import { productService } from "../productService";

describe("ProductService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getProducts", () => {
    it("should return only products from active stores", async () => {
      const mockProducts = [
        {
          id: "1",
          name: "Product 1",
          inStock: true,
          store: { isActive: true },
          rating: [],
        },
        {
          id: "2",
          name: "Product 2",
          inStock: true,
          store: { isActive: false },
          rating: [],
        },
        {
          id: "3",
          name: "Product 3",
          inStock: true,
          store: { isActive: true },
          rating: [],
        },
      ];

      prisma.product.findMany.mockResolvedValue(mockProducts);

      const result = await productService.getProducts();

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("1");
      expect(result[1].id).toBe("3");
    });
  });

  describe("getProductById", () => {
    it("should return product by id", async () => {
      const mockProduct = {
        id: "product-1",
        name: "Test Product",
        store: { id: "store-1" },
        rating: [],
      };

      prisma.product.findUnique.mockResolvedValue(mockProduct);

      const result = await productService.getProductById("product-1");

      expect(result).toEqual(mockProduct);
    });

    it("should throw NotFoundError when product not found", async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(productService.getProductById("invalid")).rejects.toThrow(
        NotFoundError
      );
    });
  });

  describe("createProduct", () => {
    it("should create product successfully", async () => {
      const productData = {
        name: "New Product",
        description: "Description",
        price: 100000,
        mrp: 120000,
        category: "electronics",
        images: ["img1.jpg"],
      };

      const mockCreated = { id: "new-id", ...productData, inStock: true };
      prisma.product.create.mockResolvedValue(mockCreated);

      const result = await productService.createProduct("store-1", productData);

      expect(result).toEqual(mockCreated);
    });
  });

  describe("getStoreProducts", () => {
    it("should return all products for a store", async () => {
      const mockProducts = [
        { id: "1", name: "P1", storeId: "store-1" },
        { id: "2", name: "P2", storeId: "store-1" },
      ];

      prisma.product.findMany.mockResolvedValue(mockProducts);

      const result = await productService.getStoreProducts("store-1");

      expect(result).toHaveLength(2);
    });
  });

  describe("toggleProductStock", () => {
    it("should toggle product stock", async () => {
      const mockProduct = { id: "p1", inStock: true };
      const mockUpdated = { id: "p1", inStock: false };

      prisma.product.findFirst.mockResolvedValue(mockProduct);
      prisma.product.update.mockResolvedValue(mockUpdated);

      const result = await productService.toggleProductStock("p1", "store-1");

      expect(result.inStock).toBe(false);
    });

    it("should throw error when product not found", async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(
        productService.toggleProductStock("p1", "store-1")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteProduct", () => {
    it("should delete product successfully", async () => {
      const mockProduct = { id: "p1", storeId: "store-1" };

      prisma.product.findFirst.mockResolvedValue(mockProduct);
      prisma.product.delete.mockResolvedValue(mockProduct);

      const result = await productService.deleteProduct("p1", "store-1");

      expect(result).toEqual({ success: true });
    });

    it("should throw error when product not found", async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(
        productService.deleteProduct("p1", "wrong-store")
      ).rejects.toThrow(NotFoundError);
    });
  });
});
