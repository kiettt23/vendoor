import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/shared/lib/prisma";

export const auth = betterAuth({
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
  },
});

export type Session = typeof auth.$Infer.Session;
