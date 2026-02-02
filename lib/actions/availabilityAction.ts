"use server";
import { revalidatePath } from "next/cache";
import { getUserSession } from "../getSession";
import db from "../prisma";
import { DAY_ORDER } from "@/utils/helper";
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

  const DAY_INDEX_MAP = new Map(DAY_ORDER.map((day, index) => [day, index]));

  return data.sort((a, b) => {
    const aIndex = DAY_INDEX_MAP.get(a.day) ?? Infinity;
    const bIndex = DAY_INDEX_MAP.get(b.day) ?? Infinity;
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
        ...(data.fromTime !== undefined && { fromTime: data.fromTime }),
        ...(data.toTime !== undefined && { toTime: data.toTime }),
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

  const sourceRecord = await db.availability.findUnique({
    where: { id: data.sourceId, userId: session.user.id },
  });
  if (!sourceRecord) {
    return { success: false, error: "Source record not found" };
  }

  try {
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
