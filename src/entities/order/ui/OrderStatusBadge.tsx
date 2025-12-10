import { Badge } from "@/shared/ui/badge";
import { ORDER_STATUS_BADGE, getBadgeConfig } from "@/shared/lib/constants";
import type { OrderStatus } from "../model/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1",
} as const;

export function OrderStatusBadge({
  status,
  size = "md",
  className,
}: OrderStatusBadgeProps) {
  const config = getBadgeConfig(status, ORDER_STATUS_BADGE);

  return (
    <Badge variant={config.variant} className={`${sizeClasses[size]} ${className || ""}`}>
      {config.label}
    </Badge>
  );
}
