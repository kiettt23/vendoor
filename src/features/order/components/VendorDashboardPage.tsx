"use client";

import { VendorDashboardStats } from "../actions/get-vendor-dashboard-stats";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { formatPrice } from "@/features/order/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

// ============================================
// VENDOR DASHBOARD PAGE
// ============================================

/**
 * Vendor dashboard with stats and recent orders
 *
 * **Features:**
 * - Stats cards: Total orders, Revenue, Pending orders, Monthly revenue
 * - Recent orders list (5 latest)
 * - Quick action links
 */

interface VendorDashboardPageProps {
  stats: VendorDashboardStats;
}

// Status mapping
const ORDER_STATUS_MAP: Record<
  string,
  {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "warning"
      | "success"
      | "info"
      | "purple";
  }
> = {
  PENDING_PAYMENT: { label: "Chờ thanh toán", variant: "secondary" },
  PENDING: { label: "Chờ xử lý", variant: "warning" },
  PROCESSING: { label: "Đang xử lý", variant: "info" },
  SHIPPED: { label: "Đã gửi hàng", variant: "purple" },
  DELIVERED: { label: "Đã giao", variant: "success" },
  CANCELLED: { label: "Đã hủy", variant: "destructive" },
};

export function VendorDashboardPage({ stats }: VendorDashboardPageProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Tổng quan về cửa hàng của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Tất cả thời gian</p>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Từ đơn hàng đã giao</p>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cần xử lý</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              Đơn chờ và đang xử lý
            </p>
          </CardContent>
        </Card>

        {/* Revenue This Month */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Doanh thu tháng này
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(stats.revenueThisMonth)}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("vi-VN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Đơn hàng gần đây</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/vendor/orders">
              Xem tất cả
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => {
                const statusInfo = ORDER_STATUS_MAP[order.status] || {
                  label: order.status,
                  variant: "outline",
                };

                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/vendor/orders/${order.id}`}
                          className="font-medium hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customerName} •{" "}
                        {formatDistanceToNow(new Date(order.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPrice(order.total)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bạn nhận: {formatPrice(order.vendorEarnings)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Đơn hàng cần xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Bạn có {stats.pendingOrders} đơn hàng đang chờ xử lý
            </p>
            <Button asChild className="w-full">
              <Link href="/vendor/orders?status=PENDING">
                Xem đơn chờ xử lý
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quản lý đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Xem tất cả {stats.totalOrders} đơn hàng của bạn
            </p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/vendor/orders">Xem tất cả đơn hàng</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
