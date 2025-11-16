"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, Eye, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Badge } from "@/shared/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatPrice } from "../lib/utils";
import type { VendorOrderListItem } from "../actions/get-vendor-orders";

/**
 * VendorOrderList Component
 *
 * **Features:**
 * - Display vendor's orders in table format
 * - Filter by status (All, Pending, Processing, Shipped, Delivered, Cancelled)
 * - Pagination controls
 * - Quick actions: View detail
 * - Responsive design
 *
 * **Props:**
 * - orders: Array of order items
 * - total: Total count for pagination
 * - page: Current page
 * - pageSize: Items per page
 * - currentStatus: Current filter status
 */

interface VendorOrderListProps {
  orders: VendorOrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  currentStatus?: string;
}

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
      | "purple"
      | null
      | undefined;
  }
> = {
  PENDING_PAYMENT: { label: "Chờ thanh toán", variant: "secondary" },
  PENDING: { label: "Chờ xử lý", variant: "warning" },
  PROCESSING: { label: "Đang xử lý", variant: "info" },
  SHIPPED: { label: "Đã gửi hàng", variant: "purple" },
  DELIVERED: { label: "Đã giao", variant: "success" },
  CANCELLED: { label: "Đã hủy", variant: "destructive" },
};

export function VendorOrderList({
  orders,
  total,
  page,
  pageSize,
  currentStatus = "ALL",
}: VendorOrderListProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);

  // Calculate pagination
  const totalPages = Math.ceil(total / pageSize);
  const hasMore = page < totalPages;
  const hasPrevious = page > 1;

  // Handle status filter change
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    const params = new URLSearchParams();
    if (newStatus !== "ALL") {
      params.set("status", newStatus);
    }
    router.push(`/vendor/orders?${params.toString()}`);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    if (status !== "ALL") {
      params.set("status", status);
    }
    router.push(`/vendor/orders?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Đơn Hàng</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý đơn hàng của shop
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tất cả</SelectItem>
              <SelectItem value="PENDING_PAYMENT">Chờ thanh toán</SelectItem>
              <SelectItem value="PENDING">Chờ xử lý</SelectItem>
              <SelectItem value="PROCESSING">Đang xử lý</SelectItem>
              <SelectItem value="SHIPPED">Đã gửi hàng</SelectItem>
              <SelectItem value="DELIVERED">Đã giao</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Danh Sách Đơn Hàng
            <span className="text-muted-foreground font-normal text-sm">
              ({total} đơn hàng)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng</h3>
              <p className="text-muted-foreground">
                {status !== "ALL"
                  ? `Không có đơn hàng với trạng thái "${
                      ORDER_STATUS_MAP[status]?.label || status
                    }"`
                  : "Chưa có đơn hàng nào. Đơn hàng sẽ xuất hiện ở đây khi khách hàng đặt mua sản phẩm của bạn."}
              </p>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Số lượng</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày đặt</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        {/* Order Number */}
                        <TableCell className="font-mono text-sm">
                          {order.orderNumber}
                        </TableCell>

                        {/* Customer Info */}
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {order.shippingInfo.phone}
                            </p>
                          </div>
                        </TableCell>

                        {/* Item Count */}
                        <TableCell>
                          <span className="text-muted-foreground">
                            {order.itemCount} sản phẩm
                          </span>
                        </TableCell>

                        {/* Total */}
                        <TableCell className="font-semibold">
                          {formatPrice(order.total)}
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell>
                          <Badge
                            variant={
                              ORDER_STATUS_MAP[order.status]?.variant ||
                              "default"
                            }
                          >
                            {ORDER_STATUS_MAP[order.status]?.label ||
                              order.status}
                          </Badge>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="gap-2"
                          >
                            <Link href={`/vendor/orders/${order.id}`}>
                              <Eye className="h-4 w-4" />
                              Xem
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Trang {page} / {totalPages} - Hiển thị{" "}
                    {(page - 1) * pageSize + 1} đến{" "}
                    {Math.min(page * pageSize, total)} trong tổng số {total} đơn
                    hàng
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={!hasPrevious}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={!hasMore}
                    >
                      Tiếp
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
