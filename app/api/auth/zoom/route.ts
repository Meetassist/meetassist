import { nylas, nylasConfig } from "@/lib/nylas";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const state = crypto.randomUUID();
    (await cookies()).set("zoom_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    const redirectUrl = new URL(nylasConfig.redirectUri);
    if (!redirectUrl.pathname.endsWith("/exchange")) {
      throw new Error(
        `Expected redirectUri pathname to end with /exchange, got: ${redirectUrl.pathname}`,
      );
    }
    redirectUrl.pathname = redirectUrl.pathname.replace(
      /\/exchange$/,
      "/exchange/zoom",
    );
    const authUrl = nylas.auth.urlForOAuth2({
      clientId: nylasConfig.clientId,
      redirectUri: redirectUrl.toString(),
      state: state,
      provider: "zoom",
    });

    return Response.redirect(authUrl);
  } catch (error) {
    console.error("Zoom OAuth initialization failed:", error);
    return new Response(
      JSON.stringify({ error: "Zoom OAuth initialization failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
