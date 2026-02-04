import { nylas, nylasConfig } from "@/lib/nylas";
import { cookies } from "next/headers";

export async function GET() {
  try {
    if (!nylasConfig.clientId || !nylasConfig.redirectUri) {
      throw new Error("Missing Nylas configuration");
    }

    const state = JSON.stringify({
      id: crypto.randomUUID(),
      type: "microsoft",
    });

    (await cookies()).set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });

    const authUrl = nylas.auth.urlForOAuth2({
      clientId: nylasConfig.clientId,
      redirectUri: nylasConfig.redirectUri.replace(
        "/exchange",
        "/exchange/microsoft",
      ),
      state: state,
      provider: "microsoft",
    });

    return Response.redirect(authUrl);
  } catch (error) {
    console.error("Microsoft OAuth initialization failed:", error);
    return new Response(
      JSON.stringify({ error: "Microsoft OAuth initialization failed" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
