"use client";

import posthog from "posthog-js";
import { useCallback } from "react";

export function useAnalytics() {
  const trackEvent = useCallback(
    (event: string, properties?: Record<string, unknown>) => {
      posthog.capture(event, properties);
    },
    []
  );

  return { trackEvent };
}
