import { headers } from "next/headers";
import { BarChart } from "lucide-react";

import { auth } from "@/shared/lib/auth/config";
import { prisma } from "@/shared/lib/db";

import {
  getVendorAnalytics,
  AnalyticsSummaryCards,
  RevenueChart,
  TopProductsTable,
  TimeRangeFilter,
  type TimeRange,
} from "@/features/vendor-analytics";

interface VendorAnalyticsPageProps {
  timeRange?: TimeRange;
}

export async function VendorAnalyticsPage({
  timeRange = "30d",
}: VendorAnalyticsPageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;

  // Get vendor profile
  const vendorProfile = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!vendorProfile) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BarChart className="mb-4 size-12 text-muted-foreground" />
        <p className="text-lg font-medium">Không tìm thấy hồ sơ vendor</p>
        <p className="text-sm text-muted-foreground">
          Vui lòng đăng ký trở thành nhà bán hàng trước
        </p>
      </div>
    );
  }

  const analytics = await getVendorAnalytics(vendorProfile.id, timeRange);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Phân Tích Doanh Thu</h1>
          <p className="text-muted-foreground">
            Theo dõi hiệu quả kinh doanh của bạn
          </p>
        </div>
        <TimeRangeFilter currentRange={timeRange} />
      </div>

      {/* Summary cards */}
      <AnalyticsSummaryCards summary={analytics.summary} />

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={analytics.revenueChart} />
        </div>
        <div>
          <TopProductsTable products={analytics.topProducts} />
        </div>
      </div>
    </div>
  );
}
