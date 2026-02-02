"use client";
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteMeeting } from "@/lib/actions/meetingAction";
import { Ellipsis, ExternalLink, Trash } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import UpdateMeeting from "./UpdateMeeting";

type MeetingButton = {
  id: string;
  url: string;
  email: string;
  days: { day: string }[];
  isGoogleConnected: boolean;
  isMicrosoftConnected: boolean;
  isZoomConnected: boolean;
};

export function MeetingButton({
  id,
  url,
  email,
  days,
  isGoogleConnected,
  isMicrosoftConnected,
  isZoomConnected,
}: MeetingButton) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const result = await DeleteMeeting(id);
      if (result.success) {
        toast.success("Event deleted");
        setIsOpen(false);
      } else {
        toast.error("There was an error with deleting event");
      }
    } catch (error) {
      console.error(error);
      toast.error("There was an error with deleting event");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant={"ghost"}
          className="border-foreground size-3 cursor-pointer rounded-sm border p-2 py-3"
          aria-label="Meeting options"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={{
              pathname: `/${encodeURIComponent(email)}/${encodeURIComponent(url)}`,
            }}
            className="flex items-center gap-2"
          >
            <ExternalLink className="size-4" />
            Preview
          </Link>
        </DropdownMenuItem>
        <UpdateMeeting
          days={days}
          id={id}
          isGoogleConnected={isGoogleConnected}
          isMicrosoftConnected={isMicrosoftConnected}
          isZoomConnected={isZoomConnected}
        />
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="flex w-full cursor-pointer items-center gap-2"
              onSelect={(e) => e.preventDefault()}
              variant="destructive"
            >
              <Trash />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-instrument font-medium">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-instrument text-muted-foreground font-medium">
                This action cannot be undone. Users will be unable to schedule
                further meetings with deleted event types. Meetings previously
                scheduled will not be affected.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={isDeleting}
                variant={"destructive"}
                className="cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Spinner />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
