import { requireRole } from "@/entities/user";
import { VendorAnalyticsPage } from "@/widgets/vendor";

import type { TimeRange } from "@/features/vendor-analytics";

interface PageProps {
  searchParams: Promise<{
    range?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  await requireRole("VENDOR");

  const params = await searchParams;
  const timeRange = (params.range as TimeRange) || "30d";

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorAnalyticsPage timeRange={timeRange} />
    </div>
  );
}
