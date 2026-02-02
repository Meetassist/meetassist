import { RecordingStatus } from "@/lib/generated/prisma/enums";
import { MeetingProvider } from "@/utils/types";

export function detectMeetingProvider(url: string): MeetingProvider | null {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Google Meet detection
    if (hostname.includes("meet.google.com")) {
      return "google_meet";
    }

    // Zoom detection
    if (hostname.includes("zoom.us") || hostname.includes("zoom.com")) {
      return "zoom";
    }

    // Microsoft Teams detection
    if (
      hostname.includes("teams.microsoft.com") ||
      hostname.includes("teams.live.com")
    ) {
      return "teams";
    }

    return null;
  } catch {
    return null;
  }
}

export function validateMeetingUrl(url: string): {
  valid: boolean;
  error?: string;
  provider?: MeetingProvider;
} {
  if (!url || url.trim().length === 0) {
    return { valid: false, error: "Meeting URL is required" };
  }

  try {
    // Try to parse as URL
    new URL(url);
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }

  const provider = detectMeetingProvider(url);

  if (!provider) {
    return {
      valid: false,
      error:
        "Unsupported meeting platform. Only Google Meet, Zoom, and Microsoft Teams are supported.",
    };
  }

  return { valid: true, provider };
}

export function getAvailableGrant(user: {
  googleGrantId?: string | null;
  microsoftGrantId?: string | null;
  zoomGrantId?: string | null;
}): { grantId: string; provider: string } | null {
  // Priority order: Google, Microsoft, Zoom
  if (user.googleGrantId) {
    return { grantId: user.googleGrantId, provider: "google" };
  }

  if (user.microsoftGrantId) {
    return { grantId: user.microsoftGrantId, provider: "microsoft" };
  }

  if (user.zoomGrantId) {
    return { grantId: user.zoomGrantId, provider: "zoom" };
  }

  return null;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) {
    return "0s";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs}s`);
  }

  return parts.join(" ");
}

export function sanitizeNotetakerName(name?: string): string {
  if (!name || name.trim().length === 0) {
    return "MeetAssist Notetaker";
  }

  // Take first name only if full name provided
  const firstName = name.trim().split(" ")[0];

  return `MeetAssist (${firstName}'s meeting assistant)`;
}

export function isTerminalStatus(status: RecordingStatus): boolean {
  return (
    status === "COMPLETED" || status === "FAILED" || status === "CANCELLED"
  );
}

export function validateNotetakerEnvironment(): {
  valid: boolean;
  error?: string;
} {
  if (!process.env.NYLAS_API_SECRET_KEY) {
    return { valid: false, error: "NYLAS_API_SECRET_KEY not configured" };
  }

  if (!process.env.NYLAS_API_URI) {
    return { valid: false, error: "NYLAS_API_URI not configured" };
  }

  if (!process.env.NEXT_PUBLIC_URL) {
    return { valid: false, error: "NEXT_PUBLIC_URL not configured" };
  }

  //   const appUrl = process.env.NEXT_PUBLIC_URL;
  //   if (appUrl.includes("localhost") || appUrl.includes("127.0.0.1")) {
  //     console.warn(
  //       " WARNING: Using localhost URL - webhooks will not work in production!",
  //     );
  //     console.warn("   Use ngrok or deploy to a public URL for webhook support");
  //   }

  return { valid: true };
}
