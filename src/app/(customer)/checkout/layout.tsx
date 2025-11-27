import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";

// ============================================
// CHECKOUT LAYOUT (PROTECTED)
// ============================================

/**
 * Layout bảo vệ route checkout - chỉ cho phép user đã đăng nhập
 *
 * **Lý do:**
 * - Checkout cần thông tin user (email, address)
 * - Cần xác thực để tạo order
 * - Redirect về login nếu chưa đăng nhập
 */

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    // Redirect về login, sau đó quay lại checkout
    redirect("/login?callbackUrl=/checkout");
  }

  return <>{children}</>;
}
