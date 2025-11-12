import { requireAdmin } from "@/features/auth/index.server";
import prisma from "@/server/db/prisma";
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
