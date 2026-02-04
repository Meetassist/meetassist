"use server";

import { BookingFormSchema, TBookingFormSchema } from "@/utils/types";
import { format } from "date-fns";
import { DAY } from "../generated/prisma/enums";
import { nylas } from "../nylas";
import db from "../prisma";
type Provider =
  | "GoToMeeting"
  | "Google Meet"
  | "Microsoft Teams"
  | "WebEx"
  | "Zoom Meeting";

export async function BookingPageData(
  originalEmail: string,
  eventname: string,
) {
  try {
    const data = await db.eventType.findFirst({
      where: {
        url: eventname,
        user: {
          email: originalEmail,
        },
      },
      select: {
        id: true,
        duration: true,
        title: true,
        videoCallSoftware: true,
        maxParticipants: true,
        user: {
          select: {
            email: true,
            name: true,
            availabilities: {
              select: {
                day: true,
                isActive: true,
              },
            },
          },
        },
      },
    });
    return data;
  } catch (error) {
    console.error("There is an error with getting booking page data", error);
    throw error;
  }
}

export async function GetTimeTableData(email: string, selectedDate: Date) {
  const currentDay = format(selectedDate, "EEEE") as DAY;
  const startOfday = new Date(selectedDate);
  startOfday.setHours(0, 0, 0, 0);
  const endofDay = new Date(selectedDate);
  endofDay.setHours(23, 59, 59, 999);

  try {
    const data = await db.availability.findFirst({
      where: {
        day: currentDay,
        user: {
          email: email,
        },
      },
      select: {
        fromTime: true,
        toTime: true,
        id: true,
        user: {
          select: {
            googleGrantId: true,
            googleEmail: true,
            microsoftGrantId: true,
            microsoftEmail: true,
          },
        },
      },
    });

    const hasGoogleCalendar =
      data?.user.googleGrantId && data?.user.googleEmail;
    const hasMicrosoftCalendar =
      data?.user.microsoftGrantId && data?.user.microsoftEmail;

    if (!data || (!hasGoogleCalendar && !hasMicrosoftCalendar)) {
      throw new Error(
        "User availability or at least one calendar provider not found",
      );
    }

    const freeBusyChecks = [];

    if (data.user.googleGrantId) {
      freeBusyChecks.push(
        nylas.calendars.getFreeBusy({
          identifier: data.user.googleGrantId,
          requestBody: {
            startTime: Math.floor(startOfday.getTime() / 1000),
            endTime: Math.floor(endofDay.getTime() / 1000),
            emails: [data.user.googleEmail as string],
          },
        }),
      );
    }

    if (data.user.microsoftGrantId) {
      freeBusyChecks.push(
        nylas.calendars.getFreeBusy({
          identifier: data.user.microsoftGrantId,
          requestBody: {
            startTime: Math.floor(startOfday.getTime() / 1000),
            endTime: Math.floor(endofDay.getTime() / 1000),
            emails: [data.user.microsoftEmail as string],
          },
        }),
      );
    }

    const allBusyTimes = await Promise.all(freeBusyChecks);
    return { data, allBusyTimes };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function CreateBooking(data: TBookingFormSchema) {
  const verifyData = BookingFormSchema.safeParse(data);
  if (!verifyData.success) {
    return {
      success: false,
      message: `Validation failed`,
    };
  }

  const validatedData = verifyData.data;

  try {
    const userData = await db.user.findUnique({
      where: {
        email: validatedData.userEmail,
      },
      select: {
        googleGrantId: true,
        googleEmail: true,
        microsoftGrantId: true,
        microsoftEmail: true,
        microsoftCalendarId: true,
        zoomGrantId: true,
      },
    });

    const eventTypeData = await db.eventType.findUnique({
      where: {
        id: validatedData.eventTypeId,
      },
      select: {
        title: true,
        duration: true,
        videoCallSoftware: true,
      },
    });

    if (!userData) {
      throw new Error("User not found in database");
    }

    if (!eventTypeData) {
      throw new Error("Event type not found or has been deleted");
    }

    const fromTime = validatedData.fromTime;
    const eventDate = validatedData.eventDate;
    const duration = eventTypeData.duration;
    const startDateTime = new Date(`${eventDate}T${fromTime}:00`);
    const eventDateTime = new Date(startDateTime.getTime() + duration * 60000);

    const participantsData = [
      {
        name: validatedData.name,
        email: validatedData.guestEmail,
        status: "yes" as const,
      },
      ...(validatedData.guestEmails || []).map((email) => ({
        email: email,
        status: "noreply" as const,
      })),
    ];

    let conferencingConfig;
    let grantId: string;
    let calendarId: string;

    if (eventTypeData.videoCallSoftware === "Google Meet") {
      if (!userData.googleGrantId || !userData.googleEmail) {
        throw new Error(
          "User has not connected their google account for video conferencing.",
        );
      }
      conferencingConfig = {
        autocreate: {},
        provider: "Google Meet" as Provider,
      };
      grantId = userData.googleGrantId;
      calendarId = userData.googleEmail;
    } else if (eventTypeData.videoCallSoftware === "Microsoft Teams") {
      if (!userData.microsoftGrantId || !userData.microsoftCalendarId) {
        throw new Error(
          "User has not connected their microsoft account for video conferencing.",
        );
      }
      conferencingConfig = {
        autocreate: {},
        provider: "Microsoft Teams" as Provider,
      };
      grantId = userData.microsoftGrantId;
      calendarId = userData.microsoftCalendarId;
    } else if (eventTypeData.videoCallSoftware === "Zoom Meeting") {
      if (
        !userData.zoomGrantId ||
        !userData.googleGrantId ||
        !userData.googleEmail
      ) {
        throw new Error(
          "User has not connected their Zoom account and Google Calendar for video conferencing.",
        );
      }
      conferencingConfig = {
        autocreate: {
          conf_grant_id: userData.zoomGrantId,
        },
        provider: "Zoom Meeting" as Provider,
      };
      grantId = userData.googleGrantId;
      calendarId = userData.googleEmail;
    } else {
      throw new Error(
        `Unsupported video conferencing provider: ${eventTypeData.videoCallSoftware}`,
      );
    }

    await nylas.events.create({
      identifier: grantId!,
      requestBody: {
        title: eventTypeData.title,
        description: validatedData.description,
        when: {
          startTime: Math.floor(startDateTime.getTime() / 1000),
          endTime: Math.floor(eventDateTime.getTime() / 1000),
        },
        conferencing: conferencingConfig,
        participants: participantsData,
      },
      queryParams: {
        calendarId: calendarId!,
        notifyParticipants: true,
      },
    });

    return {
      success: true,
      message: "Booking created successfully",
    };
  } catch (error) {
    console.error("Error creating booking:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the booking",
    };
  }
}
