"use client";

import { useQuery } from "@tanstack/react-query";
import type { CartItem } from "../types";
import { validateCartStock } from "../actions/validate-stock";

// ============================================
// REACT QUERY HOOK: Cart Stock Validation
// ============================================

/**
 * Hook to validate cart items against DB stock
 *
 * Architecture Decision (Q2: React Query with staleTime):
 * - Fetches stock validation from server
 * - Caches result for 5 minutes (staleTime)
 * - Auto refetch when cart items change
 * - Shows loading/error states
 *
 * Usage:
 * ```tsx
 * const { data, isLoading, isError } = useCartStockValidation(cartItems);
 *
 * if (data?.hasWarnings) {
 *   // Show warning badges
 * }
 * ```
 */
export function useCartStockValidation(items: CartItem[]) {
  return useQuery({
    queryKey: ["cart-stock-validation", items.map((i) => i.id).join(",")],
    queryFn: async () => {
      // Transform cart items to validation input
      const validationInput = items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      }));

      return validateCartStock(validationInput);
    },
    enabled: items.length > 0, // Only run if cart has items
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (per Q2 decision)
    refetchOnWindowFocus: true, // Revalidate when user returns to tab
    refetchOnMount: true, // Always check on mount (fresh data)
  });
}
