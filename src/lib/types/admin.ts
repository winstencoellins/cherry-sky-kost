export type UnitStatus = "vacant" | "occupied";

export type LeaseStatus = "paid" | "unpaid" | "waiting_for_review";

export type LedgerEntryType = "income" | "expense";

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  createdById: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnitType {
  id: string;
  name: string;
  description: string | null;
  totalFloor: number | null;
  size: number | null;
  propertyId: string;
  property?: Property;
  createdById: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
  _count?: { units: number; pricings: number };
}

export interface UnitPricing {
  id: string;
  unitTypeId: string;
  propertyId: string;
  durationDays: number;
  price: number;
  unitType?: UnitType;
  property?: Property;
  createdById: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
  leases?: { id: string; status: LeaseStatus }[];
}

export interface UnitUserRef {
  id: string;
  name: string;
  email: string;
}

export interface TenantUser extends UnitUserRef {
  role: "tenant";
  emailVerified: boolean;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Unit {
  id: string;
  name: string;
  floor: number | null;
  status: UnitStatus;
  unitTypeId: string;
  propertyId: string;
  property?: Property;
  unitType?: UnitType;
  activeLease?: Lease | null;
  leases?: Lease[];
  createdById: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lease {
  id: string;
  status: LeaseStatus;
  startDate: string;
  endDate: string;
  unitId: string;
  userId: string;
  propertyId: string;
  unitPricingId: string;
  unit?: Unit & { property?: Property; unitType?: UnitType };
  user?: UnitUserRef;
  unitPricing?: UnitPricing;
  createdBy?: UnitUserRef;
  updatedBy?: UnitUserRef;
  createdById: string;
  updatedById: string;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerSummary {
  income: number;
  expense: number;
  net: number;
}

export interface LedgerEntry {
  id: string;
  type: LedgerEntryType;
  amount: number;
  description: string;
  category: string | null;
  date: string;
  propertyId: string | null;
  property?: Pick<Property, "id" | "name" | "city">;
  createdBy?: UnitUserRef;
  updatedBy?: UnitUserRef;
  createdById: string;
  updatedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiListResponse<T> {
  data: T[];
}

export interface ApiLedgerListResponse {
  data: LedgerEntry[];
  summary?: LedgerSummary;
}

export interface ApiDataResponse<T> {
  data: T;
}

export function isUnitOccupied(status: UnitStatus | string): boolean {
  return status.toLowerCase() === "occupied";
}
