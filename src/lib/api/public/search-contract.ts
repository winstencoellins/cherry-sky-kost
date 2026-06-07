import type { PublicSearchParams, PublicSearchSortBy } from "@/lib/api/public/search";
import type { SearchFilters } from "@/lib/types";

export const DEFAULT_SEARCH_PAGE_SIZE = 12;

/**
 * Initial load for /search-kosts → GET /public/search
 *
 * Example:
 *   GET /public/search?status=vacant&minPrice=500000&maxPrice=2500000&page=1&pageSize=12
 */
export const DEFAULT_PUBLIC_SEARCH_PARAMS: PublicSearchParams = {
  status: "vacant",
  minPrice: 500_000,
  maxPrice: 2_500_000,
  page: 1,
  pageSize: DEFAULT_SEARCH_PAGE_SIZE,
  sortBy: "property-asc",
};

/** Cleared filters — show all room types (no keyword, property, price, or status filter). */
export function createResetSearchFilters(): SearchFilters {
  return {
    availability: "all",
    sortBy: "property-asc",
    page: 1,
    pageSize: DEFAULT_SEARCH_PAGE_SIZE,
  };
}

/** Returns a fresh filters object (avoids shared-reference bugs on reset). */
export function createDefaultSearchFilters(): SearchFilters {
  return createResetSearchFilters();
}

/** UI defaults on the search page (sidebar + hero). */
export const DEFAULT_SEARCH_FILTERS = createDefaultSearchFilters();

const SORT_MAP: Record<NonNullable<SearchFilters["sortBy"]>, PublicSearchSortBy> = {
  "property-asc": "property-asc",
  "price-asc": "price-asc",
  "price-desc": "price-desc",
  newest: "newest",
};

/**
 * Maps frontend filter state → backend query params (DB-backed fields only).
 *
 * | UI field (SearchFilters) | API param      | DB / notes |
 * |--------------------------|----------------|------------|
 * | location                 | q              | unit.name, property.name/address/city, unitType.name |
 * | city                     | city           | property.city |
 * | propertyId               | propertyId     | unit.propertyId |
 * | unitTypeId               | unitTypeId     | unit.unitTypeId |
 * | availability=available   | status=vacant  | unit.status |
 * | priceMin                 | minPrice       | unit_pricing.price |
 * | priceMax                 | maxPrice       | unit_pricing.price |
 * | durationDays             | durationDays   | unit_pricing.durationDays |
 * | startDate + endDate      | startDate/endDate | lease overlap exclusion |
 * | page, pageSize           | page, pageSize | pagination |
 * | sortBy                   | sortBy         | server-side sort |
 */
export function searchFiltersToApiParams(
  filters: SearchFilters,
): PublicSearchParams {
  const params: PublicSearchParams = {};

  const q = (filters.location ?? "").trim();
  if (q) params.q = q;

  const city = (filters.city ?? "").trim();
  if (city) params.city = city;

  if (filters.propertyId) params.propertyId = filters.propertyId;
  if (filters.unitTypeId) params.unitTypeId = filters.unitTypeId;

  if (filters.priceMin !== undefined) params.minPrice = filters.priceMin;
  if (filters.priceMax !== undefined) params.maxPrice = filters.priceMax;

  if (filters.availability === "available") {
    params.status = "vacant";
  }

  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  if (filters.durationDays !== undefined) {
    params.durationDays = filters.durationDays;
  }

  if (filters.sortBy) {
    params.sortBy = SORT_MAP[filters.sortBy] ?? "property-asc";
  }

  params.page = filters.page ?? 1;
  params.pageSize = filters.pageSize ?? DEFAULT_SEARCH_PAGE_SIZE;

  return params;
}

/** Builds full URL for debugging / sharing with backend team. */
export function buildPublicSearchUrl(
  baseUrl: string,
  params: PublicSearchParams = DEFAULT_PUBLIC_SEARCH_PARAMS,
): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.city) search.set("city", params.city);
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
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.pageSize !== undefined) search.set("pageSize", String(params.pageSize));
  if (params.sortBy) search.set("sortBy", params.sortBy);
  const qs = search.toString();
  return `${baseUrl.replace(/\/$/, "")}/public/search${qs ? `?${qs}` : ""}`;
}
