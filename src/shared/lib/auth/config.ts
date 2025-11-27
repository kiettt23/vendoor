import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { multiSession } from "better-auth/plugins";
import { prisma } from "@/shared/lib/db";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Better Auth Additional Fields - Include custom fields in session
  user: {
    additionalFields: {
      roles: {
        type: "string[]", // Array matching Prisma schema
        required: false,
        defaultValue: ["CUSTOMER"],
        input: false, // ⚠️ Security: User can't set roles on signup
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  plugins: [
    multiSession({
      maximumSessions: 5, // Max 5 sessions per device
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
