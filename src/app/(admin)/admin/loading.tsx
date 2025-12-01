import { StatsCardsLoading, ListLoadingSkeleton } from "@/shared/ui/loading";

export default function AdminDashboardLoading() {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="h-9 w-48 bg-muted rounded animate-pulse" />
      <StatsCardsLoading count={5} />
      <div className="border rounded-lg p-6">
        <div className="h-6 w-40 bg-muted rounded animate-pulse mb-4" />
        <ListLoadingSkeleton items={5} />
      </div>
    </div>
  );
}
