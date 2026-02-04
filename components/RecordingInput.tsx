"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { createRecording } from "@/lib/actions/noteTaker";
import mobileHero from "@/public/hero-mb.jpg";
import { RecordingInputSchema, TRecordingInputSchema } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  Control,
  Controller,
  useForm,
  UseFormHandleSubmit,
} from "react-hook-form";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

type MeetingUrlFormProps = {
  control: Control<TRecordingInputSchema>;
  handleSubmit: UseFormHandleSubmit<TRecordingInputSchema>;
  isSubmitting: boolean;
  onSubmit: (data: TRecordingInputSchema) => void;
  isMobile?: boolean;
};

export function RecordingInput() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TRecordingInputSchema>({
    resolver: zodResolver(RecordingInputSchema),
    defaultValues: {
      meetingUrl: "",
    },
  });

  async function handleMeetingUrlSubmit(data: TRecordingInputSchema) {
    try {
      const result = await createRecording(data.meetingUrl);

      if (!result.success) {
        toast.error(result.error || "Failed to create recording");
        return;
      }

      toast.success("MeetAssist has been sent to your meeting!", {});

      reset();
    } catch (error) {
      console.error("Error creating recording:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }

  return (
    <div>
      {/* Desktop Version */}
      <div className="relative hidden min-h-[210px] overflow-hidden rounded-2xl md:block">
        <Image
          src="/home-hero.svg"
          alt="hero"
          fill
          priority
          className="object-cover"
        />

        <div className="relative z-10 p-8">
          <h1 className="font-inter mb-2 text-[22px] font-semibold text-white">
            Record a live Meeting
          </h1>
          <p className="text-muted-foreground font-inter text-sm tracking-tighter">
            Works with Zoom, Google Meet, or Microsoft Teams
          </p>
          <div className="mt-10">
            <MeetingUrlForm
              control={control}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onSubmit={handleMeetingUrlSubmit}
            />
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="relative min-h-[150px] overflow-hidden rounded-2xl md:hidden">
        <Image
          src={mobileHero}
          alt="hero"
          fill
          priority
          className="object-cover"
        />

        <div className="relative z-10 p-8">
          <h1 className="font-inter mb-2 text-lg font-semibold text-white">
            Record a live Meeting
          </h1>
          <p className="text-muted-foreground font-inter text-sm tracking-tighter">
            Works with Zoom, Google Meet, or Microsoft Teams
          </p>
          <div className="mt-8">
            <MeetingUrlForm
              control={control}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              onSubmit={handleMeetingUrlSubmit}
              isMobile
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MeetingUrlForm({
  control,
  handleSubmit,
  isSubmitting,
  onSubmit,
  isMobile = false,
}: MeetingUrlFormProps) {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="meetingUrl"
        control={control}
        render={({ field, fieldState }) => (
          <div>
            <InputGroup
              className={`${isMobile ? "w-full" : "w-[500px]"} rounded-3xl py-6`}
            >
              <InputGroupInput
                {...field}
                placeholder="Paste meeting URL to add MeetAssist"
                className="rounded-2xl text-white"
                id={field.name}
                aria-invalid={fieldState.invalid}
                aria-describedby={
                  fieldState.error ? `${field.name}-error` : undefined
                }
                disabled={isSubmitting}
              />
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  type="submit"
                  variant="secondary"
                  className="font-inter w-[150px] cursor-pointer rounded-3xl px-3 py-5 text-sm font-normal"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Spinner /> : "Record meeting"}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
            {fieldState.error && (
              <span
                id={`${field.name}-error`}
                className="text-destructive mt-1 text-sm"
                role="alert"
              >
                {fieldState.error.message}
              </span>
            )}
          </div>
        )}
      />
    </form>
  );
}
