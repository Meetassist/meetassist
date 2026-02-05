"use server";

import {
  getAvailableGrant,
  sanitizeNotetakerName,
  validateMeetingUrl,
  validateNotetakerEnvironment,
} from "@/utils/notetaker";
import { revalidatePath } from "next/cache";
import { getUserSession } from "../getSession";
import { nylas } from "../nylas";
import db from "../prisma";

interface NotetakerCreateRequest {
  meetingLink: string;
  name: string;
  meetingSettings: {
    transcription?: boolean;
    audioRecording?: boolean;
    videoRecording?: boolean;
    summary?: boolean;
    summarySettings?: {
      customInstructions?: string;
    };
    actionItems?: boolean;
    actionItemsSettings?: {
      customInstructions?: string;
    };
  };
}

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function createRecording(
  meetingUrl: string,
): Promise<ActionResult<{ recordingId: string; notetakerId: string }>> {
  try {
    const envCheck = validateNotetakerEnvironment();
    if (!envCheck.valid) {
      return { success: false, error: envCheck.error };
    }

    const session = await getUserSession();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized. Please log in." };
    }

    const urlValidation = validateMeetingUrl(meetingUrl);
    if (!urlValidation.valid) {
      return { success: false, error: urlValidation.error };
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        googleGrantId: true,
        microsoftGrantId: true,
        zoomGrantId: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found." };
    }

    const grant = getAvailableGrant(user);
    if (!grant) {
      return {
        success: false,
        error:
          "No calendar connected. Please connect Google, Microsoft, or Zoom in Settings.",
      };
    }

    const notetakerName = sanitizeNotetakerName(user.name);
    const nylasResponse = await nylas.notetakers.create({
      identifier: grant.grantId,
      requestBody: {
        meetingLink: meetingUrl,
        name: notetakerName,
        meetingSettings: {
          transcription: true,
          audioRecording: true,
          videoRecording: true,
          summary: true,
          summarySettings: {
            customInstructions:
              "Write a flowing narrative summary in 2-3 short paragraphs. Start with what was discussed, then cover what was decided or agreed upon, and end with what happens next. Write naturally without section labels or headings. Keep it concise and easy to read.",
          },
          actionItems: true,
          actionItemsSettings: {
            customInstructions: "Extract top 7-12 important items with owners.",
          },
        },
      } as NotetakerCreateRequest,
    });

    const notetakerId = nylasResponse.data.id;

    // 7. Create database record
    const recording = await db.meetingRecording.create({
      data: {
        userId: user.id,
        meetingName: "Untitled Meeting",
        meetingUrl: meetingUrl.trim(),
        provider: urlValidation.provider!,
        grantId: grant.grantId,
        notetakerId: notetakerId,
        status: "RECORDING",
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        recordingId: recording.id,
        notetakerId: notetakerId,
      },
    };
  } catch (error) {
    console.error("[createRecording] Error:", error);

    // Handle specific Nylas API errors
    if (error instanceof Error) {
      // Check for common Nylas errors
      if (error.message.includes("invalid meeting link")) {
        return { success: false, error: "Invalid meeting link provided." };
      }
      if (error.message.includes("grant")) {
        return {
          success: false,
          error: "Calendar access expired. Please reconnect in Settings.",
        };
      }

      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: "Failed to start recording. Please try again.",
    };
  }
}
