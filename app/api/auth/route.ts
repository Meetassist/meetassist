import { nylas, nylasConfig } from "@/lib/nylas";
import { cookies } from "next/headers";
export async function GET() {
  try {
    if (!nylasConfig.clientId || !nylasConfig.redirectUri) {
      throw new Error("Missing Nylas configuration");
    }
    const state = crypto.randomUUID();
    (await cookies()).set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });
    const authUrl = nylas.auth.urlForOAuth2({
      clientId: nylasConfig.clientId,
      redirectUri: nylasConfig.redirectUri,
      scope: ["calendar", "conferencing"],
      state: state,
    });

    return Response.redirect(authUrl);
  } catch (error) {
    console.error("OAuth2 initialization failed:", error);
    return new Response(
      JSON.stringify({ error: "OAuth2 initialization failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
