import { z } from "zod";

// Product Form Schema (for Create - includes variant info)

export const productSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  price: z.number({ error: "Vui lòng nhập giá bán" }).min(1000, "Giá phải lớn hơn 1.000₫"),
  compareAtPrice: z.number().min(1000, "Giá gốc phải lớn hơn 1.000₫").optional(),
  sku: z.string().min(1, "SKU không được để trống"),
  stock: z.number({ error: "Vui lòng nhập số lượng" }).min(1, "Số lượng phải ít nhất là 1"),
  isActive: z.boolean(),
});

export type ProductFormData = z.infer<typeof productSchema>;

// Product Edit Schema (basic info only - variants managed separately)

export const productEditSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  isActive: z.boolean(),
});

export type ProductEditFormData = z.infer<typeof productEditSchema>;

// Product Variant Schema

export const productVariantSchema = z.object({
  name: z.string().optional(),
  price: z.number().min(1000, "Giá phải lớn hơn 1.000₫"),
  compareAtPrice: z.number().optional(),
  sku: z.string().min(1, "SKU không được để trống"),
  stock: z.number().min(0, "Số lượng không hợp lệ"),
  isDefault: z.boolean().default(false),
});

export type ProductVariantFormData = z.infer<typeof productVariantSchema>;
