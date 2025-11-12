"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { addToCart as addToCartAction } from "../actions/add-to-cart.action";
import { updateQuantity as updateQuantityAction } from "../actions/update-quantity.action";
import { removeItem as removeItemAction } from "../actions/remove-item.action";
import { syncCart as syncCartAction } from "../actions/sync-cart.action";
import { getCart } from "../queries/get-cart.query";
import { toast } from "sonner";
import type { CartState } from "@/types";

const CART_STORAGE_KEY = "vendoor_cart";

export function useCart() {
  const [isPending, startTransition] = useTransition();
  const [cart, setCart] = useState<CartState>({
    items: {},
    total: 0,
    isLoading: true,
  });

  useEffect(() => {
    const loadCart = async () => {
      try {
        const serverCart = await getCart();
        const serverItems = serverCart?.items || {};
        const serverTotal = serverCart?.total || 0;

        const localCart = localStorage.getItem(CART_STORAGE_KEY);
        if (localCart) {
          const parsedLocalCart = JSON.parse(localCart) as Record<
            string,
            number
          >;

          if (
            Object.keys(parsedLocalCart).length > 0 &&
            Object.keys(serverItems).length === 0
          ) {
            await syncCartAction({ items: parsedLocalCart });
            setCart({
              items: parsedLocalCart,
              total: Object.values(parsedLocalCart).reduce(
                (sum, qty) => sum + qty,
                0
              ),
              isLoading: false,
            });
          } else {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serverItems));
            setCart({
              items: serverItems,
              total: serverTotal,
              isLoading: false,
            });
          }
        } else {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serverItems));
          setCart({
            items: serverItems,
            total: serverTotal,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Failed to load cart:", error);
        const localCart = localStorage.getItem(CART_STORAGE_KEY);
        if (localCart) {
          const parsedLocalCart = JSON.parse(localCart) as Record<
            string,
            number
          >;
          setCart({
            items: parsedLocalCart,
            total: Object.values(parsedLocalCart).reduce(
              (sum, qty) => sum + qty,
              0
            ),
            isLoading: false,
          });
        } else {
          setCart({ items: {}, total: 0, isLoading: false });
        }
      }
    };

    loadCart();
  }, []);

  const updateLocalCart = useCallback((items: Record<string, number>) => {
    const total = Object.values(items).reduce((sum, qty) => sum + qty, 0);
    setCart({ items, total, isLoading: false });
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addToCart = useCallback(
    async (productId: string) => {
      const optimisticItems = {
        ...cart.items,
        [productId]: (cart.items[productId] || 0) + 1,
      };
      updateLocalCart(optimisticItems);

      startTransition(async () => {
        const result = await addToCartAction({ productId, quantity: 1 });
        if (result.success) {
          toast.success("Đã thêm vào giỏ hàng");
        } else {
          updateLocalCart(cart.items);
          toast.error(result.error || "Không thể thêm vào giỏ hàng");
        }
      });
    },
    [cart.items, updateLocalCart]
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      const previousItems = cart.items;

      const optimisticItems = { ...cart.items };
      if (quantity === 0) {
        delete optimisticItems[productId];
      } else {
        optimisticItems[productId] = quantity;
      }
      updateLocalCart(optimisticItems);

      startTransition(async () => {
        const result = await updateQuantityAction({ productId, quantity });
        if (!result.success) {
          updateLocalCart(previousItems);
          toast.error(result.error || "Không thể cập nhật số lượng");
        }
      });
    },
    [cart.items, updateLocalCart]
  );

  const removeItem = useCallback(
    async (productId: string) => {
      const previousItems = cart.items;

      const optimisticItems = { ...cart.items };
      delete optimisticItems[productId];
      updateLocalCart(optimisticItems);

      startTransition(async () => {
        const result = await removeItemAction({ productId });
        if (result.success) {
          toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
        } else {
          updateLocalCart(previousItems);
          toast.error(result.error || "Không thể xóa sản phẩm");
        }
      });
    },
    [cart.items, updateLocalCart]
  );

  const clearCart = useCallback(() => {
    updateLocalCart({});
  }, [updateLocalCart]);

  const getQuantity = useCallback(
    (productId: string) => {
      return cart.items[productId] || 0;
    },
    [cart.items]
  );

  return {
    items: cart.items,
    total: cart.total,
    isLoading: cart.isLoading,
    isPending,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getQuantity,
  };
}
