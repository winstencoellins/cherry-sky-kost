const LEASES_BASE = "/admin/leases";

export function buildCreateLeaseHref(
  unitId: string,
  startDate?: string,
): string {
  const params = new URLSearchParams({ unitId });
  if (startDate) params.set("startDate", startDate);
  return `${LEASES_BASE}/new?${params.toString()}`;
}

export function buildViewLeaseHref(leaseId: string): string {
  return `${LEASES_BASE}/${leaseId}/edit`;
}
