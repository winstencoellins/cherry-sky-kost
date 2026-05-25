"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { ADMIN_PROFILE_IMAGE } from "@/features/admin/constants/assets";
import { adminNavGroups } from "@/features/admin/constants/nav-items";
import { useAdminShell } from "@/features/admin/components/admin-shell-context";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

function isActivePath(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAdminShell();

  async function handleSignOut() {
    await authClient.signOut();
    onNavigate?.();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <>
      <Link
        href="/admin"
        onClick={onNavigate}
        className="mb-6 flex items-center gap-3 rounded-2xl px-2 py-1 transition-opacity hover:opacity-90"
      >
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5e3c] to-[#6f4627] shadow-lg shadow-[#6f4627]/25">
          <Icon name="apartment" size={24} filled className="text-white" />
        </div>
        <div>
          <p className="truncate text-base font-bold tracking-tight text-[#1a1c1a]">
            Sky Kost
          </p>
          <p className="text-xs font-medium text-[#8b5e3c]">Admin Suite</p>
        </div>
      </Link>

      <nav className="flex-1 space-y-6 overflow-y-auto pr-1">
        {adminNavGroups.map((group) => (
          <section key={group.id}>
            <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-[#83746b]/80">
              {t(group.labelKey)}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-[#6f4627] text-white shadow-md shadow-[#6f4627]/20"
                          : "text-[#51443c] hover:bg-[#efeeeb] hover:text-[#1a1c1a]",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                          active
                            ? "bg-white/15"
                            : "bg-[#efeeeb] group-hover:bg-white",
                        )}
                      >
                        <Icon
                          name={item.icon}
                          size={20}
                          filled={active}
                          className={active ? "text-white" : "text-[#6f4627]"}
                        />
                      </span>
                      <span className="truncate">{t(item.labelKey)}</span>
                      {active && (
                        <span className="ml-auto size-1.5 shrink-0 rounded-full bg-white/90" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </nav>

      <div className="mt-6 space-y-2 border-t border-[#e3e2e0] pt-5">
        <div className="flex items-center gap-3 rounded-2xl bg-[#f4f3f1] p-3">
          <div className="relative size-10 shrink-0 overflow-hidden rounded-full ring-2 ring-white">
            <Image
              src={user.avatar ?? ADMIN_PROFILE_IMAGE}
              alt={user.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#1a1c1a]">
              {user.name}
            </p>
            <p className="truncate text-xs text-[#83746b]">{user.email}</p>
          </div>
        </div>

        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#51443c] transition-colors hover:bg-[#efeeeb]"
        >
          <Icon name="settings" size={20} className="text-[#6f4627]" />
          {t("nav.settings")}
        </button>
        <button
          type="button"
          onClick={() => void handleSignOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#51443c] transition-colors hover:bg-[#ffdad6]/50 hover:text-[#ba1a1a]"
        >
          <Icon name="logout" size={20} />
          {t("nav.signOut")}
        </button>
      </div>
    </>
  );
}

export function AdminSidebar() {
  const { mobileOpen, setMobileOpen } = useAdminShell();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[280px] flex-col border-r border-[#e3e2e0]/80 bg-white/80 p-5 backdrop-blur-xl lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-50 bg-[#1a1c1a]/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,280px)] flex-col border-r border-[#e3e2e0] bg-white p-5 shadow-2xl transition-transform duration-300 ease-out lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
