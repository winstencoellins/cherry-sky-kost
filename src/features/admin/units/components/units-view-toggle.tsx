"use client";

import { useTranslations } from "next-intl";
import { Icon } from "@/components/shared/Icon";
import { cn } from "@/lib/utils";

export type UnitsViewMode = "map" | "table";

export function UnitsViewToggle({
  value,
  onChange,
}: {
  value: UnitsViewMode;
  onChange: (mode: UnitsViewMode) => void;
}) {
  const t = useTranslations("admin.pages.units");

  const options: { mode: UnitsViewMode; icon: string; label: string }[] = [
    { mode: "map", icon: "grid_view", label: t("mapView") },
    { mode: "table", icon: "table_rows", label: t("tableView") },
  ];

  return (
    <div
      className="inline-flex rounded-xl border border-[#e3e2e0] bg-white/80 p-1 shadow-sm"
      role="tablist"
      aria-label={t("viewMode")}
    >
      {options.map(({ mode, icon, label }) => (
        <button
          key={mode}
          type="button"
          role="tab"
          aria-selected={value === mode}
          onClick={() => onChange(mode)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all",
            value === mode
              ? "bg-[#6f4627] text-white shadow-sm"
              : "text-[#51443c] hover:bg-[#f3f0eb]",
          )}
        >
          <Icon name={icon} size={18} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
