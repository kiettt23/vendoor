import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { FormLoadingSkeleton } from "@/shared/ui/loading";

export default function Loading() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 lg:py-16">
      <div className="mb-8">
        <Skeleton className="h-8 w-24 mb-4" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-80 mt-2" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <FormLoadingSkeleton fields={3} />
        </CardContent>
      </Card>
    </div>
  );
}
