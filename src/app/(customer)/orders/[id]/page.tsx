import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import { OrderDetailPage } from "@/features/order/components/OrderDetailPage";

// ============================================
// ORDER DETAIL PAGE
// ============================================

/**
 * Single order detail page
 *
 * **Features:**
 * - Display full order information
 * - Order status timeline
 * - Vendor and shipping info
 * - Payment details
 * - Cancel order action
 */

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailRoute({ params }: PageProps) {
  // Check auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  return <OrderDetailPage orderId={id} />;
}
