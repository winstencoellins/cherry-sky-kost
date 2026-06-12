import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";

export interface PublicAttachment {
  id: string;
  url: string;
}

export interface PublicPricing {
  id: string;
  durationDays: number;
  price: number;
}

export interface PublicUnit {
  id: string;
  name: string;
  maxOccupancy: number | null;
  status: "vacant" | "occupied";
}

export interface PublicUnitType {
  id: string;
  name: string;
  description: string | null;
  size: number | null;
  unitTypeAttachments?: PublicAttachment[];
  pricings: PublicPricing[];
  units: PublicUnit[];
}

export interface PublicProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  propertyAttachments?: PublicAttachment[];
  unitTypes: PublicUnitType[];
}

export interface PublicPropertiesResponse {
  data: PublicProperty[];
}

export interface PublicPropertyResponse {
  data: PublicProperty;
}

function unwrapList<T>(payload: { data: T[] } | T[] | null | undefined): T[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  return payload.data ?? [];
}

function unwrapItem<T>(payload: { data: T } | T | null | undefined): T | null {
  if (!payload) return null;
  if (
    typeof payload === "object" &&
    "data" in payload &&
    payload.data != null &&
    !Array.isArray(payload.data)
  ) {
    return payload.data as T;
  }
  return payload as T;
}

export async function listPublicProperties(): Promise<PublicProperty[]> {
  try {
    const res = await apiFetch<PublicPropertiesResponse | PublicProperty[]>(
      "/public/properties",
    );
    return unwrapList(res);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      const fallback = await apiFetch<PublicPropertiesResponse | PublicProperty[]>(
        "/properties",
      );
      return unwrapList(fallback);
    }
    throw error;
  }
}

export async function getPublicProperty(id: string): Promise<PublicProperty> {
  try {
    const res = await apiFetch<PublicPropertyResponse | PublicProperty>(
      `/public/properties/${id}`,
    );
    const property = unwrapItem(res);
    if (!property) {
      throw new ApiError("NOT_FOUND", "Property not found", 404);
    }
    return property;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      const fallback = await apiFetch<PublicPropertyResponse | PublicProperty>(
        `/properties/${id}`,
      );
      const property = unwrapItem(fallback);
      if (!property) {
        throw new ApiError("NOT_FOUND", "Property not found", 404);
      }
      return property;
    }
    throw error;
  }
}

