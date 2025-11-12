import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin, multiSession, username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/server/db/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 30,
    }),
    admin({
      defaultRole: "USER",
      adminRoles: ["ADMIN"],
      impersonationSessionDuration: 60 * 60,
      async isAdmin(user: { email?: string | null }) {
        if (!user.email) return false;
        const adminEmails =
          process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
        return adminEmails.includes(user.email);
      },
    }),
    multiSession({
      maximumSessions: 5,
    }),
    nextCookies(),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
  },
});
