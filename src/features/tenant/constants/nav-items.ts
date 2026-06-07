export type TenantNavPageKey = "leases" | "leaseRenewals" | "profile";

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
    key: "leaseRenewals",
    href: "/tenant/lease-renewals",
    icon: "autorenew",
    labelKey: "nav.leaseRenewals",
  },
  {
    key: "profile",
    href: "/tenant/profile",
    icon: "person",
    labelKey: "nav.profile",
  },
];
