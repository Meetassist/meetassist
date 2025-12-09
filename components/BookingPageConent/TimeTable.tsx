import { GetTimeTableData } from "@/lib/actions/bookingpageAction";
import { calculateAvailableTimeSlot } from "@/utils/helper";
import { format } from "date-fns";
import { TimeButtonSlot } from "./TimeButtonSlot";

type TimeTableProps = {
  selectedDate: Date;
  email: string;
  duration: number;
};

export async function TimeTable({
  selectedDate,
  email,
  duration,
}: TimeTableProps) {
  const { data, nylasCalenderData } = await GetTimeTableData(
    email,
    selectedDate,
  );

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
    nylasCalenderData,
  );

  return (
    <div className="mt-5">
      <div>
        <p className="flex items-center gap-2 text-base font-semibold">
          <span>{format(selectedDate, "EEE")}</span>
          <span className="">{format(selectedDate, "MMM. d")}</span>
        </p>
      </div>
      <TimeButtonSlot
        selectedDate={selectedDate}
        availableSlots={availableSlots}
      />
    </div>
  );
}
