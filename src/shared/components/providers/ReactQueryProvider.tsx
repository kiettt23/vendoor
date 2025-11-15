"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

// ============================================
// REACT QUERY PROVIDER
// ============================================

/**
 * Provider cho React Query
 *
 * Architecture Note:
 * - Must be client component ("use client")
 * - Create QueryClient in useState để tránh recreate mỗi render
 * - DevTools chỉ show trong development mode
 */
export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Default settings cho mọi queries
            staleTime: 60 * 1000, // 1 minute default
            retry: 1, // Retry 1 lần nếu fail
            refetchOnWindowFocus: false, // Không auto refetch khi focus (trừ cart)
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
