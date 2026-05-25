import { apiFetch } from "@/lib/api/client";
import type {
  ApiDataResponse,
  ApiLedgerListResponse,
  LedgerEntry,
  LedgerEntryType,
} from "@/lib/types/admin";

export type LedgerEntryFilters = {
  propertyId?: string;
  type?: LedgerEntryType;
  from?: string;
  to?: string;
};

function buildQuery(filters?: LedgerEntryFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.propertyId) params.set("propertyId", filters.propertyId);
  if (filters.type) params.set("type", filters.type);
  if (filters.from) params.set("from", filters.from);
  if (filters.to) params.set("to", filters.to);
  const q = params.toString();
  return q ? `?${q}` : "";
}

export async function listLedgerEntries(
  filters?: LedgerEntryFilters,
): Promise<ApiLedgerListResponse> {
  return apiFetch<ApiLedgerListResponse>(
    `/admin/ledger-entries${buildQuery(filters)}`,
  );
}

export async function getLedgerEntry(id: string): Promise<LedgerEntry> {
  const res = await apiFetch<ApiDataResponse<LedgerEntry>>(
    `/admin/ledger-entries/${id}`,
  );
  return res.data;
}

export async function createLedgerEntry(input: {
  type: LedgerEntryType;
  amount: number;
  description: string;
  category?: string | null;
  date: string;
  propertyId?: string | null;
}): Promise<LedgerEntry> {
  const res = await apiFetch<ApiDataResponse<LedgerEntry>>(
    "/admin/ledger-entries",
    { method: "POST", body: input },
  );
  return res.data;
}

export async function updateLedgerEntry(
  id: string,
  input: Partial<{
    type: LedgerEntryType;
    amount: number;
    description: string;
    category: string | null;
    date: string;
    propertyId: string | null;
  }>,
): Promise<LedgerEntry> {
  const res = await apiFetch<ApiDataResponse<LedgerEntry>>(
    `/admin/ledger-entries/${id}`,
    { method: "PUT", body: input },
  );
  return res.data;
}

export async function deleteLedgerEntry(id: string): Promise<LedgerEntry> {
  const res = await apiFetch<ApiDataResponse<LedgerEntry>>(
    `/admin/ledger-entries/${id}`,
    { method: "DELETE" },
  );
  return res.data;
}
