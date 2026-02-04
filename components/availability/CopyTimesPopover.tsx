import { CopyIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Spinner } from "../ui/spinner";

interface AvailabilityDay {
  id: string;
  day: string;
  fromTime: string;
  toTime: string;
  isActive: boolean;
}

interface CopyTimesPopoverProps {
  sourceDay: AvailabilityDay;
  allDays: AvailabilityDay[];
  selectedDays: string[];
  onDayToggle: (dayId: string, checked: boolean) => void;
  onApply: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isDisabled: boolean;
  loading?: boolean;
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
}

export function CopyTimesPopover({
  sourceDay,
  allDays,
  selectedDays,
  onDayToggle,
  onApply,
  isOpen,
  onOpenChange,
  isDisabled,
  isAllSelected,
  onSelectAll,
  loading,
}: CopyTimesPopoverProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          disabled={isDisabled}
          size="icon"
          className="cursor-pointer"
          aria-label={`Copy ${sourceDay.day} times to other days`}
        >
          <CopyIcon className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] px-4 pt-4">
        <div className="space-y-4">
          <h4 className="text-muted-foreground text-sm font-medium">
            Copy Times To
          </h4>
          <div className="space-y-4">
            {allDays.map((day) => {
              const isCurrentDay = day.id === sourceDay.id;
              const isSelected = selectedDays.includes(day.id) || false;

              return (
                <div key={day.id} className="flex items-center justify-between">
                  <Label
                    htmlFor={`copy-${sourceDay.id}-${day.id}`}
                    className="w-full cursor-pointer text-sm leading-none font-normal"
                  >
                    {day.day}
                  </Label>
                  <Checkbox
                    className="cursor-pointer"
                    id={`copy-${sourceDay.id}-${day.id}`}
                    checked={isCurrentDay || isSelected}
                    disabled={isCurrentDay}
                    onCheckedChange={(checked) => {
                      if (isCurrentDay) return;
                      onDayToggle(day.id, checked === true);
                    }}
                  />
                </div>
              );
            })}
            <div className="flex w-full items-center justify-between border-t py-1">
              <Label
                htmlFor={`select-all-${sourceDay.id}`}
                className="w-full cursor-pointer text-sm font-medium"
              >
                Select All
              </Label>
              <Checkbox
                className="cursor-pointer"
                id={`select-all-${sourceDay.id}`}
                checked={isAllSelected}
                onCheckedChange={(checked) => {
                  onSelectAll(checked === true);
                }}
              />
            </div>
          </div>
        </div>
        <div className="pt-4 pb-2">
          <Button
            onClick={onApply}
            disabled={selectedDays.length === 0 || loading}
            className="font-instrument w-full cursor-pointer rounded-full text-xs font-medium text-white"
            aria-label={
              loading ? "Applying times..." : "Apply times to selected days"
            }
          >
            {loading ? <Spinner /> : "Apply"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
