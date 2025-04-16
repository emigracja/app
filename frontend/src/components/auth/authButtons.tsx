"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export function SignOutButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p></p>;
  return (
    <button
      type="submit"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={`
        mx-4 my-3 p-2 rounded-md font-semibold transition duration-150 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800/70 bg-blue-600 hover:bg-blue-700
    `}
    >
      Sign Out
    </button>
  );
}
