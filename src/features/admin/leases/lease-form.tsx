"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import {
  AdminField,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { AdminFormPage } from "@/features/admin/crud/admin-form-page";
import { AdminLeaseRenewalActions } from "@/features/admin/leases/lease-renewal-actions";
import {
  useLease,
  useLeaseMutations,
  useTenantUsers,
  useUnitPricings,
  useUnits,
} from "@/features/admin/hooks/use-admin-queries";
import { useAdminLookups } from "@/features/admin/hooks/use-admin-lookups";
import {
  resolvePricingUnitTypeName,
  resolveUnitPropertyName,
  resolveUnitTypeNameForUnit,
} from "@/features/admin/lib/entity-display";
import { formatIdrTable, toDateInputValue } from "@/features/admin/lib/format";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";
import type { LeaseStatus } from "@/lib/types/admin";

const BASE = "/admin/leases";

type FormState = {
  unitId: string;
  userId: string;
  startDate: string;
  unitPricingId: string;
  status: LeaseStatus;
  leaseRenewalId: string;
};

const emptyForm: FormState = {
  unitId: "",
  userId: "",
  startDate: "",
  unitPricingId: "",
  status: "unpaid",
  leaseRenewalId: "",
};

export function LeaseForm({ id }: { id?: string }) {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.leases");
  const tr = useTranslations("admin.pages.leaseRenewals");
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = !!id;
  const { data: units = [] } = useUnits();
  const { data: pricings = [] } = useUnitPricings();
  const { data: tenants = [], isLoading: tenantsLoading } = useTenantUsers();
  const { data: lease, isLoading } = useLease(id ?? "", isEdit);
  const mutations = useLeaseMutations();
  const lookups = useAdminLookups();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const renewalPrefill = useMemo(() => {
    if (isEdit) return null;
    const renewalId = searchParams.get("renewalId");
    const unitId = searchParams.get("unitId");
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    if (!renewalId || !unitId || !userId) return null;
    return { renewalId, unitId, userId, startDate: startDate ?? "" };
  }, [isEdit, searchParams]);

  const selectedUnit = useMemo(
    () => units.find((u) => u.id === form.unitId),
    [units, form.unitId],
  );

  const pricingOptions = useMemo(() => {
    if (!selectedUnit) return pricings;
    return pricings.filter((p) => p.unitTypeId === selectedUnit.unitTypeId);
  }, [pricings, selectedUnit]);

  useEffect(() => {
    if (lease) {
      setForm({
        unitId: lease.unitId,
        userId: lease.userId,
        startDate: toDateInputValue(lease.startDate),
        unitPricingId: lease.unitPricingId,
        status: lease.status,
        leaseRenewalId: "",
      });
    } else if (!isEdit) {
      setForm((f) => ({
        ...f,
        startDate: renewalPrefill?.startDate || toDateInputValue(new Date()),
        unitId: renewalPrefill?.unitId ?? f.unitId,
        userId: renewalPrefill?.userId ?? f.userId,
        leaseRenewalId: renewalPrefill?.renewalId ?? "",
      }));
    }
  }, [lease, isEdit, renewalPrefill]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      if (isEdit && id) {
        await mutations.update.mutateAsync({
          id,
          startDate: form.startDate,
          unitPricingId: form.unitPricingId || undefined,
          status: form.status,
        });
        showApiSuccess(t("updated"));
      } else {
        await mutations.create.mutateAsync({
          unitId: form.unitId,
          userId: form.userId,
          startDate: form.startDate,
          unitPricingId: form.unitPricingId,
          leaseRenewalId: form.leaseRenewalId || undefined,
        });
        showApiSuccess(t("created"));
      }
      router.push(form.leaseRenewalId ? "/admin/lease-renewals" : BASE);
      router.refresh();
    } catch (err) {
      const msg = getErrorMessage(err, t("saveFailed"));
      setFormError(msg);
      showApiError(err, t("saveFailed"));
    }
  }

  const pending =
    mutations.create.isPending ||
    mutations.update.isPending ||
    (isEdit && isLoading);

  if (isEdit && isLoading && !lease) {
    return <p className="text-sm text-[#83746b]">{t("loading")}</p>;
  }

  return (
    <AdminFormPage
      title={isEdit ? t("editTitle") : t("createTitle")}
      description={tp("formDescription")}
      backHref={BASE}
      backLabel={t("backToList")}
      error={formError}
      onSubmit={(e) => void handleSubmit(e)}
      pending={pending}
      submitLabel={t("save")}
      pendingLabel={t("saving")}
      cancelHref={form.leaseRenewalId ? "/admin/lease-renewals" : BASE}
      cancelLabel={t("cancel")}
    >
      {!isEdit && renewalPrefill && (
        <div className="rounded-xl border border-[#8b5e3c]/20 bg-[#fef7e0]/40 px-4 py-3 text-sm text-[#51443c]">
          {tr("renewalFormHint")}
        </div>
      )}
      {!isEdit && (
        <>
          <AdminField label={t("unit")} htmlFor="lease-unit">
            <select
              id="lease-unit"
              required
              className={adminInputClassName}
              value={form.unitId}
              disabled={!!renewalPrefill}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  unitId: e.target.value,
                  unitPricingId: "",
                }))
              }
            >
              <option value="">{t("selectUnit")}</option>
              {units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({resolveUnitTypeNameForUnit(u, lookups)})
                  {resolveUnitPropertyName(u, lookups) !== "—"
                    ? ` — ${resolveUnitPropertyName(u, lookups)}`
                    : ""}
                </option>
              ))}
            </select>
          </AdminField>
          <AdminField label={t("tenant")} htmlFor="lease-user">
            <select
              id="lease-user"
              required
              className={adminInputClassName}
              value={form.userId}
              disabled={tenantsLoading || !!renewalPrefill}
              onChange={(e) =>
                setForm((f) => ({ ...f, userId: e.target.value }))
              }
            >
              <option value="">
                {tenantsLoading ? t("loading") : t("selectTenant")}
              </option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} ({tenant.email})
                </option>
              ))}
            </select>
            {!tenantsLoading && tenants.length === 0 && (
              <p className="mt-1 text-xs text-[#ba1a1a]">
                {t("noTenantsAvailable")}
              </p>
            )}
          </AdminField>
        </>
      )}
      <AdminField label={t("startDate")} htmlFor="lease-start">
        <input
          id="lease-start"
          type="date"
          required
          className={adminInputClassName}
          value={form.startDate}
          onChange={(e) =>
            setForm((f) => ({ ...f, startDate: e.target.value }))
          }
        />
      </AdminField>
      <AdminField label={t("pricing")} htmlFor="lease-pricing">
        <select
          id="lease-pricing"
          required={!isEdit}
          className={adminInputClassName}
          value={form.unitPricingId}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              unitPricingId: e.target.value,
            }))
          }
        >
          <option value="">{t("selectPricing")}</option>
          {(isEdit ? pricings : pricingOptions).map((p) => (
            <option key={p.id} value={p.id}>
              {resolvePricingUnitTypeName(p, lookups)} · {p.durationDays}{" "}
              {t("days")} — {formatIdrTable(p.price)}
            </option>
          ))}
        </select>
      </AdminField>
      {isEdit && lease?.user && (
        <AdminField label={t("tenant")} htmlFor="lease-tenant-readonly">
          <input
            id="lease-tenant-readonly"
            readOnly
            disabled
            className={adminInputClassName}
            value={`${lease.user.name} (${lease.user.email})`}
          />
        </AdminField>
      )}
      {isEdit && (
        <AdminField label={t("status")} htmlFor="lease-status">
          <select
            id="lease-status"
            className={adminInputClassName}
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({ ...f, status: e.target.value as LeaseStatus }))
            }
          >
            <option value="unpaid">Unpaid</option>
            <option value="waiting_for_review">Waiting for Review</option>
            <option value="paid">Paid</option>
          </select>
        </AdminField>
      )}
      {isEdit && lease?.leaseRenewal && (
        <AdminLeaseRenewalActions lease={lease} />
      )}
    </AdminFormPage>
  );
}
