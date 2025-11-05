"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function checkIsAdmin(): Promise<{ isAdmin: boolean }> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { isAdmin: false };
    }

    // Get user from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Check publicMetadata.role
    const isAdmin = user.publicMetadata?.role === "admin";

    return { isAdmin };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false };
  }
}

export async function requireAdmin(): Promise<void> {
  const { isAdmin } = await checkIsAdmin();

  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
}
