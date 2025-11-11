import { z } from "zod";

export const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export const updateQuantitySchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(0, "Quantity must be non-negative"),
});

export const removeItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

export const syncCartSchema = z.object({
  items: z.record(z.string(), z.number().int().min(0)),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>;
export type RemoveItemInput = z.infer<typeof removeItemSchema>;
export type SyncCartInput = z.infer<typeof syncCartSchema>;
