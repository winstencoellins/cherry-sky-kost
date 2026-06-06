"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { Link } from "@/i18n/routing";
import { AdminStatCard } from "@/features/admin/components/admin-stat-card";
import { LeaseStatusBadge } from "@/features/admin/components/status-badge";
import { useAdminShell } from "@/features/admin/components/admin-shell-context";
import {
  useLeases,
  useProperties,
  useUnitPricings,
  useUnits,
} from "@/features/admin/hooks/use-admin-queries";
import { useAdminLookups } from "@/features/admin/hooks/use-admin-lookups";
import {
  getLeaseEndDateValue,
  resolveLeasePropertyName,
  resolveLeaseTenantLabel,
} from "@/features/admin/lib/entity-display";
import {
  formatDate,
  formatIdrCompact,
  getInitials,
  isExpiringWithinDays,
} from "@/features/admin/lib/format";
import { isUnitOccupied, type Lease } from "@/lib/types/admin";

const EXPIRING_SOON_DAYS = 5;

const quickActions = [
  { href: "/admin/properties", icon: "add_home", labelKey: "quickActions.addProperty" as const },
  { href: "/admin/unit-types", icon: "category", labelKey: "quickActions.addUnitType" as const },
  { href: "/admin/units", icon: "bed", labelKey: "quickActions.addUnit" as const },
  { href: "/admin/leases", icon: "post_add", labelKey: "quickActions.newLease" as const },
  { href: "/admin/pricing", icon: "sell", labelKey: "quickActions.setPricing" as const },
];

export function OverviewView() {
  const t = useTranslations("admin.pages.overview");
  const { user } = useAdminShell();

  const properties = useProperties();
  const units = useUnits();
  const pricings = useUnitPricings();
  const leases = useLeases();

  const loading =
    properties.isLoading ||
    units.isLoading ||
    pricings.isLoading ||
    leases.isLoading;

  const leaseList = leases.data ?? [];
  const unitList = units.data ?? [];

  const metrics = useMemo(() => {
    const occupied = unitList.filter((u) => isUnitOccupied(u.status)).length;
    const totalUnits = unitList.length;
    const occupancy =
      totalUnits > 0 ? Math.round((occupied / totalUnits) * 100) : 0;
    const activeLeases = leaseList.filter((l) => l.status === "paid").length;
    const expiring = leaseList.filter((l) => {
      const end = getLeaseEndDateValue(l);
      return end != null && isExpiringWithinDays(end, EXPIRING_SOON_DAYS);
    }).length;
    const collected = leaseList
      .filter((l) => l.status === "paid")
      .reduce((sum, l) => sum + (l.unitPricing?.price ?? 0), 0);

    return { occupied, totalUnits, occupancy, activeLeases, expiring, collected };
  }, [leaseList, unitList]);

  const recentLeases = useMemo(
    () =>
      [...leaseList]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .slice(0, 5),
    [leaseList],
  );

  const greetingKey = getGreeting();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-[#e3e2e0]/80 bg-gradient-to-br from-[#6f4627] via-[#805533] to-[#8b5e3c] p-6 text-white shadow-lg shadow-[#6f4627]/20 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 size-48 rounded-full bg-black/10 blur-2xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">
              {t(`greeting.${greetingKey}`)}
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {user.name.split(" ")[0] ?? user.name}
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/85">
              {t("description")}
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <Link
              href="/admin/leases"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#6f4627] shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Icon name="description" size={18} />
              {t("viewLeases")}
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          icon="domain"
          iconClassName="bg-[#d3e4fe] text-[#0b1c30]"
          label={t("stats.properties")}
          value={loading ? "…" : (properties.data?.length ?? 0)}
          hint={t("stats.propertiesHint")}
          href="/admin/properties"
        />
        <AdminStatCard
          icon="bed"
          iconClassName="bg-[#e2dfde] text-[#636262]"
          label={t("stats.units")}
          value={loading ? "…" : metrics.totalUnits}
          hint={t("stats.unitsHint", { occupied: metrics.occupied })}
          href="/admin/units"
          trend={
            metrics.totalUnits > 0
              ? {
                  value: `${metrics.occupancy}%`,
                  positive: metrics.occupancy >= 50,
                }
              : undefined
          }
        />
        <AdminStatCard
          icon="description"
          iconClassName="bg-[#ffdcc5] text-[#653d1e]"
          label={t("stats.leases")}
          value={loading ? "…" : metrics.activeLeases}
          hint={t("stats.leasesHint", { expiring: metrics.expiring })}
          href="/admin/leases"
        />
        <AdminStatCard
          icon="payments"
          iconClassName="bg-[#E6F4EA] text-[#137333]"
          label={t("stats.revenue")}
          value={loading ? "…" : formatIdrCompact(metrics.collected)}
          hint={t("stats.revenueHint")}
          href="/admin/pricing"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-[#e3e2e0]/80 bg-white/90 p-5 shadow-sm backdrop-blur-sm lg:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#83746b]">
            {t("quickActions.title")}
          </h3>
          <ul className="mt-4 space-y-2">
            {quickActions.map((action) => (
              <li key={action.href}>
                <Link
                  href={action.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#51443c] transition-colors hover:bg-[#f4f3f1] hover:text-[#1a1c1a]"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg bg-[#efeeeb] text-[#6f4627]">
                    <Icon name={action.icon} size={20} />
                  </span>
                  {t(action.labelKey)}
                  <Icon
                    name="chevron_right"
                    size={18}
                    className="ml-auto text-[#83746b]"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[#e3e2e0]/80 bg-white/90 shadow-sm backdrop-blur-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#e3e2e0]/60 px-5 py-4">
            <div>
              <h3 className="font-semibold text-[#1a1c1a]">{t("recent.title")}</h3>
              <p className="text-xs text-[#83746b]">{t("recent.subtitle")}</p>
            </div>
            <Link
              href="/admin/leases"
              className="text-sm font-semibold text-[#6f4627] hover:text-[#805533]"
            >
              {t("recent.viewAll")}
            </Link>
          </div>

          {loading ? (
            <p className="p-6 text-sm text-[#83746b]">{t("loading")}</p>
          ) : recentLeases.length === 0 ? (
            <p className="p-6 text-sm text-[#83746b]">{t("recent.empty")}</p>
          ) : (
            <ul className="divide-y divide-[#e3e2e0]/50">
              {recentLeases.map((lease) => (
                <RecentLeaseRow key={lease.id} lease={lease} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function RecentLeaseRow({ lease }: { lease: Lease }) {
  const t = useTranslations("admin.pages.overview.recent");
  const lookups = useAdminLookups();
  const tenant = resolveLeaseTenantLabel(lease);
  const endDate = getLeaseEndDateValue(lease);
  const propertyName = resolveLeasePropertyName(lease, lookups);
  const expiring =
    !!endDate && isExpiringWithinDays(endDate, EXPIRING_SOON_DAYS);

  return (
    <li className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#faf9f6]/80">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#d3e4fe] text-xs font-bold text-[#0b1c30]">
        {getInitials(tenant)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-[#1a1c1a]">{tenant}</p>
        <p className="truncate text-xs text-[#83746b]">
          {lease.unit?.name ?? lease.unitId}
          {propertyName !== "—" ? ` · ${propertyName}` : ""}
        </p>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-xs text-[#83746b]">
          {formatDate(lease.startDate)} –{" "}
          {endDate ? formatDate(endDate) : "—"}
        </p>
        {expiring && (
          <p className="text-xs font-medium text-[#ba1a1a]">{t("expiringSoon")}</p>
        )}
      </div>
      <LeaseStatusBadge status={lease.status} />
    </li>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
