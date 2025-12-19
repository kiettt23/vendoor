import { z } from "zod";

export const bulkUpdateStockSchema = z.object({
  updates: z
    .array(
      z.object({
        variantId: z.string().min(1),
        stock: z.number().int().min(0, "Số lượng không được âm"),
      })
    )
    .min(1, "Cần ít nhất 1 sản phẩm"),
});

export type BulkUpdateStockInput = z.infer<typeof bulkUpdateStockSchema>;

export const updateStockSchema = z.object({
  variantId: z.string().min(1),
  stock: z.number().int().min(0, "Số lượng không được âm"),
});

export type UpdateStockInput = z.infer<typeof updateStockSchema>;
