import { useTranslations } from "next-intl";
import type { LedgerEntryType } from "@/lib/types/admin";
import { cn } from "@/lib/utils";

export function LedgerTypeBadge({ type }: { type: LedgerEntryType }) {
  const t = useTranslations("admin.pages.bookkeeping");
  const isIncome = type === "income";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold",
        isIncome
          ? "bg-[#E6F4EA] text-[#137333]"
          : "bg-[#ffdad6] text-[#ba1a1a]",
      )}
    >
      {isIncome ? t("typeIncome") : t("typeExpense")}
    </span>
  );
}
