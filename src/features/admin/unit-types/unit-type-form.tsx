"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  AdminField,
  AdminFileInput,
  AdminSelect,
  AdminTextarea,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { AdminAttachmentsList } from "@/features/admin/components/admin-attachments-list";
import { AdminFormPage } from "@/features/admin/crud/admin-form-page";
import {
  useProperties,
  useUnitType,
  useUnitTypeMutations,
} from "@/features/admin/hooks/use-admin-queries";
import {
  deleteUnitTypeAttachment,
  uploadUnitTypeImage,
} from "@/lib/api/admin/attachments";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";
import { adminKeys } from "@/lib/query/keys";

const BASE = "/admin/unit-types";

type FormState = {
  name: string;
  description: string;
  propertyId: string;
  size: string;
};

const emptyForm: FormState = {
  name: "",
  description: "",
  propertyId: "",
  size: "",
};

export function UnitTypeForm({ id }: { id?: string }) {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.unitTypes");
  const ta = useTranslations("admin.attachments");
  const router = useRouter();
  const qc = useQueryClient();
  const isEdit = !!id;
  const { data: properties = [] } = useProperties();
  const { data: unitType, isLoading } = useUnitType(id ?? "", isEdit);
  const mutations = useUnitTypeMutations();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePending, setImagePending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  const attachments = unitType?.unitTypeAttachments ?? [];

  function invalidateUnitType() {
    void qc.invalidateQueries({ queryKey: adminKeys.unitTypes.all() });
    if (id) {
      void qc.invalidateQueries({ queryKey: adminKeys.unitTypes.detail(id) });
    }
  }

  useEffect(() => {
    if (unitType) {
      setForm({
        name: unitType.name,
        description: unitType.description ?? "",
        propertyId: unitType.propertyId,
        size: unitType.size != null ? String(unitType.size) : "",
      });
    }
  }, [unitType]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const size = form.size ? Number(form.size) : null;

    try {
      if (isEdit && id) {
        await mutations.update.mutateAsync({
          id,
          name: form.name,
          description: form.description,
          size,
        });
        showApiSuccess(t("updated"));
      } else {
        if (!form.propertyId) {
          setFormError(t("selectProperty"));
          return;
        }
        if (!form.description.trim()) {
          setFormError(t("descriptionRequired"));
          return;
        }
        await mutations.create.mutateAsync({
          name: form.name,
          propertyId: form.propertyId,
          description: form.description.trim(),
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
      await uploadUnitTypeImage(id, imageFile);
      showApiSuccess(tp("imageUploaded"));
      setImageFile(null);
      invalidateUnitType();
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
      await deleteUnitTypeAttachment(attachmentId);
      showApiSuccess(ta("deleted"));
      invalidateUnitType();
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
      <AdminField label={t("property")} htmlFor="ut-property" required>
        <AdminSelect
          id="ut-property"
          required
          disabled={isEdit}
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
        </AdminSelect>
      </AdminField>

      <AdminField label={t("name")} htmlFor="ut-name" required>
        <input
          id="ut-name"
          required
          className={adminInputClassName}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </AdminField>

      <AdminField label={t("description")} htmlFor="ut-desc" required>
        <AdminTextarea
          id="ut-desc"
          required
          placeholder={tp("descriptionPlaceholder")}
          value={form.description}
          onChange={(e) =>
            setForm((f) => ({ ...f, description: e.target.value }))
          }
        />
        <p className="mt-1 text-xs text-[#83746b]">{tp("descriptionHint")}</p>
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

      <AdminField label={tp("image")} htmlFor="ut-image">
        <AdminFileInput
          id="ut-image"
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
            <h3 className="text-sm font-bold text-[#1a1c1a]">{ta("title")}</h3>
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
