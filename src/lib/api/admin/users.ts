import { apiFetch } from "@/lib/api/client";
import type { ApiDataResponse, ApiListResponse, TenantUser } from "@/lib/types/admin";

export async function listTenantUsers(search?: string): Promise<TenantUser[]> {
  const query = search?.trim()
    ? `?${new URLSearchParams({ search: search.trim() })}`
    : "";
  const res = await apiFetch<ApiListResponse<TenantUser>>(
    `/admin/users${query}`,
  );
  return res.data;
}

export async function getTenantUser(id: string): Promise<TenantUser> {
  const res = await apiFetch<ApiDataResponse<TenantUser>>(
    `/admin/users/${id}`,
  );
  return res.data;
}
