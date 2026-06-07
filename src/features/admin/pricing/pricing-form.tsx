"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminField,
  AdminSelect,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { AdminFormPage } from "@/features/admin/crud/admin-form-page";
import {
  useProperties,
  useUnitPricing,
  useUnitPricingMutations,
  useUnitTypes,
} from "@/features/admin/hooks/use-admin-queries";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";

const BASE = "/admin/pricing";

type FormState = {
  propertyId: string;
  unitTypeId: string;
  durationDays: string;
  price: string;
};

const emptyForm: FormState = {
  propertyId: "",
  unitTypeId: "",
  durationDays: "",
  price: "",
};

export function PricingForm({ id }: { id?: string }) {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.pricing");
  const router = useRouter();
  const isEdit = !!id;
  const { data: properties = [] } = useProperties();
  const { data: pricing, isLoading } = useUnitPricing(id ?? "", isEdit);
  const mutations = useUnitPricingMutations();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: unitTypes = [] } = useUnitTypes(form.propertyId || undefined);

  const availableUnitTypes = useMemo(() => {
    if (!form.propertyId) return unitTypes;
    return unitTypes.filter((ut) => ut.propertyId === form.propertyId);
  }, [unitTypes, form.propertyId]);

  useEffect(() => {
    if (pricing) {
      setForm({
        propertyId: pricing.propertyId,
        unitTypeId: pricing.unitTypeId,
        durationDays: String(pricing.durationDays),
        price: String(pricing.price),
      });
    }
  }, [pricing]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      if (isEdit && id) {
        await mutations.update.mutateAsync({
          id,
          durationDays: Number(form.durationDays),
          price: Number(form.price),
        });
        showApiSuccess(t("updated"));
      } else {
        if (!form.unitTypeId) {
          setFormError(t("selectUnitType"));
          return;
        }
        await mutations.create.mutateAsync({
          unitTypeId: form.unitTypeId,
          durationDays: Number(form.durationDays),
          price: Number(form.price),
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

  if (isEdit && isLoading && !pricing) {
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
        <AdminField label={t("property")} htmlFor="price-property">
          <AdminSelect
            id="price-property"
            required
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
          </AdminSelect>
        </AdminField>
      )}

      <AdminField label={t("unitType")} htmlFor="price-unit-type">
        <AdminSelect
          id="price-unit-type"
          required
          disabled={isEdit}
          value={form.unitTypeId}
          onChange={(e) =>
            setForm((f) => ({ ...f, unitTypeId: e.target.value }))
          }
        >
          <option value="">{t("selectUnitType")}</option>
          {(isEdit ? unitTypes : availableUnitTypes).map((ut) => (
            <option key={ut.id} value={ut.id}>
              {ut.name}
            </option>
          ))}
        </AdminSelect>
      </AdminField>

      <AdminField label={t("duration")} htmlFor="price-duration">
        <input
          id="price-duration"
          type="number"
          min={1}
          required
          className={adminInputClassName}
          value={form.durationDays}
          onChange={(e) =>
            setForm((f) => ({ ...f, durationDays: e.target.value }))
          }
        />
      </AdminField>

      <AdminField label={t("price")} htmlFor="price-amount">
        <input
          id="price-amount"
          type="number"
          min={1}
          required
          className={adminInputClassName}
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        />
      </AdminField>
    </AdminFormPage>
  );
}
