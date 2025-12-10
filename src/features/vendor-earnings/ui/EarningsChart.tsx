"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { formatPrice } from "@/shared/lib";
import type { MonthlyEarnings } from "../api";

interface EarningsChartProps {
  data: MonthlyEarnings[];
}

export function EarningsChart({ data }: EarningsChartProps) {
  const maxEarnings = Math.max(...data.map((d) => d.earnings), 1);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("vi-VN", { month: "short" });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu 6 tháng gần nhất</CardTitle>
        <CardDescription>
          Biểu đồ doanh thu theo tháng (sau khi trừ phí nền tảng)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-[200px]">
          {data.map((item) => {
            const height =
              maxEarnings > 0 ? (item.earnings / maxEarnings) * 100 : 0;

            return (
              <div
                key={item.month}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full flex flex-col items-center">
                  <span className="text-xs text-muted-foreground mb-1">
                    {item.orders} đơn
                  </span>
                  <div
                    className="w-full bg-primary/80 rounded-t-sm transition-all hover:bg-primary"
                    style={{
                      height: `${Math.max(height, 4)}%`,
                      minHeight: "4px",
                    }}
                    title={formatPrice(item.earnings)}
                  />
                </div>
                <span className="text-xs font-medium">
                  {formatMonth(item.month)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tổng 6 tháng:</span>
            <span className="font-semibold">
              {formatPrice(data.reduce((sum, d) => sum + d.earnings, 0))}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
