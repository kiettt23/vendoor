import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // User model customization
  user: {
    // Additional fields for Vietnamese context
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
        input: false, // Not exposed in sign-up
      },
      username: {
        type: "string",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  plugins: [
    phoneNumber({
      sendOTP: async (phone, otp) => {
        // Development: Log to console
        if (process.env.NODE_ENV === "development") {
          console.log(`📱 OTP for ${phone}: ${otp}`);
        }

        // Production: Send via SMS provider
        // TODO: Integrate VNPT/Viettel/Stringee
        // await smsProvider.send(phone, `Mã OTP: ${otp}`);
      },
    }),
  ],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update daily
  },
});
