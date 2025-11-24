"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
export function ConnectButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.push("/api/auth")}
      className="font-instrument foreground cursor-pointer rounded-sm border py-5 text-white"
    >
      Connect
    </Button>
  );
}
