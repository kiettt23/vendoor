import { requireAdmin } from "@/shared/lib/auth";
import { AdminVendorDetailPage } from "@/widgets/admin";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminVendorDetailPage vendorId={id} />
    </div>
  );
}
