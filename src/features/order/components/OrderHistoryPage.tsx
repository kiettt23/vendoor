"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Store, Calendar, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  getCustomerOrders,
  type OrderListItem,
} from "../actions/get-customer-orders";
import { formatPrice } from "../lib/utils";

/**
 * Order History List Component
 *
 * **Features:**
 * - Display all customer orders
 * - Filter by status
 * - Pagination
 * - Link to order detail
 */

export function OrderHistoryPage() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(
    undefined
  );

  const pageSize = 10;

  useEffect(() => {
    async function loadOrders() {
      try {
        setIsLoading(true);
        const result = await getCustomerOrders({
          page,
          pageSize,
          status: statusFilter,
        });

        setOrders(result.orders);
        setTotal(result.total);
        setHasMore(result.hasMore);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [page, statusFilter]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  return (
    <div className="container mx-auto py-8 max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Đơn Hàng Của Tôi</h1>
          <p className="text-muted-foreground">
            {total > 0 ? `Tổng cộng ${total} đơn hàng` : "Chưa có đơn hàng"}
          </p>
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter || "all"}
          onValueChange={(value) =>
            setStatusFilter(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
            <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
            <SelectItem value="SHIPPED">Đang giao</SelectItem>
            <SelectItem value="DELIVERED">Đã giao</SelectItem>
            <SelectItem value="CANCELLED">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading State */}
      {isLoading && orders.length === 0 && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Đang tải đơn hàng...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && orders.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4">
              <Package className="h-16 w-16 text-muted-foreground mx-auto" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {statusFilter
                    ? "Không có đơn hàng nào với trạng thái này"
                    : "Chưa có đơn hàng nào"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {statusFilter
                    ? "Thử chọn trạng thái khác hoặc xóa bộ lọc."
                    : "Bạn chưa có đơn hàng nào. Hãy khám phá sản phẩm và bắt đầu mua sắm!"}
                </p>
              </div>
              {!statusFilter && (
                <Button asChild>
                  <Link href="/products">Khám phá sản phẩm</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      {orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {order.vendor.shopName}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mã đơn hàng:{" "}
                      <span className="font-mono">{order.orderNumber}</span>
                    </p>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>{order.itemCount} sản phẩm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="font-semibold text-lg">
                    {formatPrice(order.total)}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/orders/${order.id}`}>
                      Xem chi tiết
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > pageSize && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || isLoading}
          >
            Trang trước
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            Trang {page} / {Math.ceil(total / pageSize)}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore || isLoading}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  );
}

// ============================================
// Helper Components
// ============================================

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig: Record<
    string,
    {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }
  > = {
    PENDING: { label: "Chờ xác nhận", variant: "secondary" },
    PENDING_PAYMENT: { label: "Chờ thanh toán", variant: "secondary" },
    PROCESSING: { label: "Đang xử lý", variant: "default" },
    SHIPPED: { label: "Đang giao", variant: "default" },
    DELIVERED: { label: "Đã giao", variant: "outline" },
    CANCELLED: { label: "Đã hủy", variant: "destructive" },
  };

  const config = statusConfig[status] || {
    label: status,
    variant: "outline" as const,
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
