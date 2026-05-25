"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { AdminAlert } from "@/features/admin/components/admin-alert";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { AdminStatCard } from "@/features/admin/components/admin-stat-card";
import { AdminTableShell } from "@/features/admin/components/admin-table-shell";
import { PropertyFilter } from "@/features/admin/components/property-filter";
import {
  isLeaseIncomeEntry,
  leaseToIncomeEntry,
  sumPaidLeaseIncome,
} from "@/features/admin/bookkeeping/calculate-lease-income";
import { computeLedgerSummary } from "@/features/admin/bookkeeping/compute-ledger-summary";
import { LedgerTypeBadge } from "@/features/admin/bookkeeping/ledger-type-badge";
import { AdminDeleteDialog } from "@/features/admin/crud/admin-delete-dialog";
import {
  AdminCrudTable,
  AdminCrudTableCell,
  AdminCrudTableRow,
} from "@/features/admin/crud/admin-crud-table";
import { AdminRowActions } from "@/features/admin/crud/admin-row-actions";
import { useClientPagination } from "@/features/admin/crud/use-client-pagination";
import { useDeleteDialog } from "@/features/admin/crud/use-delete-dialog";
import {
  useLeases,
  useLedgerEntries,
  useLedgerEntryMutations,
} from "@/features/admin/hooks/use-admin-queries";
import {
  formatDate,
  formatIdrCompact,
  formatIdrTable,
} from "@/features/admin/lib/format";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";
import type { LedgerEntry, LedgerEntryType } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

const BASE = "/admin/bookkeeping";

type TypeFilter = "" | LedgerEntryType;

