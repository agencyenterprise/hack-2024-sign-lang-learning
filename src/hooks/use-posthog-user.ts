"use client";

import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";
import { useEffect } from "react";

export function usePostHogUser() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Identify user in PostHog
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
    } else {
      // Reset user identification when session is lost
      posthog.reset();
    }
  }, [user]);
}
