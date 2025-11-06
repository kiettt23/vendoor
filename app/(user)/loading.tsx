import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Skeleton */}
      <div className="mx-6">
        <div className="flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10">
          <Skeleton className="flex-1 h-96 rounded-3xl" />
          <div className="flex flex-col gap-5 w-full xl:max-w-sm">
            <Skeleton className="h-44 rounded-3xl" />
            <Skeleton className="h-44 rounded-3xl" />
          </div>
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="px-6 my-20 max-w-6xl mx-auto">
        <Skeleton className="h-8 w-64 mx-auto mb-12" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
