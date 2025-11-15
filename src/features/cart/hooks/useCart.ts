"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import type { CartStore } from "../types";
import { validateQuantityClient } from "../lib/utils";

// ============================================
// ZUSTAND CART STORE (Client State)
// ============================================

/**
 * Global cart state with localStorage persistence
 *
 * Features:
 * - Add/Update/Remove items
 * - Client-side validation (cached stock)
 * - Toast notifications
 * - Auto persist to localStorage
 * - Clear on checkout (manual call)
 *
 * Architecture Decision:
 * - Zustand handles CLIENT state (what's in cart)
 * - React Query handles SERVER state (stock validation)
 * - Separation of concerns
 */
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      /**
       * Add item to cart
       * - If exists: increase quantity
       * - Client validation against cached stock
       * - Toast success/error
       */
      addItem: (newItem) => {
        const items = get().items;
        const itemId = newItem.id || newItem.variantId;
        const existingItem = items.find((item) => item.id === itemId);

        if (existingItem) {
          // Item exists → update quantity
          const newQuantity = existingItem.quantity + (newItem.quantity || 1);

          // Client validation (cached stock)
          const validation = validateQuantityClient(
            newQuantity,
            existingItem.stock
          );

          if (!validation.isValid) {
            toast.error("Không thể thêm vào giỏ hàng", {
              description: validation.message,
            });
            return;
          }

          set({
            items: items.map((item) =>
              item.id === itemId ? { ...item, quantity: newQuantity } : item
            ),
          });

          toast.success("Đã cập nhật giỏ hàng");
        } else {
          // New item → add
          const quantity = newItem.quantity || 1;

          // Client validation
          const validation = validateQuantityClient(quantity, newItem.stock);

          if (!validation.isValid) {
            toast.error("Không thể thêm vào giỏ hàng", {
              description: validation.message,
            });
            return;
          }

          set({
            items: [
              ...items,
              {
                ...newItem,
                id: itemId,
                quantity,
              },
            ],
          });

          toast.success("Đã thêm vào giỏ hàng", {
            description: newItem.productName,
          });
        }
      },

      /**
       * Update item quantity
       * - Client validation against cached stock
       * - Show warning if exceeds
       */
      updateQuantity: (variantId, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === variantId);

        if (!item) return;

        // Client validation
        const validation = validateQuantityClient(quantity, item.stock);

        if (!validation.isValid) {
          toast.warning("Số lượng không hợp lệ", {
            description: validation.message,
          });
          return;
        }

        set({
          items: items.map((i) =>
            i.id === variantId ? { ...i, quantity } : i
          ),
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: (variantId) => {
        const items = get().items;
        const item = items.find((i) => i.id === variantId);

        set({
          items: items.filter((i) => i.id !== variantId),
        });

        if (item) {
          toast.success("Đã xóa khỏi giỏ hàng", {
            description: item.productName,
          });
        }
      },

      /**
       * Clear entire cart
       * - Called after successful checkout
       * - No toast to avoid blocking redirect
       */
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage", // localStorage key
      // No expiration - clear on checkout only (per architecture decision)
    }
  )
);
