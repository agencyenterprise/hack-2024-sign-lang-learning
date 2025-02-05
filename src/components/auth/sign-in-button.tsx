"use client";

import { useAnalytics } from "@/hooks/use-analytics";
import {
  SignInButton as ClerkSignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export function SignInButton() {
  const { user } = useUser();
  const { trackEvent } = useAnalytics();

  if (user) {
    return (
      <UserButton
        appearance={{
          elements: {
            avatarBox: "w-12 h-12",
          },
        }}
      />
    );
  }

  return (
    <ClerkSignInButton mode="modal" data-analytics="sign-in-button">
      <button
        onClick={() => trackEvent("sign_in_clicked")}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500"
      >
        Sign In
      </button>
    </ClerkSignInButton>
  );
}
