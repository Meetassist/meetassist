import { Time } from "@internationalized/date";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { CopyTimesPopover } from "./CopyTimesPopover";
import { TimeFieldInput } from "./TimeFieldInput";
import { UnavailableDay } from "./UnavailableDay";

interface AvailabilityDay {
  id: string;
  day: string;
  fromTime: string;
  toTime: string;
  isActive: boolean;
}

interface DayTimeSlotProps {
  day: AvailabilityDay;
  allDays: AvailabilityDay[];
  fromTimeValue: Time;
  toTimeValue: Time;
  onFromTimeChange: (value: Time) => void;
  onToTimeChange: (value: Time) => void;
  onFromTimeBlur: () => void;
  onToTimeBlur: () => void;
  onToggleActive: () => void;
  selectedDaysForCopy: string[];
  onCopyDayToggle: (dayId: string, checked: boolean) => void;
  onCopyApply: () => void;
  isCopyPopoverOpen: boolean;
  onCopyPopoverOpenChange: (open: boolean) => void;
  isDisabled?: boolean;
}

export function DayTimeSlot({
  day,
  allDays,
  fromTimeValue,
  toTimeValue,
  onFromTimeChange,
  onToTimeChange,
  onFromTimeBlur,
  onToTimeBlur,
  onToggleActive,
  selectedDaysForCopy,
  onCopyDayToggle,
  onCopyApply,
  isCopyPopoverOpen,
  onCopyPopoverOpenChange,
  isDisabled = false,
}: DayTimeSlotProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-primary relative flex size-10 shrink-0 items-center justify-center rounded-full text-white">
        <span>{day.day[0] || "?"}</span>
      </div>
      {day.isActive ? (
        <>
          <div className="flex items-center gap-3">
            <TimeFieldInput
              value={fromTimeValue}
              onChange={onFromTimeChange}
              onBlur={onFromTimeBlur}
              label={`${day.day} from time`}
              isDisabled={isDisabled}
            />
            <span className="text-muted-foreground">-</span>
            <TimeFieldInput
              value={toTimeValue}
              onChange={onToTimeChange}
              onBlur={onToTimeBlur}
              label={`${day.day} to time`}
              isDisabled={isDisabled}
            />
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleActive}
              disabled={isDisabled}
              aria-label={`Remove ${day.day} time slot`}
              className="cursor-pointer"
            >
              <X className="size-4" />
            </Button>
            <CopyTimesPopover
              sourceDay={day}
              allDays={allDays}
              selectedDays={selectedDaysForCopy}
              onDayToggle={onCopyDayToggle}
              onApply={onCopyApply}
              isOpen={isCopyPopoverOpen}
              onOpenChange={onCopyPopoverOpenChange}
            />
          </div>
        </>
      ) : (
        <UnavailableDay
          dayName={day.day}
          onActivate={onToggleActive}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
}
