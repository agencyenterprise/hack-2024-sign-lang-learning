"use client";

import { useAnalytics } from "@/hooks/use-analytics";
import { signIn, signOut, useSession } from "next-auth/react";

export function SignInButton() {
  const { data: session } = useSession();
  const { trackEvent } = useAnalytics();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <img
          src={session.user?.image ?? ""}
          alt={session.user?.name ?? ""}
          className="w-8 h-8 rounded-full"
        />
        <button
          onClick={() => {
            trackEvent("sign_out_clicked");
            signOut();
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500"
          data-analytics="sign-out-button"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        trackEvent("sign_in_clicked", { provider: "google" });
        signIn("google");
      }}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500"
      data-analytics="sign-in-button"
    >
      Sign In with Google
    </button>
  );
}
