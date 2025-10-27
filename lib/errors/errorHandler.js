/**
 * Centralized Error Handler for API Routes
 *
 * Benefits:
 * - DRY - Don't repeat error handling logic
 * - Consistent error responses
 * - Easy to add logging/monitoring (Sentry, etc.)
 * - Production vs Development error details
 *
 * Usage in API routes:
 *   import { handleError } from '@/lib/errors/errorHandler';
 *
 *   try {
 *     // ... logic
 *   } catch (error) {
 *     return handleError(error);
 *   }
 */

import { NextResponse } from "next/server";
import { AppError } from "./AppError";

export function handleError(error, context = "") {
  // Log error with context
  const logPrefix = context ? `[${context}]` : "";
  console.error(`${logPrefix} Error:`, error);

  // If it's our custom AppError
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === "development" && {
          stack: error.stack,
        }),
      },
      { status: error.statusCode }
    );
  }

  // Prisma errors
  if (error.code?.startsWith("P")) {
    return NextResponse.json(
      {
        error: "Database error occurred",
        code: "DATABASE_ERROR",
        ...(process.env.NODE_ENV === "development" && {
          details: error.message,
        }),
      },
      { status: 500 }
    );
  }

  // Generic errors
  return NextResponse.json(
    {
      error: error.message || "Internal server error",
      code: "INTERNAL_ERROR",
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack,
      }),
    },
    { status: 500 }
  );
}

// Async wrapper để catch errors tự động
export function asyncHandler(fn) {
  return async (request, context) => {
    try {
      return await fn(request, context);
    } catch (error) {
      return handleError(error);
    }
  };
}
