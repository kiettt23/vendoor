import { requireRole } from "@/entities/user";
import { VendorInventoryPage } from "@/widgets/vendor";

import type { InventoryFilter } from "@/features/inventory-management";

interface PageProps {
  searchParams: Promise<{
    filter?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function Page({ searchParams }: PageProps) {
  await requireRole("VENDOR");

  const params = await searchParams;
  const filter = (params.filter as InventoryFilter) || "all";
  const search = params.search;
  const page = params.page ? parseInt(params.page, 10) : 1;

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorInventoryPage filter={filter} search={search} page={page} />
    </div>
  );
}
