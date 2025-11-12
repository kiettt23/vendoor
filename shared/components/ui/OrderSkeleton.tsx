"use client";

import { Skeleton } from "./skeleton";
import { Card } from "./card";

const OrderItemSkeleton = () => {
  return (
    <Card className="p-4 md:p-6 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <div className="flex gap-4">
        <Skeleton className="h-24 w-24 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full max-w-xs" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      <div className="border-t pt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </Card>
  );
};

const OrderListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array(count)
        .fill(0)
        .map((_, i) => (
          <OrderItemSkeleton key={i} />
        ))}
    </div>
  );
};

export { OrderItemSkeleton, OrderListSkeleton };
