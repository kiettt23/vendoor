import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { OrderSuccessPage } from "@/features/order/components/OrderSuccessPage";
import { OrderHistoryPage } from "@/features/order/components/OrderHistoryPage";

// ============================================
// ORDERS PAGE
// ============================================

/**
 * Orders page with two modes:
 * 1. Success mode (after checkout) - Show order confirmation
 * 2. List mode (normal visit) - Show order history
 *
 * **Query params:**
 * - `orders` - Comma-separated order IDs (success mode)
 */

interface PageProps {
  searchParams: Promise<{
    orders?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  // Check auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const orderIdsParam = params.orders;

  // Mode 1: Success page after checkout (has order IDs in query)
  if (orderIdsParam) {
    return (
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <OrderSuccessPage />
      </Suspense>
    );
  }

  // Mode 2: Order history list
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <OrderHistoryPage />
    </Suspense>
  );
}
