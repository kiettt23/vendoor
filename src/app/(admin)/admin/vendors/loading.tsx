import {
  StatsCardsLoading,
  TableLoadingSkeleton,
} from "@/shared/components/feedback/Loading";
import { Skeleton } from "@/shared/components/ui/skeleton";

/**
 * Loading state for admin vendors page
 */
export default function Loading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />

      {/* Stats cards */}
      <StatsCardsLoading count={3} />

      {/* Vendors table skeleton */}
      <TableLoadingSkeleton rows={8} columns={4} />
    </div>
  );
}
