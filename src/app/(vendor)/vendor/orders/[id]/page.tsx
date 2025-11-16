import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import { getVendorOrderDetail } from "@/features/order/actions/get-vendor-order-detail";
import { VendorOrderDetailPage } from "@/features/order/components/VendorOrderDetailPage";
import { Loader2 } from "lucide-react";
import { prisma } from "@/shared/lib/prisma";

// ============================================
// VENDOR ORDER DETAIL ROUTE
// ============================================

/**
 * Route: /vendor/orders/[id]
 *
 * **Features:**
 * - Auth check (requires VENDOR role)
 * - Fetch order detail with all info
 * - Display full order page
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VendorOrderDetailRoute({ params }: PageProps) {
  // Auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  // Check VENDOR role via database
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  if (!user?.roles.includes("VENDOR")) {
    redirect("/");
  }

  // Get order ID from params
  const { id } = await params;

  // Fetch order detail
  const result = await getVendorOrderDetail(id);

  if (!result.success) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">
            Không thể tải thông tin đơn hàng
          </p>
          <p className="text-sm text-muted-foreground mt-2">{result.error}</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <VendorOrderDetailPage order={result.data} />
    </Suspense>
  );
}
