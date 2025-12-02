import { requireRole } from "@/entities/user";
import { VendorOrdersPage } from "@/widgets/vendor";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  await requireRole("VENDOR");

  const params = await searchParams;

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorOrdersPage
        status={params.status}
        page={params.page ? parseInt(params.page) : 1}
      />
    </div>
  );
}
