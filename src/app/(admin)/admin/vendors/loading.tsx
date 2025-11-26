import { StatsCardsLoading, TableLoadingSkeleton } from "@/shared/ui/loading";
import { Skeleton } from "@/shared/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <Skeleton className="h-10 w-48" />
      <StatsCardsLoading count={4} />
      <TableLoadingSkeleton rows={8} cols={4} />
    </div>
  );
}
