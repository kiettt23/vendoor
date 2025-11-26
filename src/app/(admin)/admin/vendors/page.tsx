import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/db/prisma";
import { AdminVendorsPage } from "@/widgets/admin";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  if (!user?.roles.includes("ADMIN")) redirect("/");

  const params = await searchParams;

  return (
    <div className="container mx-auto py-8 px-4">
      <AdminVendorsPage status={params.status} />
    </div>
  );
}
