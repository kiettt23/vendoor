import { z } from "zod";

export const variantFormSchema = z.object({
  name: z.string().nullable(),
  color: z.string().nullable(),
  size: z.string().nullable(),
  price: z.number().min(1000, "Giá phải lớn hơn 1.000₫"),
  compareAtPrice: z.number().min(1000).nullable(),
  sku: z.string().min(1, "SKU không được để trống"),
  stock: z.number().min(0, "Số lượng không hợp lệ"),
  isDefault: z.boolean(),
});

export type VariantFormData = z.infer<typeof variantFormSchema>;

export const createVariantSchema = variantFormSchema.omit({ isDefault: true });
export type CreateVariantData = z.infer<typeof createVariantSchema>;
