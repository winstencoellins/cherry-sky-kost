"use client";

import { useTranslations } from "next-intl";
import { adminInputClassName } from "@/features/admin/components/admin-field";
import { useProperties } from "@/features/admin/hooks/use-admin-queries";

export function PropertyFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (propertyId: string) => void;
}) {
  const t = useTranslations("admin.crud");
  const { data: properties = [] } = useProperties();

  return (
    <select
      className={`${adminInputClassName} max-w-xs`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{t("allProperties")}</option>
      {properties.map((p) => (
        <option key={p.id} value={p.id}>
          {p.name}
        </option>
      ))}
    </select>
  );
}
