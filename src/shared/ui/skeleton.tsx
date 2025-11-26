import { cn } from "@/shared/lib/utils/cn";

// ============================================
// LOADING SKELETON COMPONENT
// ============================================

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

// ============================================
// PRESET SKELETONS
// ============================================

/**
 * Product Card Skeleton
 * Use in product listings while loading
 */
function ProductCardSkeleton() {
  return (
    <div className="space-y-(--spacing-xs)">
      {/* Image */}
      <Skeleton className="aspect-square w-full rounded-lg" />

      {/* Content */}
      <div className="space-y-(--spacing-xs) p-(--spacing-component)">
        {/* Vendor */}
        <Skeleton className="h-3 w-24" />

        {/* Product name */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>

        {/* Price */}
        <Skeleton className="h-6 w-32" />
      </div>
    </div>
  );
}

/**
 * Table Row Skeleton
 * Use in admin tables while loading
 */
function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-(--spacing-component) py-(--spacing-component)">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className="h-5 flex-1" />
      ))}
    </div>
  );
}

/**
 * Form Field Skeleton
 * Use in forms while loading data
 */
function FormFieldSkeleton() {
  return (
    <div className="space-y-(--spacing-tight)">
      <Skeleton className="h-4 w-24" /> {/* Label */}
      <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
    </div>
  );
}

/**
 * Card Skeleton
 * Use in dashboards while loading stats
 */
function CardSkeleton() {
  return (
    <div className="rounded-lg border-2 p-(--spacing-content) space-y-(--spacing-component)">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-32" /> {/* Title */}
        <Skeleton className="size-10 rounded-md" /> {/* Icon */}
      </div>
      <Skeleton className="h-8 w-24" /> {/* Value */}
      <Skeleton className="h-4 w-40" /> {/* Description */}
    </div>
  );
}

export {
  Skeleton,
  ProductCardSkeleton,
  TableRowSkeleton,
  FormFieldSkeleton,
  CardSkeleton,
};
