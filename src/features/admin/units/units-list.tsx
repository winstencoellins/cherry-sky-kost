"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { AdminAlert } from "@/features/admin/components/admin-alert";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { AdminTableShell } from "@/features/admin/components/admin-table-shell";
import { PropertyFilter } from "@/features/admin/components/property-filter";
import { UnitStatusBadge } from "@/features/admin/components/status-badge";
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
  useUnitMutations,
  useUnits,
} from "@/features/admin/hooks/use-admin-queries";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";
import type { Unit } from "@/lib/types/admin";

const BASE = "/admin/units";

export function UnitsList() {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.units");
  const [propertyFilter, setPropertyFilter] = useState("");
  const [search, setSearch] = useState("");
  const { data = [], isLoading, error } = useUnits(propertyFilter || undefined);
  const mutations = useUnitMutations();
  const deleteDialog = useDeleteDialog<Unit>();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((unit) => {
      const tenant =
        unit.activeLease?.user?.name ??
        unit.activeLease?.user?.email ??
        "";
      return (
        unit.name.toLowerCase().includes(q) ||
        (unit.unitType?.name ?? "").toLowerCase().includes(q) ||
        (unit.property?.name ?? "").toLowerCase().includes(q) ||
        tenant.toLowerCase().includes(q)
      );
    });
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
              { key: "name", label: t("name") },
              { key: "unitType", label: t("unitType") },
              { key: "floor", label: t("floor") },
              { key: "tenant", label: t("tenant") },
              { key: "status", label: t("status") },
              { key: "actions", label: t("actions"), align: "right" },
            ]}
          >
            {pageData.map((unit) => (
              <AdminCrudTableRow key={unit.id}>
                <AdminCrudTableCell className="font-semibold">
                  {unit.name}
                </AdminCrudTableCell>
                <AdminCrudTableCell className="text-[#51443c]">
                  {unit.unitType?.name ?? "—"}
                </AdminCrudTableCell>
                <AdminCrudTableCell>
                  {unit.floor != null ? unit.floor : "—"}
                </AdminCrudTableCell>
                <AdminCrudTableCell className="text-[#51443c]">
                  {unit.activeLease?.user?.name ??
                    unit.activeLease?.user?.email ??
                    "—"}
                </AdminCrudTableCell>
                <AdminCrudTableCell>
                  <UnitStatusBadge status={unit.status} />
                </AdminCrudTableCell>
                <AdminCrudTableCell align="right">
                  <AdminRowActions
                    editHref={`${BASE}/${unit.id}/edit`}
                    onDelete={() => deleteDialog.openDelete(unit)}
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
        itemName={deleteDialog.item?.name ?? ""}
        onConfirm={confirmDelete}
        pending={pending}
      />
    </>
  );
}
