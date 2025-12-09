"use client";
import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Calendar } from "./Calender";
type RenderCalenderProps = {
  availability: {
    day: string;
    isActive: boolean;
  }[];
};

export function RenderCalender({ availability }: RenderCalenderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [date, setDate] = useState(() => {
    const dateParams = searchParams.get("date");
    try {
      return dateParams ? parseDate(dateParams) : today(getLocalTimeZone());
    } catch {
      return today(getLocalTimeZone());
    }
  });

  function handleDateChange(date: DateValue) {
    setDate(date as CalendarDate);
    const url = new URL(window.location.href);
    url.searchParams.set("date", date.toString());
    router.push(url.toString());
  }
  function isDateUnavailable(date: DateValue) {
    const dayOfWeek = date.toDate(getLocalTimeZone()).getDay();
    const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    if (availability.length !== 7) {
      throw new Error("Availability array must contain exactly 7 days");
    }
    return !availability[adjustedIndex].isActive;
  }

  return (
    <Calendar
      minValue={today(getLocalTimeZone())}
      isDateUnavailable={isDateUnavailable}
      value={date}
      onChange={handleDateChange}
    />
  );
}
