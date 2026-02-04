"use server";

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
import {
  getAvailableGrant,
  sanitizeNotetakerName,
  validateMeetingUrl,
  validateNotetakerEnvironment,
} from "@/utils/notetaker";
import { revalidatePath } from "next/cache";
import { Event } from "nylas";
import { getUserSession } from "../getSession";
import { nylas } from "../nylas";
import db from "../prisma";

export async function createRecording(
  meetingUrl: string,
): Promise<ActionResult<{ recordingId: string; notetakerId: string }>> {
  const requestId = `create_${Date.now()}`;

  try {
    const envCheck = validateNotetakerEnvironment();
    if (!envCheck.valid) return { success: false, error: envCheck.error };

    const session = await getUserSession();
    if (!session?.user?.id) return { success: false, error: "Unauthorized." };

    const urlValidation = validateMeetingUrl(meetingUrl);
    if (!urlValidation.valid)
      return { success: false, error: urlValidation.error };

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        googleGrantId: true,
        microsoftGrantId: true,
        zoomGrantId: true,
        googleEmail: true,
        microsoftEmail: true,
      },
    });

    const grant = user ? getAvailableGrant(user) : null;
    if (!user || !grant) return { success: false, error: "Grant not found." };

    if (!user.googleEmail || !user.microsoftEmail) {
      throw new Error("Grant not found");
    }

    // 2. CONCURRENT EXECUTION START
    // We run the calendar lookup and the bot creation at the same time.
    const notetakerName = sanitizeNotetakerName(user.name);

    const [meetingName, nylasResponse] = await Promise.all([
      // Fetch meeting name (with catch to ensure it never crashes the process)
      fetchMeetingNameFromCalendar(
        grant.grantId,
        meetingUrl,
        user.googleEmail,
        user.microsoftEmail,
      ).catch(() => "Untitled Meeting"),

      // Request Notetaker to join the meeting
      nylas.notetakers.create({
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
              customInstructions:
                "Extract top 7-12 importants items with owners.",
            },
          },
        } as NotetakerCreateRequest,
      }),
    ]);

    const notetakerDataId = nylasResponse.data.id;

    const recording = await db.meetingRecording.create({
      data: {
        userId: user.id,
        meetingName: meetingName,
        meetingUrl: meetingUrl.trim(),
        provider: urlValidation.provider,
        grantId: grant.grantId,
        notetakerId: notetakerDataId,
        status: "RECORDING",
      },
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        recordingId: recording.id,
        notetakerId: notetakerDataId,
      },
    };
  } catch (error) {
    console.error(`[${requestId}] Unexpected error:`, error);
    // Note: If Nylas fails, we haven't created a "zombie" DB record yet,
    // which keeps your Neon database cleaner.
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

async function fetchMeetingNameFromCalendar(
  grantId: string,
  meetingUrl: string,
  googleEmail: string,
  microsoftEmail: string,
): Promise<string> {
  try {
    const twelveHoursInMs = 12 * 60 * 60 * 1000;
    const startTime = new Date(Date.now() - twelveHoursInMs).toISOString();
    const endTime = new Date(Date.now() + twelveHoursInMs).toISOString();

    const response = await nylas.events.list({
      identifier: grantId,
      queryParams: {
        calendarId: googleEmail || microsoftEmail || "primary",
        start: startTime,
        end: endTime,
      },
    });

    const events: Event[] = response.data;
    const trimmedUrl = meetingUrl.trim();

    const match = events.find(
      (event: Event) =>
        // @ts-expect-error – third-party lib has wrong types
        event.conferencing?.details?.url === trimmedUrl ||
        event.location?.includes(trimmedUrl) ||
        event.description?.includes(trimmedUrl),
    );

    return match?.title || "Untitled Meeting";
  } catch (e) {
    console.error("Calendar lookup failed:", e);
    return "Untitled Meeting";
  }
}
