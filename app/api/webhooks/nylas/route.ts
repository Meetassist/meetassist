type TranscriptSegment = {
  speaker?: string;
  text?: string;
};

type NylasMediaObject = {
  transcript?: string;
  summary?: string;
  recording?: string;
  action_items?: string;
  recording_duration?: string;
};

type NylasNotetakerObject = {
  id: string;
  grant_id?: string;
  meeting_link?: string;
  meeting_provider: string;
  calendar_id?: string;
  event?: {
    ical_uid?: string;
    event_id?: string;
    master_event_id?: string;
  };
  status?:
    | "connecting"
    | "connected"
    | "disconnected"
    | "failed_entry"
    | "available";
  state?:
    | "scheduled"
    | "connecting"
    | "connected"
    | "disconnected"
    | "available";
  media?: NylasMediaObject;
};

type NylasWebhookPayload = {
  type: string;
  data: {
    object: NylasNotetakerObject;
  };
  challenge?: string;
};

type MeetingRecordingUpdate = {
  transcriptText?: string;
  summary?: string;
  actionItems?: string[];
  status?: RecordingStatus;
  meetingName?: string;
};

import MeetingSummaryEmail from "@/components/Emails/MeetingSummaryEmail";
import { RecordingStatus } from "@/lib/generated/prisma/enums";
import db from "@/lib/prisma";
import { formatDate, generateMeetingName, truncateWords } from "@/utils/helper";
import { render } from "@react-email/render";
import { waitUntil } from "@vercel/functions";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { Resend } from "resend";

const WEBHOOK_SECRET = process.env.NYLAS_WEBHOOK_SECRET;
const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.NEXT_PUBLIC_URL || "";
const EMAIL_FROM =
  process.env.EMAIL_SENDER_NAME && process.env.EMAIL_SENDER_ADDRESS
    ? `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`
    : null;

const DEFAULT_MEETING_NAMES = ["Untitled Meeting", "Auto-Joined Meeting"];

const PROVIDER_MAP: Record<string, string> = {
  "Google Meet": "google_meet",
  "Microsoft Teams": "teams",
  Zoom: "zoom",
};

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

async function findUserByGrant(grantId: string) {
  return await db.user.findFirst({
    where: {
      OR: [
        { googleGrantId: grantId },
        { microsoftGrantId: grantId },
        { zoomGrantId: grantId },
      ],
    },
  });
}

