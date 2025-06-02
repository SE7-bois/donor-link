"use client";

import { SessionProvider } from "next-auth/react";
import { type ReactNode } from "react";

export default function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      baseUrl={process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined}
    >
      {children}
    </SessionProvider>
  );
} 