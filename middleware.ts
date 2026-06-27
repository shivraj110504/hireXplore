import { betterFetch } from "@better-fetch/fetch";
import type { Session, User } from "better-auth/types";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { data: session } = await betterFetch<{ session: Session; user: User }>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    }
  );

  const { pathname } = request.nextUrl;

  // Protect /dashboard and /profile
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/profile")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (!session.user.emailVerified) {
      return NextResponse.redirect(new URL("/verify-email", request.url));
    }
  }

  // Handle Verify Email page routing
  if (pathname === "/verify-email") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (session.user.emailVerified) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Redirect if logged in
  if (pathname === "/login" || pathname === "/signup") {
    if (session) {
      if (!session.user.emailVerified) {
        return NextResponse.redirect(new URL("/verify-email", request.url));
      }
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/signup", "/verify-email"],
};
