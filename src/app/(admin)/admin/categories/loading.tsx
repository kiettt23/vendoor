import { ListLoadingSkeleton } from "@/shared/ui/loading";
import { Skeleton } from "@/shared/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-40" />
      </div>
      <ListLoadingSkeleton items={8} />
    </div>
  );
}
