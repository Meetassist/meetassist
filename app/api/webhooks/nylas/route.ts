interface TranscriptSegment {
  speaker?: string;
  text?: string;
  content?: string;
  start_time?: number;
  end_time?: number;
}

interface NylasMediaObject {
  transcript?: string;
  summary?: string;
  recording?: string;
  action_items?: string;
}

interface NylasNotetakerObject {
  id: string;
  meeting_state?:
    | "attending"
    | "left_meeting"
    | "error"
    | "disconnected"
    | "api_request";
  media?: NylasMediaObject;
}

interface NylasWebhookPayload {
  type: string;
  data: {
    object: NylasNotetakerObject;
  };
  challenge?: string;
}

interface MeetingRecordingUpdate {
  transcriptText?: string;
  summary?: string;
  actionItems?: string[];
  status?: RecordingStatus;
  meetingName?: string;
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/prisma";
import { RecordingStatus } from "@/lib/generated/prisma/enums";
import { generateMeetingName } from "@/utils/helper";
import { waitUntil } from "@vercel/functions";
const WEBHOOK_SECRET = process.env.NYLAS_WEBHOOK_SECRET;

async function fetchJson(url: string | undefined, type: string) {
  if (!url) return null;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`Failed to fetch ${type}: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error(`${type} fetch error:`, error);
    return null;
  }
}

async function isValidSignature(
  req: NextRequest,
  rawBody: string,
): Promise<boolean> {
  const signature = req.headers.get("x-nylas-signature");
  if (!signature || !WEBHOOK_SECRET) return false;

  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get("challenge");
  if (challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }
  return new Response("Webhook Active", { status: 200 });
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // 1. Validate Security Immediately
    if (!(await isValidSignature(req, rawBody))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: NylasWebhookPayload = JSON.parse(rawBody);

    if (body.challenge) {
      return new Response(body.challenge, { status: 200 });
    }

    const { type, data } = body;
    const notetakerId = data?.object?.id;

    if (!notetakerId) {
      return NextResponse.json({ error: "No ID" }, { status: 400 });
    }

    // 2. Handle simple state updates (Fast enough to keep in-line)
    if (type === "notetaker.updated" || type === "notetaker.meeting_state") {
      const state = data.object.meeting_state;
      const statusMap: Record<string, RecordingStatus> = {
        attending: RecordingStatus.RECORDING,
        left_meeting: RecordingStatus.PROCESSING,
        disconnected: RecordingStatus.PROCESSING,
        error: RecordingStatus.FAILED,
        api_request: RecordingStatus.RECORDING,
      };

      if (state && statusMap[state]) {
        await db.meetingRecording.update({
          where: { notetakerId },
          data: { status: statusMap[state] },
        });
      }
      return NextResponse.json({ status: "ok" });
    }

    // 3. Handle Media Processing in the Background
    if (type === "notetaker.media") {
      const media = data.object.media;

      // START BACKGROUND TASK
      waitUntil(
        (async () => {
          try {
            // Fetch everything from Nylas URLs
            const [rawTranscript, rawSummary, rawActions] = await Promise.all([
              fetchJson(media?.transcript, "Transcript"),
              fetchJson(media?.summary, "Summary"),
              fetchJson(media?.action_items, "Action Items"),
            ]);

            const updateData: MeetingRecordingUpdate = {};

            // Parse Transcript
            if (rawTranscript) {
              if (
                rawTranscript.type === "speaker_labelled" &&
                Array.isArray(rawTranscript.transcript)
              ) {
                updateData.transcriptText = rawTranscript.transcript
                  .map(
                    (s: TranscriptSegment) =>
                      `${s.speaker || "Unknown"}: ${s.text || ""}`,
                  )
                  .join("\n");
              } else if (
                rawTranscript.type === "raw" &&
                rawTranscript.transcript
              ) {
                updateData.transcriptText = rawTranscript.transcript;
              }
            }

            // Parse Action Items
            if (rawActions) {
              updateData.actionItems = Array.isArray(rawActions)
                ? rawActions
                : rawActions.action_items || [];
            }

            // Parse Summary & Call Gemini
            if (rawSummary) {
              const summaryContent =
                rawSummary.summary?.text ||
                rawSummary.summary ||
                rawSummary.text;

              if (summaryContent) {
                updateData.summary = summaryContent;
                updateData.status = RecordingStatus.COMPLETED;

                // Only generate name if it's still generic
                const current = await db.meetingRecording.findUnique({
                  where: { notetakerId },
                  select: { meetingName: true },
                });

                if (
                  current?.meetingName === "Untitled Meeting" ||
                  !current?.meetingName
                ) {
                  const aiTitle = await generateMeetingName(summaryContent);
                  if (aiTitle) updateData.meetingName = aiTitle;
                }
              }
            }

            // Final DB Update
            if (Object.keys(updateData).length > 0) {
              await db.meetingRecording.update({
                where: { notetakerId },
                data: updateData,
              });
            }
          } catch (bgError) {
            console.error(`[Background Error] for ${notetakerId}:`, bgError);
          }
        })(),
      );

      // Return immediately so Nylas doesn't timeout
      return NextResponse.json({ status: "processing_started" });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
