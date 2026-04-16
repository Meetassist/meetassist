"use client";

import { updateAutoJoin } from "@/lib/actions/autoJoinAction";
import { AUTOJOIN } from "@/lib/generated/prisma/enums";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Field } from "./ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Spinner } from "./ui/spinner";
import { Switch } from "./ui/switch";

interface AutoJoinProps {
  initialValue?: AUTOJOIN;
}

const RULE_OPTIONS: { value: AUTOJOIN; label: string }[] = [
  { value: AUTOJOIN.all, label: "All meetings" },
  { value: AUTOJOIN.external, label: "External meetings" },
  { value: AUTOJOIN.internal, label: "Internal meetings" },
  { value: AUTOJOIN.ownEvents, label: "Own events" },
  { value: AUTOJOIN.participantsOnly, label: "Participants only" },
];

export default function AutoJoin({
  initialValue = AUTOJOIN.all,
}: AutoJoinProps) {
  const [isEnabled, setIsEnabled] = useState(initialValue !== AUTOJOIN.none);
  const [rule, setRule] = useState<AUTOJOIN>(
    initialValue === AUTOJOIN.none ? AUTOJOIN.all : initialValue,
  );

  const [isPending, startTransition] = useTransition();

  function handleSwitch(checked: boolean) {
    setIsEnabled(checked);

    const newRule = checked ? rule : AUTOJOIN.none;

    startTransition(async () => {
      try {
        const result = await updateAutoJoin(newRule);
        if (result.success) {
          toast.success("Your settings have been saved");
        } else {
          toast.error("Something went wrong");
          setIsEnabled(!checked);
        }
      } catch {
        toast.error("Something went wrong");
        setIsEnabled(!checked);
      }
    });
  }

  function handleRuleChange(value: string) {
    const newRule = value as AUTOJOIN;
    setRule(newRule);

    startTransition(async () => {
      const result = await updateAutoJoin(newRule);
      if (result.success) {
        toast.success("Your settings have been saved");
      }
      if (!result.success) {
        toast.error(
          "Failed to save your settings. Check if your calendar is connected",
        );
        setRule(rule);
      }
    });
  }

  return (
    <div className="mt-8 max-w-[400px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="font-instrument text-xl font-medium">
            Auto-record meetings
          </h3>
          <p className="font-instrument text-muted-foreground text-xs font-medium">
            MeetAssist will join and record your Calendar events
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <Field orientation="horizontal">
              <Switch
                id="auto-join-switch"
                size="default"
                checked={isEnabled}
                disabled={isPending}
                onCheckedChange={handleSwitch}
              />
            </Field>
          </div>
          <div>{isPending && <Spinner className="size-5" />}</div>
        </div>
      </div>

      <div className="mt-4">
        <Select
          value={isEnabled ? rule : "none"}
          onValueChange={handleRuleChange}
          disabled={!isEnabled || isPending}
        >
          <SelectTrigger className="w-full max-w-[400px]">
            <SelectValue>
              {!isEnabled
                ? "None"
                : (RULE_OPTIONS.find((o) => o.value === rule)?.label ??
                  "All meetings")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {isEnabled ? (
                RULE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  None
                </SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
