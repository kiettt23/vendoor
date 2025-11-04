import { vi } from "@/lib/i18n";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ApproveClient from "./ApproveClient";

// ✅ Server Component - Fetch pending stores
export default async function AdminApprove() {
  // ✅ Check auth on server
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

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
