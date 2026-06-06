"use client";

import { useMemo } from "react";
import {
  useProperties,
  useUnitTypes,
} from "@/features/admin/hooks/use-admin-queries";
import type { Property, UnitType } from "@/lib/types/admin";

export type AdminLookups = {
  propertyById: Map<string, Property>;
  unitTypeById: Map<string, UnitType>;
};

export function useAdminLookups(): AdminLookups {
  const { data: properties = [] } = useProperties();
  const { data: unitTypes = [] } = useUnitTypes();

  return useMemo(
    () => ({
      propertyById: new Map(properties.map((p) => [p.id, p])),
      unitTypeById: new Map(unitTypes.map((ut) => [ut.id, ut])),
    }),
    [properties, unitTypes],
  );
}
