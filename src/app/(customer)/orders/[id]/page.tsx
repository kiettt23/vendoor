import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { OrderDetailPage } from "@/widgets/orders";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailRoute({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const { id } = await params;
  return <OrderDetailPage orderId={id} />;
}
