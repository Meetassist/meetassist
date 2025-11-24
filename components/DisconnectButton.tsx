"use client";

import { disconnectNylas } from "@/lib/actions/nylasAction";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

export function DisconnectButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleDisconnect() {
    setIsLoading(true);
    try {
      const result = await disconnectNylas();
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      toast.error("Failed to disconnect");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleDisconnect}
      disabled={isLoading}
      variant="ghost"
      className="font-instrument text-foreground rounded-sm border py-5"
    >
      {isLoading ? <Spinner /> : "Disconnect"}
    </Button>
  );
}
