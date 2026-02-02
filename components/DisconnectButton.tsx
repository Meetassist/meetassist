"use client";

import {
  DisconnectGoogle,
  DisconnectMicrosoft,
  DisconnectZoom,
} from "@/lib/actions/nylasAction";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";

export function DisconnectGoogleButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleDisconnect() {
    setIsLoading(true);
    try {
      const result = await DisconnectGoogle();
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
      type="button"
      onClick={handleDisconnect}
      disabled={isLoading}
      variant="ghost"
      className="font-instrument text-foreground cursor-pointer rounded-sm border py-5"
    >
      {isLoading ? (
        <>
          <Spinner />
          Disconnecting...
        </>
      ) : (
        "Disconnect"
      )}
    </Button>
  );
}
export function DisconnectZoomButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleDisconnect() {
    setIsLoading(true);
    try {
      const result = await DisconnectZoom();
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
      type="button"
      onClick={handleDisconnect}
      disabled={isLoading}
      variant="ghost"
      className="font-instrument text-foreground cursor-pointer rounded-sm border py-5"
    >
      {isLoading ? (
        <>
          <Spinner />
          Disconnecting...
        </>
      ) : (
        "Disconnect"
      )}
    </Button>
  );
}
export function DisconnectMicrosoftButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  async function handleDisconnect() {
    setIsLoading(true);
    try {
      const result = await DisconnectMicrosoft();
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
      type="button"
      onClick={handleDisconnect}
      disabled={isLoading}
      variant="ghost"
      className="font-instrument text-foreground cursor-pointer rounded-sm border py-5"
    >
      {isLoading ? (
        <>
          <Spinner />
          Disconnecting...
        </>
      ) : (
        "Disconnect"
      )}
    </Button>
  );
}
