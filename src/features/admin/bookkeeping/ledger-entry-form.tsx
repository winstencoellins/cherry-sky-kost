"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminDatePicker,
  AdminField,
  AdminSelect,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { AdminFormPage } from "@/features/admin/crud/admin-form-page";
import {
  useLedgerEntry,
  useLedgerEntryMutations,
  useProperties,
} from "@/features/admin/hooks/use-admin-queries";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";
import { toDateInputValue } from "@/features/admin/lib/format";
import type { LedgerEntryType } from "@/lib/types/admin";

const BASE = "/admin/bookkeeping";

type FormState = {
  type: LedgerEntryType;
  amount: string;
  description: string;
  date: string;
  propertyId: string;
};

const emptyForm: FormState = {
  type: "income",
  amount: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  propertyId: "",
};

export function LedgerEntryForm({ id }: { id?: string }) {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.bookkeeping");
  const router = useRouter();
  const isEdit = !!id;
  const { data: properties = [] } = useProperties();
  const { data: entry, isLoading } = useLedgerEntry(id ?? "", isEdit);
  const mutations = useLedgerEntryMutations();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (entry) {
      setForm({
        type: entry.type,
        amount: String(entry.amount),
        description: entry.description,
        date: toDateInputValue(entry.date),
        propertyId: entry.propertyId ?? "",
      });
    }
  }, [entry]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setFormError(tp("amountRequired"));
      return;
    }

    const payload = {
      type: form.type,
      amount,
      description: form.description.trim(),
      date: form.date,
      propertyId: form.propertyId || null,
    };

    try {
      if (isEdit && id) {
        await mutations.update.mutateAsync({ id, ...payload });
        showApiSuccess(t("updated"));
      } else {
        await mutations.create.mutateAsync(payload);
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

  if (isEdit && isLoading && !entry) {
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
      <AdminField label={tp("entryType")} htmlFor="ledger-type">
        <AdminSelect
          id="ledger-type"
          required
          value={form.type}
          onChange={(e) =>
            setForm((f) => ({ ...f, type: e.target.value as LedgerEntryType }))
          }
        >
          <option value="income">{tp("typeIncome")}</option>
          <option value="expense">{tp("typeExpense")}</option>
        </AdminSelect>
      </AdminField>

      <AdminField label={tp("amount")} htmlFor="ledger-amount">
        <input
          id="ledger-amount"
          type="number"
          min={1}
          required
          className={adminInputClassName}
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          placeholder="0"
        />
      </AdminField>

      <AdminField label={t("description")} htmlFor="ledger-description">
        <input
          id="ledger-description"
          required
          className={adminInputClassName}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
      </AdminField>

      <AdminField label={tp("date")} htmlFor="ledger-date">
        <AdminDatePicker
          id="ledger-date"
          value={form.date}
          onChange={(date) => setForm((f) => ({ ...f, date }))}
          placeholder={t("pickDate")}
        />
      </AdminField>

      <AdminField label={t("property")} htmlFor="ledger-property">
        <AdminSelect
          id="ledger-property"
          value={form.propertyId}
          onChange={(e) =>
            setForm((f) => ({ ...f, propertyId: e.target.value }))
          }
        >
          <option value="">{tp("noProperty")}</option>
          {properties.map((property) => (
            <option key={property.id} value={property.id}>
              {property.name}
            </option>
          ))}
        </AdminSelect>
      </AdminField>
    </AdminFormPage>
  );
}
