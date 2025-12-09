"use client";

import { format } from "date-fns";
import Link from "next/link";
import { Fragment, useState } from "react";
import { Button } from "../ui/button";

type TimeTableProps = {
  selectedDate: Date;
  availableSlots: string[];
};

export function TimeButtonSlot({
  availableSlots,
  selectedDate,
}: TimeTableProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const handleSlotClick = (slot: string) => {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  return (
    <div className="mt-3 max-h-[350px] space-y-2 overflow-y-auto">
      {availableSlots.length > 0 ? (
        <>
          {availableSlots.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <Fragment key={slot}>
                {!isSelected ? (
                  <Button
                    className="text-primary font-inter border-primary mb-2 w-full cursor-pointer border py-5 text-base"
                    variant={"outline"}
                    onClick={() => handleSlotClick(slot)}
                  >
                    <span>{slot}</span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-1">
                    <Button
                      className="font-inter w-full flex-1 bg-[#75747C] py-5 text-base text-white"
                      type="button"
                    >
                      {selectedSlot}
                    </Button>
                    <Link
                      href={`?date=${format(selectedDate, "yyyy-MM-dd")}&time=${encodeURIComponent(selectedSlot)}`}
                      className="flex-1"
                    >
                      <Button
                        className="w-full cursor-pointer py-5 text-base font-medium text-white"
                        size="lg"
                      >
                        Next
                      </Button>
                    </Link>
                  </div>
                )}
              </Fragment>
            );
          })}
        </>
      ) : (
        <p className="text-muted-foreground">No available slots</p>
      )}
    </div>
  );
}
