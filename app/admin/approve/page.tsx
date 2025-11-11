import { vi } from "@/lib/i18n";
import { requireAdmin } from "@/features/auth/server";
import prisma from "@/lib/prisma";
import ApproveClient from "./_components/ApproveClient";

// ✅ Server Component - Fetch pending stores
export default async function AdminApprove() {
  // ✅ Check auth on server
  await requireAdmin();

  // ✅ Fetch pending stores directly from database
  const stores = await prisma.store.findMany({
    where: {
      status: "pending",
    },
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <ApproveClient stores={stores} />;
}
