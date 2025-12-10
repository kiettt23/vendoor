import { requireAuth } from "@/entities/user";
import { OrderDetailPage } from "@/widgets/orders";

// Force dynamic để luôn fetch fresh data
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailRoute({ params }: PageProps) {
  await requireAuth();

  const { id } = await params;
  return <OrderDetailPage orderId={id} />;
}
