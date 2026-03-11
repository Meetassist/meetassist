"use client";

import { useEffect } from "react";
import { identifyUser } from "@/lib/mixpanel";

type Props = {
  userId: string;
};

export default function MixpanelIdentifier({ userId }: Props) {
  useEffect(() => {
    identifyUser(userId, {
      role: "USER",
      createdAt: new Date().toISOString(),
    });
  }, [userId]);

  return null;
}
