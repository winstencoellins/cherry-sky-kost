"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { AdminAlert } from "@/features/admin/components/admin-alert";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { AdminTableShell } from "@/features/admin/components/admin-table-shell";
import { PropertyFilter } from "@/features/admin/components/property-filter";
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
  useUnitPricingMutations,
  useUnitPricings,
} from "@/features/admin/hooks/use-admin-queries";
import { useAdminLookups } from "@/features/admin/hooks/use-admin-lookups";
import {
  resolvePricingPropertyName,
  resolvePricingUnitTypeName,
} from "@/features/admin/lib/entity-display";
import { formatIdrTable } from "@/features/admin/lib/format";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";
import type { UnitPricing } from "@/lib/types/admin";

const BASE = "/admin/pricing";

export function PricingList() {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.pricing");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [search, setSearch] = useState("");
  const { data = [], isLoading, error } = useUnitPricings({
    propertyId: propertyFilter || undefined,
  });
  const mutations = useUnitPricingMutations();
  const deleteDialog = useDeleteDialog<UnitPricing>();
  const lookups = useAdminLookups();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      [
        row.unitType?.name,
        row.property?.name,
        String(row.durationDays),
        String(row.price),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [data, search]);

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

      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end">
        <PropertyFilter value={propertyFilter} onChange={setPropertyFilter} />
        <div className="relative flex-1 max-w-md">
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

      {error && (
        <div className="mb-4">
          <AdminAlert message={getErrorMessage(error, t("loadFailed"))} />
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
        {isLoading ? (
          <p className="p-8 text-center text-sm text-[#83746b]">{t("loading")}</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#83746b]">{t("empty")}</p>
        ) : (
          <AdminCrudTable
            columns={[
              { key: "unitType", label: t("unitType") },
              { key: "property", label: t("property") },
              { key: "duration", label: t("duration") },
              { key: "price", label: t("price") },
              { key: "actions", label: t("actions"), align: "right" },
            ]}
          >
            {pageData.map((row) => (
              <AdminCrudTableRow key={row.id}>
                <AdminCrudTableCell className="font-semibold">
                  {resolvePricingUnitTypeName(row, lookups)}
                </AdminCrudTableCell>
                <AdminCrudTableCell className="text-[#51443c]">
                  {resolvePricingPropertyName(row, lookups)}
                </AdminCrudTableCell>
                <AdminCrudTableCell>
                  {row.durationDays} {t("days")}
                </AdminCrudTableCell>
                <AdminCrudTableCell className="font-semibold tabular-nums">
                  Rp {formatIdrTable(row.price)}
                </AdminCrudTableCell>
                <AdminCrudTableCell align="right">
                  <AdminRowActions
                    editHref={`${BASE}/${row.id}/edit`}
                    onDelete={() => deleteDialog.openDelete(row)}
                    disabled={pending}
                  />
                </AdminCrudTableCell>
              </AdminCrudTableRow>
            ))}
          </AdminCrudTable>
        )}
      </AdminTableShell>

      <AdminDeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => !open && deleteDialog.close()}
        itemName={
          deleteDialog.item
            ? `${deleteDialog.item.unitType?.name ?? ""} · ${deleteDialog.item.durationDays} ${t("days")}`
            : ""
        }
        onConfirm={confirmDelete}
        pending={pending}
      />
    </>
  );
}
