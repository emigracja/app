"use client";

import { signOut, useSession } from "next-auth/react";

export function SignOutButton() {
  const { status } = useSession();

  const handleSubmit = async () => {
    try {
      await fetch(`${process.env.BACKEND_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("Signout error: ", err);
    }
    signOut({ callbackUrl: "/" });
  };

  const isLoading = status === "loading";
  return (
    <button
      type="submit"
      onClick={handleSubmit}
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
