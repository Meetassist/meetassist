import { MeetingsData } from "@/lib/actions/meetingAction";
import { getUserSession } from "@/lib/getSession";
import db from "@/lib/prisma";
import { Suspense } from "react";
import { MeetingsLoadingSkeleton } from "../SkeletonLoading";
import { Card, CardContent } from "../ui/card";
import { CopyMeetingLink } from "./CopyMeetingLink";
import { MeetingButton } from "./MeetingButton";
import { redirect } from "next/navigation";
import { getAllConnectionStatuses } from "@/utils/helper";

async function DataForMeeting() {
  const data = await MeetingsData();
  const session = await getUserSession();
  if (!session?.user?.id) {
    redirect("/login");
  }
  const days = await db.availability.findMany({
    where: { userId: session.user.id, isActive: true },
    select: {
      day: true,
    },
  });
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const baseUrl = process.env.NEXT_PUBLIC_URL;
  if (!baseUrl) {
    return (
      <div className="p-4 text-red-500">
        Configuration error: Base URL is not configured. Please contact support.
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="mt-8 w-full pb-4">
        <p className="text-muted-foreground font-inter mt-4 text-2xl">
          You have not created a meeting Link yet, create one to get started.
        </p>
      </div>
    );
  }

  const sortedDays = days.sort((a, b) => {
    const aIndex = dayOrder.indexOf(a.day);
    const bIndex = dayOrder.indexOf(b.day);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  const { isGoogleConnected, isMicrosoftConnected, isZoomConnected } =
    await getAllConnectionStatuses();

  return (
    <>
      {data.map((meeting) => {
        const splitdays = meeting.user.availabilities
          .map((item) => item.day.slice(0, 3))
          .join(", ");
        return (
          <Card
            key={meeting.id}
            className="md:border-b-primary border-l-primary gap-5 rounded-2xl border-l-7 px-4 py-4 md:border-b-7 md:border-l-0"
          >
            <CardContent className="flex items-start justify-between md:items-center">
              <div>
                <div className="flex items-center gap-4">
                  <span className="bg-primary size-5 rounded-xs" />
                  <h3 className="font-instrument text-base font-medium capitalize sm:text-2xl">
                    {meeting.title}
                  </h3>
                </div>
                <div className="pt-4">
                  <p className="text-xs text-[#AEAEAE] sm:text-sm">
                    {meeting.duration} mins {meeting.videoCallSoftware},{" "}
                    {meeting.maxParticipants > 1
                      ? "multiple participants"
                      : "one-on-one"}
                  </p>
                  <p className="text-xs text-[#AEAEAE] sm:text-sm">
                    {splitdays}
                  </p>
                </div>
              </div>
              <div className="flex flex-col-reverse items-end justify-end gap-10 md:flex-row md:items-center md:gap-4">
                <CopyMeetingLink
                  meetLinkUrl={`${baseUrl}/${encodeURIComponent(meeting.user.email)}/${encodeURIComponent(meeting.url)}`}
                />
                <MeetingButton
                  id={meeting.id}
                  url={meeting.url}
                  email={meeting.user.email}
                  days={sortedDays}
                  isGoogleConnected={isGoogleConnected}
                  isMicrosoftConnected={isMicrosoftConnected}
                  isZoomConnected={isZoomConnected}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}

export function Meetings() {
  return (
    <section>
      <h2 className="text-foreground font-instrument text-2xl font-medium">
        Meeting Link
      </h2>
      <Suspense fallback={<MeetingsLoadingSkeleton />}>
        <div className="mt-4 space-y-5">
          <DataForMeeting />
        </div>
      </Suspense>
    </section>
  );
}
