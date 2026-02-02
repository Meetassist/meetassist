"use client";
import {
  copyTimesToDays,
  toggleTimeSlotActive,
  updateTimeSlot,
} from "@/lib/actions/availabilityAction";
import { formatTimeForDb, parseTimeString } from "@/utils/helper";
import { parseTime, Time } from "@internationalized/date";
import { useOptimistic, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { DayTimeSlot } from "./DayTimeSlot";

interface AvailabilityDay {
  id: string;
  fromTime: string;
  isActive: boolean;
  toTime: string;
  day: string;
}

type OptimisticUpdate =
  | { id: string; fromTime?: string; toTime?: string; type: "time" }
  | { id: string; isActive: boolean; type: "toggle" }
  | { targetIds: string[]; fromTime: string; toTime: string; type: "copy" };

interface TimeAvailableProps {
  data: AvailabilityDay[];
}

export function TimeAvailable({ data }: TimeAvailableProps) {
  const [selectedDays, setSelectedDays] = useState<Record<string, string[]>>(
    {},
  );
  const [isPending, startTransition] = useTransition();
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  const [optimisticData, setOptimisticData] = useOptimistic(
    data,
    (state, update: OptimisticUpdate) => {
      if (update.type === "copy") {
        return state.map((item) => {
          if (update.targetIds.includes(item.id)) {
            return {
              ...item,
              fromTime: update.fromTime,
              toTime: update.toTime,
              isActive: true,
            };
          }
          return item;
        });
      }

      return state.map((item) => {
        if (item.id === update.id) {
          if (update.type === "time") {
            return {
              ...item,
              ...(update.fromTime && { fromTime: update.fromTime }),
              ...(update.toTime && { toTime: update.toTime }),
            };
          } else if (update.type === "toggle") {
            return {
              ...item,
              isActive: update.isActive,
            };
          }
        }
        return item;
      });
    },
  );

  const [localTimes, setLocalTimes] = useState<
    Record<string, { fromTime?: Time; toTime?: Time }>
  >({});

  const pendingChanges = useRef<
    Map<string, { fromTime?: string; toTime?: string }>
  >(new Map());

  function getCurrentValue(id: string, field: "fromTime" | "toTime"): Time {
    const localValue = localTimes[id]?.[field];
    if (localValue) return localValue;

    const dataItem = optimisticData.find((item) => item.id === id);
    return parseTimeString(dataItem?.[field] || "09:00");
  }

  function handleTimeChange(
    id: string,
    field: "fromTime" | "toTime",
    value: Time,
  ) {
    setLocalTimes((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));

    const timeString = formatTimeForDb(value);
    const existing = pendingChanges.current.get(id) || {};
    pendingChanges.current.set(id, {
      ...existing,
      [field]: timeString,
    });
  }

  function handleBlur(id: string) {
    const changes = pendingChanges.current.get(id);
    if (!changes) return;
    const dataItem = optimisticData.find((item) => item.id === id);
    if (dataItem) {
      const fromTimeStr = changes.fromTime || dataItem.fromTime;
      const toTimeStr = changes.toTime || dataItem.toTime;
      const from = parseTime(fromTimeStr + ":00");
      const to = parseTime(toTimeStr + ":00");
      if (from.compare(to) >= 0) {
        toast.error("Start time must be before end time");
        return;
      }
    }

    startTransition(async () => {
      setOptimisticData({ id, ...changes, type: "time" });

      const result = await updateTimeSlot({
        id,
        ...changes,
      });

      if (result.success) {
        toast.success("Your settings have been saved");
        pendingChanges.current.delete(id);
        setLocalTimes((prev) => {
          const updated = { ...prev };
          delete updated[id];
          return updated;
        });
      } else {
        toast.error(result.error || "Failed to save your settings");
      }
    });
  }

  function handleToggleActive(id: string, currentStatus: boolean) {
    const newStatus = !currentStatus;
    startTransition(async () => {
      setOptimisticData({ id, isActive: newStatus, type: "toggle" });

      const result = await toggleTimeSlotActive(id, newStatus);

      if (result.success) {
        toast.success("Your settings have been saved");
      } else {
        toast.error(result.error || "Failed to save your settings");
      }
    });
  }

  function handleCopyDayToggle(
    sourceId: string,
    dayId: string,
    checked: boolean,
  ) {
    setSelectedDays((prev) => {
      const current = prev[sourceId] || [];
      if (checked) {
        return {
          ...prev,
          [sourceId]: [...current, dayId],
        };
      } else {
        return {
          ...prev,
          [sourceId]: current.filter((id) => id !== dayId),
        };
      }
    });
  }

  function handleApplyCopy(sourceDay: AvailabilityDay) {
    const targetIds = selectedDays[sourceDay.id] || [];

    if (targetIds.length === 0) {
      toast.error("Please select at least one day to copy to");
      return;
    }

    startTransition(async () => {
      setOptimisticData({
        targetIds,
        fromTime: sourceDay.fromTime,
        toTime: sourceDay.toTime,
        type: "copy",
      });

      const result = await copyTimesToDays({
        sourceId: sourceDay.id,
        targetIds,
        fromTime: sourceDay.fromTime,
        toTime: sourceDay.toTime,
      });

      if (result.success) {
        toast.success("Your settings have been saved");
        setSelectedDays((prev) => ({
          ...prev,
          [sourceDay.id]: [],
        }));
        setOpenPopoverId(null);
      } else {
        toast.error(result.error || "Failed to save your settings");
      }
    });
  }

  function handlePopoverOpenChange(dayId: string, open: boolean) {
    setOpenPopoverId(open ? dayId : null);
    if (!open) {
      setSelectedDays((prev) => ({
        ...prev,
        [dayId]: [],
      }));
    }
  }

  function handleSelectAll(sourceTimeId: string, checked: boolean) {
    if (checked) {
      const allDayIds = optimisticData
        .filter((day) => day.id !== sourceTimeId)
        .map((day) => day.id);

      setSelectedDays((prev) => ({
        ...prev,
        [sourceTimeId]: allDayIds,
      }));
    } else {
      setSelectedDays((prev) => ({
        ...prev,
        [sourceTimeId]: [],
      }));
    }
  }

  function isAllSelected(sourceTimeId: string): boolean {
    const selectedCount = selectedDays[sourceTimeId]?.length || 0;
    const totalAvailable = optimisticData.filter(
      (d) => d.id !== sourceTimeId,
    ).length;
    return selectedCount === totalAvailable && totalAvailable > 0;
  }

  return (
    <div className="mt-4 space-y-4">
      {optimisticData?.map((day) => (
        <DayTimeSlot
          key={day.id}
          day={day}
          allDays={optimisticData}
          fromTimeValue={getCurrentValue(day.id, "fromTime")}
          toTimeValue={getCurrentValue(day.id, "toTime")}
          onFromTimeChange={(value) =>
            handleTimeChange(day.id, "fromTime", value)
          }
          onToTimeChange={(value) => handleTimeChange(day.id, "toTime", value)}
          onFromTimeBlur={() => handleBlur(day.id)}
          onToTimeBlur={() => handleBlur(day.id)}
          onToggleActive={() => handleToggleActive(day.id, day.isActive)}
          selectedDaysForCopy={selectedDays[day.id] || []}
          onCopyDayToggle={(dayId, checked) =>
            handleCopyDayToggle(day.id, dayId, checked)
          }
          onCopyApply={() => handleApplyCopy(day)}
          isCopyPopoverOpen={openPopoverId === day.id}
          onCopyPopoverOpenChange={(open) =>
            handlePopoverOpenChange(day.id, open)
          }
          isDisabled={isPending}
          loading={isPending}
          isCopyAllSelected={isAllSelected(day.id)}
          onCopySelectAll={(checked) => handleSelectAll(day.id, checked)}
        />
      ))}
    </div>
  );
}
