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
  useProperty,
  usePropertyMutations,
} from "@/features/admin/hooks/use-admin-queries";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";

const BASE = "/admin/properties";

type FormState = { name: string; address: string; city: string };

const emptyForm: FormState = { name: "", address: "", city: "" };

export function PropertyForm({ id }: { id?: string }) {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.properties");
  const router = useRouter();
  const isEdit = !!id;
  const { data: property, isLoading } = useProperty(id ?? "", isEdit);
  const mutations = usePropertyMutations();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (property) {
      setForm({
        name: property.name,
        address: property.address,
        city: property.city,
      });
    }
  }, [property]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    try {
      if (isEdit && id) {
        await mutations.update.mutateAsync({ id, ...form });
        showApiSuccess(t("updated"));
      } else {
        await mutations.create.mutateAsync(form);
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

  if (isEdit && isLoading && !property) {
    return (
      <p className="text-sm text-[#83746b]">{t("loading")}</p>
    );
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
      <AdminField label={t("name")} htmlFor="prop-name">
        <input
          id="prop-name"
          required
          className={adminInputClassName}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </AdminField>
      <AdminField label={t("address")} htmlFor="prop-address">
        <input
          id="prop-address"
          required
          className={adminInputClassName}
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
        />
      </AdminField>
      <AdminField label={t("city")} htmlFor="prop-city">
        <input
          id="prop-city"
          required
          className={adminInputClassName}
          value={form.city}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
        />
      </AdminField>
    </AdminFormPage>
  );
}
