"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AdminSearchInput,
  adminInputClassName,
} from "@/features/admin/components/admin-field";
import { TenantQuickCreateDialog } from "@/features/admin/users/tenant-quick-create-dialog";
import {
  useTenantUser,
  useTenantUsers,
} from "@/features/admin/hooks/use-admin-queries";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import type { TenantUser } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

function formatTenantLabel(tenant: Pick<TenantUser, "name" | "email">) {
  return `${tenant.name} (${tenant.email})`;
}

function looksLikeEmail(value: string) {
  return value.includes("@");
}

type TenantComboboxProps = {
  id?: string;
  value: string;
  onChange: (userId: string, tenant?: TenantUser) => void;
  disabled?: boolean;
  required?: boolean;
};

export function TenantCombobox({
  id,
  value,
  onChange,
  disabled = false,
  required = false,
}: TenantComboboxProps) {
  const t = useTranslations("admin.crud");
  const tp = useTranslations("admin.pages.users");
  const tl = useTranslations("admin.pages.leases");
  const listboxId = useId();
  const searchRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<TenantUser | null>(null);

  const debouncedSearch = useDebouncedValue(search, 300);
  const { data: tenants = [], isLoading, isFetching } = useTenantUsers(
    debouncedSearch.trim() || undefined,
    { enabled: open },
  );
  const { data: resolvedTenant } = useTenantUser(value, !!value);

  const displayTenant = useMemo(() => {
    if (selectedTenant?.id === value) return selectedTenant;
    if (resolvedTenant) return resolvedTenant;
    return tenants.find((tenant) => tenant.id === value) ?? null;
  }, [selectedTenant, resolvedTenant, tenants, value]);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      const timer = window.setTimeout(() => searchRef.current?.focus(), 0);
      return () => window.clearTimeout(timer);
    }
    setSearch("");
    setActiveIndex(0);
  }, [open]);

  function handleSelect(tenant: TenantUser) {
    setSelectedTenant(tenant);
    onChange(tenant.id, tenant);
    setOpen(false);
  }

  function handleCreated(tenant: TenantUser) {
    setSelectedTenant(tenant);
    onChange(tenant.id, tenant);
    setOpen(false);
  }

  function openCreateDialog() {
    setOpen(false);
    setCreateOpen(true);
  }

  const createDefaults = useMemo(() => {
    const trimmed = search.trim();
    if (!trimmed) return { name: "", email: "" };
    if (looksLikeEmail(trimmed)) {
      return { name: "", email: trimmed };
    }
    return { name: trimmed, email: "" };
  }, [search]);

  if (disabled) {
    return (
      <input
        id={id}
        readOnly
        disabled
        className={adminInputClassName}
        value={displayTenant ? formatTenantLabel(displayTenant) : value}
      />
    );
  }

  const showLoading = isLoading || (isFetching && tenants.length === 0);
  const emptyMessage = debouncedSearch.trim()
    ? tl("noTenantsMatch")
    : tp("empty");

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            className={cn(
              adminInputClassName,
              "relative flex h-10 cursor-pointer items-center pr-10 text-left",
              !displayTenant && "text-[#83746b]/60",
            )}
          >
            <span className="truncate">
              {displayTenant
                ? formatTenantLabel(displayTenant)
                : t("selectTenant")}
            </span>
            <span
              className="pointer-events-none absolute inset-y-0 right-0 flex w-9 items-center justify-center text-[#83746b]"
              aria-hidden
            >
              <Icon name="expand_more" size={20} />
            </span>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] min-w-[18rem] p-0"
          align="start"
        >
          <div className="border-b border-[#e3e2e0] p-2">
            <AdminSearchInput
              ref={searchRef}
              value={search}
              onChange={setSearch}
              placeholder={tp("searchPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.min(i + 1, tenants.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActiveIndex((i) => Math.max(i - 1, 0));
                } else if (e.key === "Enter" && tenants[activeIndex]) {
                  e.preventDefault();
                  handleSelect(tenants[activeIndex]);
                } else if (e.key === "Escape") {
                  setOpen(false);
                }
              }}
            />
          </div>

          <ul
            id={listboxId}
            role="listbox"
            className="max-h-56 overflow-y-auto p-1"
          >
            {showLoading ? (
              <li className="px-3 py-6 text-center text-sm text-[#83746b]">
                {t("loading")}
              </li>
            ) : tenants.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-[#83746b]">
                {emptyMessage}
              </li>
            ) : (
              tenants.map((tenant, index) => {
                const isSelected = tenant.id === value;
                const isActive = index === activeIndex;

                return (
                  <li key={tenant.id} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => handleSelect(tenant)}
                      className={cn(
                        "flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                        isActive || isSelected
                          ? "bg-[#f4ebe3] text-[#1a1c1a]"
                          : "text-[#51443c] hover:bg-[#faf9f6]",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {tenant.name}
                        </span>
                        <span className="block truncate text-xs text-[#83746b]">
                          {tenant.email}
                        </span>
                      </span>
                      {!tenant.isActive && (
                        <span className="shrink-0 text-xs text-[#ba1a1a]">
                          {tp("statusInactive")}
                        </span>
                      )}
                      {isSelected && (
                        <Icon
                          name="check"
                          size={18}
                          className="shrink-0 text-[#6f4627]"
                        />
                      )}
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          <div className="border-t border-[#e3e2e0] p-2">
            <Button
              type="button"
              variant="ghost"
              className="h-9 w-full justify-start gap-2 text-[#6f4627] hover:bg-[#f4ebe3] hover:text-[#6f4627]"
              onClick={openCreateDialog}
            >
              <Icon name="person_add" size={18} />
              {tl("addNewTenant")}
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <input
        type="hidden"
        name={id ? `${id}-value` : undefined}
        value={value}
        required={required}
        tabIndex={-1}
        aria-hidden
        onChange={() => {}}
      />

      <TenantQuickCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreated={handleCreated}
        initialName={createDefaults.name}
        initialEmail={createDefaults.email}
      />
    </>
  );
}
