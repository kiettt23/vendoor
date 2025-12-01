import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock prisma
vi.mock("@/shared/lib/db", () => ({
  prisma: {
    category: {
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
import { createCategory, updateCategory, deleteCategory } from "./actions";

describe("Category Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCategory", () => {
    it("should create category with slugified name", async () => {
      vi.mocked(prisma.category.create).mockResolvedValueOnce({
        id: "1",
        name: "Điện Tử",
        slug: "dien-tu",
      } as never);

      const result = await createCategory("Điện Tử");

      expect(result.success).toBe(true);
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: { name: "Điện Tử", slug: "dien-tu" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/categories");
    });

    it("should return error on failure", async () => {
      vi.mocked(prisma.category.create).mockRejectedValueOnce(
        new Error("DB Error")
      );

      const result = await createCategory("Test");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Không thể tạo danh mục");
    });
  });

  describe("updateCategory", () => {
    it("should update category with new slugified name", async () => {
      vi.mocked(prisma.category.update).mockResolvedValueOnce({
        id: "1",
        name: "Thời Trang",
        slug: "thoi-trang",
      } as never);

      const result = await updateCategory("1", "Thời Trang");

      expect(result.success).toBe(true);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { name: "Thời Trang", slug: "thoi-trang" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/categories");
    });

    it("should return error on failure", async () => {
      vi.mocked(prisma.category.update).mockRejectedValueOnce(
        new Error("Not Found")
      );

      const result = await updateCategory("999", "Test");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Không thể cập nhật danh mục");
    });
  });

  describe("deleteCategory", () => {
    it("should delete category by id", async () => {
      vi.mocked(prisma.category.delete).mockResolvedValueOnce({
        id: "1",
        name: "Test",
        slug: "test",
      } as never);

      const result = await deleteCategory("1");

      expect(result.success).toBe(true);
      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(revalidatePath).toHaveBeenCalledWith("/admin/categories");
    });

    it("should return error on failure", async () => {
      vi.mocked(prisma.category.delete).mockRejectedValueOnce(
        new Error("Constraint violation")
      );

      const result = await deleteCategory("1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("Không thể xóa danh mục");
    });
  });
});
