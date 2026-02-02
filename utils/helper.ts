import {
  GoogleConnectionStatus,
  MicrosoftConnectionStatus,
  ZoomConnectionStatus,
} from "@/lib/actions/nylasAction";
import { parseTime, Time } from "@internationalized/date";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  addMinutes,
  differenceInDays,
  format,
  formatDistanceToNowStrict,
  fromUnixTime,
  isAfter,
  isBefore,
  parse,
  parseISO,
} from "date-fns";
import { GetFreeBusyResponse, NylasResponse } from "nylas";
interface GoogleConnection {
  googleGrantId: string;
  email: string;
}

interface ZoomConnection {
  zoomGrantId?: string;
  email?: string;
}

interface MicrosoftConnection {
  microsoftGrantId?: string;
  email?: string;
}

interface ConnectionStatusResult {
  isGoogleConnected: boolean;
  googleConnection: GoogleConnection | null;
  isZoomConnected: boolean;
  zoomConnection: ZoomConnection | null;
  isMicrosoftConnected: boolean;
  microsoftConnection: MicrosoftConnection | null;
}
//Parse time to 12 hours to allow the TimeFieldInput from react spectrum can use a 24hours to be able to use it, since it
export function parseTimeString(timeStr: string) {
  const timeWithSeconds =
    timeStr.includes(":") && timeStr.split(":").length === 2
      ? `${timeStr}:00`
      : timeStr;
  return parseTime(timeWithSeconds);
}

//parse the time back to 24 hours to be stored in the database
export function formatTimeForDb(time: Time): string {
  const hour = String(time.hour).padStart(2, "0");
  const minute = String(time.minute).padStart(2, "0");
  return `${hour}:${minute}`;
}

export function generateUrl(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug;
}

// To calulate the user time remaining for the day
export function calculateAvailableTimeSlot(
  date: string,
  dbAvailability: { fromTime: string | undefined; toTime: string | undefined },
  duration: number,
  nylasDataArray: NylasResponse<GetFreeBusyResponse[]>[],
) {
  if (!dbAvailability.fromTime || !dbAvailability.toTime) {
    return [];
  }

  const now = new Date();

  const availableFrom = parse(
    `${date} ${dbAvailability.fromTime}`,
    "yyyy-MM-dd HH:mm",
    new Date(),
  );
  const availableTill = parse(
    `${date} ${dbAvailability.toTime}`,
    "yyyy-MM-dd HH:mm",
    new Date(),
  );

  // Collect all busy slots from all calendars
  const busySlots: Array<{ start: Date; end: Date }> = [];

  nylasDataArray.forEach((nylasData) => {
    if (!nylasData.data || nylasData.data.length === 0) {
      console.error("Nylas data is empty or undefined");
      return;
    }

    nylasData.data.forEach((calendar) => {
      if ("object" in calendar && calendar.object === "error") {
        console.error("Nylas API error:", calendar);
        return;
      }

      if (calendar.timeSlots) {
        calendar.timeSlots.forEach((slot) => {
          busySlots.push({
            start: fromUnixTime(slot.startTime),
            end: fromUnixTime(slot.endTime),
          });
        });
      }
    });
  });

  const allSlots = [];
  let currentSlot = availableFrom;
  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, Number(duration));
  }

  const freeSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, Number(duration));
    return (
      isAfter(slot, now) &&
      !busySlots.some(
        (busy) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end)),
      )
    );
  });

  return freeSlots.map((slot) => format(slot, "HH:mm"));
}

export function formatTimeRange(startTime: string, duration: number): string {
  const startDateTime = parse(startTime, "HH:mm", new Date());
  const endDateTime = addMinutes(startDateTime, duration);

  const formattedStart = format(startDateTime, "h:mm a");
  const formattedEnd = format(endDateTime, "h:mm a");

  return `${formattedStart} - ${formattedEnd}`;
}

export const DAY_ORDER = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

//All the connection status

