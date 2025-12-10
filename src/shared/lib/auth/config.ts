import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { multiSession } from "better-auth/plugins";
import { prisma } from "@/shared/lib/db";
import { APP_URL } from "@/shared/lib/constants";
import { createLogger } from "@/shared/lib/utils/logger";

const logger = createLogger("auth");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [APP_URL],
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

  // Social Providers - Google OAuth
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account", // Luôn cho chọn tài khoản
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      // Dev: log để test, Production: integrate email service
      logger.info("Password reset request", { email: user.email, url });
    },
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
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
