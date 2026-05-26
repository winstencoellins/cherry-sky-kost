export type TenantNavPageKey = "leases" | "profile";

export interface TenantNavItem {
  key: TenantNavPageKey;
  href: string;
  icon: string;
  labelKey: `nav.${TenantNavPageKey}`;
}

export const tenantNavItems: TenantNavItem[] = [
  {
    key: "leases",
    href: "/tenant/leases",
    icon: "description",
    labelKey: "nav.leases",
  },
  {
    key: "profile",
    href: "/tenant/profile",
    icon: "person",
    labelKey: "nav.profile",
  },
];
