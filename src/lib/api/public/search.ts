import { apiFetch } from "@/lib/api/client";
import type { PublicPricing } from "@/lib/api/public/properties";

export interface PublicSearchProperty {
  id: string;
  name: string;
  address: string;
  city: string;
}

export interface PublicSearchUnitType {
  id: string;
  name: string;
  description: string | null;
  totalFloor: number | null;
  size: number | null;
  pricings: PublicPricing[];
}

export interface PublicSearchUnit {
  id: string;
  name: string;
  floor: number;
  status: "vacant" | "occupied";
  property: PublicSearchProperty;
  unitType: PublicSearchUnitType;
}

export interface PublicSearchParams {
  q?: string;
  city?: string;
  propertyId?: string;
  unitTypeId?: string;
  status?: "vacant" | "occupied";
  startDate?: string;
  endDate?: string;
  minPrice?: number;
  maxPrice?: number;
  durationDays?: number;
}

export interface PublicSearchResponse {
  data: PublicSearchUnit[];
  meta: {
    total: number;
  };
}

function buildQueryString(params: PublicSearchParams): string {
  const search = new URLSearchParams();

  if (params.q?.trim()) search.set("q", params.q.trim());
  if (params.city?.trim()) search.set("city", params.city.trim());
  if (params.propertyId) search.set("propertyId", params.propertyId);
  if (params.unitTypeId) search.set("unitTypeId", params.unitTypeId);
  if (params.status) search.set("status", params.status);
  if (params.startDate) search.set("startDate", params.startDate);
  if (params.endDate) search.set("endDate", params.endDate);
  if (params.minPrice !== undefined) search.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) search.set("maxPrice", String(params.maxPrice));
  if (params.durationDays !== undefined) {
    search.set("durationDays", String(params.durationDays));
  }

  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function searchPublicUnits(
  params: PublicSearchParams = {},
): Promise<PublicSearchResponse> {
  return apiFetch<PublicSearchResponse>(`/public/search${buildQueryString(params)}`);
}
