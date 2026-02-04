"use client";
import { CreateBooking } from "@/lib/actions/bookingpageAction";
import { BookingFormSchema, TBookingFormSchema } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { KeyboardEvent, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { Textarea } from "../ui/textarea";
import { BookingDetail } from "./BookingDetail";

type BookingFormTypes = {
  eventDate: string | undefined;
  fromTime: string | undefined;
  eventTypeId: string;
  userEmail: string;
  participants: number;
  name: string;
  duration: number;
  eventName: string;
};

export function BookingForm({
  eventDate,
  eventTypeId,
  fromTime,
  userEmail,
  participants,
  name,
  duration,
  eventName,
}: BookingFormTypes) {
  const [showGuestInput, setShowGuestInput] = useState<boolean>(false);
  const [guestEmails, setGuestEmails] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [showDetails, setShowDetails] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = useForm<TBookingFormSchema>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      eventDate: eventDate,
      fromTime: fromTime,
      eventTypeId: eventTypeId,
      userEmail: userEmail,
      description: "",
      guestEmail: "",
      name: "",
      guestEmails: [],
    },
  });

  function handleAddGuest() {
    if (participants <= 1) {
      toast.error("This is a one-on-one meeting link. You cannot add guests.");
      return;
    }
    setShowGuestInput(true);
  }

  function addEmail(email: string): boolean {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(trimmedEmail)) {
      toast.error(`"${trimmedEmail}" is not a valid email address`, {});
      return false;
    }

    if (guestEmails.includes(trimmedEmail)) {
      toast.error("This email has already been added");
      return false;
    }
    const mainBookerEmail = getValues("guestEmail");
    if (mainBookerEmail && mainBookerEmail === trimmedEmail) {
      toast.error("You cannot add yourself as a guest");
      return false;
    }

    if (guestEmails.length >= participants) {
      toast.error(
        `You can only add a maximum of ${participants} additional guests`,
      );
      return false;
    }
    const updatedEmails = [...guestEmails, trimmedEmail];
    setGuestEmails(updatedEmails);
    setValue("guestEmails", updatedEmails);
    setCurrentInput("");
    return true;
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === " " || e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail(currentInput);
    }

    if (
      e.key === "Backspace" &&
      currentInput === "" &&
      guestEmails.length > 0
    ) {
      const updatedEmails = guestEmails.slice(0, -1);
      setGuestEmails(updatedEmails);
      setValue("guestEmails", updatedEmails);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    const emails = pastedText
      .split(/[,;\s\n]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
    emails.forEach((email) => addEmail(email));
  }

  function removeGuestEmail(emailToRemove: string) {
    const updatedEmails = guestEmails.filter(
      (email) => email !== emailToRemove,
    );
    setGuestEmails(updatedEmails);
    setValue("guestEmails", updatedEmails);
  }

  async function handleBooking() {
    if (currentInput.trim()) {
      const added = addEmail(currentInput);
      if (!added) {
        return;
      }
    }

    const result = await CreateBooking(getValues());
    if (result.success) {
      toast.success(result.message);
      setShowDetails(true);
      reset();
      setGuestEmails([]);
      setShowGuestInput(false);
      setCurrentInput("");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <>
      <div className="mt-2 w-full pb-5 pl-0 md:mt-12 md:w-1/2">
        <div>
          <h2 className="font-instrument hidden text-2xl font-medium md:block">
            Enter Details
          </h2>
        </div>
        <form
          className="max-w-[500px] md:mt-8"
          onSubmit={handleSubmit(handleBooking)}
        >
          <FieldGroup className="gap-4">
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="guestEmail"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="w-full space-y-3">
              {!showGuestInput && (
                <Button
                  onClick={handleAddGuest}
                  className="text-primary border-primary font-inter w-full cursor-pointer rounded-full border p-4 text-xs md:w-fit"
                  type="button"
                  variant={"ghost"}
                >
                  Add Guests
                </Button>
              )}

              {showGuestInput && (
                <Field>
                  <FieldLabel htmlFor="guests">Guest Email(s)</FieldLabel>

                  <div
                    className="border-input bg-background ring-offset-background focus-within:ring-ring flex min-h-20 w-full flex-wrap items-start gap-2 rounded-md border p-3 focus-within:ring-2 focus-within:ring-offset-2"
                    onClick={() => inputRef.current?.focus()}
                  >
                    {guestEmails.map((email, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1.5 bg-[#EDECFF] p-2 text-sm text-black"
                      >
                        <span>{email}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeGuestEmail(email);
                          }}
                          disabled={isSubmitting}
                          className="cursor-pointer rounded-sm"
                          aria-label={`Remove ${email}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}

                    <input
                      ref={inputRef}
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onPaste={handlePaste}
                      onBlur={() => {
                        if (currentInput.trim()) {
                          addEmail(currentInput);
                        }
                      }}
                      disabled={isSubmitting}
                      className="placeholder:text-muted-foreground min-w-[200px] flex-1 bg-transparent outline-none"
                    />
                  </div>

                  <FieldDescription>
                    Notify up to {participants} additional guests of the
                    scheduled event.
                  </FieldDescription>
                </Field>
              )}
            </div>

            {/* Description Field */}
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel
                    htmlFor={field.name}
                    className="font-inter text-xs font-medium"
                  >
                    Share anything that will help prepare for the meeting
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    disabled={isSubmitting}
                    placeholder="Please share anything that will help prepare for our meeting."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          {/* Submit Button */}
          <div className="mt-6 w-full">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="font-inter w-full cursor-pointer rounded-full px-8 py-6 text-sm font-medium text-white md:w-fit"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  <span className="ml-2">Scheduling Event...</span>
                </>
              ) : (
                "Schedule Event"
              )}
            </Button>
          </div>
        </form>
      </div>

      {showDetails && (
        <BookingDetail
          name={name}
          duration={duration}
          eventDate={eventDate}
          fromTime={fromTime}
          eventName={eventName}
        />
      )}
    </>
  );
}
