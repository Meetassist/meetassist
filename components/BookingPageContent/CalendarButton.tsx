"use client";
import { AriaButtonProps, useButton } from "@react-aria/button";
import { type CalendarState } from "react-stately";
import { Button } from "../ui/button";
import { mergeProps } from "@react-aria/utils";
import { useFocusRing } from "@react-aria/focus";
import { useRef } from "react";
export function CalendarButton(
  props: AriaButtonProps<"button"> & {
    state?: CalendarState;
    side?: "left" | "right";
  },
) {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(props, ref);
  const { focusProps } = useFocusRing();
  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      className="text-primary cursor-pointer"
      {...mergeProps(buttonProps, focusProps)}
      ref={ref}
    >
      {props.children}
    </Button>
  );
}
