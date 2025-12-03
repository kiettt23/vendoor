import "server-only";

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
    // Forgot Password - gửi email reset
    sendResetPassword: async ({ user, url }) => {
      // TODO: Integrate với email service (Resend, SendGrid, etc.)
      // Tạm thời log ra console để dev
      // eslint-disable-next-line no-console
      console.log("=== PASSWORD RESET REQUEST ===");
      // eslint-disable-next-line no-console
      console.log(`User: ${user.email}`);
      // eslint-disable-next-line no-console
      console.log(`Reset URL: ${url}`);
      // eslint-disable-next-line no-console
      console.log("==============================");

      // Production: uncomment và config email service
      // await sendEmail({
      //   to: user.email,
      //   subject: "Đặt lại mật khẩu - Vendoor",
      //   html: `
      //     <h1>Đặt lại mật khẩu</h1>
      //     <p>Nhấn vào link bên dưới để đặt lại mật khẩu:</p>
      //     <a href="${url}">${url}</a>
      //     <p>Link có hiệu lực trong 1 giờ.</p>
      //   `,
      // });
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
