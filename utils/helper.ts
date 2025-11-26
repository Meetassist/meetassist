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
