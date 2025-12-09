"use server";

import { getUserSession } from "@/lib/getSession";
import { nylas } from "@/lib/nylas";
import db from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function disconnectNylas() {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { grantId: true },
    });
    if (!user?.grantId) {
      return { success: false, error: "No calendar connection found" };
    }

    try {
      await nylas.grants.destroy({
        grantId: user.grantId,
      });
      await db.user.update({
        where: { id: session.user.id },
        data: {
          grantId: null,
          grantEmail: null,
          confGrantId: null,
        },
      });
    } catch (error) {
      console.warn(
        "Failed to revoke Nylas grant (may already be revoked):",
        error,
      );
    }
    revalidatePath("/dashboard/sync");
    return { success: true, message: "Calendar disconnected successfully" };
  } catch (error) {
    console.error("Disconnect failed:", error);
    return { success: false, error: "Failed to disconnect calendar" };
  }
}

export async function getNylasConnectionStatus() {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return { isConnected: false, connection: null };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { grantId: true, grantEmail: true },
    });

    if (!user?.grantId || !user?.grantEmail) {
      return { isConnected: false, connection: null };
    }

    return {
      isConnected: true,
      connection: {
        grantId: user.grantId,
        email: user.grantEmail,
      },
    };
  } catch (error) {
    console.error("Failed to get connection status:", error);
    return { isConnected: false, connection: null };
  }
}
