"use client";

import { signOut, useSession } from "next-auth/react";

export function SignOutButton() {
  const { status } = useSession();

  const isLoading = status === "loading";
  return (
    <button
      type="submit"
      onClick={() => signOut({ callbackUrl: "/" })}
      disabled={isLoading}
      className={`
        mx-4 my-3 p-2 rounded-md font-semibold transition duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800/70 
        ${
          isLoading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }
    `}
    >
      Sign Out
    </button>
  );
}