function normaliseProvider(meetingProvider: string): string {
  const mapped = PROVIDER_MAP[meetingProvider];
  if (mapped) return mapped;
  const normalised = meetingProvider.toLowerCase().replace(/\s+/g, "_");
  return normalised || "unknown";
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

    if (!(await isValidSignature(req, rawBody))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: NylasWebhookPayload = JSON.parse(rawBody);

    if (body.challenge) {
      return new Response(body.challenge, { status: 200 });
    }

    const { type, data } = body;
    const notetakerId = data?.object?.id;
    const grantId = data?.object?.grant_id;

    if (!notetakerId) {
      return NextResponse.json({ error: "No ID" }, { status: 400 });
    }
    if (type === "notetaker.created") {
      if (grantId) {
        const user = await findUserByGrant(grantId);
        if (user) {
          await db.meetingRecording.upsert({
            where: { notetakerId },
            update: {},
            create: {
              userId: user.id,
              notetakerId,
              grantId,
              meetingName: "Auto-Joined Meeting",
              meetingUrl: data.object.meeting_link || "",
              provider: normaliseProvider(data.object.meeting_provider),
              status: RecordingStatus.PENDING,
            },
          });
        } else {
          console.error(
            `[notetaker.created] No user found for grant ${grantId}`,
          );
        }
      }

      return NextResponse.json({ status: "ok" });
    }

    if (type !== "notetaker.media") {
      const existing = await db.meetingRecording.findUnique({
        where: { notetakerId },
      });

      if (!existing) {
        console.warn(
          `[webhook] No record found for notetaker ${notetakerId} on event "${type}". ` +
            `notetaker.created may not have been delivered.`,
        );
        return NextResponse.json({ status: "ok" });
      }
    }

    if (type === "notetaker.updated" || type === "notetaker.meeting_state") {
      const status = data.object.status;

      const statusMap: Record<string, RecordingStatus> = {
        connecting: RecordingStatus.RECORDING,
        connected: RecordingStatus.RECORDING,
        disconnected: RecordingStatus.PROCESSING,
        available: RecordingStatus.PROCESSING,
        failed_entry: RecordingStatus.FAILED,
      };

      if (status && statusMap[status]) {
        await db.meetingRecording.update({
          where: { notetakerId },
          data: { status: statusMap[status] },
        });
      }

      return NextResponse.json({ status: "ok" });
    }
    if (type === "notetaker.media") {
      const { state, media } = data.object;
      if (state !== "available") {
        return NextResponse.json({ status: "ok" });
      }
      let existing = await db.meetingRecording.findUnique({
        where: { notetakerId },
      });

      if (!existing && grantId) {
        const user = await findUserByGrant(grantId);
        if (user) {
          existing = await db.meetingRecording.upsert({
            where: { notetakerId },
            update: {},
            create: {
              userId: user.id,
              notetakerId,
              grantId,
              meetingName: "Auto-Joined Meeting",
              meetingUrl: data.object.meeting_link || "",
              provider: normaliseProvider(data.object.meeting_provider),
              status: RecordingStatus.PENDING,
            },
          });
        } else {
          console.error(
            `[notetaker.media] No user found for grant ${grantId} — cannot process media`,
          );
          return NextResponse.json({ status: "ok" });
        }
      }
      if (!existing) {
        console.error(
          `[notetaker.media] No record and no grantId — cannot process media for ${notetakerId}`,
        );
        return NextResponse.json({ status: "ok" });
      }

      waitUntil(
        (async () => {
          try {
            const [rawTranscript, rawSummary, rawActions] = await Promise.all([
              fetchJson(media?.transcript, "Transcript"),
              fetchJson(media?.summary, "Summary"),
              fetchJson(media?.action_items, "Action Items"),
            ]);

            const updateData: MeetingRecordingUpdate = {};

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

            if (rawActions) {
              updateData.actionItems = Array.isArray(rawActions)
                ? rawActions
                : [];
            }

            if (rawSummary) {
              const summaryContent =
                rawSummary?.summary ||
                (typeof rawSummary === "string" ? rawSummary : null);

              if (summaryContent && summaryContent.trim()) {
                updateData.summary = summaryContent;
                updateData.status = RecordingStatus.COMPLETED;

                const current = await db.meetingRecording.findUnique({
                  where: { notetakerId },
                  select: {
                    meetingName: true,
                    createdAt: true,
                    notetakerId: true,
                    user: { select: { email: true } },
                  },
                });

                if (
                  !current?.meetingName ||
                  DEFAULT_MEETING_NAMES.includes(current.meetingName)
                ) {
                  const aiTitle = await generateMeetingName(
                    summaryContent.trim(),
                  );
                  if (aiTitle) updateData.meetingName = aiTitle;
                }
              }
            }

            if (Object.keys(updateData).length > 0) {
              const updateRecord = await db.meetingRecording.update({
                where: { notetakerId },
                data: updateData,
                include: { user: { select: { email: true } } },
              });

              if (updateRecord?.user?.email) {
                const formattedDate = formatDate(updateRecord.updatedAt);
                try {
                  const emailHtml = await render(
                    React.createElement(MeetingSummaryEmail, {
                      meetingTitle: updateRecord.meetingName || "Your Meeting",
                      dateSent: formattedDate,
                      summary: truncateWords(updateRecord.summary || "", 150),
                      baseUrl,
                      actionItems:
                        (updateRecord.actionItems as string[])?.slice(0, 3) ||
                        [],
                      meetingId: updateRecord.notetakerId,
                      image: `https://q212epyvwe.ufs.sh/f/W9qsvzaZwWtcJBGBgyn3kOTCG0vYAsNHbhWcmozPJ8Vit4qw`,
                    }),
                  );

                  if (!EMAIL_FROM) {
                    throw new Error(
                      "EMAIL_SENDER_NAME or EMAIL_SENDER_ADDRESS is not configured",
                    );
                  }

                  await resend.emails.send({
                    from: EMAIL_FROM,
                    to: updateRecord.user.email,
                    subject: `Meeting Summary for ${updateRecord.meetingName ?? "Your Meeting"}`,
                    html: emailHtml,
                  });
                } catch (emailError) {
                  console.error(`Failed to send email:`, emailError);
                }
              }
            }
          } catch (bgError) {
            console.error(`[Background Error]`, bgError);
          }
        })(),
      );

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
