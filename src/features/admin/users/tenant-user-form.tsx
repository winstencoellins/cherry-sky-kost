"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { useRouter } from "@/i18n/routing";
import {
  AdminField,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { AdminFormPage } from "@/features/admin/crud/admin-form-page";
import { useTenantUserMutations } from "@/features/admin/hooks/use-admin-queries";
import {
  createTenantUserSchema,
  type CreateTenantUserValues,
} from "@/features/admin/users/schemas";
import { getErrorMessage } from "@/features/admin/lib/errors";
import { showApiError, showApiSuccess } from "@/features/admin/lib/show-api-error";
import { ApiError } from "@/lib/api/errors";
import { cn } from "@/lib/utils";

const BASE = "/admin/users";

const emptyForm: CreateTenantUserValues = {
  name: "",
  email: "",
  password: "",
};

export function TenantUserForm() {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.users");
  const router = useRouter();
  const mutations = useTenantUserMutations();
  const [form, setForm] = useState<CreateTenantUserValues>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const parsed = createTenantUserSchema.safeParse(form);
    if (!parsed.success) {
      setFormError(parsed.error.issues[0]?.message ?? t("saveFailed"));
      return;
    }

    try {
      const created = await mutations.create.mutateAsync(parsed.data);
      showApiSuccess(t("created"));
      router.push(`${BASE}/${created.id}`);
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError && err.code === "CONFLICT"
          ? tp("emailExists")
          : getErrorMessage(err, t("saveFailed"));
      setFormError(msg);
      showApiError(err, msg);
    }
  }

  const pending = mutations.create.isPending;

  return (
    <AdminFormPage
      title={tp("createTitle")}
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
      <AdminField label={t("name")} htmlFor="tenant-name" required>
        <input
          id="tenant-name"
          required
          autoComplete="name"
          className={adminInputClassName}
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </AdminField>
      <AdminField label={t("email")} htmlFor="tenant-email" required>
        <input
          id="tenant-email"
          type="email"
          required
          autoComplete="email"
          className={adminInputClassName}
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </AdminField>
      <AdminField label={tp("password")} htmlFor="tenant-password" required>
        <div className="relative">
          <input
            id="tenant-password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="new-password"
            className={cn(adminInputClassName, "pr-10")}
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
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
    </AdminFormPage>
  );
}
