"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/mixpanel";

export default function LandingPageTracker() {
  useEffect(() => {
    const timer = setTimeout(() => {
      trackEvent("Landing Page Visited", {
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
      });
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
