import { ProductCardSkeleton } from "@/shared/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-(--spacing-component) py-(--spacing-section)">
      {/* Header skeleton */}
      <div className="mb-(--spacing-section) space-y-(--spacing-component)">
        <div className="h-12 w-64 bg-muted animate-pulse rounded-md" />
        <div className="h-6 w-96 bg-muted animate-pulse rounded-md" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-(--spacing-component) mb-(--spacing-content) flex-wrap">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-48 bg-muted animate-pulse rounded-md"
          />
        ))}
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-(--spacing-content)">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
