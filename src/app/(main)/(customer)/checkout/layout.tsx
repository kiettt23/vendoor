import { redirect } from "next/navigation";
import { getSession } from "@/shared/lib/auth/session";

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
