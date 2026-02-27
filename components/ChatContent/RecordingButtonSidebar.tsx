"use client";

import useSWR from "swr";
import { RecordedMeetingList } from "@/lib/actions/chatAction";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { RecordingMenuButton } from "../RecordingMenuButton";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

type Recording = {
  notetakerId: string | null;
  meetingName: string | null;
  updatedAt: Date;
};

export function RecordingButtonSidebar() {
  const searchParams = useSearchParams();
  const activeId = searchParams.get("id") ?? undefined;
  const { setOpenMobile } = useSidebar();
  const {
    data: recordings,
    error,
    isLoading,
  } = useSWR<Recording[]>("recordings", RecordedMeetingList);

  if (isLoading) {
    return (
      <div className="space-y-1 px-4 md:hidden">
        <p className="text-muted-foreground text-sm italic">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-1 px-4 md:hidden">
        <p className="text-destructive text-sm">Failed to load recordings</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 px-4 md:hidden">
      <p className="text-muted-foreground mb-4 px-4 text-sm font-semibold tracking-wider uppercase">
        Recent Recordings
      </p>
      {!recordings?.length ? (
        <p className="text-muted-foreground px-4 text-sm italic">
          No recordings found.
        </p>
      ) : (
        recordings.map((item) => {
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
                  href={`?id=${item.notetakerId}`}
                  onClick={() => setOpenMobile(false)}
                  scroll={false}
                >
                  <span className="truncate text-left text-base font-medium">
                    {item.meetingName ?? "Untitled Meeting"}
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
        })
      )}
    </div>
  );
}
