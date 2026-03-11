"use client";
import { type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { trackEvent } from "@/lib/mixpanel";
type ButtonConnect = {
  text: string;
  styles?: string;
  variant?:
    | "ghost"
    | "default"
    | "outline"
    | "secondary"
    | "destructive"
    | "link";
  icon?: LucideIcon;
};

export function ConnectMicrosoftButton({
  text,
  styles,
  icon: Icon,
  variant = "ghost",
}: ButtonConnect) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      asChild
      variant={variant}
      disabled={isLoading}
      className={`font-instrument foreground relative overflow-hidden ${styles}`}
    >
      <Link
        href="/api/auth/microsoft"
        onClick={() => {
          setIsLoading(true);
          trackEvent("Connect Button Clicked", { provider: "Microsoft" });
        }}
        className={isLoading ? "pointer-events-none" : ""}
        prefetch={false}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-inherit">
            <Spinner />
          </div>
        )}

        <span
          className={`flex items-center gap-2 transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
        >
          {text}
          {Icon && <Icon />}
        </span>
      </Link>
    </Button>
  );
}
export function ConnectGoogleMeetButton({
  text,
  icon: Icon,
  styles,
  variant,
}: ButtonConnect) {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Button
      asChild
      variant={variant}
      disabled={isLoading}
      className={`font-instrument foreground relative overflow-hidden ${styles}`}
    >
      <Link
        href="/api/auth"
        onClick={() => {
          setIsLoading(true);
          trackEvent("Connect Button Clicked", { provider: "Google" });
        }}
        className={isLoading ? "pointer-events-none" : ""}
        prefetch={false}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-inherit">
            <Spinner />
          </div>
        )}

        <span
          className={`flex items-center gap-2 transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
        >
          {text}
          {Icon && <Icon />}
        </span>
      </Link>
    </Button>
  );
}

export function ConnectZoomButton({
  text,
  icon: Icon,
  styles,
  variant,
}: ButtonConnect) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      asChild
      variant={variant}
      disabled={isLoading}
      className={`font-instrument foreground relative overflow-hidden ${styles}`}
    >
      <Link
        href="/api/auth/zoom"
        onClick={() => {
          setIsLoading(true);
          trackEvent("Connect Button Clicked", { provider: "Zoom" });
        }}
        className={isLoading ? "pointer-events-none" : ""}
        prefetch={false}
      >
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-inherit">
            <Spinner />
          </div>
        )}

        <span
          className={`flex items-center gap-2 transition-opacity ${isLoading ? "opacity-0" : "opacity-100"}`}
        >
          {text}
          {Icon && <Icon />}
        </span>
      </Link>
    </Button>
  );
}
