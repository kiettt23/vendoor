"use client";

import { OrderStatus } from "@prisma/client";
import { Badge } from "@/shared/components/ui/badge";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  PENDING_PAYMENT: {
    label: "Chờ thanh toán",
    variant: "secondary" as const,
  },
  PENDING: {
    label: "Chờ xử lý",
    variant: "secondary" as const,
  },
  PROCESSING: {
    label: "Đang chuẩn bị",
    variant: "default" as const,
  },
  SHIPPED: {
    label: "Đang giao",
    variant: "default" as const,
  },
  DELIVERED: {
    label: "Đã giao",
    variant: "default" as const,
  },
  CANCELLED: {
    label: "Đã hủy",
    variant: "destructive" as const,
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    variant: "destructive" as const,
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  return <Badge variant={config.variant}>{config.label}</Badge>;
}
