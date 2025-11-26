"use server";

import { revalidatePath } from "next/cache";
import { getUserSession } from "../getSession";
import db from "../prisma";

type MeetingWithAvailabilities = {
  id: string;
  title: string;
  duration: number;
  maxParticipants: number;
  url: string;
  videoCallSoftware: string;
  user: {
    email: string;
    availabilities: Array<{
      day: string;
    }>;
  };
};

export async function MeetingsData(): Promise<MeetingWithAvailabilities[]> {
  const session = await getUserSession();
  if (!session?.user) {
    return [];
  }

  try {
    const data = await db.eventType.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        title: true,
        duration: true,
        maxParticipants: true,
        url: true,
        videoCallSoftware: true,
        user: {
          select: {
            email: true,
            availabilities: {
              select: { day: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return data;
  } catch (error) {
    console.log("There is an error with getting event", error);
    throw new Error("There is an error with getting data");
  }
}

export async function DeleteMeeting(
  id: string,
): Promise<{ success: boolean; message?: string }> {
  const session = await getUserSession();
  if (!session) {
    return { success: false, message: "No user found" };
  }
  try {
    await db.eventType.delete({
      where: {
        id,
        userId: session.user.id,
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("There was an error with delete event", error);
    return { success: false, message: "There was error with deleting event" };
  }
}
