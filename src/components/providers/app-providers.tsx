"use client";

import type { User } from "@/lib/types/auth";
import { AuthProvider } from "@/components/providers/auth-provider";
import { AppToaster } from "@/components/providers/app-toaster";
import { QueryProvider } from "@/components/providers/query-provider";

export function AppProviders({
  children,
  user = null,
}: {
  children: React.ReactNode;
  user?: User | null;
}) {
  return (
    <QueryProvider>
      <AuthProvider user={user}>
        {children}
        <AppToaster />
      </AuthProvider>
    </QueryProvider>
  );
}
