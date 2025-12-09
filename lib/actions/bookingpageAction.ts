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
    console.log("There is an error with getting booking page data", error);
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
            grantEmail: true,
            grantId: true,
          },
        },
      },
    });

    if (!data || !data.user.grantId || !data.user.grantEmail) {
      throw new Error("User availability or grant credentials not found");
    }

    const nylasCalenderData = await nylas.calendars.getFreeBusy({
      identifier: data.user.grantId,
      requestBody: {
        startTime: Math.floor(startOfday.getTime() / 1000),
        endTime: Math.floor(endofDay.getTime() / 1000),
        emails: [data.user.grantEmail],
      },
    });
    return { data, nylasCalenderData };
  } catch (error) {
    console.log(error);
    throw new Error("There is an error with get this data");
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
        grantEmail: true,
        grantId: true,
        confGrantId: true,
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

    if (!userData.grantEmail || !userData.grantId) {
      throw new Error(
        "User has not connected their calendar. Please contact the event host.",
      );
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

    if (eventTypeData.videoCallSoftware === "Google Meet") {
      conferencingConfig = {
        autocreate: {},
        provider: "Google Meet" as Provider,
      };
    } else if (
      ["Zoom Meeting", "Microsoft Teams"].includes(
        eventTypeData.videoCallSoftware,
      )
    ) {
      if (!userData.confGrantId) {
        throw new Error(
          "User has not connected their conferencing account for Zoom/Teams. Please contact the event host.",
        );
      }
      // Zoom and Teams need conf_grant_id
      conferencingConfig = {
        autocreate: {
          conf_grant_id: userData.confGrantId,
        },
        provider: eventTypeData.videoCallSoftware as Provider,
      };
    } else {
      throw new Error(
        `Unsupported video conferencing provider: ${eventTypeData.videoCallSoftware}`,
      );
    }
    await nylas.events.create({
      identifier: userData.grantId,
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
        calendarId: userData.grantEmail,
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
