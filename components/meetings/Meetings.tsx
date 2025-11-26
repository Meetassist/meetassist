import { MeetingsData } from "@/lib/actions/meetingAction";
import { Card, CardContent, CardTitle } from "../ui/card";
import { CopyMeetingLink } from "./CopyMeetingLink";
import { MeetingButton } from "./MeetingButton";

export async function Meetings() {
  const data = await MeetingsData();

  const baseUrl = process.env.NEXT_PUBLIC_URL;
  if (!baseUrl) {
    return (
      <div className="p-4 text-red-500">
        Configuration error: Base URL is not configured. Please contact support.
      </div>
    );
  }

  if (data.length === 0) {
    return <div>No meetings found.</div>;
  }

  return (
    <>
      {data.map((meeting) => {
        const displayDays =
          meeting.user.availabilities
            ?.slice(0, 3)
            .map((availability) => availability.day?.slice(0, 3) || "N/A")
            .join(", ") || "No availability";

        return (
          <Card
            key={meeting.id}
            className="border-b-primary gap-5 rounded-2xl border-b-7 px-4 py-4"
          >
            <CardTitle className="flex items-center gap-4">
              <span className="bg-primary size-5 rounded-xs" />
              <span className="font-instrument text-2xl font-medium capitalize">
                {meeting.title}
              </span>
            </CardTitle>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#AEAEAE]">
                  {meeting.duration} mins {meeting.videoCallSoftware},{" "}
                  {meeting.maxParticipants > 1
                    ? "multiple participants"
                    : "one-on-one"}
                </p>
                <p className="text-sm text-[#AEAEAE]">{displayDays}</p>
              </div>
              <div className="flex items-center gap-6">
                <CopyMeetingLink
                  meetLinkUrl={`${baseUrl}/${encodeURIComponent(meeting.user.email)}/${encodeURIComponent(meeting.url)}`}
                />
                <MeetingButton id={meeting.id} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
