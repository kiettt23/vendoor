"use client";

import { AlertTriangle } from "lucide-react";

import { cn } from "@/shared/lib/utils";

import { STOCK_THRESHOLDS } from "../model";

interface LowStockAlertProps {
  lowStockCount: number;
  outOfStockCount: number;
  className?: string;
}

export function LowStockAlert({
  lowStockCount,
  outOfStockCount,
  className,
}: LowStockAlertProps) {
  const hasIssues = lowStockCount > 0 || outOfStockCount > 0;

  if (!hasIssues) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4",
        className
      )}
    >
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-yellow-600" />
      <div className="flex-1 space-y-1">
        <p className="font-medium text-yellow-800">Cảnh báo tồn kho</p>
        <ul className="space-y-0.5 text-sm text-yellow-700">
          {outOfStockCount > 0 && (
            <li>
              <span className="font-semibold text-red-600">
                {outOfStockCount}
              </span>{" "}
              sản phẩm hết hàng
            </li>
          )}
          {lowStockCount > 0 && (
            <li>
              <span className="font-semibold text-yellow-600">
                {lowStockCount}
              </span>{" "}
              sản phẩm sắp hết (≤{STOCK_THRESHOLDS.LOW_STOCK})
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
