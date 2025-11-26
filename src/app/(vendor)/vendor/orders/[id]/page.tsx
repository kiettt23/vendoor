import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { prisma } from "@/shared/lib/db/prisma";
import { VendorOrderDetailPage } from "@/widgets/vendor";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  if (!user?.roles.includes("VENDOR")) redirect("/");

  const { id } = await params;

  return (
    <div className="container mx-auto py-8 px-4">
      <VendorOrderDetailPage orderId={id} />
    </div>
  );
}
