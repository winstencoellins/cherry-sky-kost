import { cn } from "@/lib/utils";
import type { LeaseStatus, UnitStatus } from "@/lib/types/admin";

const unitStyles: Record<UnitStatus, string> = {
  vacant: "bg-emerald-50 text-emerald-700",
  occupied: "bg-blue-50 text-blue-700",
};

const leaseStyles: Record<LeaseStatus, string> = {
  paid: "bg-[#E6F4EA] text-[#137333]",
  unpaid: "bg-[#ffdad6] text-[#ba1a1a]",
  waiting_for_review: "bg-[#FEF7E0] text-[#B06000]",
};

const leaseLabels: Record<LeaseStatus, string> = {
  paid: "Paid",
  unpaid: "Unpaid",
  waiting_for_review: "Waiting for Review",
};

export function UnitStatusBadge({ status }: { status: UnitStatus | string }) {
  const key = status.toLowerCase() as UnitStatus;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize",
        unitStyles[key] ?? "bg-[#e3e2e0] text-[#51443c]",
      )}
    >
      {key}
    </span>
  );
}

export function LeaseStatusBadge({ status }: { status: LeaseStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        leaseStyles[status],
      )}
    >
      {leaseLabels[status]}
    </span>
  );
}
