import { cn } from "@/lib/utils";
import {
  type CalendarDate,
  getLocalTimeZone,
  isSameMonth,
  isToday,
} from "@internationalized/date";
import { useRef } from "react";
import { mergeProps, useCalendarCell, useFocusRing } from "react-aria";
import { type CalendarState } from "react-stately";
export function CalendarCell({
  state,
  date,
  currentMonth,
  isUnavailable,
}: {
  state: CalendarState;
  date: CalendarDate;
  currentMonth: CalendarDate;
  isUnavailable?: boolean;
}) {
  const ref = useRef(null);
  const { cellProps, buttonProps, isSelected, isDisabled, formattedDate } =
    useCalendarCell({ date }, state, ref);

  const { focusProps, isFocusVisible } = useFocusRing();
  const isDateToday = isToday(date, getLocalTimeZone());
  const isOutsideOfMonth = !isSameMonth(currentMonth, date);
  const finallyIsDisabled = isDisabled || isUnavailable;
  return (
    <td
      {...cellProps}
      className={`relative p-1 ${isFocusVisible ? "z-10" : "z-0"}`}
    >
      <button
        {...mergeProps(buttonProps, focusProps)}
        hidden={isOutsideOfMonth}
        disabled={finallyIsDisabled}
        ref={ref}
        className="group size-10 rounded-md border-0 bg-transparent p-0 outline-none sm:size-12"
      >
        <div
          className={cn(
            "flex size-full cursor-pointer items-center justify-center rounded-full text-base font-normal",
            finallyIsDisabled
              ? "text-muted-foreground cursor-not-allowed"
              : isSelected
                ? "bg-primary font-semibold text-white"
                : "text-primary bg-[#F0EFFF]",
          )}
        >
          {formattedDate}
          {isDateToday && (
            <div
              className={cn(
                "bg-primary absolute bottom-3 left-1/2 size-1.5 -translate-x-1/2 translate-y-1/2 transform rounded-full",
              )}
            />
          )}
        </div>
      </button>
    </td>
  );
}
