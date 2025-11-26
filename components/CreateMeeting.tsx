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
import { CreateEvent } from "@/lib/actions/createEvent";
import { cn } from "@/lib/utils";
import { generateUrl } from "@/utils/helper";
import { MicrosoftTeams, Zoom } from "@/utils/svgs";
import { CreateMeetingSchema, TCreateMeetingSchema } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Ellipsis, Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Spinner } from "./ui/spinner";

type VideoCallProvider =
  | "Google Meet"
  | "Zoom Meeting"
  | "Microsoft Teams"
  | "";

type TCreateMeeting = {
  days: { day: string }[];
};

export default function CreateMeeting({ days }: TCreateMeeting) {
  const splitdays = days.map((item) => item.day.slice(0, 3)).join(", ");
  const [participants, setParticipants] = useState<number>(0);
  const [videoCallPlatform, setVideoCallPlatform] =
    useState<VideoCallProvider>("");
  const [isOpen, setIsOpen] = useState(false);
  const {
    handleSubmit,
    register,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TCreateMeetingSchema>({
    resolver: zodResolver(CreateMeetingSchema),
    defaultValues: {
      title: "",
      duration: 30,
      maxParticipants: 1,
      url: "",
      videoCallSoftware: "",
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    setValue("url", generateUrl(newTitle), { shouldValidate: true });
  };

  const handlePlatformSelect = (platform: VideoCallProvider) => {
    setVideoCallPlatform(platform);
    setValue("videoCallSoftware", platform);
  };

  async function handleCreateMeeting(data: TCreateMeetingSchema) {
    try {
      const results = await CreateEvent(data);
      if (results.success) {
        toast.success("Event created");
        setIsOpen(false);
      } else {
        toast.error(results.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create event. Please try again.");
    }
  }

  const handleDialogClose = () => {
    setParticipants(0);
    setVideoCallPlatform("");
    reset();
  };
  return (
    <div className="mt-4">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) handleDialogClose();
        }}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="font-instrument border-primary text-primary w-full cursor-pointer rounded-full border-2 py-5 text-base font-medium"
          >
            <Plus />
            Create
          </Button>
        </DialogTrigger>

        {/* Show meeting details form after selecting type */}
        {participants === 1 || participants === 2 ? (
          <DialogContent
            className="min-h-[550px] rounded-sm sm:max-w-[650px]"
            showCloseButton={false}
          >
            <DialogDescription className="sr-only">
              Create Event
            </DialogDescription>
            <form
              onSubmit={handleSubmit(handleCreateMeeting)}
              className="contents"
            >
              <DialogHeader className="-mt-8 flex flex-row items-center justify-between gap-8 text-2xl font-semibold">
                <div className="flex-1">
                  <input
                    className="shadow-0 w-full border-0 py-6 outline-0"
                    {...register("title")}
                    placeholder="Name Your Meeting"
                    onChange={handleTitleChange}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <DialogTitle className="sr-only">Create Meeting</DialogTitle>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="border-border cursor-pointer rounded-full border p-3 transition-colors hover:bg-gray-100"
                  >
                    <X size={16} />
                    <span className="sr-only">Close</span>
                  </button>
                </DialogClose>
              </DialogHeader>

              <div className="space-y-4">
                {/* Duration Selection */}
                <div className="space-y-3">
                  <Label
                    htmlFor="duration"
                    className="font-instrument text-xl font-medium"
                  >
                    Duration
                  </Label>
                  <Controller
                    name="duration"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString()}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
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
                    )}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-500">
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                {/* Video Platform Selection */}
                <div className="space-y-3">
                  <Label className="font-instrument text-xl font-medium">
                    Location
                  </Label>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant={
                        videoCallPlatform === "Google Meet"
                          ? "default"
                          : "ghost"
                      }
                      onClick={() => handlePlatformSelect("Google Meet")}
                      className={cn(
                        "border-border flex-1 cursor-pointer border p-6 text-center",
                        videoCallPlatform === "Google Meet" && "text-white",
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
                      type="button"
                      onClick={() => handlePlatformSelect("Zoom Meeting")}
                      variant={
                        videoCallPlatform === "Zoom Meeting"
                          ? "default"
                          : "ghost"
                      }
                      className={cn(
                        "border-border flex-1 cursor-pointer border p-6 text-center",
                        videoCallPlatform === "Zoom Meeting" && "text-white",
                      )}
                    >
                      <Zoom />
                      ZOOM
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handlePlatformSelect("Microsoft Teams")}
                      variant={
                        videoCallPlatform === "Microsoft Teams"
                          ? "default"
                          : "ghost"
                      }
                      className={cn(
                        "border-border flex-1 cursor-pointer border p-6 text-center",
                        videoCallPlatform === "Microsoft Teams" && "text-white",
                      )}
                    >
                      <MicrosoftTeams />
                      Microsoft Teams
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
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
                  {errors.videoCallSoftware && (
                    <p className="text-sm text-red-500">
                      {errors.videoCallSoftware.message}
                    </p>
                  )}
                </div>

                {/* Availability Display */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-instrument text-xl font-medium">
                      Availability
                    </Label>
                    <Button
                      type="button"
                      variant="ghost"
                      className="border-foreground size-3 cursor-pointer rounded-sm border p-2 py-3"
                    >
                      <Ellipsis />
                    </Button>
                  </div>

                  <span className="text-muted-foreground text-sm font-medium">
                    {splitdays} (Hours vary)
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <Button
                  className="w-full cursor-pointer py-5 text-white"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner /> Creating...
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        ) : (
          /* Initial participant type selection */
          <DialogContent
            className="min-h-[500px] rounded-sm sm:max-w-[650px]"
            showCloseButton={false}
          >
            <DialogHeader className="flex flex-row items-center justify-between space-y-0">
              <DialogTitle className="font-instrument text-2xl">
                Create Event
              </DialogTitle>
              <DialogDescription className="sr-only">
                Select meeting type
              </DialogDescription>
              <DialogClose asChild>
                <button
                  type="button"
                  className="border-border cursor-pointer rounded-full border p-3 transition-colors hover:bg-gray-100"
                >
                  <X size={16} />
                  <span className="sr-only">Close</span>
                </button>
              </DialogClose>
            </DialogHeader>

            <div className="space-y-4">
              <Card
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setParticipants(1);
                    setValue("maxParticipants", 1);
                  }
                }}
                onClick={() => {
                  setParticipants(1);
                  setValue("maxParticipants", 1);
                }}
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

              {/* Group Option */}
              <Card
                className="cursor-pointer"
                onClick={() => {
                  setParticipants(2);
                  setValue("maxParticipants", 10);
                }}
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
