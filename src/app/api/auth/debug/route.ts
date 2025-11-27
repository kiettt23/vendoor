import { auth } from "@/shared/lib/auth/config";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const headersList = await headers();

    // Log all cookies for debugging
    const cookies = headersList.get("cookie");
    console.log("[Debug Auth] Cookies:", cookies);

    const session = await auth.api.getSession({ headers: headersList });

    console.log("[Debug Auth] Session:", JSON.stringify(session, null, 2));

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        message: "No session found",
        debug: {
          cookies: cookies ? "Present" : "Missing",
        },
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        roles: session.user.roles,
      },
      session: {
        id: session.session.id,
        expiresAt: session.session.expiresAt,
      },
    });
  } catch (error) {
    console.error("[Debug Auth] Error:", error);
    return NextResponse.json(
      {
        authenticated: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
