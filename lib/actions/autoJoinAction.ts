"use server";

import { AUTOJOIN } from "@/lib/generated/prisma/enums";
import { sanitizeNotetakerName } from "@/utils/notetaker";
import { revalidatePath } from "next/cache";
import type { NotetakerMeetingSettings } from "nylas";
import { getUserSession } from "../getSession";
import { nylas } from "../nylas";
import db from "../prisma";

type ActionResult<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

interface ExtendedNotetakerMeetingSettings extends NotetakerMeetingSettings {
  summary?: boolean;
  summary_settings?: { custom_instructions?: string };
  action_items?: boolean;
  action_items_settings?: { custom_instructions?: string };
}

const SUMMARY_INSTRUCTIONS =
  "Write a flowing narrative summary in 2-3 short paragraphs. Start with what was discussed, then cover what was decided or agreed upon, and end with what happens next. Write naturally without section labels or headings. Keep it concise and easy to read.";

const ACTION_ITEMS_INSTRUCTIONS =
  "Extract top 7-12 important items with owners.";

function mapRuleToEventSelection(rule: AUTOJOIN): string[] | null {
  switch (rule) {
    case AUTOJOIN.all:
      return ["all"];
    case AUTOJOIN.ownEvents:
      return ["own_events"];
    case AUTOJOIN.internal:
      return ["internal"];
    case AUTOJOIN.external:
      return ["external"];
    case AUTOJOIN.participantsOnly:
      return ["all"];
    case AUTOJOIN.none:
      return null;
    default:
      return ["all"];
  }
}

function buildNotetakerRequestBody(rule: AUTOJOIN, notetakerName: string) {
  const eventSelection = mapRuleToEventSelection(rule);

  if (eventSelection === null) {
    return { notetaker: undefined };
  }

  const rules: Record<string, unknown> = { eventSelection };

  if (rule === AUTOJOIN.participantsOnly) {
    rules.participantFilter = { participants_gte: 2 };
  }

  return {
    notetaker: {
      name: notetakerName,
      rules,
      meetingSettings: {
        transcription: true,
        audioRecording: true,
        videoRecording: true,
        summary: true,
        summary_settings: { custom_instructions: SUMMARY_INSTRUCTIONS },
        action_items: true,
        action_items_settings: {
          custom_instructions: ACTION_ITEMS_INSTRUCTIONS,
        },
      } as ExtendedNotetakerMeetingSettings,
    },
  };
}

export async function enableAutoJoin(
  userId: string,
  name: string,
  grantId: string,
  googleEmail: string,
): Promise<ActionResult> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { autoJoin: true },
    });

    const rule = user?.autoJoin ?? AUTOJOIN.all;
    const notetakerName = sanitizeNotetakerName(name);
    const requestBody = buildNotetakerRequestBody(rule, notetakerName);

    await nylas.calendars.update({
      identifier: grantId,
      calendarId: googleEmail,
      requestBody,
    });

    return { success: true, message: "Auto-join enabled successfully." };
  } catch (error) {
    console.error("[enableAutoJoin] Error:", error);
    if (error instanceof Error) {
      if (error.message.includes("grant"))
        return {
          success: false,
          error: "Calendar access expired. Please reconnect in Sync.",
        };
      if (error.message.includes("calendar"))
        return {
          success: false,
          error: "Calendar not found. Please reconnect your calendar in Sync.",
        };
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "Failed to configure auto-join settings. Please try again.",
    };
  }
}

export async function updateAutoJoin(rule: AUTOJOIN): Promise<ActionResult> {
  try {
    const session = await getUserSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        googleGrantId: true,
        googleEmail: true,
        microsoftGrantId: true,
        microsoftEmail: true,
        microsoftCalendarId: true,
      },
    });

    if (!user) return { success: false, error: "User not found." };

    const grantId = user.googleGrantId ?? user.microsoftGrantId;
    const calendarId = user.googleGrantId
      ? user.googleEmail
      : user.microsoftCalendarId;

    if (!grantId || !calendarId) {
      return {
        success: false,
        error:
          "No calendar connected. Please connect Google or Microsoft in Settings.",
      };
    }

    const notetakerName = sanitizeNotetakerName(user.name);
    const requestBody = buildNotetakerRequestBody(rule, notetakerName);

    await nylas.calendars.update({
      identifier: grantId,
      calendarId,
      requestBody,
    });

    await db.user.update({
      where: { id: user.id },
      data: { autoJoin: rule },
    });

    revalidatePath("/dashboard/availability");

    return {
      success: true,
      message:
        rule === AUTOJOIN.none
          ? "Auto-join disabled."
          : "Auto-join settings updated.",
    };
  } catch (error) {
    console.error("[updateAutoJoin] Error:", error);
    if (error instanceof Error) {
      if (error.message.includes("grant"))
        return {
          success: false,
          error: "Calendar access expired. Please reconnect in Settings.",
        };
      if (error.message.includes("calendar"))
        return {
          success: false,
          error:
            "Calendar not found. Please reconnect your calendar in Settings.",
        };
      return { success: false, error: error.message };
    }
    return {
      success: false,
      error: "Failed to update auto-join settings. Please try again.",
    };
  }
}
