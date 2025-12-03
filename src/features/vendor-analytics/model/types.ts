/**
 * Time range filter options
 */
export type TimeRange = "7d" | "30d" | "90d" | "365d";

export const TIME_RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "90d", label: "3 tháng" },
  { value: "365d", label: "1 năm" },
];

/**
 * Get date range from time range option
 */
export function getDateRange(range: TimeRange): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  const days = parseInt(range.replace("d", ""), 10);
  start.setDate(start.getDate() - days);

  return { start, end };
}

/**
 * Revenue data point
 */
export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orderCount: number;
}

/**
 * Product performance data
 */
export interface ProductPerformance {
  productId: string;
  productName: string;
  productSlug: string;
  image: string | null;
  totalSold: number;
  totalRevenue: number;
}

/**
 * Vendor analytics summary
 */
export interface VendorAnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueChange: number;
  ordersChange: number;
}

/**
 * Full analytics data
 */
export interface VendorAnalytics {
  summary: VendorAnalyticsSummary;
  revenueChart: RevenueDataPoint[];
  topProducts: ProductPerformance[];
}
