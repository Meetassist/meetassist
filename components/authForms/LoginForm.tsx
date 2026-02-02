"use client";
import {
  SignInWithGoogle,
  SignInWithMicrosoft,
} from "@/lib/actions/authentication";
import { authClient } from "@/lib/auth-client";
import { Google, Microsoft } from "@/utils/svgs";
import Image from "next/image";
import { useState, useSyncExternalStore, useTransition } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

const lastLoginMethodStore = {
  subscribe: (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  },

  getSnapshot: (): string | null => {
    return authClient.getLastUsedLoginMethod();
  },

  getServerSnapshot: (): string | null => {
    return null;
  },
};

type AuthProvider = "google" | "microsoft" | null;

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [activeProvider, setActiveProvider] = useState<AuthProvider>(null);

  const lastMethod = useSyncExternalStore(
    lastLoginMethodStore.subscribe,
    lastLoginMethodStore.getSnapshot,
    lastLoginMethodStore.getServerSnapshot,
  );

  async function handleSignInWithGoogle() {
    setActiveProvider("google");
    startTransition(async () => {
      try {
        const result = await SignInWithGoogle();
        if (result.success && result.url) {
          window.location.href = result.url;
          toast.success("Redirecting to Google...");
        } else {
          console.error("Failed to initiate Google sign-in:", result.message);
          toast.error(result.message);
          setActiveProvider(null);
        }
      } catch (error) {
        console.error("Error signing in with Google:", error);
        toast.error("An unexpected error occurred");
        setActiveProvider(null);
      }
    });
  }

  async function handleSignInWithMicrosoft() {
    setActiveProvider("microsoft");
    startTransition(async () => {
      try {
        const result = await SignInWithMicrosoft();

        if (result.success && result.url) {
          window.location.href = result.url;
          toast.success("Redirecting to Microsoft...");
        } else {
          console.error(
            "Failed to initiate Microsoft sign-in:",
            result.message,
          );
          toast.error(result.message);
          setActiveProvider(null);
        }
      } catch (error) {
        console.error("Error signing in with Microsoft:", error);
        toast.error("An unexpected error occurred");
        setActiveProvider(null);
      }
    });
  }
  return (
    <div className="flex min-h-dvh w-full flex-2 flex-col items-center justify-center px-6 pb-40 sm:px-8 md:px-10">
      <div className="flex items-center -space-x-4 text-2xl">
        <Image
          src={"/meetassit.png"}
          alt="Meetassist Logo"
          width={70}
          height={70}
        />
        <h1 className="font-inter text-primary font-medium"> Meetassist</h1>
      </div>
      <div className="mt-4 px-5 text-center">
        <div>
          <h2 className="font-inter text-2xl font-medium">
            Do Meetings Smarter
          </h2>
          <p className="text-muted-foreground mt-3 max-w-[410px] text-sm font-medium">
            Join online meetings for you or with you, take flawless notes, keep
            everything organized, and set smart reminders so you never miss a
            beat.
          </p>
        </div>
        <div className="mt-4">
          <div className="mt-4 flex flex-col items-center justify-center gap-4">
            <p className="font-instrument inline-block text-xl">
              Get Started With
            </p>
            <Button
              onClick={handleSignInWithGoogle}
              disabled={isPending}
              variant={"outline"}
              type="button"
              aria-label="Continue with Google"
              className="font-instrument relative w-full cursor-pointer py-5 text-sm font-medium disabled:cursor-not-allowed"
            >
              {lastMethod === "google" && (
                <Badge className="font-instrument absolute -top-1 -right-1 font-medium text-white">
                  Last
                </Badge>
              )}

              {isPending && activeProvider === "google" ? (
                <>
                  <Spinner />
                  <span className="sr-only">Signing in with Google...</span>
                </>
              ) : (
                <>
                  <Google /> Continue with Google
                </>
              )}
            </Button>
            <Button
              onClick={handleSignInWithMicrosoft}
              disabled={isPending}
              variant={"outline"}
              type="button"
              aria-label="Continue with Microsoft"
              className="font-instrument relative w-full cursor-pointer py-5 text-sm font-medium disabled:cursor-not-allowed"
            >
              {lastMethod === "microsoft" && (
                <Badge className="font-instrument absolute -top-1 -right-1 font-medium text-white">
                  Last
                </Badge>
              )}

              {isPending && activeProvider === "microsoft" ? (
                <>
                  <Spinner />
                  <span className="sr-only">Signing in with Microsoft...</span>
                </>
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
