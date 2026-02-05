"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { type LucideIcon } from "lucide-react";
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
  const router = useRouter();
  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => router.push("/api/auth/microsoft")}
      className={`font-instrument foreground cursor-pointer ${styles ?? ""}`}
    >
      {text}
      {Icon && <Icon />}
    </Button>
  );
}
export function ConnectGoogleMeetButton({
  text,
  icon: Icon,
  styles,
  variant,
}: ButtonConnect) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => router.push("/api/auth")}
      className={`font-instrument foreground cursor-pointer ${styles ?? ""}`}
    >
      {text}
      {Icon && <Icon />}
    </Button>
  );
}

export function ConnectZoomButton({
  text,
  icon: Icon,
  styles,
  variant,
}: ButtonConnect) {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => router.push("/api/auth/zoom")}
      className={`font-instrument foreground cursor-pointer ${styles}`}
    >
      {text}
      {Icon && <Icon />}
    </Button>
  );
}
