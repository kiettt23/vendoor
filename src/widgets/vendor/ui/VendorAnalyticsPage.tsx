import { requireVendor } from "@/entities/vendor";

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
  const { vendorProfile } = await requireVendor();

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
