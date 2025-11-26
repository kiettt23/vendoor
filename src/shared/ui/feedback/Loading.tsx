import { Skeleton } from "@/shared/ui/skeleton";

/**
 * Reusable loading skeleton components
 * Used across all routes for consistent loading states
 */

interface TableLoadingSkeletonProps {
  rows?: number;
  columns?: number;
}

interface StatsCardsLoadingProps {
  count?: number;
}

interface GridLoadingSkeletonProps {
  items?: number;
  columns?: number;
}

interface ListLoadingSkeletonProps {
  items?: number;
}

/**
 * Table loading skeleton
 * Used in: Admin/Vendor orders, products, vendors, categories
 */
export function TableLoadingSkeleton({
  rows = 5,
  columns = 4,
}: TableLoadingSkeletonProps) {
  return (
    <div className="border rounded-lg">
      {/* Table header */}
      <div className="p-4 border-b flex gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-48" />
        ))}
      </div>

      {/* Table rows */}
      <div className="divide-y">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex gap-4 items-center">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton
                key={j}
                className={`h-4 ${j === 0 ? "w-16" : "flex-1"}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Stats cards loading skeleton
 * Used in: Admin/Vendor dashboards, orders, products pages
 */
export function StatsCardsLoading({ count = 4 }: StatsCardsLoadingProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${count} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

/**
 * Grid loading skeleton
 * Used in: Customer products page
 */
export function GridLoadingSkeleton({
  items = 8,
  columns = 4,
}: GridLoadingSkeletonProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-6`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="border rounded-lg overflow-hidden space-y-4">
          {/* Product image */}
          <Skeleton className="h-48 w-full" />
          {/* Product info */}
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * List loading skeleton
 * Used in: Customer orders, cart items, categories
 */
export function ListLoadingSkeleton({ items = 5 }: ListLoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-24" />
          </div>
          {/* Content */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Cart item loading skeleton
 * Used in: Customer cart page
 */
export function CartItemsLoading({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-4 border rounded-lg p-4">
          <Skeleton className="h-24 w-24 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Order summary loading skeleton
 * Used in: Cart, checkout pages
 */
export function OrderSummaryLoading() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex justify-between pt-2 border-t">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>
      <Skeleton className="h-11 w-full" />
    </div>
  );
}
