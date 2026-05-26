"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { Link, usePathname } from "@/i18n/routing";
import { ADMIN_PROFILE_IMAGE } from "@/features/admin/constants/assets";
import { tenantNavItems } from "@/features/tenant/constants/nav-items";
import { useTenantShell } from "@/features/tenant/components/tenant-shell-context";
import { cn } from "@/lib/utils";

export function TenantHeader() {
  const t = useTranslations("tenant");
  const th = useTranslations("tenant.header");
  const pathname = usePathname();
  const { user, toggleMobile } = useTenantShell();

  const activeItem =
    tenantNavItems.find(
      (item) =>
        pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? tenantNavItems[0];

  const pageTitle = t(activeItem.labelKey);

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

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[#83746b]">{th("breadcrumb")}</p>
          <h1 className="truncate text-lg font-semibold tracking-tight text-[#1a1c1a]">
            {pageTitle}
          </h1>
        </div>

        <Link
          href="/tenant/profile"
          className={cn(
            "flex shrink-0 items-center gap-2.5 rounded-xl py-1.5 pl-1.5 pr-3 transition-colors hover:bg-[#f4f3f1]",
          )}
        >
          <div className="relative size-9 overflow-hidden rounded-full ring-2 ring-[#e3e2e0]">
            <Image
              src={user.avatar ?? ADMIN_PROFILE_IMAGE}
              alt={user.name}
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <span className="hidden text-left md:block">
            <span className="block max-w-[120px] truncate text-sm font-semibold text-[#1a1c1a]">
              {user.name}
            </span>
            <span className="block text-xs text-[#83746b]">{th("roleTenant")}</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
