"use client";

import { useAdminShell } from "@/features/admin/components/admin-shell-context";
import type { Property, UnitType } from "@/lib/types/admin";

export type AdminLookups = {
  propertyById: Map<string, Property>;
  unitTypeById: Map<string, UnitType>;
};

export function useAdminLookups(): AdminLookups {
  return useAdminShell().lookups;
}
