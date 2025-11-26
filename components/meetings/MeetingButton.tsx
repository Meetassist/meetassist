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
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

export function MeetingButton({ id }: { id: string }) {
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
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="w-full cursor-pointer"
              onSelect={(e) => e.preventDefault()}
              variant="destructive"
            >
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-instrument font-medium">
                Are you sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-instrument text-muted-foreground font-medium">
                This action cannot be undone. This will permanently delete your
                meeting and remove your data from our servers. People you have
                shared the link with will no longer have access to it.
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
