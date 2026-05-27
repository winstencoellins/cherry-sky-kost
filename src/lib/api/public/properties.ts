import { apiFetch } from "@/lib/api/client";

export interface PublicPricing {
  id: string;
  durationDays: number;
  price: number;
}

export interface PublicUnit {
  id: string;
  name: string;
  floor: number;
  status: "vacant" | "occupied";
}

export interface PublicUnitType {
  id: string;
  name: string;
  description: string | null;
  totalFloor: number | null;
  size: number | null;
  pricings: PublicPricing[];
  units: PublicUnit[];
}

export interface PublicProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  unitTypes: PublicUnitType[];
}

export interface PublicPropertiesResponse {
  data: PublicProperty[];
}

export interface PublicPropertyResponse {
  data: PublicProperty;
}

export async function listPublicProperties(): Promise<PublicPropertiesResponse> {
  return apiFetch<PublicPropertiesResponse>("/public/properties");
}

export async function getPublicProperty(id: string): Promise<PublicPropertyResponse> {
  return apiFetch<PublicPropertyResponse>(`/public/properties/${id}`);
}

