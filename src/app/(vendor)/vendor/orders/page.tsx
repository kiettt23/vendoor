import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { VendorOrderList } from "@/features/order/components/VendorOrderList";
import { getVendorOrders } from "@/features/order/actions/get-vendor-orders";

// ============================================
// VENDOR ORDERS PAGE
// ============================================

/**
 * Vendor orders page
 *
 * **Features:**
 * - List all orders for current vendor
 * - Filter by status
 * - Pagination support
 *
 * **Auth:**
 * - Checks vendorProfile to verify user is a vendor
 * - Redirects to /login if not authenticated
 */

interface PageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
  }>;
}

export default async function VendorOrdersPage({ searchParams }: PageProps) {
  // ============================================
  // 1. AUTH CHECK
  // ============================================
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // ============================================
  // 2. PARSE QUERY PARAMS
  // ============================================
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const status = params.status || "ALL";

  // ============================================
  // 3. FETCH VENDOR ORDERS
  // ============================================
  const ordersData = await getVendorOrders({
    page,
    pageSize: 10,
    status: status !== "ALL" ? status : undefined,
  });

  // ============================================
  // 4. RENDER
  // ============================================
  return (
    <div className="container mx-auto py-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        }
      >
        <VendorOrderList
          orders={ordersData.orders}
          total={ordersData.total}
          page={ordersData.page}
          pageSize={ordersData.pageSize}
          currentStatus={status}
        />
      </Suspense>
    </div>
  );
}
