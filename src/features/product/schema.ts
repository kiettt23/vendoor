import { z } from "zod";

// ============================================
// PRODUCT VARIANT SCHEMA
// ============================================

export const productVariantSchema = z.object({
  // Variant info
  name: z
    .string()
    .min(1, "Tên biến thể không được để trống")
    .max(100, "Tên biến thể tối đa 100 ký tự"),
  sku: z.string().max(50, "SKU tối đa 50 ký tự").optional().or(z.literal("")),

  // Pricing (in VND, stored as integer)
  price: z.number().int("Giá phải là số nguyên").positive("Giá phải lớn hơn 0"),
  compareAtPrice: z
    .number()
    .int("Giá gốc phải là số nguyên")
    .positive("Giá gốc phải lớn hơn 0")
    .optional()
    .or(z.literal(0))
    .nullable(),

  // Inventory
  stock: z
    .number()
    .int("Số lượng phải là số nguyên")
    .nonnegative("Số lượng không được âm"),

  // Default flag
  isDefault: z.boolean(),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

// ============================================
// PRODUCT IMAGE SCHEMA
// ============================================

export const productImageSchema = z.object({
  url: z.string().url("URL ảnh không hợp lệ"),
  order: z.number().int().nonnegative(),
});

export type ProductImageInput = z.infer<typeof productImageSchema>;

// ============================================
// CREATE PRODUCT SCHEMA
// ============================================

export const createProductSchema = z
  .object({
    // Basic info
    name: z
      .string()
      .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự")
      .max(200, "Tên sản phẩm tối đa 200 ký tự"),
    description: z
      .string()
      .max(5000, "Mô tả tối đa 5000 ký tự")
      .optional()
      .or(z.literal("")),
    categoryId: z.string().cuid("Category ID không hợp lệ"),

    // Variants (phải có ít nhất 1)
    variants: z
      .array(productVariantSchema)
      .min(1, "Phải có ít nhất 1 biến thể"),

    // Images (phải có ít nhất 1, tối đa 10)
    images: z
      .array(productImageSchema)
      .min(1, "Phải có ít nhất 1 ảnh")
      .max(10, "Tối đa 10 ảnh"),
  })
  .refine(
    (data) => {
      // Validate: Chỉ có 1 variant được đánh dấu isDefault
      const defaultVariants = data.variants.filter((v) => v.isDefault);
      return defaultVariants.length === 1;
    },
    {
      message: "Phải có đúng 1 biến thể mặc định",
      path: ["variants"],
    }
  )
  .refine(
    (data) => {
      // Validate: Nếu variant có compareAtPrice, phải > price
      return data.variants.every((v) => {
        if (!v.compareAtPrice || v.compareAtPrice === 0) return true;
        return v.compareAtPrice > v.price;
      });
    },
    {
      message: "Giá gốc phải lớn hơn giá bán",
      path: ["variants"],
    }
  );

export type CreateProductInput = z.infer<typeof createProductSchema>;

// ============================================
// UPDATE PRODUCT SCHEMA
// ============================================

export const updateProductSchema = z
  .object({
    id: z.string().cuid("Product ID không hợp lệ"),
    name: z
      .string()
      .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự")
      .max(200, "Tên sản phẩm tối đa 200 ký tự"),
    description: z
      .string()
      .max(5000, "Mô tả tối đa 5000 ký tự")
      .optional()
      .or(z.literal("")),
    categoryId: z.string().cuid("Category ID không hợp lệ"),
    variants: z
      .array(productVariantSchema)
      .min(1, "Phải có ít nhất 1 biến thể"),
    images: z
      .array(productImageSchema)
      .min(1, "Phải có ít nhất 1 ảnh")
      .max(10, "Tối đa 10 ảnh"),
  })
  .refine(
    (data) => {
      // Validate: Chỉ có 1 variant được đánh dấu isDefault
      const defaultVariants = data.variants.filter((v) => v.isDefault);
      return defaultVariants.length === 1;
    },
    {
      message: "Phải có đúng 1 biến thể mặc định",
      path: ["variants"],
    }
  )
  .refine(
    (data) => {
      // Validate: Nếu variant có compareAtPrice, phải > price
      return data.variants.every((v) => {
        if (!v.compareAtPrice || v.compareAtPrice === 0) return true;
        return v.compareAtPrice > v.price;
      });
    },
    {
      message: "Giá gốc phải lớn hơn giá bán",
      path: ["variants"],
    }
  );

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
