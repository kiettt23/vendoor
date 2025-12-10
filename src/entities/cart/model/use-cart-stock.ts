"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/lib/constants/query-keys";
import { useCart } from "./store";
import { getCartItemsStock } from "../api/actions";

/**
 * Hook để sync stock từ database vào cart store.
 * Auto-refetch khi focus lại window.
 */
export function useCartStock() {
  const items = useCart((state) => state.items);
  const syncStock = useCart((state) => state.syncStock);
  const variantIds = items.map((item) => item.variantId);

  const query = useQuery({
    queryKey: queryKeys.cart.stock(variantIds),
    queryFn: () => getCartItemsStock(variantIds),
    enabled: variantIds.length > 0,
    staleTime: 30_000, // 30s - stock có thể thay đổi nhanh
    gcTime: 60_000,
    refetchOnWindowFocus: true,
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
