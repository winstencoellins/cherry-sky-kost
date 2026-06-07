"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  useProperties,
  useUnitTypes,
} from "@/features/admin/hooks/use-admin-queries";
import type { AdminLookups } from "@/features/admin/hooks/use-admin-lookups";
import type { User } from "@/lib/types/auth";

interface AdminShellContextValue {
  user: User;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
  lookups: AdminLookups;
}

const AdminShellContext = createContext<AdminShellContextValue | null>(null);

export function AdminShellProvider({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  const { data: properties = [] } = useProperties();
  const { data: unitTypes = [] } = useUnitTypes();

  const lookups = useMemo<AdminLookups>(
    () => ({
      propertyById: new Map(properties.map((p) => [p.id, p])),
      unitTypeById: new Map(unitTypes.map((ut) => [ut.id, ut])),
    }),
    [properties, unitTypes],
  );

  const value = useMemo(
    () => ({ user, mobileOpen, setMobileOpen, toggleMobile, lookups }),
    [user, mobileOpen, toggleMobile, lookups],
  );

  return (
    <AdminShellContext.Provider value={value}>
      {children}
    </AdminShellContext.Provider>
  );
}

export function useAdminShell() {
  const ctx = useContext(AdminShellContext);
  if (!ctx) {
    throw new Error("useAdminShell must be used within AdminShellProvider");
  }
  return ctx;
}
