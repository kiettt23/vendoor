import { Skeleton } from "./skeleton";

export function ListLoadingSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
          <Skeleton className="h-12 w-12 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[150px]" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}

export function StatsCardsLoading({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-6 border rounded-lg">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

export function TableLoadingSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-24" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b last:border-b-0">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-24" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductGridLoading({ items = 8 }: { items?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="aspect-square w-full" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartItemsLoading({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-lg">
          <Skeleton className="h-20 w-20 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-3 w-[100px]" />
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-6 w-20" />
        </div>
      ))}
    </div>
  );
}

export function OrderSummaryLoading() {
  return (
    <div className="p-6 border rounded-lg space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between pt-2 border-t">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

