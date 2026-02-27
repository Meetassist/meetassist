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
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  ConnectGoogleMeetButton,
  ConnectMicrosoftButton,
  ConnectZoomButton,
} from "../ConnectButton";

type VideoCallProvider =
  | "Google Meet"
  | "Zoom Meeting"
  | "Microsoft Teams"
  | "";

type TCreateMeeting = {
  days: { day: string }[];
  isGoogleConnected: boolean;
  isMicrosoftConnected: boolean;
  isZoomConnected: boolean;
  button?: boolean;
};

export default function CreateMeeting({
  days,
  isGoogleConnected,
  isMicrosoftConnected,
  isZoomConnected,
  button,
}: TCreateMeeting) {
  const splitdays = days.map((item) => item.day.slice(0, 3)).join(", ");
  const [participants, setParticipants] = useState<number>(0);
  const [videoCallPlatform, setVideoCallPlatform] =
    useState<VideoCallProvider>("");
  const [isOpen, setIsOpen] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState<string>("");
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

  function handleSoftwareCheck(platform: VideoCallProvider) {
    if (platform === "Google Meet" && !isGoogleConnected) {
      setConnectionMessage("Your Google account has not been connected");
      return false;
    } else {
      setConnectionMessage("");
    }
    if (platform === "Microsoft Teams" && !isMicrosoftConnected) {
      setConnectionMessage("Your Microsoft account has not been connected");
      return false;
    } else {
      setConnectionMessage("");
    }
    if (platform === "Zoom Meeting" && !isZoomConnected) {
      setConnectionMessage("Your Zoom account has not been connected");
      return false;
    } else {
      setConnectionMessage("");
    }
    return true;
  }

  function handlePlatformSelect(platform: VideoCallProvider) {
    const isConnected = handleSoftwareCheck(platform);

    if (isConnected) {
      setVideoCallPlatform(platform);
      setValue("videoCallSoftware", platform, { shouldValidate: true });
    } else {
      setVideoCallPlatform("");
      setValue("videoCallSoftware", "");
    }
  }

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
    setConnectionMessage("");
    reset();
  };
  return (
    <div className={`${button ? "" : "mt-4"}`}>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) handleDialogClose();
        }}
      >
        <DialogTrigger asChild>
          {!button ? (
            <Button className="font-instrument mt-4 w-full cursor-pointer rounded-full py-7 text-base font-medium text-white">
              <Plus />
              Create
            </Button>
          ) : (
            <p className="text-muted-foreground font-inter text-sm md:text-xl">
              You have not created a meeting Link yet,{" "}
              <button className="text-primary font-inter cursor-pointer text-sm md:text-xl">
                click here
              </button>{" "}
              to get started.
            </p>
          )}
        </DialogTrigger>

        {participants === 1 || participants === 2 ? (
          <DialogContent
            className="max-h-[90vh] min-h-[550px] overflow-y-auto rounded-sm px-4 sm:max-w-[650px] sm:px-6"
            showCloseButton={false}
          >
            <DialogDescription className="sr-only">
              Create Event
            </DialogDescription>
            <form
              onSubmit={handleSubmit(handleCreateMeeting)}
              className="contents"
            >
              <DialogHeader className="-mt-8 flex flex-row items-center justify-between gap-4 text-xl font-semibold sm:gap-8 sm:text-2xl">
                <div className="flex-1">
                  <input
                    className="shadow-0 w-full border-0 py-4 text-base outline-0 sm:py-6 sm:text-xl"
                    {...register("title")}
                    placeholder="Name Your Meeting"
                    onChange={handleTitleChange}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-500 sm:text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <DialogTitle className="sr-only">Create Meeting</DialogTitle>
                <DialogClose asChild>
                  <button
                    type="button"
                    className="border-border cursor-pointer rounded-full border p-2 transition-colors hover:bg-gray-100 sm:p-3"
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
                    className="font-instrument text-lg font-medium sm:text-xl"
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
                          className="w-full cursor-pointer py-5 sm:py-6"
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
                    <p className="text-xs text-red-500 sm:text-sm">
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                {/* Video Platform Selection */}
                <div className="space-y-3">
                  <Label className="font-instrument text-lg font-medium sm:text-xl">
                    Location
                  </Label>

                  <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:gap-1.5">
                    <Button
                      type="button"
                      variant={
                        videoCallPlatform === "Google Meet"
                          ? "default"
                          : "ghost"
                      }
                      onClick={() => handlePlatformSelect("Google Meet")}
                      className={cn(
                        "border-border flex-1 cursor-pointer border p-4 text-center text-xs sm:p-6 sm:text-sm",
                        videoCallPlatform === "Google Meet" && "text-white",
                      )}
                    >
                      <Image
                        src="/sync_1.svg"
                        alt="Google meet"
                        priority
                        width={20}
                        height={20}
                        className="shrink-0"
                      />
                      <span className="hidden sm:inline">Google Meet</span>
                      <span className="sm:hidden">Meet</span>
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
                        "border-border flex-1 cursor-pointer border p-4 text-center text-xs sm:p-6 sm:text-sm",
                        videoCallPlatform === "Microsoft Teams" && "text-white",
                      )}
                    >
                      <MicrosoftTeams />
                      <span className="hidden sm:inline">Microsoft Teams</span>
                      <span className="sm:hidden">Teams</span>
                    </Button>
                    <Button
                      type="button"
                      disabled={true}
                      onClick={() => handlePlatformSelect("Zoom Meeting")}
                      variant={
                        videoCallPlatform === "Zoom Meeting"
                          ? "default"
                          : "ghost"
                      }
                      className={cn(
                        "border-border flex-1 cursor-not-allowed border p-4 text-center text-xs sm:p-6 sm:text-sm",
                        videoCallPlatform === "Zoom Meeting" && "text-white",
                      )}
                    >
                      <Zoom />
                      ZOOM
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={true}
                      className="border-border flex-1 cursor-not-allowed border p-4 text-center text-xs sm:p-6 sm:text-sm"
                    >
                      <Image
                        src="/call.svg"
                        alt="Phone"
                        priority
                        width={20}
                        height={20}
                        className="shrink-0"
                      />
                      Phone
                    </Button>
                  </div>
                  {errors.videoCallSoftware && (
                    <p className="text-xs text-red-500 sm:text-sm">
                      {errors.videoCallSoftware.message}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    <p className="text-xs text-red-500 sm:text-sm">
                      {connectionMessage}
                    </p>
                    <div>
                      {connectionMessage.includes("Microsoft") && (
                        <ConnectMicrosoftButton
                          variant="ghost"
                          text="Connect Microsoft"
                          icon={ArrowRight}
                          styles="text-primary rounded-full border py-3"
                        />
                      )}
                      {connectionMessage.includes("Google") && (
                        <ConnectGoogleMeetButton
                          text="Connect Google"
                          variant="ghost"
                          icon={ArrowRight}
                          styles="text-primary rounded-full border py-3"
                        />
                      )}
                      {/* zoom is currently disable at the moment till we host meetassist on zoom market place */}
                      {connectionMessage.includes("Zoom") && (
                        <ConnectZoomButton
                          variant="ghost"
                          text="Connect Zoom"
                          icon={ArrowRight}
                          styles="text-primary rounded-full border py-3"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Availability Display */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-instrument text-lg font-medium sm:text-xl">
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

                  <span className="text-muted-foreground text-xs font-medium sm:text-sm">
                    {splitdays} (Hours vary)
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 w-full sm:mt-8">
                <Button
                  className="w-full cursor-pointer py-5 text-sm text-white sm:text-base"
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
            className="max-h-[90vh] min-h-[500px] overflow-y-auto rounded-sm px-4 sm:max-w-[650px] sm:px-6"
            showCloseButton={false}
          >
            <DialogHeader className="flex flex-row items-center justify-between space-y-0">
              <DialogTitle className="font-instrument text-xl sm:text-2xl">
                Create Event
              </DialogTitle>
              <DialogDescription className="sr-only">
                Select meeting type
              </DialogDescription>
              <DialogClose asChild>
                <button
                  type="button"
                  className="border-border cursor-pointer rounded-full border p-2 transition-colors hover:bg-gray-100 sm:p-3"
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
                <CardContent className="flex items-center justify-between px-3 py-4">
                  <div>
                    <h2 className="font-instrument text-xl font-medium sm:text-2xl">
                      One-on-one
                    </h2>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
                        1 host → 1 Invitee
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Ideal for a 1:1 Interview, chats, etc
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="size-5 shrink-0 sm:size-7" />
                </CardContent>
              </Card>
              {/* Group Option */}
              <Card
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setParticipants(2);
                    setValue("maxParticipants", 10);
                  }
                }}
                onClick={() => {
                  setParticipants(2);
                  setValue("maxParticipants", 10);
                }}
              >
                <CardContent className="flex items-center justify-between px-3 py-4">
                  <div>
                    <h2 className="font-instrument text-xl font-medium sm:text-2xl">
                      Group
                    </h2>
                    <div className="mt-2 space-y-0.5">
                      <p className="text-muted-foreground flex items-center gap-2 text-xs sm:text-sm">
                        1 host → Multiple Invitees{" "}
                      </p>
                      <p className="text-muted-foreground text-xs sm:text-sm">
                        Online class, Group chats, etc
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="size-5 shrink-0 sm:size-7" />
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
