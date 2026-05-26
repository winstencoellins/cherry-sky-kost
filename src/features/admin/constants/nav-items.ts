export type AdminNavPageKey =
  | "overview"
  | "properties"
  | "unitTypes"
  | "units"
  | "vacantSearch"
  | "pricing"
  | "leases"
  | "users"
  | "bookkeeping";

export interface AdminNavItem {
  key: AdminNavPageKey;
  href: string;
  icon: string;
  labelKey: `nav.${AdminNavPageKey}`;
}

export type AdminNavGroupLabelKey =
  | "nav.groups.main"
  | "nav.groups.inventory"
  | "nav.groups.operations"
  | "nav.groups.finance";

export interface AdminNavGroup {
  id: string;
  labelKey: AdminNavGroupLabelKey;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: "main",
    labelKey: "nav.groups.main",
    items: [
      {
        key: "overview",
        href: "/admin",
        icon: "space_dashboard",
        labelKey: "nav.overview",
      },
    ],
  },
  {
    id: "inventory",
    labelKey: "nav.groups.inventory",
    items: [
      {
        key: "properties",
        href: "/admin/properties",
        icon: "domain",
        labelKey: "nav.properties",
      },
      {
        key: "unitTypes",
        href: "/admin/unit-types",
        icon: "category",
        labelKey: "nav.unitTypes",
      },
      {
        key: "units",
        href: "/admin/units",
        icon: "bed",
        labelKey: "nav.units",
      },
      {
        key: "vacantSearch",
        href: "/admin/units/vacant",
        icon: "event_available",
        labelKey: "nav.vacantSearch",
      },
      {
        key: "pricing",
        href: "/admin/pricing",
        icon: "sell",
        labelKey: "nav.pricing",
      },
    ],
  },
  {
    id: "operations",
    labelKey: "nav.groups.operations",
    items: [
      {
        key: "leases",
        href: "/admin/leases",
        icon: "description",
        labelKey: "nav.leases",
      },
      {
        key: "users",
        href: "/admin/users",
        icon: "group",
        labelKey: "nav.users",
      },
    ],
  },
  {
    id: "finance",
    labelKey: "nav.groups.finance",
    items: [
      {
        key: "bookkeeping",
        href: "/admin/bookkeeping",
        icon: "account_balance_wallet",
        labelKey: "nav.bookkeeping",
      },
    ],
  },
];

export const adminNavItems: AdminNavItem[] = adminNavGroups.flatMap(
  (g) => g.items,
);