export async function getAllConnectionStatuses(): Promise<ConnectionStatusResult> {
  try {
    const [googleResult, zoomResult, microsoftResult] = await Promise.all([
      GoogleConnectionStatus(),
      ZoomConnectionStatus(),
      MicrosoftConnectionStatus(),
    ]);

    return {
      isGoogleConnected: googleResult.isGoogleConnected,
      googleConnection: googleResult.googleConnection,
      isZoomConnected: zoomResult.isZoomConnected,
      zoomConnection: zoomResult.zoomConnection,
      isMicrosoftConnected: microsoftResult.isMicrosoftConnected,
      microsoftConnection: microsoftResult.microsoftConnection,
    };
  } catch (error) {
    console.error("Failed to fetch connection statuses:", error);
    return {
      isGoogleConnected: false,
      googleConnection: null,
      isZoomConnected: false,
      zoomConnection: null,
      isMicrosoftConnected: false,
      microsoftConnection: null,
    };
  }
}

export const displayDate = (input: string | Date) => {
  const date =
    typeof input === "string" ? parseISO(input.replace(" ", "T")) : input;

  if (isNaN(date.getTime())) return "Invalid date";

  const now = new Date();

  if (differenceInDays(now, date) < 7) {
    return formatDistanceToNowStrict(date, { addSuffix: true });
  }

  return format(date, "MMMM d");
};

let model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }
  return model;
}

