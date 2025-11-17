"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { Eye } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { OrderStatus } from "@prisma/client";

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  platformFee: number;
  vendorEarnings: number;
  createdAt: Date;
  vendor: {
    shopName: string;
  };
  customer: {
    name: string | null;
    email: string;
  };
}

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  if (orders.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy đơn hàng nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã đơn</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Tổng tiền</TableHead>
            <TableHead className="text-right">Phí nền tảng</TableHead>
            <TableHead className="text-right">Thu nhập vendor</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{order.vendor.shopName}</TableCell>
              <TableCell>
                <div>
                  <p className="text-sm">{order.customer.name || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                {order.total.toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell className="text-right">
                {order.platformFee.toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell className="text-right">
                {order.vendorEarnings.toLocaleString("vi-VN")} ₫
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(order.createdAt), {
                  addSuffix: true,
                  locale: vi,
                })}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/orders/${order.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    Chi tiết
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
