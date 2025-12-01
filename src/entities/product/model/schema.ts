import { z } from "zod";

// ============================================
// Product Form Schema
// ============================================

export const productSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  price: z.number().min(1000, "Giá phải lớn hơn 1.000₫"),
  compareAtPrice: z.number().optional(),
  sku: z.string().min(1, "SKU không được để trống"),
  stock: z.number().min(0, "Số lượng không hợp lệ"),
  isActive: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// ============================================
// Product Variant Schema
// ============================================

export const productVariantSchema = z.object({
  name: z.string().optional(),
  price: z.number().min(1000, "Giá phải lớn hơn 1.000₫"),
  compareAtPrice: z.number().optional(),
  sku: z.string().min(1, "SKU không được để trống"),
  stock: z.number().min(0, "Số lượng không hợp lệ"),
  isDefault: z.boolean().default(false),
});

export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
