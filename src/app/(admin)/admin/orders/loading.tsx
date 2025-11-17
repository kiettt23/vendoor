import {
  StatsCardsLoading,
  TableLoadingSkeleton,
} from "@/shared/components/feedback/Loading";
import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Loading state for admin orders page
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-48" />

      {/* Stats cards */}
      <StatsCardsLoading count={4} />

      {/* Orders table skeleton */}
      <TableLoadingSkeleton rows={10} columns={4} />
    </div>
  );
}
