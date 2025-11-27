/**
 * Test Account Setup Script
 *
 * Run this to create test accounts for development:
 * curl -X POST http://localhost:3000/api/auth/setup-test
 */

import { auth } from "@/shared/lib/auth/config";
import { prisma } from "@/shared/lib/db/prisma";
import { NextResponse } from "next/server";

const TEST_ACCOUNTS = [
  {
    email: "customer@test.com",
    password: "Test@123",
    name: "Test Customer",
    roles: ["CUSTOMER"],
  },
  {
    email: "vendor@test.com",
    password: "Test@123",
    name: "Test Vendor",
    roles: ["CUSTOMER", "VENDOR"],
  },
  {
    email: "admin@test.com",
    password: "Test@123",
    name: "Test Admin",
    roles: ["CUSTOMER", "ADMIN"],
  },
];

export async function POST() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not allowed in production" },
      { status: 403 }
    );
  }

  const results = [];

  for (const account of TEST_ACCOUNTS) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: account.email },
      });

      if (existingUser) {
        // Check if account exists
        const existingAccount = await prisma.account.findFirst({
          where: {
            userId: existingUser.id,
            providerId: "credential",
          },
        });

        if (existingAccount) {
          results.push({ email: account.email, status: "exists" });
          continue;
        }
      }

      // Create user via Better Auth API
      const response = await auth.api.signUpEmail({
        body: {
          email: account.email,
          password: account.password,
          name: account.name,
        },
      });

      if (response.user) {
        // Update roles
        await prisma.user.update({
          where: { id: response.user.id },
          data: { roles: account.roles },
        });

        // Create vendor profile if needed
        if (account.roles.includes("VENDOR")) {
          await prisma.vendorProfile.upsert({
            where: { userId: response.user.id },
            update: {},
            create: {
              userId: response.user.id,
              shopName: `${account.name}'s Shop`,
              slug: account.email.split("@")[0] + "-shop",
              description: "Test vendor shop",
              status: "APPROVED",
              commissionRate: 0.1,
            },
          });
        }

        results.push({ email: account.email, status: "created" });
      }
    } catch (error) {
      console.error(`Error creating ${account.email}:`, error);
      results.push({
        email: account.email,
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    message: "Test accounts setup complete",
    accounts: results,
    credentials: TEST_ACCOUNTS.map((a) => ({
      email: a.email,
      password: a.password,
    })),
  });
}

export async function GET() {
  return NextResponse.json({
    message: "POST to this endpoint to create test accounts",
    accounts: TEST_ACCOUNTS.map((a) => ({
      email: a.email,
      password: a.password,
      roles: a.roles,
    })),
  });
}
