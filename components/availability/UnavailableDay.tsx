import { Plus } from "lucide-react";
import { Button } from "../ui/button";

interface UnavailableDayProps {
  dayName: string;
  onActivate: () => void;
  isDisabled?: boolean;
}

export function UnavailableDay({
  dayName,
  onActivate,
  isDisabled = false,
}: UnavailableDayProps) {
  return (
    <div className="flex items-center gap-4">
      <p className="font-instrument text-muted-foreground text-base font-medium">
        Unavailable
      </p>
      <Button
        variant="ghost"
        size="icon"
        onClick={onActivate}
        aria-label={`Activate ${dayName}`}
        disabled={isDisabled}
        className="border-border cursor-pointer rounded-full border"
      >
        <Plus className="size-4" />
      </Button>
    </div>
  );
}
