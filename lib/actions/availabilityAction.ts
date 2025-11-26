"use server";
import { revalidatePath } from "next/cache";
import { getUserSession } from "../getSession";
import db from "../prisma";

export async function Availability(): Promise<
  Array<{
    id: string;
    day: string;
    fromTime: string;
    toTime: string;
    isActive: boolean;
  }>
> {
  const session = await getUserSession();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  const data = await db.availability.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      day: true,
      fromTime: true,
      toTime: true,
      isActive: true,
    },
  });
  const dayOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return data.sort((a, b) => {
    const aIndex = dayOrder.indexOf(a.day);
    const bIndex = dayOrder.indexOf(b.day);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

export async function updateTimeSlot(data: {
  id: string;
  fromTime?: string;
  toTime?: string;
}) {
  try {
    const session = await getUserSession();
    if (!session?.user) {
      return { success: false, error: "No user found" };
    }

    await db.availability.update({
      where: { id: data.id, userId: session.user.id },
      data: {
        ...(data.fromTime && { fromTime: data.fromTime }),
        ...(data.toTime && { toTime: data.toTime }),
      },
    });

    revalidatePath("/dashboard/availability");
    return { success: true };
  } catch (error) {
    console.error("Failed to update time slot:", error);
    return { success: false, error: "Failed to save settings" };
  }
}

export async function toggleTimeSlotActive(id: string, isActive: boolean) {
  const session = await getUserSession();
  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }
  try {
    await db.availability.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        isActive,
      },
    });
    revalidatePath("/dashboard/availability");

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle time slot:", error);
    return { success: false, error: "Failed to save settings" };
  }
}

export async function copyTimesToDays(data: {
  sourceId: string;
  targetIds: string[];
  fromTime: string;
  toTime: string;
}) {
  const session = await getUserSession();
  if (!session?.user) {
    return { success: false, error: "Not authenticated" };
  }

  // Verify user owns the source record
  const source = await db.availability.findUnique({
    where: { id: data.sourceId, userId: session.user.id },
  });
  if (!source) {
    return { success: false, error: "Source record not found" };
  }

  try {
    // Use updateMany instead of transaction for better performance
    await db.availability.updateMany({
      where: {
        id: {
          in: data.targetIds,
        },
        userId: session.user.id,
      },
      data: {
        fromTime: data.fromTime,
        toTime: data.toTime,
        isActive: true,
      },
    });

    revalidatePath("/dashboard/availability");

    return { success: true };
  } catch (error) {
    console.error("Failed to copy times:", error);
    return { success: false, error: "Failed to copy times" };
  }
}
