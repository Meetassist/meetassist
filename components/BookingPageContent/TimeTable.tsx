import { GetTimeTableData } from "@/lib/actions/bookingpageAction";
import { calculateAvailableTimeSlot } from "@/utils/helper";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { TimeButtonSlot } from "./TimeButtonSlot";

type TimeTableProps = {
  selectedDate: Date;
  email: string;
  duration: number;
  showSlot: boolean;
  date: string | undefined;
};

export async function TimeTable({
  selectedDate,
  email,
  duration,
  showSlot,
  date,
}: TimeTableProps) {
  let data;
  let allBusyTimes;
  try {
    ({ data, allBusyTimes } = await GetTimeTableData(email, selectedDate));
  } catch (error) {
    console.error("Failed to fetch timetable data:", error);
    return (
      <div>
        <p className="text-muted-foreground">
          Unable to load availability. Please try again later.
        </p>
      </div>
    );
  }
  if (!data) {
    return (
      <div>
        <p className="text-muted-foreground">
          No availability configured for this day.
        </p>
      </div>
    );
  }

  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const dbAvailability = {
    fromTime: data?.fromTime,
    toTime: data?.toTime,
  };

  const availableSlots = calculateAvailableTimeSlot(
    formattedDate,
    dbAvailability,
    duration,
    allBusyTimes,
  );

  return (
    <div
      className={`md:mt-6 ${showSlot ? "absolute z-10 bg-white pr-5 md:relative md:z-0" : ""}`}
    >
      {showSlot && (
        <div className="block md:hidden">
          {date && (
            <>
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <div>
                  <Link href={`?`}>
                    <Button
                      type="button"
                      className="md:border-border cursor-pointer rounded-full px-6 py-6 md:border"
                      variant={"ghost"}
                      size={"icon"}
                      aria-label="Go back to date selection"
                    >
                      <ArrowLeft className="size-8" />
                    </Button>
                  </Link>
                </div>
                <div className="flex justify-center">
                  <p className="font-instrument text-muted-foreground text-xl font-medium md:hidden">
                    {format(selectedDate, "MMMM d, yyyy")}
                  </p>
                </div>
              </div>
            </>
          )}
          <div className="mt-10 pb-4 text-center">
            <p>Select Time</p>
            <p>Duration: {duration} mins</p>
          </div>
        </div>
      )}
      <div>
        <p className="hidden items-center gap-2 text-base font-semibold md:flex">
          <span>{format(selectedDate, "EEE")}</span>
          <span>{format(selectedDate, "MMM. d")}</span>
        </p>
      </div>
      <TimeButtonSlot
        selectedDate={selectedDate}
        availableSlots={availableSlots}
      />
    </div>
  );
}