export async function generateMeetingName(summary: string): Promise<string> {
  if (!summary?.trim()) return "Meeting Recording";
  const prompt = `Generate a professional, concise title for a meeting based on this summary. The title should be in Title Case and between 6-12 words. Avoid generic words like 'Meeting' if possible. Summary: ${summary.substring(0, 5000)}`;
  try {
    const result = await getModel().generateContent(prompt);
    const title = result.response
      .text()
      .trim()
      .replace(/["']/g, "")
      .replace(/\.$/, "");

    // Return AI title if valid, otherwise use the fallback
    return title.length > 5 && title.length < 80
      ? title
      : generateFallback(summary);
  } catch (error) {
    console.error(error);
    return generateFallback(summary);
  }
}

function generateFallback(summary: string): string {
  return (
    summary.split(/[.!?]/)[0].split(/\s+/).slice(0, 6).join(" ") ||
    "Meeting Recording"
  );
}

// interface TranscriptSegment {
//   speaker?: string;
//   text?: string;
//   content?: string;
//   start_time?: number;
//   end_time?: number;
// }

// interface NylasMediaObject {
//   transcript?: string;
//   summary?: string;
//   recording?: string;
//   action_items?: string;
// }

// interface NylasNotetakerObject {
//   id: string;
//   meeting_state?:
//     | "attending"
//     | "left_meeting"
//     | "error"
//     | "disconnected"
//     | "api_request";
//   media?: NylasMediaObject;
// }

// interface NylasWebhookPayload {
//   type: string;
//   data: {
//     object: NylasNotetakerObject;
//   };
//   challenge?: string;
// }

// interface MeetingRecordingUpdate {
//   transcriptText?: string;
//   summary?: string;
//   actionItems?: string[];
//   status?: RecordingStatus;
//   meetingName?: string;
// }

// import { NextRequest, NextResponse } from "next/server";
// import crypto from "crypto";
// import db from "@/lib/prisma";
// import { RecordingStatus } from "@/lib/generated/prisma/enums";
// import { generateMeetingName } from "@/utils/helper";

// const WEBHOOK_SECRET = process.env.NYLAS_WEBHOOK_SECRET;

// async function isValidSignature(
//   req: NextRequest,
//   rawBody: string,
// ): Promise<boolean> {
//   const signature = req.headers.get("x-nylas-signature");
//   if (!signature || !WEBHOOK_SECRET) return false;

//   const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
//   hmac.update(rawBody);
//   const digest = hmac.digest("hex");

//   return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
// }

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const challenge = searchParams.get("challenge");
//   if (challenge) {
//     return new Response(challenge, {
//       status: 200,
//       headers: { "Content-Type": "text/plain" },
//     });
//   }
//   return new Response("Webhook Active", { status: 200 });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const rawBody = await req.text();

//     if (!(await isValidSignature(req, rawBody))) {
//       console.error("Unauthorized Webhook Attempt");
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const body: NylasWebhookPayload = JSON.parse(rawBody);

//     if (body.challenge) {
//       return new Response(body.challenge, { status: 200 });
//     }

//     const { type, data } = body;
//     const notetakerId = data?.object?.id;

//     if (!notetakerId) {
//       return NextResponse.json({ error: "No ID" }, { status: 400 });
//     }

//     if (type === "notetaker.updated" || type === "notetaker.meeting_state") {
//       const state = data.object.meeting_state;

//       const statusMap: Record<string, RecordingStatus> = {
//         attending: RecordingStatus.RECORDING,
//         left_meeting: RecordingStatus.PROCESSING,
//         disconnected: RecordingStatus.PROCESSING,
//         error: RecordingStatus.FAILED,
//         api_request: RecordingStatus.RECORDING,
//       };

//       if (state && statusMap[state]) {
//         try {
//           await db.meetingRecording.update({
//             where: { notetakerId },
//             data: { status: statusMap[state] },
//           });
//         } catch (error) {
//           console.error(`Failed to update recording ${notetakerId}:`, error);
//           return NextResponse.json(
//             { error: "Failed to update recording" },
//             { status: 500 },
//           );
//         }
//       }
//     }

//     if (type === "notetaker.media") {
//       const media = data.object.media;
//       let transcriptText: string | undefined = undefined;
//       let summaryText: string | undefined = undefined;
//       let actionItemsArray: string[] | undefined = undefined;

//       if (media?.transcript) {
//         try {
//           const res = await fetch(media.transcript);
//           if (res.ok) {
//             const transcriptData = await res.json();
//             if (
//               transcriptData.type === "speaker_labelled" &&
//               Array.isArray(transcriptData.transcript)
//             ) {
//               transcriptText = transcriptData.transcript
//                 .map(
//                   (s: TranscriptSegment) =>
//                     `${s.speaker || "Unknown"}: ${s.text || ""}`,
//                 )
//                 .join("\n");
//             } else if (transcriptData.type === "raw") {
//               transcriptText = transcriptData.transcript;
//             }
//           }
//         } catch (e) {
//           console.error("Transcript fetch failed:", e);
//         }
//       }

//       if (media?.summary) {
//         try {
//           const res = await fetch(media.summary);
//           if (res.ok) {
//             const summaryData = await res.json();

//             if (typeof summaryData === "string") {
//               summaryText = summaryData;
//             } else if (
//               summaryData.summary &&
//               typeof summaryData.summary === "string"
//             ) {
//               summaryText = summaryData.summary;
//             } else if (summaryData.summary?.text) {
//               summaryText = summaryData.summary.text;
//             } else if (summaryData.text) {
//               summaryText = summaryData.text;
//             }
//           }
//         } catch (e) {
//           console.error("Summary fetch failed:", e);
//         }
//       }

//       if (media?.action_items) {
//         try {
//           const res = await fetch(media.action_items);
//           if (res.ok) {
//             const data = await res.json();

//             // Handle both raw array and nested object
//             if (Array.isArray(data)) {
//               actionItemsArray = data;
//             } else if (data.action_items && Array.isArray(data.action_items)) {
//               actionItemsArray = data.action_items;
//             }
//           }
//         } catch (e) {
//           console.error("Action items fetch failed:", e);
//         }
//       }

//       // Update database with fetched data
//       if (transcriptText || summaryText || actionItemsArray) {
//         try {
//           const updateData: MeetingRecordingUpdate = {};

//           if (transcriptText) {
//             updateData.transcriptText = transcriptText;
//           }
//           if (actionItemsArray) {
//             updateData.actionItems = actionItemsArray;
//           }

//           // Mark as COMPLETED when we have summary (usually the last piece)
//           if (summaryText) {
//             updateData.summary = summaryText;
//             updateData.status = RecordingStatus.COMPLETED;

//             const currentRecording = await db.meetingRecording.findUnique({
//               where: { notetakerId },
//               select: { meetingName: true },
//             });

//             const aiTitle = await generateMeetingName(summaryText);
//             if (
//               currentRecording?.meetingName === "Untitled Meeting" &&
//               aiTitle
//             ) {
//               updateData.meetingName = aiTitle;
//             }
//           }

//           await db.meetingRecording.update({
//             where: { notetakerId },
//             data: updateData,
//           });
//         } catch (error) {
//           console.error(`DB Update Error for ${notetakerId}:`, error);
//           return NextResponse.json(
//             { error: "Failed to update recording" },
//             { status: 500 },
//           );
//         }
//       }
//     }

//     return NextResponse.json({ status: "ok" });
//   } catch (error) {
//     console.error("Webhook Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }
