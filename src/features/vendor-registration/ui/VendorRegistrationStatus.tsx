import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Store,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ROUTES, VENDOR_STATUS_BADGE, getBadgeConfig } from "@/shared/lib/constants";

type VendorStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";

interface VendorRegistrationStatusProps {
  status: VendorStatus;
  shopName: string;
  slug: string;
}

const statusConfig: Record<
  VendorStatus,
  {
    icon: typeof Clock;
    description: string;
    color: string;
  }
> = {
  PENDING: {
    icon: Clock,
    description:
      "Đơn đăng ký của bạn đang được xem xét. Chúng tôi sẽ thông báo khi có kết quả.",
    color: "text-yellow-600",
  },
  APPROVED: {
    icon: CheckCircle,
    description:
      "Chúc mừng! Bạn đã trở thành người bán. Hãy bắt đầu đăng sản phẩm!",
    color: "text-green-600",
  },
  REJECTED: {
    icon: XCircle,
    description:
      "Đơn đăng ký của bạn đã bị từ chối. Vui lòng liên hệ hỗ trợ để biết thêm chi tiết.",
    color: "text-red-600",
  },
  SUSPENDED: {
    icon: AlertTriangle,
    description:
      "Tài khoản người bán của bạn đã bị đình chỉ. Vui lòng liên hệ hỗ trợ.",
    color: "text-red-600",
  },
};

export function VendorRegistrationStatus({
  status,
  shopName,
  slug,
}: VendorRegistrationStatusProps) {
  const config = statusConfig[status];
  const badgeConfig = getBadgeConfig(status, VENDOR_STATUS_BADGE);
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              {shopName}
              <Badge variant={badgeConfig.variant}>{badgeConfig.label}</Badge>
            </CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      {status === "APPROVED" && (
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <Link href={ROUTES.VENDOR_PRODUCTS}>
                <Store className="mr-2 h-4 w-4" />
                Quản lý sản phẩm
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={ROUTES.STORE_DETAIL(slug)}>Xem cửa hàng</Link>
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
