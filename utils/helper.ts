import { parseTime, Time } from "@internationalized/date";

export function parseTimeString(timeStr: string) {
  const timeWithSeconds =
    timeStr.includes(":") && timeStr.split(":").length === 2
      ? `${timeStr}:00`
      : timeStr;
  return parseTime(timeWithSeconds);
}

export function formatTimeForDb(time: Time): string {
  const hour = String(time.hour).padStart(2, "0");
  const minute = String(time.minute).padStart(2, "0");
  return `${hour}:${minute}`;
}

export function generateUrl(title: string): string {
  if (!title || !title.trim()) {
    throw new Error("Title cannot be empty");
  }
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
  if (!slug) {
    throw new Error("Title produces an empty slug");
  }
  return slug;
}
