import {
  DollarSign,
  Clock,
  CheckCircle,
  TrendingUp,
  Receipt,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatPrice } from "@/shared/lib";
import { ORDER } from "@/shared/lib/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import type { EarningsSummary } from "../api";

interface EarningsStatsProps {
  summary: EarningsSummary;
}

const PLATFORM_FEE_PERCENT = ORDER.PLATFORM_FEE_RATE * 100;

export function EarningsStats({ summary }: EarningsStatsProps) {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: formatPrice(summary.totalEarnings),
      icon: DollarSign,
      description: "Sau khi trừ phí nền tảng",
      tooltip: "Tổng thu nhập thực nhận = Tiền hàng - Phí nền tảng (không bao gồm phí ship)",
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Đã xác nhận",
      value: formatPrice(summary.completedEarnings),
      icon: CheckCircle,
      description: "Đơn đã giao thành công",
      tooltip: "Doanh thu từ các đơn hàng đã hoàn tất (DELIVERED). Đây là số tiền bạn chắc chắn nhận được.",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Đang chờ",
      value: formatPrice(summary.pendingEarnings),
      icon: Clock,
      description: "Chờ giao hàng thành công",
      tooltip: "Doanh thu từ đơn đang xử lý/giao hàng. Sẽ chuyển sang 'Đã xác nhận' khi đơn hoàn tất.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Phí nền tảng",
      value: formatPrice(summary.totalPlatformFee),
      icon: Receipt,
      description: `${PLATFORM_FEE_PERCENT}% trên mỗi đơn hàng`,
      tooltip: `Vendoor thu ${PLATFORM_FEE_PERCENT}% phí nền tảng trên giá trị đơn hàng (không tính phí ship). Phí này đã được trừ trong "Tổng doanh thu".`,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Tổng đơn hàng",
      value: summary.totalOrders.toString(),
      icon: TrendingUp,
      description: "Đơn có doanh thu",
      tooltip: "Số đơn hàng tạo ra doanh thu (không tính đơn đã hủy hoặc hoàn tiền)",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-1">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{stat.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
}
