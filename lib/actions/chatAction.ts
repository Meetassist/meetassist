"use server";

import { getUserSession } from "../getSession";
import db from "../prisma";

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
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }
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
