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

export async function listPublicProperties(): Promise<PublicPropertiesResponse> {
  try {
    return await apiFetch<PublicPropertiesResponse>("/public/properties");
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return apiFetch<PublicPropertiesResponse>("/properties");
    }
    throw error;
  }
}

export async function getPublicProperty(id: string): Promise<PublicPropertyResponse> {
  try {
    return await apiFetch<PublicPropertyResponse>(`/public/properties/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return apiFetch<PublicPropertyResponse>(`/properties/${id}`);
    }
    throw error;
  }
}

