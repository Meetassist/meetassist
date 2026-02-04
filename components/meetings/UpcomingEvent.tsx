import { getUserSession } from "@/lib/getSession";
import { nylas } from "@/lib/nylas";
import db from "@/lib/prisma";
import { format, fromUnixTime } from "date-fns";
import {
  CalendarDays,
  Clock2,
  MapPinCheckInside,
  RefreshCw,
} from "lucide-react";
import { Suspense } from "react";
import { ScheduledMeetingsLoadingSkeleton } from "../SkeletonLoading";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const getCurrentUnixTime = () => Math.floor(Date.now() / 1000);

type CalendarProvider = "google" | "microsoft";

interface EventWithProvider {
  id: string;
  title?: string;
  provider?: CalendarProvider;
  when: {
    startTime: number;
    endTime: number;
  };
  conferencing?: {
    provider?: string;
    details?: {
      url?: string;
    };
  };
  htmlLink?: string;
}

interface FetchResult {
  provider: CalendarProvider;
  events: EventWithProvider[];
}
async function Meeting() {
  const session = await getUserSession();
  if (!session?.user) {
    throw new Error("Unauthorized: Please sign in to view meetings");
  }

  const userData = await db.user.findFirst({
    where: { email: session.user.email },
    select: {
      googleGrantId: true,
      googleEmail: true,
      microsoftGrantId: true,
      microsoftEmail: true,
      microsoftCalendarId: true,
    },
  });

  if (!userData) {
    throw new Error("User account not found");
  }

  const hasGoogleConnected = Boolean(
    userData.googleGrantId && userData.googleEmail,
  );
  const hasMicrosoftConnected = Boolean(
    userData.microsoftGrantId &&
      userData.microsoftEmail &&
      userData.microsoftCalendarId,
  );

  if (!hasGoogleConnected && !hasMicrosoftConnected) {
    return (
      <div className="mt-8 w-full">
        <p className="text-muted-foreground font-inter text-2xl">
          Connect your calendar to view upcoming meetings.
        </p>
      </div>
    );
  }

  const now = getCurrentUnixTime();
  const allEventPromises: Promise<FetchResult>[] = [];
  // Fetch from Google if connected
  if (hasGoogleConnected && userData.googleGrantId && userData.googleEmail) {
    allEventPromises.push(
      nylas.events
        .list({
          identifier: userData.googleGrantId,
          queryParams: {
            calendarId: userData.googleEmail,
            limit: 10,
          },
        })
        .then((result) => ({
          provider: "google" as CalendarProvider,
          events: result.data.map((event) => ({
            ...event,
            provider: "google" as CalendarProvider,
          })) as EventWithProvider[],
        }))
        .catch((error) => {
          console.error("Error fetching Google calendar events:", error);
          return {
            provider: "google" as CalendarProvider,
            events: [] as EventWithProvider[],
          };
        }),
    );
  }

  // Fetch from Microsoft if connected
  if (
    hasMicrosoftConnected &&
    userData.microsoftGrantId &&
    userData.microsoftEmail
  ) {
    allEventPromises.push(
      nylas.events
        .list({
          identifier: userData.microsoftGrantId,
          queryParams: {
            calendarId: userData.microsoftCalendarId!,
            limit: 10,
          },
        })
        .then((result) => ({
          provider: "microsoft" as CalendarProvider,
          events: result.data.map((event) => ({
            ...event,
            provider: "microsoft" as CalendarProvider,
          })) as EventWithProvider[],
        }))
        .catch((error) => {
          console.error("Error fetching Microsoft calendar events:", error);
          return {
            provider: "microsoft" as CalendarProvider,
            events: [] as EventWithProvider[],
          };
        }),
    );
  }
  const allResults = await Promise.all(allEventPromises);

  const allEvents = allResults.flatMap((result) => result.events);

  // Filter and sort upcoming meetings
  const upcomingMeetings = allEvents
    .filter((meeting) => {
      if (!meeting.when || typeof meeting.when !== "object") return false;
      return meeting.when.startTime >= now;
    })
    .sort((a, b) => a.when.startTime - b.when.startTime)
    .slice(0, 10);

  if (upcomingMeetings.length === 0) {
    return (
      <div className="mt-8 w-full pb-4">
        <p className="text-muted-foreground font-inter mt-4 text-2xl">
          You do not have an upcoming meeting yet
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-5">
      {upcomingMeetings.map((meeting) => {
        const startTime = meeting.when.startTime;
        const endTime = meeting.when.endTime;
        const meetingUrl = meeting.conferencing?.details?.url;

        return (
          <Card key={meeting.id} className="gap-5 rounded-2xl px-4 py-4 pr-6">
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-instrument text-base font-medium capitalize sm:text-xl md:text-2xl">
                  {meeting.title || "Untitled Meeting"}
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                  {/* This fragment is holding different date formats for desktop and mobile */}
                  <>
                    <p className="hidden items-center gap-2 text-xs font-normal text-[#AEAEAE] sm:text-sm md:flex">
                      <CalendarDays size={14} />
                      {format(fromUnixTime(startTime), "EEEE, MMMM d, yyyy")}
                    </p>
                    <p className="flex items-center gap-2 text-xs font-normal text-[#AEAEAE] sm:text-sm md:hidden">
                      <CalendarDays size={14} />
                      {format(fromUnixTime(startTime), "EEE, MMM d, yyyy")}
                    </p>
                  </>
                  <p className="flex items-center gap-2 text-xs font-normal text-[#AEAEAE] sm:text-sm">
                    <Clock2 size={14} />
                    {format(fromUnixTime(startTime), "h:mm a")} -{" "}
                    {format(fromUnixTime(endTime), "h:mm a")}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 md:flex-row">
                  {meetingUrl && (
                    <Button
                      asChild
                      className="font-inter cursor-pointer rounded-2xl text-xs font-medium text-white"
                    >
                      <a
                        href={meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        Join Meeting
                      </a>
                    </Button>
                  )}
                  {meeting.htmlLink && (
                    <Button
                      asChild
                      variant="ghost"
                      className="border-border font-inter cursor-pointer rounded-2xl border text-xs font-medium"
                    >
                      <a
                        href={meeting.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <RefreshCw size={14} />
                        Reschedule
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              <div className="pt-2">
                {meeting.conferencing?.provider && (
                  <p className="flex items-center gap-2 text-sm font-normal text-[#AEAEAE]">
                    <MapPinCheckInside size={14} />
                    {meeting.conferencing.provider}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function UpcomingMeeting() {
  return (
    <section>
      <div className="mt-8 pb-10">
        <h2 className="text-foreground font-instrument text-2xl font-medium">
          Upcoming Meetings
        </h2>
        <Suspense fallback={<ScheduledMeetingsLoadingSkeleton />}>
          <Meeting />
        </Suspense>
      </div>
    </section>
  );
}
