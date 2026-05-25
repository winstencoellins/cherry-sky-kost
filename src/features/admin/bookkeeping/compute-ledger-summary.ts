import type { LedgerEntry, LedgerSummary } from "@/lib/types/admin";

export function computeLedgerSummary(entries: LedgerEntry[]): LedgerSummary {
  const income = entries
    .filter((e) => e.type === "income")
    .reduce((sum, e) => sum + e.amount, 0);
  const expense = entries
    .filter((e) => e.type === "expense")
    .reduce((sum, e) => sum + e.amount, 0);
  return { income, expense, net: income - expense };
}
