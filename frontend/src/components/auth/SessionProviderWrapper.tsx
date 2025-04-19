"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // SessionProvider requires a client component boundary
  return <SessionProvider>{children}</SessionProvider>;
}
