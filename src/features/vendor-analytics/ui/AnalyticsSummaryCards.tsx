"use client";

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  BarChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { formatPrice, cn } from "@/shared/lib/utils";

import type { VendorAnalyticsSummary } from "../model/types";

interface AnalyticsSummaryCardsProps {
  summary: VendorAnalyticsSummary;
}

export function AnalyticsSummaryCards({ summary }: AnalyticsSummaryCardsProps) {
  const cards = [
    {
      title: "Doanh thu",
      value: formatPrice(summary.totalRevenue),
      change: summary.revenueChange,
      icon: DollarSign,
    },
    {
      title: "Đơn hàng",
      value: summary.totalOrders.toString(),
      change: summary.ordersChange,
      icon: ShoppingCart,
    },
    {
      title: "Giá trị TB",
      value: formatPrice(summary.averageOrderValue),
      change: null,
      icon: BarChart,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            {card.change !== null && (
              <div className="flex items-center gap-1 mt-1">
                {card.change >= 0 ? (
                  <TrendingUp className="size-3 text-green-600" />
                ) : (
                  <TrendingDown className="size-3 text-red-600" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    card.change >= 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {card.change >= 0 ? "+" : ""}
                  {card.change.toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  so với kỳ trước
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
