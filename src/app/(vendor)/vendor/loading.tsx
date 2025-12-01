import { StatsCardsLoading, ListLoadingSkeleton } from "@/shared/ui/loading";

export default function VendorDashboardLoading() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-muted rounded animate-pulse" />
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
      </div>
      <StatsCardsLoading count={4} />
      <div className="border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-40 bg-muted rounded animate-pulse" />
          <div className="h-8 w-24 bg-muted rounded animate-pulse" />
        </div>
        <ListLoadingSkeleton items={5} />
      </div>
    </div>
  );
}
