"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminField,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { AdminFormPage } from "@/features/admin/crud/admin-form-page";
import {
  useProperties,
  useUnitType,
  useUnitTypeMutations,
} from "@/features/admin/hooks/use-admin-queries";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";

const BASE = "/admin/unit-types";

type FormState = {
  name: string;
  description: string;
  propertyId: string;
  totalFloor: string;
  size: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  propertyId: "",
  totalFloor: "",
  size: "",
};

export function UnitTypeForm({ id }: { id?: string }) {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.unitTypes");
  const router = useRouter();
  const isEdit = !!id;
  const { data: properties = [] } = useProperties();
  const { data: unitType, isLoading } = useUnitType(id ?? "", isEdit);
  const mutations = useUnitTypeMutations();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (unitType) {
      setForm({
        name: unitType.name,
        description: unitType.description ?? "",
        propertyId: unitType.propertyId,
        totalFloor:
          unitType.totalFloor != null ? String(unitType.totalFloor) : "",
        size: unitType.size != null ? String(unitType.size) : "",
      });
    }
  }, [unitType]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const totalFloor = form.totalFloor ? Number(form.totalFloor) : null;
    const size = form.size ? Number(form.size) : null;

    try {
      if (isEdit && id) {
        await mutations.update.mutateAsync({
          id,
          name: form.name,
          description: form.description || null,
          totalFloor,
          size,
        });
        showApiSuccess(t("updated"));
      } else {
        if (!form.propertyId) {
          setFormError(t("selectProperty"));
          return;
        }
        await mutations.create.mutateAsync({
          name: form.name,
          propertyId: form.propertyId,
          description: form.description || null,
          totalFloor,
          size,
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

  if (isEdit && isLoading && !unitType) {
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
      <AdminField label={t("property")} htmlFor="ut-property">
        <select
          id="ut-property"
          required
          disabled={isEdit}
          className={adminInputClassName}
          value={form.propertyId}
          onChange={(e) =>
            setForm((f) => ({ ...f, propertyId: e.target.value }))
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

      <AdminField label={t("name")} htmlFor="ut-name">
        <input
          id="ut-name"
          required
          className={adminInputClassName}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </AdminField>

      <AdminField label={t("description")} htmlFor="ut-desc">
        <textarea
          id="ut-desc"
          rows={3}
          className={adminInputClassName}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
      </AdminField>

      <AdminField label={t("size")} htmlFor="ut-size">
        <input
          id="ut-size"
          type="number"
          min={0}
          className={adminInputClassName}
          value={form.size}
          onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
        />
      </AdminField>

      <AdminField label={t("floor")} htmlFor="ut-floor">
        <input
          id="ut-floor"
          type="number"
          min={0}
          className={adminInputClassName}
          value={form.totalFloor}
          onChange={(e) =>
            setForm((f) => ({ ...f, totalFloor: e.target.value }))
          }
          placeholder="Total floors"
        />
      </AdminField>
    </AdminFormPage>
  );
}
