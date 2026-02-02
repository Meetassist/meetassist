import { formatTimeRange } from "@/utils/helper";
import { format, parseISO } from "date-fns";
import { Calendar, Check, UserRound, Video } from "lucide-react";

export function BookingDetail({
  name,
  duration,
  eventDate,
  fromTime,
  eventName,
}: {
  name: string;
  duration: number;
  eventDate: string | undefined;
  fromTime: string | undefined;
  eventName: string;
}) {
  if (!eventDate || !fromTime) {
    return null;
  }

  return (
    <div className="bg-accent fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="flex h-auto w-full max-w-2xl flex-col items-center justify-center rounded-2xl bg-white p-8 shadow-xl md:p-12">
        <h1 className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700">
            <Check size={20} color="white" strokeWidth={3} />
          </span>
          <span className="font-instrument text-2xl font-bold text-slate-900">
            You are scheduled
          </span>
        </h1>

        <p className="font-instrument mt-4 text-center">
          A calendar invitation has been sent to your email address.
        </p>

        <div className="border-border mt-10 flex w-full flex-col items-start gap-5 rounded-xl border p-6 md:p-10">
          <h2 className="text-lg font-bold tracking-wider text-slate-400 uppercase">
            {eventName}
          </h2>

          <div className="space-y-4">
            <p className="flex items-center gap-4 text-sm font-medium text-slate-700 sm:text-base">
              <UserRound className="text-muted-foreground" size={20} />
              <span>{name}</span>
            </p>

            <p className="flex items-center gap-4 text-sm font-medium text-slate-700 sm:text-base">
              <Calendar className="text-muted-foreground" size={20} />
              <span>
                {formatTimeRange(fromTime, duration)},{" "}
                {format(parseISO(eventDate), "EEEE, MMMM d, yyyy")}
              </span>
            </p>

            <p className="flex items-center gap-4 text-sm font-medium text-slate-700 sm:text-base">
              <Video className="text-muted-foreground" size={20} />
              <span>Web conferencing details to follow.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
