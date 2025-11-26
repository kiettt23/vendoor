import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/db/prisma";
import { VendorOrdersPage } from "@/widgets/vendor";

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  if (!user?.roles.includes("VENDOR")) redirect("/");

  const params = await searchParams;

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorOrdersPage status={params.status} page={params.page ? parseInt(params.page) : 1} />
    </div>
  );
}