export function BookkeepingList() {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.bookkeeping");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("");
  const [search, setSearch] = useState("");

  const filters = useMemo(
    () => ({
      ...(propertyFilter ? { propertyId: propertyFilter } : {}),
      ...(typeFilter ? { type: typeFilter } : {}),
    }),
    [propertyFilter, typeFilter],
  );

  const { data, isLoading, error, isError: ledgerError } = useLedgerEntries(filters);
  const {
    data: leases = [],
    isLoading: leasesLoading,
    isError: leasesError,
    error: leasesQueryError,
  } = useLeases(propertyFilter ? { propertyId: propertyFilter } : undefined);
  const entries = data?.data ?? [];
  const ledgerSummary =
    data?.summary ?? computeLedgerSummary(entries);
  const leaseIncome = useMemo(
    () => sumPaidLeaseIncome(leases.filter((l) => l.status === "paid")),
    [leases],
  );
  const summary = useMemo(
    () => ({
      income: ledgerSummary.income + leaseIncome,
      expense: ledgerSummary.expense,
      net: ledgerSummary.income + leaseIncome - ledgerSummary.expense,
    }),
    [ledgerSummary, leaseIncome],
  );
  const mutations = useLedgerEntryMutations();
  const deleteDialog = useDeleteDialog<LedgerEntry>();

  const leaseIncomeEntries = useMemo(() => {
    if (typeFilter === "expense") return [];
    return leases
      .map((lease) =>
        leaseToIncomeEntry(
          lease,
          tp("leaseIncomeDescription", {
            unit: lease.unit?.name ?? lease.unitId,
            property: lease.unit?.property?.name ?? "—",
          }),
        ),
      )
      .filter((row): row is LedgerEntry => row != null);
  }, [leases, typeFilter, tp]);

  const allEntries = useMemo(
    () => [...leaseIncomeEntries, ...entries],
    [leaseIncomeEntries, entries],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allEntries;
    return allEntries.filter((entry) => {
      const property = entry.property?.name ?? "";
      return [entry.description, property]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [allEntries, search]);

  const { page, setPage, pageData, total, pageSize } =
    useClientPagination(filtered);

  async function confirmDelete() {
    if (!deleteDialog.item) return;
    try {
      await mutations.remove.mutateAsync(deleteDialog.item.id);
      showApiSuccess(t("deleted"));
      deleteDialog.close();
    } catch (err) {
      showApiError(err, t("deleteFailed"));
    }
  }

  const pending = mutations.remove.isPending;

  return (
    <>
      <AdminPageHeader
        title={tp("title")}
        description={tp("description")}
        primaryAction={{
          label: t("add"),
          href: `${BASE}/new`,
          icon: "add",
        }}
      />

      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <AdminStatCard
          icon="trending_up"
          iconClassName="bg-[#E6F4EA] text-[#137333]"
          label={tp("stats.income")}
          value={formatIdrCompact(summary.income)}
          valuePrefix="Rp"
          hint={tp("stats.incomeHint")}
        />
        <AdminStatCard
          icon="trending_down"
          iconClassName="bg-[#ffdad6] text-[#ba1a1a]"
          label={tp("stats.expense")}
          value={formatIdrCompact(summary.expense)}
          valuePrefix="Rp"
          hint={tp("stats.expenseHint")}
        />
        <AdminStatCard
          icon="account_balance"
          iconClassName="bg-[#d3e4fe] text-[#0b1c30]"
          label={tp("stats.net")}
          value={formatIdrCompact(Math.abs(summary.net))}
          valuePrefix="Rp"
          hint={tp("stats.netHint")}
          trend={
            summary.net !== 0
              ? {
                  value: summary.net >= 0 ? tp("stats.profit") : tp("stats.loss"),
                  positive: summary.net >= 0,
                }
              : undefined
          }
        />
      </section>

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <PropertyFilter value={propertyFilter} onChange={setPropertyFilter} />
        <div>
          <label
            htmlFor="ledger-type-filter"
            className="mb-1 block text-xs font-semibold uppercase tracking-wide text-[#83746b]"
          >
            {tp("typeFilter")}
          </label>
          <select
            id="ledger-type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            className="h-10 min-w-[10rem] rounded-xl border border-[#e3e2e0] bg-white/80 px-3 text-sm outline-none focus:border-[#8b5e3c]/50 focus:ring-2 focus:ring-[#8b5e3c]/15"
          >
            <option value="">{tp("allTypes")}</option>
            <option value="income">{tp("typeIncome")}</option>
            <option value="expense">{tp("typeExpense")}</option>
          </select>
        </div>
        <div className="relative min-w-[12rem] flex-1 max-w-md">
          <Icon
            name="search"
            size={20}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#83746b]"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-10 w-full rounded-xl border border-[#e3e2e0] bg-white/80 pl-10 pr-4 text-sm outline-none focus:border-[#8b5e3c]/50 focus:ring-2 focus:ring-[#8b5e3c]/15"
          />
        </div>
      </div>

      {(ledgerError || leasesError) && (
        <div className="mb-4 space-y-2">
          {ledgerError && (
            <AdminAlert message={getErrorMessage(error, t("loadFailed"))} />
          )}
          {leasesError && (
            <AdminAlert
              message={getErrorMessage(leasesQueryError, tp("leasesLoadFailed"))}
            />
          )}
        </div>
      )}

      <AdminTableShell
        footer={
          !isLoading && total > 0 ? (
            <AdminPagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          ) : undefined
        }
      >
        {isLoading || leasesLoading ? (
          <p className="p-8 text-center text-sm text-[#83746b]">{t("loading")}</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#83746b]">{t("empty")}</p>
        ) : (
          <AdminCrudTable
            columns={[
              { key: "date", label: tp("date") },
              { key: "type", label: tp("entryType") },
              { key: "description", label: t("description") },
              { key: "property", label: t("property") },
              { key: "amount", label: tp("amount"), align: "right" },
              { key: "actions", label: t("actions"), align: "right" },
            ]}
          >
            {pageData.map((entry) => {
              const fromLease = isLeaseIncomeEntry(entry.id);
              return (
              <AdminCrudTableRow key={entry.id}>
                <AdminCrudTableCell className="whitespace-nowrap text-[#51443c]">
                  {formatDate(entry.date)}
                </AdminCrudTableCell>
                <AdminCrudTableCell>
                  <LedgerTypeBadge type={entry.type} />
                </AdminCrudTableCell>
                <AdminCrudTableCell className="max-w-[14rem] font-medium">
                  <span className="line-clamp-2">{entry.description}</span>
                </AdminCrudTableCell>
                <AdminCrudTableCell className="text-[#51443c]">
                  {entry.property?.name ?? tp("noProperty")}
                </AdminCrudTableCell>
                <AdminCrudTableCell align="right">
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      entry.type === "income"
                        ? "text-[#137333]"
                        : "text-[#ba1a1a]",
                    )}
                  >
                    {entry.type === "income" ? "+" : "−"} Rp{" "}
                    {formatIdrTable(entry.amount)}
                  </span>
                </AdminCrudTableCell>
                <AdminCrudTableCell align="right">
                  {fromLease ? (
                    <span className="text-xs text-[#83746b]">{tp("fromLease")}</span>
                  ) : (
                    <AdminRowActions
                      editHref={`${BASE}/${entry.id}/edit`}
                      onDelete={() => deleteDialog.openDelete(entry)}
                      disabled={pending}
                    />
                  )}
                </AdminCrudTableCell>
              </AdminCrudTableRow>
            );
            })}
          </AdminCrudTable>
        )}
      </AdminTableShell>

      <AdminDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && deleteDialog.close()}
        itemName={deleteDialog.item?.description ?? ""}
        onConfirm={confirmDelete}
        pending={pending}
      />
    </>
  );
}
