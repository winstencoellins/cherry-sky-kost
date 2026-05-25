import { apiFetch } from "@/lib/api/client";
import type {
  ApiDataResponse,
  ApiListResponse,
  UnitType,
} from "@/lib/types/admin";

export async function listUnitTypes(propertyId?: string): Promise<UnitType[]> {
  const query = propertyId
    ? `?propertyId=${encodeURIComponent(propertyId)}`
    : "";
  const res = await apiFetch<ApiListResponse<UnitType>>(
    `/admin/unit-types${query}`,
  );
  return res.data;
}

export async function getUnitType(id: string): Promise<UnitType> {
  const res = await apiFetch<ApiDataResponse<UnitType>>(
    `/admin/unit-types/${id}`,
  );
  return res.data;
}

export async function createUnitType(input: {
  name: string;
  propertyId: string;
  description?: string | null;
  totalFloor?: number | null;
  size?: number | null;
}): Promise<UnitType> {
  const res = await apiFetch<ApiDataResponse<UnitType>>("/admin/unit-types", {
    method: "POST",
    body: input,
  });
  return res.data;
}

export async function updateUnitType(
  id: string,
  input: Partial<{
    name: string;
    description: string | null;
    totalFloor: number | null;
    size: number | null;
  }>,
): Promise<UnitType> {
  const res = await apiFetch<ApiDataResponse<UnitType>>(
    `/admin/unit-types/${id}`,
    { method: "PUT", body: input },
  );
  return res.data;
}

export async function deleteUnitType(id: string): Promise<UnitType> {
  const res = await apiFetch<ApiDataResponse<UnitType>>(
    `/admin/unit-types/${id}`,
    { method: "DELETE" },
  );
  return res.data;
}
