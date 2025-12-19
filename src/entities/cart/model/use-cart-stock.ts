"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys, STALE_TIME, GC_TIME } from "@/shared/lib/constants";
import { useCart } from "./store";
import { getCartItemsStock } from "../api/actions";

/**
 * Hook để sync stock từ database vào cart store.
 * Auto-refetch khi focus lại window vì stock thay đổi thường xuyên.
 *
 * @returns Object với loading state và refetch function
 *
 * @example
 * // Trong CartPage hoặc Checkout
 * const { isLoading, isFetching, refetch } = useCartStock();
 *
 * // Manual refetch khi cần
 * <button onClick={() => refetch()}>Refresh Stock</button>
 */
export function useCartStock() {
  const items = useCart((state) => state.items);
  const syncStock = useCart((state) => state.syncStock);
  const variantIds = items.map((item) => item.variantId);

  const query = useQuery({
    queryKey: queryKeys.cart.stock(variantIds),
    queryFn: () => getCartItemsStock(variantIds),
    enabled: variantIds.length > 0,
    staleTime: STALE_TIME.STOCK, // 30s - stock changes frequently
    gcTime: GC_TIME.SHORT,
    refetchOnWindowFocus: true, // Always refetch stock on focus
  });

  useEffect(() => {
    if (query.data) {
      syncStock(query.data);
    }
  }, [query.data, syncStock]);

  return {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}
