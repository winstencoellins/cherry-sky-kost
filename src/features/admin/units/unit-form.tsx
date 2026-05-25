"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminField,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { AdminFormPage } from "@/features/admin/crud/admin-form-page";
import {
  useProperties,
  useUnit,
  useUnitMutations,
  useUnitTypes,
} from "@/features/admin/hooks/use-admin-queries";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";
import type { UnitStatus } from "@/lib/types/admin";

const BASE = "/admin/units";

type FormState = {
  name: string;
  floor: string;
  propertyId: string;
  unitTypeId: string;
};

const emptyForm: FormState = {
  name: "",
  floor: "",
  propertyId: "",
  unitTypeId: "",
};

export function UnitForm({ id }: { id?: string }) {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.units");
  const router = useRouter();
  const isEdit = !!id;
  const { data: properties = [] } = useProperties();
  const { data: unit, isLoading } = useUnit(id ?? "", isEdit);
  const mutations = useUnitMutations();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<UnitStatus>("vacant");
  const [formError, setFormError] = useState<string | null>(null);

  const { data: unitTypes = [] } = useUnitTypes(form.propertyId || undefined);

  const availableUnitTypes = useMemo(() => {
    if (!form.propertyId) return unitTypes;
    return unitTypes.filter((ut) => ut.propertyId === form.propertyId);
  }, [unitTypes, form.propertyId]);

  useEffect(() => {
    if (unit) {
      setForm({
        name: unit.name,
        floor: unit.floor != null ? String(unit.floor) : "",
        propertyId: unit.propertyId,
        unitTypeId: unit.unitTypeId,
      });
      setStatus(unit.status);
    }
  }, [unit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const floor = form.floor ? Number(form.floor) : undefined;

    try {
      if (isEdit && id) {
        await mutations.update.mutateAsync({
          id,
          name: form.name,
          floor: floor ?? null,
          status,
        });
        showApiSuccess(t("updated"));
      } else {
        if (!form.unitTypeId) {
          setFormError(t("selectUnitType"));
          return;
        }
        await mutations.create.mutateAsync({
          name: form.name,
          unitTypeId: form.unitTypeId,
          floor,
        });
        showApiSuccess(t("created"));
      }
      router.push(BASE);
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

  if (isEdit && isLoading && !unit) {
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
      cancelHref={BASE}
      cancelLabel={t("cancel")}
    >
      {!isEdit && (
        <AdminField label={t("property")} htmlFor="unit-property">
          <select
            id="unit-property"
            required
            className={adminInputClassName}
            value={form.propertyId}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                propertyId: e.target.value,
                unitTypeId: "",
              }))
            }
          >
            <option value="">{t("selectProperty")}</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </AdminField>
      )}

      <AdminField label={t("unitType")} htmlFor="unit-type">
        <select
          id="unit-type"
          required
          disabled={isEdit}
          className={adminInputClassName}
          value={form.unitTypeId}
          onChange={(e) =>
            setForm((f) => ({ ...f, unitTypeId: e.target.value }))
          }
        >
          <option value="">{t("selectUnitType")}</option>
          {(isEdit ? unitTypes : availableUnitTypes).map((ut) => (
            <option key={ut.id} value={ut.id}>
              {ut.name}
              {ut.property?.name ? ` — ${ut.property.name}` : ""}
            </option>
          ))}
        </select>
      </AdminField>

      <AdminField label={t("name")} htmlFor="unit-name">
        <input
          id="unit-name"
          required
          className={adminInputClassName}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </AdminField>

      <AdminField label={t("floor")} htmlFor="unit-floor">
        <input
          id="unit-floor"
          type="number"
          className={adminInputClassName}
          value={form.floor}
          onChange={(e) => setForm((f) => ({ ...f, floor: e.target.value }))}
        />
      </AdminField>

      {isEdit && (
        <AdminField label={t("status")} htmlFor="unit-status">
          <select
            id="unit-status"
            className={adminInputClassName}
            value={status}
            onChange={(e) => setStatus(e.target.value as UnitStatus)}
          >
            <option value="vacant">vacant</option>
            <option value="occupied">occupied</option>
          </select>
        </AdminField>
      )}
    </AdminFormPage>
  );
}
