import { Skeleton } from "@/shared/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { StatsCardsLoading, ListLoadingSkeleton } from "@/shared/ui/loading";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-16">
      <Skeleton className="h-10 w-48 mb-8" />

      <div className="grid gap-8 md:grid-cols-3">
        {/* Profile Card Skeleton */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-6 w-32 mt-4" />
                <Skeleton className="h-4 w-40 mt-2" />
              </div>
              <div className="mt-6 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="space-y-6 md:col-span-2">
          <StatsCardsLoading count={3} />

          {/* Total Spent */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-32 mt-1" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-8 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <ListLoadingSkeleton items={3} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
