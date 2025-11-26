import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/db/prisma";
import { VendorDashboardPage } from "@/widgets/vendor";

export default async function VendorDashboardRoute() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  if (!user?.roles.includes("VENDOR")) redirect("/");

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorDashboardPage />
    </div>
  );
}
