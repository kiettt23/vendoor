"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

/**
 * Check if user is admin using Clerk metadata
 * @returns {Promise<{isAdmin: boolean}>}
 */
export async function checkIsAdmin() {
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