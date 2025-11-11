import { vi } from "@/lib/i18n";
import { requireAdmin } from "@/features/auth/index.server";
import prisma from "@/server/db/prisma";
import StoresClient from "./_components/StoresClient";

// ✅ Server Component - Fetch approved stores
export default async function AdminStores() {
  // ✅ Check auth on server
  await requireAdmin();

  // ✅ Fetch approved stores directly from database
  const stores = await prisma.store.findMany({
    where: {
      status: "approved",
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <StoresClient stores={stores} />;
}
