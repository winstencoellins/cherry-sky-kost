import type { Lease, LedgerEntry } from "@/lib/types/admin";

function parseDateOnly(iso: string): Date {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Full rent amount for a paid lease once it has started (startDate ≤ today). */
export function calculatePaidLeaseIncome(
  lease: Lease,
  asOf: Date = new Date(),
): number {
  if (lease.status !== "paid") return 0;

  const price = lease.unitPricing?.price ?? 0;
  if (price <= 0) return 0;

  const start = parseDateOnly(lease.startDate);
  const today = startOfDay(asOf);
  if (today < start) return 0;

  return price;
}

export function sumPaidLeaseIncome(leases: Lease[], asOf?: Date): number {
  return leases.reduce(
    (sum, lease) => sum + calculatePaidLeaseIncome(lease, asOf),
    0,
  );
}

export function isLeaseIncomeEntry(id: string): boolean {
  return id.startsWith("lease-income-");
}

export function leaseToIncomeEntry(
  lease: Lease,
  description: string,
): LedgerEntry | null {
  const amount = calculatePaidLeaseIncome(lease);
  if (amount <= 0) return null;

  const property = lease.property ?? lease.unit?.property;

  return {
    id: `lease-income-${lease.id}`,
    type: "income",
    amount,
    description,
    category: null,
    date: lease.startDate,
    propertyId: lease.propertyId,
    property: property
      ? { id: property.id, name: property.name, city: property.city }
      : undefined,
    createdById: lease.createdById,
    updatedById: lease.updatedById,
    createdAt: lease.createdAt,
    updatedAt: lease.updatedAt,
  };
}
