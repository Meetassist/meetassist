"use server";

import { CreateMeetingSchema, TCreateMeetingSchema } from "@/utils/types";
import { getUserSession } from "../getSession";
import db from "../prisma";
import { revalidatePath } from "next/cache";

type CreateEventResult =
  | { success: true }
  | { success: false; message: string };

export async function CreateEvent(
  data: TCreateMeetingSchema,
): Promise<CreateEventResult> {
  const session = await getUserSession();
  if (!session?.user) {
    return { success: false, message: "Not authenticated" };
  }
  const validate = CreateMeetingSchema.safeParse(data);
  if (!validate.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    await db.eventType.create({
      data: {
        userId: session.user.id,
        title: validate.data.title,
        duration: validate.data.duration,
        maxParticipants: validate.data.maxParticipants,
        url: validate.data.url,
        videoCallSoftware: validate.data.videoCallSoftware,
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("There is an error with creating an event", error);
    return {
      success: false,
      message: "There is an error with creating an event",
    };
  }
}
type UpdateEventResult =
  | { success: true }
  | { success: false; message: string };

export async function UpdateEvent(
  data: TCreateMeetingSchema,
  id: string,
): Promise<UpdateEventResult> {
  const session = await getUserSession();
  if (!session?.user) {
    return { success: false, message: "Not authenticated" };
  }
  const validate = CreateMeetingSchema.safeParse(data);
  if (!validate.success) {
    return { success: false, message: "Invalid data" };
  }

  try {
    await db.eventType.update({
      where: { userId: session.user.id, id },
      data: {
        userId: session.user.id,
        title: validate.data.title,
        duration: validate.data.duration,
        maxParticipants: validate.data.maxParticipants,
        url: validate.data.url,
        videoCallSoftware: validate.data.videoCallSoftware,
      },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.log("There is an error with updating an event", error);
    return {
      success: false,
      message: "There is an error with updating an event",
    };
  }
}
