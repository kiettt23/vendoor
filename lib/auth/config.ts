import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),

  // Cấu hình user với các field bổ sung
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // Không cho phép set qua form đăng ký
      },
      username: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Tắt xác thực email (có thể bật sau)
    autoSignIn: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  // Liên kết tài khoản (cho phép login bằng nhiều phương thức)
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  plugins: [
    admin({
      defaultRole: "USER",
      adminRoles: ["ADMIN"],
      impersonationSessionDuration: 60 * 60, // 1 giờ
      async isAdmin(user) {
        // Kiểm tra email có trong danh sách admin không
        const adminEmails = process.env.ADMIN_EMAILS?.split(",").map(e => e.trim()) || [];
        return adminEmails.includes(user.email);
      },
    }),

    nextCookies(),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 ngày
    updateAge: 60 * 60 * 24,      // Cập nhật mỗi 24 giờ
  },
});
