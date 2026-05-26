"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { AdminAlert } from "@/features/admin/components/admin-alert";
import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { AdminPagination } from "@/features/admin/components/admin-pagination";
import { AdminTableShell } from "@/features/admin/components/admin-table-shell";
import {
  AdminCrudTable,
  AdminCrudTableCell,
  AdminCrudTableRow,
} from "@/features/admin/crud/admin-crud-table";
import { useClientPagination } from "@/features/admin/crud/use-client-pagination";
import { TenantResetPasswordDialog } from "@/features/admin/users/tenant-reset-password-dialog";
import { useTenantUsers } from "@/features/admin/hooks/use-admin-queries";
import { formatDate } from "@/features/admin/lib/format";
import { getErrorMessage } from "@/features/admin/lib/errors";
import type { TenantUser } from "@/lib/types/admin";

const BASE = "/admin/users";

export function UsersList() {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.users");
  const [search, setSearch] = useState("");
  const [resetUser, setResetUser] = useState<TenantUser | null>(null);
  const { data = [], isLoading, error } = useTenantUsers(search || undefined);

  const { page, setPage, pageData, total, pageSize } = useClientPagination(data);

  return (
    <>
      <AdminPageHeader
        title={tp("title")}
        description={tp("description")}
        primaryAction={{
          label: t("add"),
          href: `${BASE}/new`,
          icon: "add",
        }}
      />

      <div className="relative mb-4 max-w-md">
        <Icon
          name="search"
          size={20}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#83746b]"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder={tp("searchPlaceholder")}
          className="h-10 w-full rounded-xl border border-[#e3e2e0] bg-white/80 pl-10 pr-4 text-sm outline-none focus:border-[#8b5e3c]/50 focus:ring-2 focus:ring-[#8b5e3c]/15"
        />
      </div>

      {error && (
        <div className="mb-4">
          <AdminAlert message={getErrorMessage(error, t("loadFailed"))} />
        </div>
      )}

      <AdminTableShell
        footer={
          !isLoading && total > 0 ? (
            <AdminPagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
            />
          ) : undefined
        }
      >
        {isLoading ? (
          <p className="p-8 text-center text-sm text-[#83746b]">{t("loading")}</p>
        ) : data.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#83746b]">{tp("empty")}</p>
        ) : (
          <AdminCrudTable
            columns={[
              { key: "name", label: t("name") },
              { key: "email", label: t("email") },
              { key: "joined", label: tp("joined") },
              { key: "actions", label: t("actions"), align: "right" },
            ]}
          >
            {pageData.map((user) => (
              <AdminCrudTableRow key={user.id} className="group">
                <AdminCrudTableCell className="font-semibold">
                  {user.name}
                </AdminCrudTableCell>
                <AdminCrudTableCell className="text-[#51443c]">
                  {user.email}
                </AdminCrudTableCell>
                <AdminCrudTableCell className="text-[#51443c]">
                  {formatDate(user.createdAt)}
                </AdminCrudTableCell>
                <AdminCrudTableCell align="right">
                  <button
                    type="button"
                    onClick={() => setResetUser(user)}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#6f4627] transition-colors hover:bg-[#efeeeb]"
                    aria-label={tp("resetPassword")}
                  >
                    <Icon name="lock_reset" size={18} />
                    {tp("resetPassword")}
                  </button>
                </AdminCrudTableCell>
              </AdminCrudTableRow>
            ))}
          </AdminCrudTable>
        )}
      </AdminTableShell>

      <TenantResetPasswordDialog
        user={resetUser}
        open={resetUser !== null}
        onOpenChange={(open) => !open && setResetUser(null)}
      />
    </>
  );
}
