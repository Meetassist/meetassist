"use client";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { Google, Microsoft } from "@/utils/svgs";
import { useState, useTransition } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import {
  SignInWithGoogle,
  SignInWithMicrosoft,
} from "@/lib/actions/authentication";
export function LoginForm() {
  const [isPendingGoogle, startTransitionGoogle] = useTransition();
  const [isPendingMicrosoft, startTransitionMicrosoft] = useTransition();
  const [lastMethod] = useState(() => {
    return authClient.getLastUsedLoginMethod();
  });

  async function handleSignInWithGoogle() {
    startTransitionGoogle(async () => {
      try {
        const result = await SignInWithGoogle();
        if (result.success && result.url) {
          window.location.href = result.url;
          toast.success("Redirecting to Google...");
        } else {
          console.error("Failed to initiate Google sign-in:", result.message);
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error signing in with Google:", error);
        toast.error("An unexpected error occurred");
      }
    });
  }
  async function handleSignInWithMicrosoft() {
    startTransitionMicrosoft(async () => {
      try {
        const result = await SignInWithMicrosoft();

        if (result.success && result.url) {
          window.location.href = result.url;
          toast.success("Redirecting to microsoft...");
        } else {
          console.error(
            "Failed to initiate Microsoft sign-in:",
            result.message,
          );
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error signing in with Microsoft:", error);
        toast.error("An unexpected error occurred");
      }
    });
  }

  return (
    <div className="flex min-h-dvh w-full flex-2 flex-col items-center justify-center px-6 pb-40 sm:px-8 md:px-10">
      <div className="flex items-center -space-x-4 text-2xl">
        <Image src={"/meetassit.png"} alt="Logo" width={70} height={70} />
        <span className="font-inter text-primary font-medium"> Meetassist</span>
      </div>
      <div className="mt-4 px-5 text-center">
        <div>
          <h1 className="font-inter text-2xl font-medium">
            Do Meetings Smarter
          </h1>
          <p className="text-muted-foreground mt-3 max-w-[410px] text-sm font-medium">
            Join online meetings for you or with you, take flawless notes, keep
            everything organized, and set smart reminders so you never miss a
            beat.
          </p>
        </div>
        <div className="mt-4">
          <div className="mt-4 flex flex-col items-center justify-center gap-4">
            <span className="font-instrument inline-block text-xl">
              Get Started With
            </span>
            <Button
              onClick={handleSignInWithGoogle}
              disabled={isPendingGoogle || isPendingMicrosoft}
              variant={"outline"}
              type="button"
              className="font-instrument relative w-full cursor-pointer py-5 text-sm font-medium"
            >
              {lastMethod === "google" && (
                <Badge className="font-instrument absolute -top-1 -right-1 font-medium text-white">
                  Last
                </Badge>
              )}

              {isPendingGoogle ? (
                <Spinner />
              ) : (
                <>
                  <Google /> Continue with Google
                </>
              )}
            </Button>
            <Button
              onClick={handleSignInWithMicrosoft}
              variant={"outline"}
              // disabled={isPendingMicrosoft || isPendingGoogle}
              disabled
              type="button"
              className="font-instrument relative w-full cursor-pointer py-5 text-sm font-medium disabled:cursor-not-allowed"
            >
              {lastMethod === "microsoft" && (
                <Badge className="font-instrument absolute -top-1 -right-1 font-medium text-white">
                  Last
                </Badge>
              )}

              {isPendingMicrosoft ? (
                <Spinner />
              ) : (
                <>
                  <Microsoft /> Continue with Microsoft
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
