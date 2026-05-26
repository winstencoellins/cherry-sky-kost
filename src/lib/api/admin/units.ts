import { apiFetch } from "@/lib/api/client";
import type {
  ApiDataResponse,
  ApiListResponse,
  Unit,
  UnitStatus,
} from "@/lib/types/admin";

export async function listUnits(propertyId?: string): Promise<Unit[]> {
  const query = propertyId
    ? `?propertyId=${encodeURIComponent(propertyId)}`
    : "";
  const res = await apiFetch<ApiListResponse<Unit>>(`/admin/units${query}`);
  return res.data;
}

export async function listVacantUnits(params: {
  startDate: string;
  endDate: string;
  propertyId?: string;
}): Promise<Unit[]> {
  const search = new URLSearchParams({
    startDate: params.startDate,
    endDate: params.endDate,
  });
  if (params.propertyId) {
    search.set("propertyId", params.propertyId);
  }
  const res = await apiFetch<ApiListResponse<Unit>>(
    `/admin/units/vacant?${search.toString()}`,
  );
  return res.data;
}

export async function getUnit(id: string): Promise<Unit> {
  const res = await apiFetch<ApiDataResponse<Unit>>(`/admin/units/${id}`);
  return res.data;
}

export async function createUnit(input: {
  name: string;
  unitTypeId: string;
  floor?: number;
}): Promise<Unit> {
  const res = await apiFetch<ApiDataResponse<Unit>>("/admin/units", {
    method: "POST",
    body: input,
  });
  return res.data;
}

export async function updateUnit(
  id: string,
  input: Partial<{
    name: string;
    floor: number | null;
    status: UnitStatus;
  }>,
): Promise<Unit> {
  const res = await apiFetch<ApiDataResponse<Unit>>(`/admin/units/${id}`, {
    method: "PUT",
    body: input,
  });
  return res.data;
}

export async function deleteUnit(id: string): Promise<Unit> {
  const res = await apiFetch<ApiDataResponse<Unit>>(`/admin/units/${id}`, {
    method: "DELETE",
  });
  return res.data;
}
