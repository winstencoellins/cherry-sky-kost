export const adminKeys = {
  all: ["admin"] as const,
  properties: {
    all: () => [...adminKeys.all, "properties"] as const,
    detail: (id: string) => [...adminKeys.properties.all(), id] as const,
  },
  unitTypes: {
    all: () => [...adminKeys.all, "unit-types"] as const,
    list: (propertyId?: string) =>
      [...adminKeys.unitTypes.all(), { propertyId }] as const,
    detail: (id: string) => [...adminKeys.unitTypes.all(), id] as const,
  },
  unitPricings: {
    all: () => [...adminKeys.all, "unit-pricings"] as const,
    list: (filters?: { unitTypeId?: string; propertyId?: string }) =>
      [...adminKeys.unitPricings.all(), filters ?? {}] as const,
    detail: (id: string) => [...adminKeys.unitPricings.all(), id] as const,
  },
  units: {
    all: () => [...adminKeys.all, "units"] as const,
    list: (propertyId?: string) =>
      [...adminKeys.units.all(), { propertyId }] as const,
    detail: (id: string) => [...adminKeys.units.all(), id] as const,
  },
  leases: {
    all: () => [...adminKeys.all, "leases"] as const,
    list: (filters?: {
      unitId?: string;
      userId?: string;
      propertyId?: string;
    }) => [...adminKeys.leases.all(), filters ?? {}] as const,
    detail: (id: string) => [...adminKeys.leases.all(), id] as const,
  },
  users: {
    all: () => [...adminKeys.all, "users"] as const,
    list: (search?: string) =>
      [...adminKeys.users.all(), { search: search ?? "" }] as const,
    detail: (id: string) => [...adminKeys.users.all(), id] as const,
  },
  ledgerEntries: {
    all: () => [...adminKeys.all, "ledger-entries"] as const,
    list: (filters?: {
      propertyId?: string;
      type?: string;
      from?: string;
      to?: string;
    }) => [...adminKeys.ledgerEntries.all(), filters ?? {}] as const,
    detail: (id: string) => [...adminKeys.ledgerEntries.all(), id] as const,
  },
} as const;
