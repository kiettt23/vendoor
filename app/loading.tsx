import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Navbar Skeleton */}
      <div className="bg-white border-b">
        <div className="mx-6">
          <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
            <Skeleton className="h-10 w-32" />
            <div className="hidden sm:flex items-center gap-8">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
            <Skeleton className="sm:hidden h-9 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="mx-6 my-10">
        <div className="flex max-xl:flex-col gap-8 max-w-7xl mx-auto">
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
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-sm p-0">
              <Skeleton className="h-48 w-full rounded-b-none" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-20" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Loading Spinner Overlay */}
      <div className="fixed inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-purple-500 animate-spin"></div>
          <p className="text-sm text-slate-600 font-medium">Đang tải...</p>
        </div>
      </div>
    </div>
  );
}
