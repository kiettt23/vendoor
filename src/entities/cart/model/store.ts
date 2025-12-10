"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  TOAST_MESSAGES,
  showToast,
  showCustomToast,
} from "@/shared/lib/constants";
import type { CartStore } from "./types";

function validateQuantity(quantity: number, stock: number) {
  if (quantity <= 0)
    return { isValid: false, message: "Số lượng phải lớn hơn 0" };
  if (quantity > stock)
    return { isValid: false, message: `Chỉ còn ${stock} sản phẩm` };
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
            showCustomToast.error(
              TOAST_MESSAGES.cart.cannotAdd,
              validation.message
            );
            return;
          }

          set({
            items: items.map((item) =>
              item.id === itemId ? { ...item, quantity: newQuantity } : item
            ),
          });
          showToast("cart", "updated");
        } else {
          const quantity = newItem.quantity || 1;
          const validation = validateQuantity(quantity, newItem.stock);

          if (!validation.isValid) {
            showCustomToast.error(
              TOAST_MESSAGES.cart.cannotAdd,
              validation.message
            );
            return;
          }

          set({ items: [...items, { ...newItem, id: itemId, quantity }] });
          showCustomToast.success(
            TOAST_MESSAGES.cart.added,
            newItem.productName
          );
        }
      },

      updateQuantity: (variantId, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === variantId);
        if (!item) return;

        const validation = validateQuantity(quantity, item.stock);
        if (!validation.isValid) {
          showCustomToast.warning(
            TOAST_MESSAGES.cart.invalidQuantity,
            validation.message
          );
          return;
        }

        set({
          items: items.map((i) =>
            i.id === variantId ? { ...i, quantity } : i
          ),
        });
      },

      removeItem: (variantId) => {
        const items = get().items;
        const item = items.find((i) => i.id === variantId);
        set({ items: items.filter((i) => i.id !== variantId) });
        if (item)
          showCustomToast.success(
            TOAST_MESSAGES.cart.removed,
            item.productName
          );
      },

      clearCart: () => set({ items: [] }),

      syncStock: (stockData) => {
        const items = get().items;
        const updatedItems = items.map((item) => {
          const stockInfo = stockData.find((s) => s.variantId === item.variantId);
          if (stockInfo) {
            const newStock = stockInfo.currentStock;
            // Auto-adjust quantity if exceeds new stock
            const newQuantity = Math.min(item.quantity, newStock);
            return { ...item, stock: newStock, quantity: newQuantity > 0 ? newQuantity : item.quantity };
          }
          return item;
        });
        set({ items: updatedItems });
      },
    }),
    { name: "cart-storage" }
  )
);

export const useCart = useCartStore;
