import { OrderDetailPage } from "@/features/admin/components/OrderDetailPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  return <OrderDetailPage orderId={id} />;
}
