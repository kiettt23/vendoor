import { requireAdmin } from "@/shared/lib/auth";
import { AdminOrderDetailPage } from "@/widgets/admin";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  await requireAdmin();

  const { id } = await params;

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminOrderDetailPage orderId={id} />
    </div>
  );
}
