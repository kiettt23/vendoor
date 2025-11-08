import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth API Handler
 *
 * Handles all auth requests: /api/auth/*
 * - Sign in/up
 * - OAuth callbacks
 * - Session management
 * - Phone OTP
 */
export const { GET, POST } = toNextJsHandler(auth);
