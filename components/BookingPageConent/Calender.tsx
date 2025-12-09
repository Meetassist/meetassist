"use client";
import { CalendarProps, DateValue, useCalendar, useLocale } from "react-aria";
import { useCalendarState } from "react-stately";
import { createCalendar } from "@internationalized/date";
import { CalenderHeader } from "./CalenderHeader";
import { CalendarGrid } from "./CalenderGrid";
export function Calendar(
  props: CalendarProps<DateValue> & {
    isDateUnavailable?: (date: DateValue) => boolean;
  },
) {
  const { locale } = useLocale();
  const state = useCalendarState({
    ...props,
    visibleDuration: { months: 1 },
    locale,
    createCalendar,
  });

  const { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state,
  );
  return (
    <div {...calendarProps} className="inline-block">
      <CalenderHeader
        calendarProps={calendarProps}
        state={state}
        nextButtonProps={nextButtonProps}
        prevButtonProps={prevButtonProps}
      />
      <div>
        <CalendarGrid
          state={state}
          isDateUnavailable={props.isDateUnavailable}
        />
      </div>
    </div>
  );
}
