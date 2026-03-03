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

  // Check if it's a dynamic booking page route
  const isBookingPage = isPublicBookingRoute(pathname);

  // Get the session of the user
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
    // Allow public routes and booking pages even on session error
    if (!publicRoutes.includes(pathname) && !isBookingPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (publicRoutes.includes(pathname) && session?.user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to public booking pages
  if (isBookingPage) {
    return NextResponse.next();
  }

  // Allow access to public routes
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Helper function to identify booking pages
function isPublicBookingRoute(pathname: string): boolean {
  try {
    const segments = pathname.split("/").filter(Boolean);

    // Must be exactly 2 segments: username/event-slug
    if (segments.length !== 2) {
      return false;
    }

    const [encodedUsername, eventSlug] = segments;

    // Decode the username to validate the actual email/username
    const username = decodeURIComponent(encodedUsername);

    // More strict validation:
    // More strict validation:
    // - Username: alphanumeric with @ and common special chars (not full email validation)
    // - Event slug: URL-safe characters only
    const usernameRegex = /^[a-zA-Z0-9._@+%-]+$/; // Added + and % for email aliases
    const eventSlugRegex = /^[a-zA-Z0-9-_]+$/;
    // Validate decoded username and event slug
    const isValidUsername = usernameRegex.test(username);
    const isValidEventSlug = eventSlugRegex.test(eventSlug);

    // Additional length checks for security
    const isValidLength = username.length <= 100 && eventSlug.length <= 100;

    return isValidUsername && isValidEventSlug && isValidLength;
  } catch (error) {
    // If decoding fails, it's not a valid route
    console.error("Invalid booking route format:", error);
    return false;
  }
}
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|icon.png|site.webmanifest).*)",
  ],
};
