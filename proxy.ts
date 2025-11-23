import { betterFetch } from "@better-fetch/fetch";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
type UserRole = "USER";
type Session = {
  user?: { role?: UserRole };
} | null;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const publicRoutes = ["/", "/login"];

  const { data: session, error } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );
  // If session fetch fails, treat as unauthenticated
  if (error) {
    console.error("Session fetch failed:", error);
    if (!publicRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } // If user is logged in and trying to access public auth pages, redirect to their dashboard
  if (publicRoutes.includes(pathname) && session?.user) {
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  // If trying to access public routes and not logged in, allow
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
