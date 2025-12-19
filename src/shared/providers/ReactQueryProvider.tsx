"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

import { STALE_TIME, GC_TIME } from "@/shared/lib/constants";

/**
 * React Query Provider với optimized caching defaults
 * 
 * Cache Strategy:
 * - staleTime: Data considered fresh for this duration (no refetch)
 * - gcTime: Inactive queries kept in cache for this duration
 * - refetchOnWindowFocus: Disabled to reduce unnecessary requests
 * 
 * Per-query overrides can be set using staleTime from STALE_TIME constants
 */
export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default: 5 minutes fresh, good balance for most data
            staleTime: STALE_TIME.PRODUCTS,
            // Keep inactive queries for 30 minutes
            gcTime: GC_TIME.DEFAULT,
            // Don't refetch on window focus - reduces unnecessary requests
            refetchOnWindowFocus: false,
            // Retry once on failure
            retry: 1,
            // Don't refetch on mount if data exists
            refetchOnMount: false,
          },
          mutations: {
            // Retry mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
