import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/db/prisma";
import { AdminDashboardPage } from "@/widgets/admin";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  if (!user?.roles.includes("ADMIN")) redirect("/");

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminDashboardPage />
    </div>
  );
}
