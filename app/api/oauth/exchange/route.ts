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
      console.error("Unauthorized OAuth callback attempt");
      redirect("/login");
    }

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      console.error("OAuth provider error:", error);
      redirect(`/login`);
    }

    if (!code) {
      console.error("Missing authorization code");
      redirect("/login");
    }

    const storedState = cookieStore.get("oauth_state")?.value;
    if (!storedState || storedState !== state) {
      console.error("State mismatch - possible CSRF attack", {
        stored: storedState,
        received: state,
      });
      redirect("/login");
    }

    cookieStore.delete("oauth_state");

    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      redirectUri: nylasConfig.redirectUri,
      code: code,
    });

    if (!response?.grantId || !response?.email) {
      throw new Error("Invalid OAuth response: missing required fields");
    }

    const { email, grantId } = response;

    await db.user.update({
      where: { id: session?.user?.id },
      data: {
        grantId,
        grantEmail: email,
      },
    });

    console.log("OAuth successful for user:", session?.user?.id);
    redirect("/dashboard?success=calendar_connected");
  } catch (error) {
    cookieStore.delete("oauth_state");
    console.error("OAuth exchange failed:", error);
    redirect("/login");
  }
}
