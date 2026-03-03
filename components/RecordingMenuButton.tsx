"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteRecording, UpdateRecordingName } from "@/lib/actions/chatAction";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { Input } from "./ui/input";

import { Controller, useForm } from "react-hook-form";
import { RenameMeetingSchema, TRenameMeetingSchema } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSidebar } from "./ui/sidebar";

type RecordingMenuButtonProps = {
  notetakerId: string | null;
  meetingName: string | null;
};

export function RecordingMenuButton({
  notetakerId,
  meetingName,
}: RecordingMenuButtonProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isAlertOpenUpdate, setIsAlertOpenUpdate] = useState<boolean>(false);
  const { isMobile, setOpenMobile } = useSidebar();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TRenameMeetingSchema>({
    resolver: zodResolver(RenameMeetingSchema),
    defaultValues: {
      id: notetakerId,
      RecordingName: meetingName,
    },
  });

  async function handleDelete() {
    setIsDeleting(true);
    try {
      if (!notetakerId) {
        throw new Error("NotetakerId is required");
      }
      const results = await DeleteRecording(notetakerId);
      if (results.success) {
        toast.success("Recording deleted");
        setIsAlertOpen(false);
        setIsDropdownOpen(false);
        if (isMobile) setOpenMobile(false);
      } else {
        toast.error("Failed to delete recording");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete recording");
    } finally {
      setIsDeleting(false);
    }
  }
  async function handleUpdate(data: TRenameMeetingSchema) {
    try {
      const result = await UpdateRecordingName(data);
      if (result.success) {
        toast.success("Recording name updated!");
        setIsAlertOpenUpdate(false);
        if (isMobile) setOpenMobile(false);
      } else {
        toast.error("Failed to update!");
      }
    } catch (error) {
      toast.error("Failed to update");
      console.error(error);
    }
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
        <button className="ml-auto cursor-pointer">
          <Ellipsis size={20} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <AlertDialog
          open={isAlertOpenUpdate}
          onOpenChange={setIsAlertOpenUpdate}
        >
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="flex w-full cursor-pointer items-center gap-2"
              onSelect={(e) => e.preventDefault()}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-medium">
                Rename Recording
              </AlertDialogTitle>
              <AlertDialogDescription className="sr-only">
                Renaming Recording name
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-3">
              <form onSubmit={handleSubmit(handleUpdate)}>
                <Controller
                  name="RecordingName"
                  control={control}
                  render={({ field, fieldState }) => (
                    <div>
                      <Input
                        {...field}
                        value={field.value ?? ""}
                        id={field.name}
                        aria-invalid={fieldState.invalid}
                        aria-describedby={
                          fieldState.error ? `${field.name}-error` : undefined
                        }
                        disabled={isSubmitting}
                        className="text-black focus-visible:ring-1"
                        autoFocus
                      />
                      {fieldState.error && (
                        <span
                          id={`${field.name}-error`}
                          className="text-destructive mt-1 text-xs sm:text-sm"
                          role="alert"
                        >
                          {fieldState.error.message}
                        </span>
                      )}
                    </div>
                  )}
                />
                <AlertDialogFooter className="pt-4">
                  <AlertDialogCancel
                    type="button"
                    className="cursor-pointer"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="cursor-pointer bg-black text-white hover:bg-zinc-800"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </AlertDialogFooter>
              </form>
            </div>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="flex w-full cursor-pointer items-center gap-2"
              onSelect={(e) => e.preventDefault()}
              variant="destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-instrument font-medium">
                Delete recording
              </AlertDialogTitle>
              <AlertDialogDescription className="font-instrument text-muted-foreground font-medium">
                Are you sure you want to delete this recording?
              </AlertDialogDescription>{" "}
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                className="cursor-pointer"
                disabled={isDeleting}
              >
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
