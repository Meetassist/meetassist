"use client";
import {
  CalendarDate,
  DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from "@internationalized/date";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Calendar } from "./Calendar";
type RenderCalendarProps = {
  availability: {
    day: string;
    isActive: boolean;
  }[];
};

export function RenderCalendar({ availability }: RenderCalendarProps) {
  if (availability.length !== 7) {
    throw new Error("Availability array must contain exactly 7 days");
  }
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
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", date.toString());
    router.push(`${window.location.pathname}?${params.toString()}` as Route);
  }

  function isDateUnavailable(date: DateValue) {
    const dayOfWeek = date.toDate(getLocalTimeZone()).getDay();
    const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

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
