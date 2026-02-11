export const dynamic = "force-dynamic";
import { DetailsSkeleton, SidebarSkeleton } from "@/components/SkeletonLoading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  RecordedMeetingDetail,
  RecordedMeetingList,
} from "@/lib/actions/chatAction";
import ChatState from "@/public/chatState.svg";
import { displayDate } from "@/utils/helper";
import { ArrowUp, SearchIcon } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Chat",
  description: "Chat with MeetAssist about your conversations",
  robots: {
    index: false,
    follow: false,
  },
};

import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

async function RecordingButton({
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
              <Button
                key={item.notetakerId}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={`font-instrument w-full justify-start rounded-none ${
                  isActive ? "bg-accent text-accent-foreground" : ""
                }`}
              >
                <Link href={`?id=${item.notetakerId}`} scroll={false}>
                  <span className="truncate text-left text-base font-medium">
                    {item.meetingName ?? "Untitled Meeting"}
                  </span>
                  <span className="text-muted-foreground font-instrument shrink-0 text-sm font-medium">
                    ({displayDate(item.updatedAt)})
                  </span>
                </Link>
              </Button>
            );
          })}
        </>
      )}
    </div>
  );
}
async function RecordingDetails({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id: activeId } = await searchParams;
  const recordingData = await RecordedMeetingDetail(activeId);
  return (
    <>
      {recordingData === null ? (
        <div className="md:border-border w-full flex-1 pr-3 md:border-r">
          <div className="flex h-[380px] w-full flex-col items-center justify-center gap-4">
            <Image src={ChatState} alt="Meetassist Chat empty state" />
            <h3 className="text-muted-foreground px-4 text-base font-semibold tracking-wider uppercase">
              {activeId
                ? "Recording not found"
                : "Select a recording from the sidebar"}
            </h3>
          </div>
        </div>
      ) : (
        <div className="md:border-border w-full flex-1 pr-3 md:border-r">
          <h2 className="font-instrument text-2xl font-medium">
            Summary of {recordingData.meetingName ?? "Untitled meeting"}
          </h2>
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="/meetassit.png"
                  alt="Meetassist"
                  className="size-10 object-cover"
                />
              </Avatar>

              <span className="text-xl font-medium">Meetassist</span>
              <span className="font-instrument text-muted-foreground text-sm">
                {displayDate(recordingData.updatedAt)}
              </span>
            </div>
            <div className="px-4 md:px-7">
              <div>
                <p className="font-instrument text-muted-foreground mt-4 max-w-full text-base font-medium md:max-w-[700px]">
                  {recordingData.summary ?? "No summary available"}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="font-instrument pb-2 text-xl font-medium">
                  Action items
                </h3>
                <div className="space-y-3">
                  {(recordingData.actionItems ?? []).map((item, index) => (
                    <p
                      key={index}
                      className="font-instrument flex gap-2 text-base font-medium text-[#646566]"
                    >
                      <span> ✔</span>
                      <span> {item}</span>
                    </p>
                  ))}{" "}
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <Image
                  src="/thumbup.svg"
                  alt="positive"
                  className="cursor-pointer"
                  width={20}
                  height={20}
                />
                <Image
                  src="/thumbdown.svg"
                  className="cursor-pointer"
                  alt="negative"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>
          <div className="mt-[100px]">
            <InputGroup className="max-w-[600px] rounded-3xl px-4 py-9">
              <InputGroupInput
                aria-label="Ask Meetassist about your conversation"
                placeholder="Ask Meetassist about your conversation"
                className="font-medium placeholder:text-base"
              />
              <InputGroupAddon align="inline-end">
                <Button
                  variant={"secondary"}
                  type="button"
                  className="cursor-pointer rounded-full p-3"
                >
                  <ArrowUp />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      )}
    </>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  return (
    <section className="px-4 pb-4 md:px-6">
      <header className="hidden py-5 md:block">
        <InputGroup className="max-w-[500px] rounded-lg py-5">
          <InputGroupInput
            aria-label="Ask or Search"
            className="placeholder:text-base"
            placeholder="Ask or Search"
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end" className="font-inter">
            K
          </InputGroupAddon>
        </InputGroup>
      </header>
      <div className="border-border mt-3 flex items-center border-b pb-3 md:mt-6">
        <div>
          <h1 className="font-instrument text-2xl font-medium">MeetAssist</h1>
          <p className="font-instrument text-muted-foreground text-sm">
            This channel is just between meetassist and you. Ask anything about
            your conversations 💬
          </p>
        </div>
      </div>
      <div className="mt-8 flex items-start justify-between gap-8">
        <Suspense fallback={<DetailsSkeleton />}>
          <RecordingDetails searchParams={searchParams} />
        </Suspense>

        <div className="hidden w-[300px] shrink-0 md:block">
          <h3 className="text-muted-foreground mb-4 px-4 text-sm font-semibold tracking-wider uppercase">
            Recent Recordings
          </h3>
          <Suspense fallback={<SidebarSkeleton />}>
            <RecordingButton searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
