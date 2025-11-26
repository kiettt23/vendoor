import { ListLoadingSkeleton } from "@/shared/ui/loading";
import { Skeleton } from "@/shared/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Skeleton className="h-10 w-56 mb-8" />
      <ListLoadingSkeleton items={5} />
    </div>
  );
}
