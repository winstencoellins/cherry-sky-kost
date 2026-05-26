"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { AdminAlert } from "@/features/admin/components/admin-alert";
import {
  AdminField,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { AdminTableShell } from "@/features/admin/components/admin-table-shell";
import { PropertyFilter } from "@/features/admin/components/property-filter";
import { UnitStatusBadge } from "@/features/admin/components/status-badge";
import {
  AdminCrudTable,
  AdminCrudTableCell,
  AdminCrudTableRow,
} from "@/features/admin/crud/admin-crud-table";
import { useClientPagination } from "@/features/admin/crud/use-client-pagination";
import { useVacantUnits } from "@/features/admin/hooks/use-admin-queries";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { toDateInputValue } from "@/features/admin/lib/format";

function defaultEndDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return toDateInputValue(date);
}

export function VacantUnitsSearch() {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.vacantUnits");

  const [startDate, setStartDate] = useState(() => toDateInputValue(new Date()));
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [propertyFilter, setPropertyFilter] = useState("");
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState<{
    startDate: string;
    endDate: string;
    propertyId?: string;
  } | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const queryParams = submitted ?? {
    startDate: "",
    endDate: "",
    propertyId: undefined,
  };

  const { data = [], isLoading, error, isFetching } = useVacantUnits(
    {
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
      propertyId: queryParams.propertyId,
    },
    !!submitted,
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((unit) => {
      return (
        unit.name.toLowerCase().includes(q) ||
        (unit.unitType?.name ?? "").toLowerCase().includes(q) ||
        (unit.property?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [data, search]);

  const { page, setPage, pageData, total, pageSize } =
    useClientPagination(filtered);

  function handleSearch() {
    if (!startDate || !endDate) {
      setDateError(tp("datesRequired"));
      return;
    }
    if (startDate >= endDate) {
      setDateError(tp("invalidDateRange"));
      return;
    }
    setDateError(null);
    setSubmitted({
      startDate,
      endDate,
      propertyId: propertyFilter || undefined,
    });
    setPage(1);
  }

  const showResults = !!submitted;

  return (
    <>
      <AdminPageHeader title={tp("title")} description={tp("description")} />

      <div className="mb-6 rounded-2xl border border-[#e3e2e0] bg-white/80 p-5 shadow-sm">
        <p className="mb-4 text-sm font-medium text-[#51443c]">{tp("filters")}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminField label={t("startDate")} htmlFor="vacant-start">
            <input
              id="vacant-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>
          <AdminField label={tp("endDate")} htmlFor="vacant-end">
            <input
              id="vacant-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={adminInputClassName}
            />
          </AdminField>
          <AdminField label={t("property")}>
            <PropertyFilter value={propertyFilter} onChange={setPropertyFilter} />
          </AdminField>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleSearch}
              disabled={isFetching}
              className="flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-[#6f4627] px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#805533] disabled:opacity-50"
            >
              <Icon name="search" size={18} />
              {tp("search")}
            </button>
          </div>
        </div>
        {dateError && (
          <p className="mt-3 text-sm text-[#ba1a1a]">{dateError}</p>
        )}
      </div>

      {showResults && (
        <>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#51443c]">
              {tp("resultsCount", { count: filtered.length })}
            </p>
            <div className="relative max-w-md flex-1">
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
              <p className="p-8 text-center text-sm text-[#83746b]">
                {t("loading")}
              </p>
            ) : filtered.length === 0 ? (
              <p className="p-8 text-center text-sm text-[#83746b]">
                {tp("empty")}
              </p>
            ) : (
              <AdminCrudTable
                columns={[
                  { key: "name", label: t("name") },
                  { key: "unitType", label: t("unitType") },
                  { key: "property", label: t("property") },
                  { key: "floor", label: t("floor") },
                  { key: "status", label: t("status") },
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
                    <AdminCrudTableCell className="text-[#51443c]">
                      {unit.property?.name ?? "—"}
                    </AdminCrudTableCell>
                    <AdminCrudTableCell>
                      {unit.floor != null ? unit.floor : "—"}
                    </AdminCrudTableCell>
                    <AdminCrudTableCell>
                      <UnitStatusBadge status={unit.status} />
                    </AdminCrudTableCell>
                  </AdminCrudTableRow>
                ))}
              </AdminCrudTable>
            )}
          </AdminTableShell>
        </>
      )}

      {!showResults && (
        <p className="rounded-2xl border border-dashed border-[#e3e2e0] bg-[#faf9f6]/80 p-10 text-center text-sm text-[#83746b]">
          {tp("hint")}
        </p>
      )}
    </>
  );
}
