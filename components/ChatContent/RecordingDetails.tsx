import { RecordedMeetingDetail } from "@/lib/actions/chatAction";
import ChatState from "@/public/chatState.svg";
import { displayDate } from "@/utils/helper";
import { ArrowUp, Dot } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Badge } from "../ui/badge";
export async function RecordingDetails({
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
                <p className="font-instrument text-muted-foreground mt-4 max-w-full text-justify text-base font-medium md:max-w-[700px]">
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
                      <span>
                        <Dot size={20} />
                      </span>
                      <span> {item}</span>
                    </p>
                  ))}{" "}
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Like this summary"
                  className="cursor-pointer"
                >
                  <Image src="/thumbup.svg" alt="" width={20} height={20} />
                </button>
                <button
                  type="button"
                  aria-label="Dislike this summary"
                  className="cursor-pointer"
                >
                  <Image src="/thumbdown.svg" alt="" width={20} height={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-[100px]">
            <InputGroup className="relative max-w-[600px] rounded-3xl px-4 py-9">
              <Badge className="absolute -top-2 -right-4 z-10 text-white">
                Coming Soon
              </Badge>
              <InputGroupInput
                aria-label="Ask Meetassist about your conversation"
                placeholder="Ask Meetassist about your conversation"
                className="font-medium placeholder:text-base"
                disabled
              />
              <InputGroupAddon align="inline-end">
                <Button
                  variant={"secondary"}
                  type="button"
                  className="cursor-pointer rounded-full p-3"
                  disabled
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
