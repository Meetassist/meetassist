"use server";

import { revalidatePath } from "next/cache";
import { getUserSession } from "../getSession";
import db from "../prisma";
import { RenameMeetingSchema, TRenameMeetingSchema } from "@/utils/types";

type Recordings = {
  summary: string | null;
  id: string;
  updatedAt: Date;
  meetingName: string | null;
  actionItems: string[];
} | null;

export async function RecordedMeetingList() {
  const session = await getUserSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  try {
    const RecordedMeetingListData = await db.meetingRecording.findMany({
      where: {
        userId: session?.user.id,
        status: "COMPLETED",
      },
      select: {
        meetingName: true,
        updatedAt: true,
        id: true,
        notetakerId: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return RecordedMeetingListData;
  } catch (error) {
    throw error;
  }
}

export async function RecordedMeetingDetail(activeId: string | undefined) {
  const session = await getUserSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  try {
    let recordingData: Recordings = null;
    if (activeId) {
      recordingData = await db.meetingRecording.findFirst({
        where: {
          userId: session?.user.id,
          notetakerId: activeId,
        },
        select: {
          id: true,
          meetingName: true,
          updatedAt: true,
          actionItems: true,
          summary: true,
        },
      });
    }
    return recordingData;
  } catch (error) {
    throw error;
  }
}

export async function DeleteRecording(id: string) {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
    await db.meetingRecording.delete({
      where: { userId: session.user.id, notetakerId: id },
    });
    revalidatePath("/dashboard/chats");
    return { success: true };
  } catch (error) {
    console.error("Delete failed:", error);
    return { success: false, error: "Failed to delete recording" };
  }
}

export async function UpdateRecordingName(rawData: TRenameMeetingSchema) {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = RenameMeetingSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: "Invalid data" };
    }

    const { id, RecordingName } = validatedData.data;
    if (!id) {
      return { success: false, error: "Id is required" };
    }
    await db.meetingRecording.update({
      where: {
        notetakerId: id,
        userId: session.user.id,
      },
      data: {
        meetingName: RecordingName,
      },
    });

    revalidatePath("/dashboard/chats");
    return { success: true };
  } catch (error) {
    console.error("Update failed:", error);
    return { success: false, error: "Internal Server Error" };
  }
}
