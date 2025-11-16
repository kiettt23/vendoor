import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/prisma";
import { getVendorDashboardStats } from "@/features/order/actions/get-vendor-dashboard-stats";
import { VendorDashboardPage } from "@/features/order/components/VendorDashboardPage";
import { Loader2 } from "lucide-react";

// ============================================
// VENDOR DASHBOARD ROUTE
// ============================================

/**
 * Route: /vendor (default vendor page)
 *
 * **Features:**
 * - Auth check (requires VENDOR role)
 * - Fetch dashboard stats
 * - Display overview
 */

export default async function VendorDashboardRoute() {
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

  // Fetch dashboard stats
  const result = await getVendorDashboardStats();

  if (!result.success) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-destructive">
            Không thể tải thông tin dashboard
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
      <VendorDashboardPage stats={result.data} />
    </Suspense>
  );
}
