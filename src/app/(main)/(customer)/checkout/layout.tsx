import { redirect } from "next/navigation";
import { getSession } from "@/shared/lib/auth/session";

// CHECKOUT LAYOUT (PROTECTED)

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
  const session = await getSession();

  if (!session?.user) {
    // Redirect về login, sau đó quay lại checkout
    redirect("/login?callbackUrl=/checkout");
  }

  return <>{children}</>;
}
