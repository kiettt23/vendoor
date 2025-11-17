import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  slug: z
    .string()
    .min(1, "Slug là bắt buộc")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"
    ),
  description: z.string().optional(),
  image: z.string().url("URL ảnh không hợp lệ").optional().or(z.literal("")),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.string(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
