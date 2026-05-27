import type { PublicSearchParams } from "@/lib/api/public/search";
import type { SearchFilters } from "@/lib/types";

/**
 * Initial load for /search-kosts → GET /public/search
 *
 * Example:
 *   GET /public/search?status=vacant&minPrice=500000&maxPrice=2500000
 */
export const DEFAULT_PUBLIC_SEARCH_PARAMS: PublicSearchParams = {
  status: "vacant",
  minPrice: 500_000,
  maxPrice: 2_500_000,
};

/** UI defaults on the search page (sidebar + hero). */
export const DEFAULT_SEARCH_FILTERS: SearchFilters = {
  availability: "available",
  priceMin: DEFAULT_PUBLIC_SEARCH_PARAMS.minPrice,
  priceMax: DEFAULT_PUBLIC_SEARCH_PARAMS.maxPrice,
};

/**
 * Maps frontend filter state → backend query params.
 *
 * | UI field (SearchFilters) | API param    | Notes |
 * |--------------------------|--------------|-------|
 * | location                 | q            | Free-text: unit, property, city, unit type |
 * | city                     | city         | Partial match on property city |
 * | availability=available   | status=vacant| Omit when availability is "all" |
 * | priceMin                 | minPrice     | Rupiah, smallest unit |
 * | priceMax                 | maxPrice     | Rupiah |
 * | durationDays             | durationDays | Only units with a package for this duration |
 * | startDate + endDate      | startDate, endDate | Both required together |
 * | (not in UI yet)          | propertyId   | Single property |
 * | (not in UI yet)          | unitTypeId   | Single unit type |
 *
 * Not sent to API (client-only today): bathroomType, facilities, sortBy
 */
export function searchFiltersToApiParams(
  filters: SearchFilters,
): PublicSearchParams {
  const params: PublicSearchParams = {};

  const q = (filters.location ?? "").trim();
  if (q) params.q = q;

  const city = (filters.city ?? "").trim();
  if (city) params.city = city;

  if (filters.priceMin !== undefined) params.minPrice = filters.priceMin;
  if (filters.priceMax !== undefined) params.maxPrice = filters.priceMax;

  if (filters.availability === "available") {
    params.status = "vacant";
  }

  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;

  // Only send when explicitly set — do NOT default to 30 (backend may only have 7/12-day packages).
  if (filters.durationDays !== undefined) {
    params.durationDays = filters.durationDays;
  }

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
  const qs = search.toString();
  return `${baseUrl.replace(/\/$/, "")}/public/search${qs ? `?${qs}` : ""}`;
}
