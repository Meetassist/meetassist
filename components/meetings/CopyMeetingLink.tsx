"use client";

import { Link } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";

export function CopyMeetingLink({ meetLinkUrl }: { meetLinkUrl: string }) {
  async function handleCopy() {
    if (!navigator.clipboard) {
      toast.error("Clipboard not available in this context");
      return;
    }
    try {
      await navigator.clipboard.writeText(meetLinkUrl);
      toast.success("URL copied successfully");
    } catch (error) {
      console.error(error);
      toast.error("Could not copy URL");
    }
  }
  return (
    <Button
      onClick={handleCopy}
      variant={"ghost"}
      type="button"
      aria-label="Copy meeting link to clipboard"
      className="border-border cursor-pointer rounded-2xl border text-sm"
    >
      <Link />
      copy link
    </Button>
  );
}
