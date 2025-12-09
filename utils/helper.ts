import { parseTime, Time } from "@internationalized/date";
import {
  addMinutes,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import { GetFreeBusyResponse, NylasResponse } from "nylas";
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
  nylasData: NylasResponse<GetFreeBusyResponse[]>,
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

  if (!nylasData.data || nylasData.data.length === 0) {
    console.error("Nylas data is empty or undefined");
    return [];
  }

  const firstCalendar = nylasData.data[0];
  if ("object" in firstCalendar && firstCalendar.object === "error") {
    console.error("Nylas API error:", firstCalendar);
    return [];
  }
  const busySlots: Array<{ start: Date; end: Date }> = (
    firstCalendar.timeSlots || []
  ).map((slot) => ({
    start: fromUnixTime(slot.startTime),
    end: fromUnixTime(slot.endTime),
  }));
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

  const formattedStart = format(startDateTime, "HH:mm");
  const formattedEnd = format(endDateTime, "HH:mm");

  return `${formattedStart} - ${formattedEnd}`;
}

{
  /* <Card className="gap-5 rounded-2xl border-b-7 border-b-[#C479A4] px-4 py-4">
              <CardTitle className="flex items-center gap-4">
                <div className="size-[23px] rounded-xs bg-[#C479A4]" />
                <p className="font-instrument text-2xl font-medium">
                  Single Use Link
                </p>
              </CardTitle>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#AEAEAE]">
                    30 min Google meet, one-on-one
                  </p>
                  <p className="text-sm text-[#AEAEAE]">One Time meet link</p>
                </div>
                <div className="flex items-center gap-6">
                  <Button
                    variant={"ghost"}
                    type="button"
                    className="border-border cursor-pointer rounded-2xl border text-sm"
                  >
                    <RefreshCw />
                    Regenerate Link
                  </Button>
                  <Button
                    type="button"
                    variant={"ghost"}
                    aria-label="More options"
                    className="border-foreground size-3 cursor-pointer rounded-sm border p-2 py-3"
                  >
                    <Ellipsis />
                  </Button>
                </div>
              </CardContent>
            </Card> */
}
