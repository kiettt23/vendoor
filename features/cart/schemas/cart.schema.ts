import { z } from "zod";

/**
 * Cart Validation Schemas
 */

export const addToCartSchema = z.object({
  productId: z.string().min(1, "ID sản phẩm không được để trống"),
  quantity: z.number().int().min(1, "Số lượng phải lớn hơn 0").default(1),
});

export const updateQuantitySchema = z.object({
  productId: z.string().min(1, "ID sản phẩm không được để trống"),
  quantity: z.number().int().min(0, "Số lượng không hợp lệ"),
});

export const removeItemSchema = z.object({
  productId: z.string().min(1, "ID sản phẩm không được để trống"),
});

export const syncCartSchema = z.object({
  items: z.record(z.string(), z.number().int().min(0)),
});

/**
 * Inferred Types
 */
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>;
export type RemoveItemInput = z.infer<typeof removeItemSchema>;
export type SyncCartInput = z.infer<typeof syncCartSchema>;
