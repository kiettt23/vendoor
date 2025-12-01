import { requireRole } from "@/shared/lib/auth";
import { VendorOrderDetailPage } from "@/widgets/vendor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  await requireRole("VENDOR");

  const { id } = await params;

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorOrderDetailPage orderId={id} />
    </div>
  );
}
