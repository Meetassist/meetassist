import { RecordedMeetingList } from "@/lib/actions/chatAction";
import { displayDate } from "@/utils/helper";
import Link from "next/link";
import { RecordingMenuButton } from "../RecordingMenuButton";
import { Button } from "../ui/button";

export async function RecordingButton({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: activeId } = await searchParams;
  const RecordedMeetingListData = await RecordedMeetingList();

  return (
    <div className="space-y-1">
      {RecordedMeetingListData.length === 0 ? (
        <p className="text-muted-foreground px-4 text-sm italic">
          No recordings found.
        </p>
      ) : (
        <>
          {RecordedMeetingListData.map((item) => {
            const isActive = item.notetakerId === activeId;
            return (
              <div key={item.notetakerId} className="group relative">
                <Button
                  asChild
                  variant={isActive ? "secondary" : "ghost"}
                  className={`font-instrument w-full justify-start rounded-none ${
                    isActive ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  <Link
                    href={`/dashboard/chats?id=${item.notetakerId}`}
                    scroll={false}
                  >
                    <span className="truncate text-left text-base font-medium">
                      {item.meetingName ?? "Untitled Meeting"}
                    </span>
                    <span className="text-muted-foreground font-instrument shrink-0 text-sm font-medium">
                      ({displayDate(item.updatedAt)})
                    </span>
                  </Link>
                </Button>
                <div className="absolute top-1/2 right-2 mt-1 -translate-y-1/2">
                  <RecordingMenuButton
                    notetakerId={item.notetakerId}
                    meetingName={item.meetingName ?? "Untitled Meeting"}
                  />
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
