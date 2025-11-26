"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { CartStore } from "./types";

function validateQuantity(quantity: number, stock: number) {
  if (quantity <= 0) return { isValid: false, message: "Số lượng phải lớn hơn 0" };
  if (quantity > stock) return { isValid: false, message: `Chỉ còn ${stock} sản phẩm` };
  return { isValid: true };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) => {
        const items = get().items;
        const itemId = newItem.id || newItem.variantId;
        const existingItem = items.find((item) => item.id === itemId);

        if (existingItem) {
          const newQuantity = existingItem.quantity + (newItem.quantity || 1);
          const validation = validateQuantity(newQuantity, existingItem.stock);

          if (!validation.isValid) {
            toast.error("Không thể thêm", { description: validation.message });
            return;
          }

          set({
            items: items.map((item) =>
              item.id === itemId ? { ...item, quantity: newQuantity } : item
            ),
          });
          toast.success("Đã cập nhật giỏ hàng");
        } else {
          const quantity = newItem.quantity || 1;
          const validation = validateQuantity(quantity, newItem.stock);

          if (!validation.isValid) {
            toast.error("Không thể thêm", { description: validation.message });
            return;
          }

          set({ items: [...items, { ...newItem, id: itemId, quantity }] });
          toast.success("Đã thêm vào giỏ", { description: newItem.productName });
        }
      },

      updateQuantity: (variantId, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === variantId);
        if (!item) return;

        const validation = validateQuantity(quantity, item.stock);
        if (!validation.isValid) {
          toast.warning("Số lượng không hợp lệ", { description: validation.message });
          return;
        }

        set({ items: items.map((i) => (i.id === variantId ? { ...i, quantity } : i)) });
      },

      removeItem: (variantId) => {
        const items = get().items;
        const item = items.find((i) => i.id === variantId);
        set({ items: items.filter((i) => i.id !== variantId) });
        if (item) toast.success("Đã xóa", { description: item.productName });
      },

      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" }
  )
);

export const useCart = useCartStore;

