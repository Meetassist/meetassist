import { Time } from "@internationalized/date";
import { DateInput, DateSegment, TimeField } from "react-aria-components";

interface TimeFieldInputProps {
  value: Time;
  onChange: (value: Time) => void;
  onBlur: () => void;
  label: string;
  isDisabled?: boolean;
}

export function TimeFieldInput({
  value,
  onChange,
  onBlur,
  label,
  isDisabled = false,
}: TimeFieldInputProps) {
  return (
    <TimeField
      value={value}
      onChange={(newValue) => {
        if (newValue) {
          onChange(newValue);
        }
      }}
      onBlur={onBlur}
      aria-label={label}
      isDisabled={isDisabled}
    >
      <DateInput className="border-border flex gap-1 rounded border p-2">
        {(segment) => (
          <DateSegment
            segment={segment}
            className="focus:bg-primary rounded px-px tabular-nums focus:text-white focus:outline-none"
          />
        )}
      </DateInput>
    </TimeField>
  );
}
