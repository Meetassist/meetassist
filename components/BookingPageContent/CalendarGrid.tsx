import { DateDuration, DateValue, endOfMonth } from "@internationalized/date";
import { useCalendarGrid } from "react-aria";
import { type CalendarState } from "react-stately";
import { CalendarCell } from "./CalendarCell";
export function CalendarGrid({
  state,
  offset = {},
  isDateUnavailable,
}: {
  state: CalendarState;
  offset?: DateDuration;
  isDateUnavailable?: (date: DateValue) => boolean;
}) {
  const startDate = state.visibleRange.start.add(offset);
  const endDate = endOfMonth(startDate);
  const { gridProps, headerProps, weekDays, weeksInMonth } = useCalendarGrid(
    {
      startDate,
      endDate,
      weekdayStyle: "short",
    },
    state,
  );

  return (
    <div className="mt-10">
      <table {...gridProps} cellPadding={0}>
        <thead {...headerProps} className="">
          <tr className="text-muted-foreground text-xs font-semibold md:text-sm">
            {weekDays.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody className="">
          {/* {state.getDatesInWeek(weekIndex, startDate).map((date, i) => { */}
          {[...new Array(weeksInMonth).keys()].map((weekIndex) => (
            <tr key={weekIndex}>
              {state.getDatesInWeek(weekIndex).map((date, i) => {
                const cellKey = date
                  ? date.toString()
                  : `empty-${weekIndex}-${i}`;
                return date ? (
                  <CalendarCell
                    currentMonth={startDate}
                    key={cellKey}
                    state={state}
                    date={date}
                    isUnavailable={isDateUnavailable?.(date)}
                  />
                ) : (
                  <td key={cellKey} />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
