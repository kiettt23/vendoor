import { getSession } from "@/shared/lib/auth/session";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/widgets/dashboard-shell";
import { ROUTES } from "@/shared/lib/constants";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || !session.user.roles?.includes("ADMIN")) {
    redirect(ROUTES.LOGIN);
  }

  return <DashboardShell type="admin">{children}</DashboardShell>;
}
