"use server";

import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server action để logout user
 */
export async function logout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/login");
}
