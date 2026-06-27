"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { ProfileAvatarPlaceholder } from "@/components/shared/profile-avatar-placeholder";
import { Link, usePathname } from "@/i18n/routing";
import { adminNavItems } from "@/features/admin/constants/nav-items";
import { useAdminShell } from "@/features/admin/components/admin-shell-context";
import { UserRole } from "@/lib/types/auth";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const t = useTranslations("admin");
  const th = useTranslations("admin.header");
  const pathname = usePathname();
  const { user, toggleMobile } = useAdminShell();

  const activeItem =
    adminNavItems.find((item) =>
      item.href === "/admin"
        ? pathname === "/admin"
        : pathname.startsWith(item.href),
    ) ?? adminNavItems[0];

  const tenantDetailMatch = pathname.match(/^\/admin\/users\/([^/]+)$/);
  const tenantDetailId = tenantDetailMatch?.[1];
  const isTenantDetail = Boolean(tenantDetailId && tenantDetailId !== "new");

  const pageTitle = pathname.startsWith("/admin/profile")
    ? t("pages.profile.title")
    : isTenantDetail
      ? t("pages.users.detailTitle")
      : t(activeItem.labelKey);

  const roleLabel =
    user.role === UserRole.SUPERADMIN
      ? t("pages.staff.roles.superadmin")
      : t("pages.staff.roles.admin");

  return (
    <header className="sticky top-0 z-40 border-b border-[#e3e2e0]/60 bg-white/70 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-8">
        <button
          type="button"
          onClick={toggleMobile}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#e3e2e0] bg-white text-[#51443c] transition-colors hover:bg-[#f4f3f1] lg:hidden"
          aria-label={th("openMenu")}
        >
          <Icon name="menu" size={22} />
        </button>

        <div className="min-w-0 flex-1 flex-col sm:flex">
          <p className="text-xs font-medium text-[#83746b]">{th("breadcrumb")}</p>
          <h1 className="truncate text-lg font-semibold tracking-tight text-[#1a1c1a]">
            {pageTitle}
          </h1>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <LanguageSwitcher variant="navbar" isSolid />

          <button
            type="button"
            className="relative flex size-10 items-center justify-center rounded-xl text-[#51443c] transition-colors hover:bg-[#f4f3f1]"
            aria-label={th("notifications")}
          >
            <Icon name="notifications" size={22} />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-[#ba1a1a] ring-2 ring-white" />
          </button>

          <div className="hidden h-8 w-px bg-[#e3e2e0] sm:block" />

          <Link
            href="/admin/profile"
            className={cn(
              "flex items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 transition-colors hover:bg-[#f4f3f1]",
            )}
          >
            <ProfileAvatarPlaceholder
              className="size-9 ring-2 ring-[#e3e2e0]"
              iconSize={20}
              label={user.name}
            />            <span className="hidden text-left md:block">
              <span className="block max-w-[120px] truncate text-sm font-semibold text-[#1a1c1a]">
                {user.name}
              </span>
              <span className="block text-xs text-[#83746b]">{roleLabel}</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

