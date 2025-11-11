import { z } from "zod";

/**
 * Validation schema cho Product
 * Dùng chung cho: add-product, edit-product, admin review
 */
export const productSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  category: z.string().min(1, "Vui lòng chọn danh mục"),
  price: z.number().positive("Giá bán phải lớn hơn 0"),
  mrp: z.number().positive("Giá gốc phải lớn hơn 0"),
});

export type ProductFormData = z.infer<typeof productSchema>;
