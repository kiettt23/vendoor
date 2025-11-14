"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartStore } from "../types";
import {
  calculateItemCount,
  calculateSubtotal,
  findItemByVariant,
  generateCartItemId,
  groupItemsByVendor,
  validateQuantity,
} from "../lib/utils";

// ============================================
// ZUSTAND CART STORE
// ============================================

/**
 * Global cart state management with Zustand
 *
 * Features:
 * - localStorage persistence
 * - Optimized re-renders (only subscribers affected)
 * - No Provider needed
 * - Redux DevTools support
 *
 * Usage:
 * ```tsx
 * // Subscribe to specific state slice
 * const itemCount = useCart((state) => state.itemCount());
 * const addItem = useCart((state) => state.addItem);
 * ```
 */
export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      // ============================================
      // STATE
      // ============================================
      items: [],

      // ============================================
      // COMPUTED VALUES (Getters)
      // ============================================

      itemCount: () => {
        return calculateItemCount(get().items);
      },

      subtotal: () => {
        return calculateSubtotal(get().items);
      },

      getItemsByVendor: () => {
        return groupItemsByVendor(get().items);
      },

      // ============================================
      // ACTIONS
      // ============================================

      /**
       * Add item to cart
       * - If item exists (same variant), increase quantity
       * - Respects stock limit
       */
      addItem: (newItem) => {
        set((state) => {
          const existingItem = findItemByVariant(
            state.items,
            newItem.variantId
          );

          if (existingItem) {
            // Update quantity (max = stock)
            return {
              items: state.items.map((item) =>
                item.id === existingItem.id
                  ? {
                      ...item,
                      quantity: validateQuantity(
                        item.quantity + newItem.quantity,
                        item.stock
                      ),
                    }
                  : item
              ),
            };
          }

          // Add new item
          return {
            items: [
              ...state.items,
              {
                ...newItem,
                id: generateCartItemId(newItem.variantId),
              },
            ],
          };
        });
      },

      /**
       * Remove item from cart
       */
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
      },

      /**
       * Update item quantity
       * - Validates: 1 <= quantity <= stock
       */
      updateQuantity: (itemId, quantity) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                quantity: validateQuantity(quantity, item.stock),
              };
            }
            return item;
          }),
        }));
      },

      /**
       * Clear entire cart
       */
      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage", // localStorage key
      skipHydration: false, // Auto hydrate from localStorage
    }
  )
);
