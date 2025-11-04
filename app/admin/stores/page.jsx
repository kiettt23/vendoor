import { vi } from "@/lib/i18n";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import StoresClient from "./StoresClient";

// ✅ Server Component - Fetch approved stores
export default async function AdminStores() {
  // ✅ Check auth on server
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

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
