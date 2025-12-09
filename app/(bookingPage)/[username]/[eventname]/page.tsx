import { BookingForm } from "@/components/BookingPageConent/BookingForm";
import { RenderCalender } from "@/components/BookingPageConent/RenderCalender";
import { TimeTable } from "@/components/BookingPageConent/TimeTable";
import { Button } from "@/components/ui/button";
import { BookingPageData } from "@/lib/actions/bookingpageAction";
import { formatTimeRange } from "@/utils/helper";
import { format, parseISO } from "date-fns";
import { ArrowLeft, Calendar, Clock, Video } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ username: string; eventname: string }>;
  searchParams: Promise<{ date?: string; time?: string }>;
}) {
  const { username, eventname } = await params;
  const { date, time } = await searchParams;
  let selectedDate = new Date();
  if (date) {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      selectedDate = parsedDate;
    }
  }
  const showSlots = !!date;
  const showForm = !!date && !!time;
  const originalEmail = decodeURIComponent(username);
  const data = await BookingPageData(originalEmail, eventname);

  if (!data) {
    return (
      <h1 className="font-instrument text-center text-xl">
        Event not found or it is no longer available
      </h1>
    );
  }

  return (
    <main className="flex min-h-screen flex-col px-8 pb-4 md:flex-row md:gap-8">
      <div className="w-full pt-7 md:w-1/2">
        {showForm && (
          <div className="grid grid-cols-[auto_1fr] items-center gap-4">
            <div>
              <Link href={`?date=${format(selectedDate, "yyyy-MM-dd")}`}>
                <Button
                  type="button"
                  className="md:border-border cursor-pointer rounded-full px-6 py-6 md:border"
                  variant={"ghost"}
                  size={"icon"}
                  aria-label="Go back to time selection"
                >
                  <ArrowLeft className="size-8" />
                </Button>{" "}
              </Link>
            </div>
            <div className="flex justify-center">
              <p className="font-instrument text-xl font-medium md:hidden">
                New Meeting
              </p>
            </div>
          </div>
        )}
        <div className="mt-8 md:mt-20">
          <div className="hidden md:block">
            <h1 className="font-instrument text-muted-foreground text-xl font-medium">
              {data?.user.name}
            </h1>
            <p className="font-instrument text-[28px] font-semibold">
              {data?.duration} Minutes Meeting
            </p>
          </div>
          <div className="mt-10 space-y-4">
            <p className="font-instrument text-muted-foreground flex items-center gap-2 text-base font-medium">
              <Clock />
              {data?.duration} Mins
            </p>
            <p className="font-instrument text-muted-foreground flex items-center gap-2 text-base font-medium">
              <Video />
              {data.videoCallSoftware}
            </p>
            {showForm && (
              <p className="font-instrument text-muted-foreground flex items-center gap-2 text-base font-medium">
                <Calendar />
                {formatTimeRange(time, data.duration)},{" "}
                {format(parseISO(date), "EEEE, MMMM d, yyyy")}
              </p>
            )}
            <p className="font-instrument text-muted-foreground flex items-center gap-2 text-xs font-medium sm:text-sm md:text-base">
              <Video />
              Web conferencing details provided upon <br />
              confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Vertical separator line */}
      <div className="border-border my-6 hidden self-stretch border-l md:block" />

      {!showForm ? (
        <div className="mt-8 w-full px-10 pb-5 pl-0 md:w-1/2">
          <div className="space-y-6">
            <h2 className="font-instrument text-xl font-medium">
              Select Date & Time
            </h2>
          </div>

          <div className={`${showSlots ? "flex items-center gap-5" : ""}`}>
            <RenderCalender availability={data?.user.availabilities ?? []} />
            {showSlots && (
              <TimeTable
                email={originalEmail}
                duration={data?.duration as number}
                selectedDate={selectedDate}
              />
            )}
          </div>
        </div>
      ) : (
        <BookingForm
          eventDate={date}
          fromTime={time}
          eventTypeId={data.id}
          userEmail={data.user.email}
          participants={data.maxParticipants}
        />
      )}
    </main>
  );
}
