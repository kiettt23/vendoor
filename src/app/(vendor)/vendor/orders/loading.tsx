import { ListLoadingSkeleton } from "@/shared/ui/loading";
import { Skeleton } from "@/shared/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20" />
        ))}
      </div>
      <ListLoadingSkeleton items={8} />
    </div>
  );
}
