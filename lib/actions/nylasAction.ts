"use server";

import { getUserSession } from "@/lib/getSession";
import { nylas } from "@/lib/nylas";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function DisconnectGoogle() {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { googleGrantId: true },
    });
    if (!user?.googleGrantId) {
      return { success: false, error: "No calendar connection found" };
    }

    try {
      await nylas.grants.destroy({
        grantId: user.googleGrantId,
      });
    } catch (error) {
      console.warn(
        "Failed to revoke Nylas grant (may already be revoked):",
        error,
      );
    }

    await db.user.update({
      where: { id: session.user.id },
      data: {
        googleGrantId: null,
        googleEmail: null,
      },
    });
    revalidatePath("/dashboard/sync");
    return { success: true, message: "Google disconnected successfully" };
  } catch (error) {
    console.error("Disconnect failed:", error);
    return { success: false, error: "Failed to disconnect Google" };
  }
}
export async function DisconnectZoom() {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { zoomGrantId: true },
    });
    if (!user?.zoomGrantId) {
      return { success: false, error: "No Zoom connection found" };
    }
    try {
      await nylas.grants.destroy({
        grantId: user.zoomGrantId,
      });
    } catch (error) {
      console.warn(
        "Failed to revoke Nylas grant (may already be revoked):",
        error,
      );
    }
    await db.user.update({
      where: { id: session.user.id },
      data: {
        zoomGrantId: null,
      },
    });
    revalidatePath("/dashboard/sync");
    return { success: true, message: "Zoom disconnected successfully" };
  } catch (error) {
    console.error("Disconnect failed:", error);
    return { success: false, error: "Failed to disconnect Zoom" };
  }
}

export async function DisconnectMicrosoft() {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { microsoftGrantId: true },
    });
    if (!user?.microsoftGrantId) {
      return { success: false, error: "No calendar connection found" };
    }

    try {
      await nylas.grants.destroy({
        grantId: user.microsoftGrantId,
      });
    } catch (error) {
      console.warn(
        "Failed to revoke Nylas grant (may already be revoked):",
        error,
      );
    }
    await db.user.update({
      where: { id: session.user.id },
      data: {
        microsoftGrantId: null,
        microsoftEmail: null,
      },
    });
    revalidatePath("/dashboard/sync");
    return { success: true, message: "Microsoft disconnected successfully" };
  } catch (error) {
    console.error("Disconnect failed:", error);
    return { success: false, error: "Failed to disconnect Microsoft" };
  }
}

export async function GoogleConnectionStatus() {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return { isGoogleConnected: false, googleConnection: null };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { googleGrantId: true, googleEmail: true },
    });

    if (!user?.googleGrantId || !user?.googleEmail) {
      return { isGoogleConnected: false, googleConnection: null };
    }

    return {
      isGoogleConnected: true,
      googleConnection: {
        googleGrantId: user.googleGrantId,
        email: user.googleEmail,
      },
    };
  } catch (error) {
    console.error("Failed to get connection status:", error);
    return { isGoogleConnected: false, googleConnection: null };
  }
}
export async function ZoomConnectionStatus() {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return { isZoomConnected: false, zoomConnection: null };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { zoomGrantId: true },
    });

    if (!user?.zoomGrantId) {
      return { isZoomConnected: false, zoomConnection: null };
    }

    return {
      isZoomConnected: true,
      zoomConnection: {
        zoomGrantId: user.zoomGrantId,
      },
    };
  } catch (error) {
    console.error("Failed to get connection status:", error);
    return { isZoomConnected: false, zoomConnection: null };
  }
}
export async function MicrosoftConnectionStatus() {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return { isMicrosoftConnected: false, microsoftConnection: null };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { microsoftGrantId: true, microsoftEmail: true },
    });

    if (!user?.microsoftGrantId || !user.microsoftEmail) {
      return { isMicrosoftConnected: false, microsoftConnection: null };
    }

    return {
      isMicrosoftConnected: true,
      microsoftConnection: {
        microsoftGrantId: user.microsoftGrantId,
        microsoftEmail: user.microsoftEmail,
      },
    };
  } catch (error) {
    console.error("Failed to get connection status:", error);
    return { isMicrosoftConnected: false, microsoftConnection: null };
  }
}
