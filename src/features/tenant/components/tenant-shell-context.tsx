"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { User } from "@/lib/types/auth";

interface TenantShellContextValue {
  user: User;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
}

const TenantShellContext = createContext<TenantShellContextValue | null>(null);

export function TenantShellProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  const value = useMemo(
    () => ({ user, mobileOpen, setMobileOpen, toggleMobile }),
    [user, mobileOpen, toggleMobile],
  );

  return (
    <TenantShellContext.Provider value={value}>
      {children}
    </TenantShellContext.Provider>
  );
}

export function useTenantShell() {
  const ctx = useContext(TenantShellContext);
  if (!ctx) {
    throw new Error("useTenantShell must be used within TenantShellProvider");
  }
  return ctx;
}
