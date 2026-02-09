// app/api/oauth/exchange/zoom/route.ts - NEW FILE
import { getUserSession } from "@/lib/getSession";
import { nylas, nylasConfig } from "@/lib/nylas";
import db from "@/lib/prisma";
import { cookies } from "next/headers";

import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();

  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      console.error("Unauthorized Zoom OAuth callback attempt");
      redirect("/login");
    }

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      console.error("Zoom OAuth provider error:", error);
      redirect(`/dashboard?error=zoom_connection_failed`);
    }

    if (!code) {
      console.error("Missing Zoom authorization code");
      redirect("/dashboard?error=zoom_connection_failed");
    }

    const storedState = cookieStore.get("zoom_oauth_state")?.value;
    if (!storedState || storedState !== state) {
      console.error("Zoom state mismatch");
      cookieStore.delete("zoom_oauth_state");
      redirect("/dashboard");
    }

    cookieStore.delete("zoom_oauth_state");
    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      redirectUri: nylasConfig.redirectUri.replace(
        "/exchange",
        "/exchange/zoom",
      ),
      code: code,
    });

    if (!response?.grantId) {
      throw new Error("Invalid Zoom OAuth response: missing grant ID");
    }

    const { grantId: zoomGrantId, email } = response;

    // Update user with Zoom grant ID
    await db.user.update({
      where: { id: session?.user?.id },
      data: {
        googleEmail: email,
        zoomGrantId: zoomGrantId,
      },
    });
    redirect("/dashboard/sync");
  } catch (error) {
    cookieStore.delete("zoom_oauth_state");
    console.error("Zoom OAuth exchange failed:", error);
    redirect("/dashboard");
  }
}
