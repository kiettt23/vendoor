import { requireAdmin } from "@/entities/user";
import { AdminVendorsPage } from "@/widgets/admin";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  await requireAdmin();

  const params = await searchParams;

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminVendorsPage status={params.status} />
    </div>
  );
}
