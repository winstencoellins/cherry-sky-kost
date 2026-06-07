"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { useRouter } from "@/i18n/routing";
import { AdminAlert } from "@/features/admin/components/admin-alert";
import { useAdminShell } from "@/features/admin/components/admin-shell-context";
import {
  AdminField,
  AdminSelect,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { AdminFormPage } from "@/features/admin/crud/admin-form-page";
import {
  useStaffUser,
  useStaffUserMutations,
} from "@/features/admin/hooks/use-admin-queries";
import {
  createStaffUserSchema,
  updateStaffUserSchema,
  type CreateStaffUserValues,
  type UpdateStaffUserValues,
} from "@/features/admin/staff/schemas";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";
import { ApiError } from "@/lib/api/errors";
import { UserRole } from "@/lib/types/auth";
import { cn } from "@/lib/utils";

const BASE = "/admin/staff";

const emptyCreateForm: CreateStaffUserValues = {
  name: "",
  email: "",
  password: "",
  role: "admin",
};

const emptyEditForm: UpdateStaffUserValues = {
  name: "",
  email: "",
  role: "admin",
};

export function StaffUserForm({ id }: { id?: string }) {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.staff");
  const router = useRouter();
  const { user: currentUser } = useAdminShell();
  const isEdit = !!id;
  const isSuperadmin = currentUser.role === UserRole.SUPERADMIN;
  const { data: staffUser, isLoading } = useStaffUser(id ?? "", isEdit);
  const mutations = useStaffUserMutations();
  const [form, setForm] = useState<CreateStaffUserValues | UpdateStaffUserValues>(
    isEdit ? emptyEditForm : emptyCreateForm,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (staffUser) {
      setForm({
        name: staffUser.name,
        email: staffUser.email,
        role: staffUser.role,
      });
    }
  }, [staffUser]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (isEdit && id) {
      const parsed = updateStaffUserSchema.safeParse(form);
      if (!parsed.success) {
        setFormError(parsed.error.issues[0]?.message ?? t("saveFailed"));
        return;
      }

      try {
        await mutations.update.mutateAsync({ id, ...parsed.data });
        showApiSuccess(t("updated"));
        router.push(BASE);
        router.refresh();
      } catch (err) {
        const msg =
          err instanceof ApiError && err.code === "CONFLICT"
            ? tp("emailExists")
            : err instanceof ApiError && err.code === "FORBIDDEN"
              ? tp("forbiddenAction")
              : getErrorMessage(err, t("saveFailed"));
        setFormError(msg);
        showApiError(err, msg);
      }
      return;
    }

    const parsed = createStaffUserSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? t("saveFailed"));
      return;
    }

    try {
      await mutations.create.mutateAsync(parsed.data);
      showApiSuccess(t("created"));
      router.push(BASE);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError && err.code === "CONFLICT"
          ? tp("emailExists")
          : err instanceof ApiError && err.code === "FORBIDDEN"
            ? tp("forbiddenAction")
            : getErrorMessage(err, t("saveFailed"));
      setFormError(msg);
      showApiError(err, msg);
    }
  }

  const pending = mutations.create.isPending || mutations.update.isPending;

  if (!isSuperadmin) {
    return (
      <div className="p-8">
        <AdminAlert message={tp("forbiddenAction")} />
      </div>
    );
  }

  if (isEdit && isLoading) {
    return (
      <p className="p-8 text-center text-sm text-[#83746b]">{t("loading")}</p>
    );
  }

  return (
    <AdminFormPage
      title={isEdit ? tp("editTitle") : tp("createTitle")}
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
      <AdminField label={t("name")} htmlFor="staff-name">
        <input
          id="staff-name"
          required
          autoComplete="name"
          className={adminInputClassName}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </AdminField>

      <AdminField label={t("email")} htmlFor="staff-email">
        <input
          id="staff-email"
          type="email"
          required
          autoComplete="email"
          className={adminInputClassName}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </AdminField>

      {!isEdit && (
        <AdminField label={tp("password")} htmlFor="staff-password">
          <div className="relative">
            <input
              id="staff-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              className={cn(adminInputClassName, "pr-10")}
              value={"password" in form ? form.password : ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#5f5e5e] transition-colors hover:text-[#6f4627]"
              aria-label={showPassword ? tp("hidePassword") : tp("showPassword")}
            >
              <Icon
                name={showPassword ? "visibility_off" : "visibility"}
                size={20}
              />
            </button>
          </div>
          <p className="mt-1 text-xs text-[#83746b]">{tp("passwordHint")}</p>
        </AdminField>
      )}

      <AdminField label={tp("role")} htmlFor="staff-role">
        <AdminSelect
          id="staff-role"
          required
          value={form.role}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              role: e.target.value as CreateStaffUserValues["role"],
            }))
          }
          disabled={!isSuperadmin}
        >
          <option value="admin">{tp("roles.admin")}</option>
          {isSuperadmin && (
            <option value="superadmin">{tp("roles.superadmin")}</option>
          )}
        </AdminSelect>
        {!isSuperadmin && (
          <p className="mt-1 text-xs text-[#83746b]">{tp("roleHint")}</p>
        )}
      </AdminField>
    </AdminFormPage>
  );
}
