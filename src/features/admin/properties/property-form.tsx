"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminField,
  AdminFileInput,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { AdminAttachmentsList } from "@/features/admin/components/admin-attachments-list";
import { AdminFormPage } from "@/features/admin/crud/admin-form-page";
import {
  useProperty,
  usePropertyMutations,
} from "@/features/admin/hooks/use-admin-queries";
import {
  deletePropertyAttachment,
  uploadPropertyImage,
} from "@/lib/api/admin/attachments";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";
import { adminKeys } from "@/lib/query/keys";

const BASE = "/admin/properties";

type FormState = { name: string; address: string; city: string };

const emptyForm: FormState = { name: "", address: "", city: "" };

export function PropertyForm({ id }: { id?: string }) {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.properties");
  const ta = useTranslations("admin.attachments");
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!id;
  const { data: property, isLoading } = useProperty(id ?? "", isEdit);
  const mutations = usePropertyMutations();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePending, setImagePending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const attachments = property?.propertyAttachments ?? [];

  function invalidateProperty() {
    void qc.invalidateQueries({ queryKey: adminKeys.properties.all() });
    if (id) {
      void qc.invalidateQueries({ queryKey: adminKeys.properties.detail(id) });
    }
  }

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

  async function handleImageUpload() {
    if (!isEdit || !id) {
      setImageError(tp("saveFirstToUpload"));
      return;
    }
    if (!imageFile) {
      setImageError(tp("imageRequired"));
      return;
    }

    setImageError(null);
    setImagePending(true);
    try {
      await uploadPropertyImage(id, imageFile);
      showApiSuccess(tp("imageUploaded"));
      setImageFile(null);
      invalidateProperty();
    } catch (err) {
      const msg = getErrorMessage(err, tp("imageUploadFailed"));
      setImageError(msg);
      showApiError(err, msg);
    } finally {
      setImagePending(false);
    }
  }

  async function handleDeleteAttachment(attachmentId: string) {
    setDeletePending(true);
    try {
      await deletePropertyAttachment(attachmentId);
      showApiSuccess(ta("deleted"));
      invalidateProperty();
    } catch (err) {
      showApiError(err, ta("deleteFailed"));
      throw err;
    } finally {
      setDeletePending(false);
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
      <AdminField label={tp("image")} htmlFor="prop-image">
        <AdminFileInput
          id="prop-image"
          file={imageFile}
          onFileChange={setImageFile}
        />
        <p className="mt-1 text-xs text-[#83746b]">{tp("imageHint")}</p>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => void handleImageUpload()}
            disabled={imagePending}
            className="rounded-lg border border-[#6f4627] bg-[#faf9f6] px-3 py-1.5 text-sm font-semibold text-[#6f4627] transition-colors hover:bg-[#efeeeb] disabled:opacity-50"
          >
            {imagePending ? tp("uploadingImage") : tp("uploadImage")}
          </button>
          {!isEdit ? (
            <span className="text-xs text-[#83746b]">{tp("saveFirstToUpload")}</span>
          ) : null}
        </div>
        {imageError ? (
          <p className="mt-1 text-xs text-[#ba1a1a]">{imageError}</p>
        ) : null}
      </AdminField>

      {isEdit ? (
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#1a1c1a]">
              {ta("title")}
            </h3>
            <p className="text-xs text-[#83746b]">{ta("subtitle")}</p>
          </div>
          <AdminAttachmentsList
            attachments={attachments}
            onDelete={handleDeleteAttachment}
            deletePending={deletePending}
          />
        </div>
      ) : null}
    </AdminFormPage>
  );
}
