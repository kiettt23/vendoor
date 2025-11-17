import { ListLoadingSkeleton } from "@/shared/components/feedback/Loading";
import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Loading state for orders page
 */
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-48 mb-8" />

      {/* Orders list skeleton */}
      <ListLoadingSkeleton items={5} />
    </div>
  );
}
