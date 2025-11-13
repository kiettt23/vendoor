import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/vendor") ||
    request.nextUrl.pathname.startsWith("/admin");

  // Nếu vào protected route mà không có session cookie → redirect login
  if (isProtectedRoute && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/vendor/:path*", "/admin/:path*"],
};
