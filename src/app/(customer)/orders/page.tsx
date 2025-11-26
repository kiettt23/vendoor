import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { Suspense } from "react";
import { OrderSuccessPage, OrderHistoryPage } from "@/widgets/orders";

interface PageProps {
  searchParams: Promise<{ orders?: string }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const params = await searchParams;

  if (params.orders) {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
        <OrderSuccessPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <OrderHistoryPage />
    </Suspense>
  );
}
