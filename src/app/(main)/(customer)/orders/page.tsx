import { Suspense } from "react";
import { requireAuth } from "@/entities/user";
import { OrderSuccessPage, OrderHistoryPage } from "@/widgets/orders";

// Force dynamic to ensure fresh order data
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ orders?: string }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  await requireAuth();

  const params = await searchParams;

  if (params.orders) {
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
