"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight, Ellipsis, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { useState } from "react";
import { MicrosoftTeams, Zoom } from "@/utils/svgs";
import { cn } from "@/lib/utils";
type VideoCallProvider =
  | "Zoom Meeting"
  | "Google Meet"
  | "Microsoft Teams"
  | null;
export default function CreateMeeting() {
  const [participants, setParticipants] = useState<number>(0);
  const [videoCallPlatform, setVideoCallPlatform] =
    useState<VideoCallProvider>(null);
  return (
    <div className="mt-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="font-instrument border-primary text-primary w-full cursor-pointer rounded-full border-2 py-5 text-base font-medium"
          >
            <Plus />
            Create
          </Button>{" "}
        </DialogTrigger>
        <DialogDescription className="sr-only">Create Event</DialogDescription>

        {participants === 1 || participants > 1 ? (
          <DialogContent
            className="min-h-[550px] rounded-sm sm:max-w-[650px]"
            showCloseButton={false}
          >
            <DialogHeader className="-mt-8 flex flex-row items-center justify-between gap-8 text-2xl font-semibold">
              <input
                className="shadow-0 border-0 py-6 outline-0"
                defaultValue={"Name Your Meeting"}
              />
              <DialogTitle className="sr-only">Create Meeting</DialogTitle>
              <DialogClose asChild onClick={() => setParticipants(0)}>
                <button className="border-border cursor-pointer rounded-full border p-3 transition-colors hover:bg-gray-100">
                  <X size={16} />
                  <span className="sr-only">Close</span>
                </button>
              </DialogClose>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-3">
                <Label
                  htmlFor="duration"
                  className="font-instrument text-xl font-medium"
                >
                  Duration
                </Label>
                <Select defaultValue="30" name="duration">
                  <SelectTrigger
                    className="w-full cursor-pointer py-6"
                    id="duration"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="30">30 mins</SelectItem>
                      <SelectItem value="45">45 mins</SelectItem>
                      <SelectItem value="60">60 mins</SelectItem>
                      <SelectItem value="120">120 mins</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label className="font-instrument text-xl font-medium">
                  {" "}
                  Location
                </Label>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant={
                      videoCallPlatform === "Google Meet" ? "default" : "ghost"
                    }
                    onClick={() => setVideoCallPlatform("Google Meet")}
                    className={cn(
                      `border-border flex-1 cursor-pointer border p-6 text-center ${videoCallPlatform === "Google Meet" ? "text-white" : ""}`,
                    )}
                  >
                    <Image
                      src="/sync_1.svg"
                      alt="Google meet"
                      priority
                      width={20}
                      height={20}
                    />
                    Google Meet
                  </Button>
                  <Button
                    onClick={() => setVideoCallPlatform("Zoom Meeting")}
                    variant={
                      videoCallPlatform === "Zoom Meeting" ? "default" : "ghost"
                    }
                    className={cn(
                      `border-border flex-1 cursor-pointer border p-6 text-center ${videoCallPlatform === "Zoom Meeting" ? "text-white" : ""}`,
                    )}
                  >
                    <Zoom />
                    ZOOM
                  </Button>
                  <Button
                    onClick={() => setVideoCallPlatform("Microsoft Teams")}
                    variant={
                      videoCallPlatform === "Microsoft Teams"
                        ? "default"
                        : "ghost"
                    }
                    className={cn(
                      `border-border flex-1 cursor-pointer border p-6 text-center ${videoCallPlatform === "Microsoft Teams" ? "text-white" : ""}`,
                    )}
                  >
                    <MicrosoftTeams />
                    Microsoft Teams
                  </Button>

                  <Button
                    variant={"ghost"}
                    aria-disabled
                    disabled={true}
                    className="border-border flex-1 cursor-not-allowed border p-6 text-center"
                  >
                    <Image
                      src="/call.svg"
                      alt="Phone"
                      priority
                      width={20}
                      height={20}
                    />
                    Phone
                  </Button>
                </div>
              </div>

              <div className="mt-4">
                <div className="item-center flex justify-between">
                  <Label className="font-instrument text-xl font-medium">
                    Availability
                  </Label>
                  <Button
                    type="button"
                    variant={"ghost"}
                    className="border-foreground size-3 cursor-pointer rounded-sm border p-2 py-3"
                  >
                    <Ellipsis />
                  </Button>
                </div>
                <span className="text-mute-foreground text-sm font-medium">
                  Mon, Tue, Fri ( Hours Vary)
                </span>
              </div>
            </div>
            <div className="mt-8">
              <Button
                className="w-full cursor-pointer py-5 text-white"
                type="button"
              >
                Create
              </Button>
            </div>
          </DialogContent>
        ) : (
          <DialogContent
            className="min-h-[500px] rounded-sm sm:max-w-[650px]"
            showCloseButton={false}
          >
            <DialogHeader className="flex flex-row items-center justify-between space-y-0">
              <DialogTitle className="font-instrument text-2xl">
                Create Event
              </DialogTitle>
              <DialogClose asChild>
                <button className="border-border cursor-pointer rounded-full border p-3 transition-colors hover:bg-gray-100">
                  <X size={16} />
                  <span className="sr-only">Close</span>
                </button>
              </DialogClose>
            </DialogHeader>

            <div className="space-y-4">
              <Card
                className="cursor-pointer"
                onClick={() => setParticipants(1)}
              >
                <CardContent className="flex items-center justify-between px-3">
                  <div>
                    <h2 className="font-instrument text-2xl font-medium">
                      One-on-one
                    </h2>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        1 host → 1 Invitee
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Ideal for a 1:1 Interview, chats, etc
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="size-7 shrink-0" />
                </CardContent>
              </Card>
              <Card
                className="cursor-pointer"
                onClick={() => setParticipants(2)}
              >
                <CardContent className="flex items-center justify-between px-3">
                  <div>
                    <h2 className="font-instrument text-2xl font-medium">
                      Group
                    </h2>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-muted-foreground flex items-center gap-2 text-sm">
                        1 host → Multiple Invitees{" "}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Online class, Group chats, etc
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="size-7 shrink-0" />
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
