import { Badge } from "@/shared/components/ui/badge";
import { VendorStatus } from "@prisma/client";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface VendorStatusBadgeProps {
  status: VendorStatus;
}

export function VendorStatusBadge({ status }: VendorStatusBadgeProps) {
  const config = {
    PENDING: {
      label: "Chờ duyệt",
      variant: "secondary" as const,
      icon: Clock,
    },
    APPROVED: {
      label: "Đã duyệt",
      variant: "default" as const,
      icon: CheckCircle,
    },
    REJECTED: {
      label: "Đã từ chối",
      variant: "destructive" as const,
      icon: XCircle,
    },
    SUSPENDED: {
      label: "Đình chỉ",
      variant: "destructive" as const,
      icon: XCircle,
    },
  };

  const { label, variant, icon: Icon } = config[status];

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
}
