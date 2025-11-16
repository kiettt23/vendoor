import { getAdminDashboardStats } from "../actions/get-dashboard-stats";
import { getOrdersChartData } from "../actions/get-orders-chart-data";
import { getRevenueChartData } from "../actions/get-revenue-chart-data";
import { OrdersChart } from "./OrdersChart";
import { RevenueChart } from "./RevenueChart";
import { StatsCard } from "./StatsCard";
import {
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

export async function AdminDashboardPage() {
  // Fetch data in parallel
  const [statsResult, ordersChartResult, revenueChartResult] =
    await Promise.all([
      getAdminDashboardStats(),
      getOrdersChartData(12),
      getRevenueChartData(12),
    ]);

  // Handle unauthorized
  if (
    !statsResult.success ||
    !ordersChartResult.success ||
    !revenueChartResult.success
  ) {
    redirect("/login");
  }

  const stats = statsResult.data!;
  const ordersData = ordersChartResult.data!;
  const revenueData = revenueChartResult.data!;

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Tổng quan về toàn bộ nền tảng</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng Vendors"
          value={stats.vendors.total}
          description={`${stats.vendors.pending} chờ duyệt, ${stats.vendors.approved} đã duyệt`}
          icon={Store}
        />
        <StatsCard
          title="Tổng Sản phẩm"
          value={stats.products.total}
          description="Sản phẩm đang hoạt động"
          icon={Package}
        />
        <StatsCard
          title="Tổng Đơn hàng"
          value={stats.orders.total}
          description="Tất cả đơn hàng"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Doanh thu Platform"
          value={formatCurrency(stats.revenue.total)}
          description={`Tháng này: ${formatCurrency(stats.revenue.thisMonth)}`}
          icon={DollarSign}
        />
      </div>

      {/* Vendor Status Details */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Chờ duyệt"
          value={stats.vendors.pending}
          description="Vendors đang chờ phê duyệt"
          icon={Clock}
        />
        <StatsCard
          title="Đã duyệt"
          value={stats.vendors.approved}
          description="Vendors đang hoạt động"
          icon={CheckCircle}
        />
        <StatsCard
          title="Đã từ chối"
          value={stats.vendors.rejected}
          description="Vendors bị từ chối"
          icon={XCircle}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <OrdersChart data={ordersData} />
        <RevenueChart data={revenueData} />
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Thao tác nhanh</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/vendors">
              <Users className="mr-2 h-4 w-4" />
              Quản lý Vendors
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/orders">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Xem Đơn hàng
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/categories">
              <Package className="mr-2 h-4 w-4" />
              Quản lý Danh mục
            </Link>
          </Button>
          <Button asChild variant="outline" className="justify-start">
            <Link href="/admin/products">
              <Package className="mr-2 h-4 w-4" />
              Xem Sản phẩm
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
