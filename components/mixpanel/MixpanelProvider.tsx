"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { initMixpanel, trackEvent } from "@/lib/mixpanel";

export default function MixpanelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isInitialized = useRef(false);

  useEffect(() => {
    initMixpanel();
    isInitialized.current = true;
  }, []);

  useEffect(() => {
    if (isInitialized.current && pathname) {
      trackEvent("Page View", { page: pathname });
    }
  }, [pathname]);

  return <>{children}</>;
}
