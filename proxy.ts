import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Better Auth Proxy (Next.js 16+)
 *
 * Protects routes based on user authentication and role
 * Replaces deprecated middleware.ts
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from Better Auth
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user;
  const isAuthenticated = !!user;

  // Public routes - allow everyone
  const publicRoutes = ["/", "/shop", "/product", "/pricing"];
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Auth routes - allow Better Auth to handle
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protected user routes - require authentication
  const userRoutes = ["/cart", "/orders", "/create-store"];
  if (userRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Seller routes - require SELLER or ADMIN role
  if (pathname.startsWith("/store")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const userRole = user.role as string;
    if (userRole !== "SELLER" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/create-store", request.url));
    }

    return NextResponse.next();
  }

  // Admin routes - require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const userRole = user.role as string;
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

/**
 * Proxy configuration for Next.js 16+
 *
 * Apply proxy to all routes except static files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Static files in public folder
     */
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
