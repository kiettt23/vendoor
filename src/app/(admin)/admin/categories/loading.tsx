import { ListLoadingSkeleton } from "@/shared/components/feedback/Loading";
import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Loading state for admin categories page
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Categories list */}
      <ListLoadingSkeleton items={8} />
    </div>
  );
}
