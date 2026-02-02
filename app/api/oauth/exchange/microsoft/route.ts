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
      console.error("Unauthorized Microsoft OAuth callback attempt");
      redirect("/login");
    }

    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    if (error) {
      console.error("Microsoft OAuth provider error:", error);
      redirect(`/dashboard`);
    }

    if (!code) {
      console.error("Missing Microsoft authorization code");
      redirect("/dashboard");
    }

    const storedState = cookieStore.get("oauth_state")?.value;
    if (!storedState || storedState !== state) {
      console.error("Microsoft state mismatch - possible CSRF attack");
      redirect("/dashboard");
    }

    cookieStore.delete("oauth_state");

    const response = await nylas.auth.exchangeCodeForToken({
      clientSecret: nylasConfig.apiKey,
      clientId: nylasConfig.clientId,
      redirectUri: nylasConfig.redirectUri.replace(
        "/exchange",
        "/exchange/microsoft",
      ),
      code: code,
    });

    if (!response?.grantId || !response?.email) {
      throw new Error(
        "Invalid Microsoft OAuth response: missing required fields",
      );
    }

    const { email, grantId } = response;

    try {
      const calendars = await nylas.calendars.list({
        identifier: grantId,
      });

      const primaryCalendar = calendars.data[0];
      if (!primaryCalendar?.id) {
        throw new Error("Microsoft calendar not found");
      }
      const calendarId = primaryCalendar.id;
      await db.user.update({
        where: { id: session?.user?.id },
        data: {
          microsoftEmail: email,
          microsoftGrantId: grantId,
          microsoftCalendarId: calendarId,
        },
      });
      redirect("/dashboard");
    } catch (calendarError) {
      console.error("Error fetching Microsoft calendar:", calendarError);
      redirect("/dashboard");
    }
  } catch (error) {
    cookieStore.delete("oauth_state");
    console.error("Microsoft OAuth exchange failed:", error);
    redirect("/dashboard");
  }
}
