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
type GoogleConnection = {
  googleGrantId: string;
  email: string;
};

type ZoomConnection = {
  zoomGrantId?: string;
  email?: string;
};

type MicrosoftConnection = {
  microsoftGrantId?: string;
  email?: string;
};

type ConnectionStatusResult = {
  isGoogleConnected: boolean;
  googleConnection: GoogleConnection | null;
  isZoomConnected: boolean;
  zoomConnection: ZoomConnection | null;
  isMicrosoftConnected: boolean;
  microsoftConnection: MicrosoftConnection | null;
};
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

export function getModel() {
  if (!model) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }
  return model;
}

export async function generateMeetingName(summary: string): Promise<string> {
  if (!summary?.trim()) return "Meeting Recording";
  const prompt = `Generate a professional, concise title for a meeting based on this summary.
- The title must be in Title Case.
- Length: Exactly 2 to 3 words.
- Format: PLAIN TEXT ONLY. 
- DO NOT use Markdown, bolding (**), or quotation marks.
- Avoid the word "Meeting".

Summary: ${summary.substring(0, 5000)}`;
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
    summary.split(/[.!?]/)[0].split(/\s+/).slice(0, 3).join(" ") ||
    "Meeting Recording"
  );
}

export function truncateWords(str: string, count: number) {
  const words = str.split(/\s+/).filter(Boolean);
  if (words.length <= count) return str;
  return words.slice(0, count).join(" ") + "...";
}
export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .replace(" at ", ", ");
}
