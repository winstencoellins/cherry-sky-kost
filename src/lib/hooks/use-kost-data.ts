/**
 * React hooks for fetching kost data
 * Public-facing property catalogue (read-only)
 */

'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Kost, SearchFilters, SearchUnitTypeResult } from '../types';
import {
    getPublicProperty,
    listPublicProperties,
    type PublicPricing,
    type PublicProperty,
} from '@/lib/api/public/properties';
import { searchFiltersToApiParams } from '@/lib/api/public/search-contract';
import {
    searchPublicUnits,
    type PublicSearchUnit,
} from '@/lib/api/public/search';
import { publicKeys } from '@/lib/query/keys';

function toSlug(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function mapRoomTypePricings(pricings: PublicPricing[] | undefined) {
    return (pricings ?? [])
        .filter((p) => Number.isFinite(p.price))
        .sort((a, b) => a.durationDays - b.durationDays)
        .map((p) => ({
            id: p.id,
            durationDays: p.durationDays,
            price: p.price,
        }));
}

const FALLBACK_THUMBNAILS = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=800&fit=crop',
];

function mapPublicPropertyToKost(property: PublicProperty, index: number): Kost {
    const allPricings = property.unitTypes.flatMap((ut) => ut.pricings ?? []);
    const prices = allPricings.map((p) => p.price).filter((p) => Number.isFinite(p));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    const totalRooms = property.unitTypes.reduce((sum, ut) => sum + (ut.units?.length ?? 0), 0);
    const availableRooms = property.unitTypes.reduce(
        (sum, ut) => sum + (ut.units ?? []).filter((u) => u.status === 'vacant').length,
        0,
    );

    const propertyImageUrls =
        property.propertyAttachments?.map((a) => a.url).filter(Boolean) ?? [];

    const roomTypes = property.unitTypes.map((ut) => {
        const utPrices = (ut.pricings ?? []).map((p) => p.price).filter((p) => Number.isFinite(p));
        const price = utPrices.length > 0 ? Math.min(...utPrices) : minPrice;
        const totalCount = ut.units?.length ?? 0;
        const availableCount = (ut.units ?? []).filter((u) => u.status === 'vacant').length;
        const unitTypeImages =
            ut.unitTypeAttachments?.map((a) => a.url).filter(Boolean) ?? [];

        const roomPricings = mapRoomTypePricings(ut.pricings);

        return {
            id: ut.id,
            name: ut.name,
            price,
            pricings: roomPricings.length > 0 ? roomPricings : undefined,
            bathroomType: 'bersama' as const,
            capacity: '1 orang',
            size: ut.size ?? undefined,
            availableCount,
            totalCount,
            status: availableCount > 0 ? ('available' as const) : ('full' as const),
            waitlistEnabled: false,
            images: unitTypeImages,
            description: ut.description ?? undefined,
        };
    });

    const fallbackThumbnail = FALLBACK_THUMBNAILS[index % FALLBACK_THUMBNAILS.length];
    const thumbnail = propertyImageUrls[0] ?? fallbackThumbnail;
    const images =
        propertyImageUrls.length > 0 ? propertyImageUrls : [fallbackThumbnail];

    return {
        id: property.id,
        name: property.name,
        slug: toSlug(property.name),
        type: 'campur',
        description: '',
        location: {
            address: property.address,
            city: property.city,
        },
        priceRange: { min: minPrice, max: maxPrice },
        images,
        thumbnail,
        roomTypes,
        facilities: [],
        highlights: [],
        totalRooms,
        availableRooms,
        isFeatured: index < 2,
        whatsappNumber: '081234567890',
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

/**
 * Hook to fetch all kosts
 */
export function useKosts() {
    const query = useQuery({
        queryKey: publicKeys.properties.all(),
        queryFn: listPublicProperties,
    });

    const data = useMemo(() => {
        const rows = query.data?.data ?? [];
        return rows.map((p, idx) => mapPublicPropertyToKost(p, idx));
    }, [query.data]);

    return { data, isLoading: query.isLoading, error: query.error as Error | null };
}

/**
 * Hook to fetch featured kosts
 */
export function useFeaturedKosts() {
    const query = useQuery({
        queryKey: [...publicKeys.properties.all(), 'featured'] as const,
        queryFn: listPublicProperties,
    });

    const data = useMemo(() => {
        const rows = query.data?.data ?? [];
        return rows.slice(0, 2).map((p, idx) => mapPublicPropertyToKost(p, idx));
    }, [query.data]);

    return { data, isLoading: query.isLoading, error: query.error as Error | null };
}

/**
 * Hook to fetch a single kost by ID
 */
export function useKost(id: string) {
    const query = useQuery({
        queryKey: publicKeys.properties.detail(id),
        queryFn: () => getPublicProperty(id),
        enabled: !!id,
    });

    const data = useMemo(() => {
        const p = query.data?.data;
        return p ? mapPublicPropertyToKost(p, 0) : null;
    }, [query.data]);

    return { data, isLoading: query.isLoading, error: query.error as Error | null };
}

function mapSearchResultsToKosts(units: PublicSearchUnit[]): Kost[] {
    const propertyMap = new Map<
        string,
        {
            property: PublicSearchUnit['property'];
            unitTypes: Map<
                string,
                { unitType: PublicSearchUnit['unitType']; units: PublicSearchUnit[] }
            >;
        }
    >();

    for (const item of units) {
        let entry = propertyMap.get(item.property.id);
        if (!entry) {
            entry = { property: item.property, unitTypes: new Map() };
            propertyMap.set(item.property.id, entry);
        }
        let unitTypeEntry = entry.unitTypes.get(item.unitType.id);
        if (!unitTypeEntry) {
            unitTypeEntry = { unitType: item.unitType, units: [] };
            entry.unitTypes.set(item.unitType.id, unitTypeEntry);
        }
        unitTypeEntry.units.push(item);
    }

    return Array.from(propertyMap.values()).map((entry, index) => {
        const propertyImageUrls =
            entry.property.propertyAttachments?.map((a) => a.url).filter(Boolean) ??
            [];

        const roomTypes = Array.from(entry.unitTypes.values()).map(({ unitType, units }) => {
            const utPrices = (unitType.pricings ?? [])
                .map((p) => p.price)
                .filter((p) => Number.isFinite(p));
            const price = utPrices.length > 0 ? Math.min(...utPrices) : 0;
            const totalCount = units.length;
            const availableCount = units.filter((u) => u.status === 'vacant').length;
            const unitTypeImages =
                unitType.unitTypeAttachments?.map((a) => a.url).filter(Boolean) ?? [];

            const roomPricings = mapRoomTypePricings(unitType.pricings);

            return {
                id: unitType.id,
                name: unitType.name,
                price,
                pricings: roomPricings.length > 0 ? roomPricings : undefined,
                bathroomType: 'bersama' as const,
                capacity: '1 orang',
                size: unitType.size ?? undefined,
                availableCount,
                totalCount,
                status: availableCount > 0 ? ('available' as const) : ('full' as const),
                waitlistEnabled: false,
                images: unitTypeImages,
                description: unitType.description ?? undefined,
            };
        });

        const allPricings = Array.from(entry.unitTypes.values()).flatMap(({ unitType }) =>
            (unitType.pricings ?? []).map((p) => p.price),
        );
        const prices = allPricings.filter((p) => Number.isFinite(p));
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        const totalRooms = Array.from(entry.unitTypes.values()).reduce(
            (sum, { units }) => sum + units.length,
            0,
        );
        const availableRooms = Array.from(entry.unitTypes.values()).reduce(
            (sum, { units }) => sum + units.filter((u) => u.status === 'vacant').length,
            0,
        );

        const fallbackThumbnail = FALLBACK_THUMBNAILS[index % FALLBACK_THUMBNAILS.length];
        const thumbnail = propertyImageUrls[0] ?? fallbackThumbnail;
        const images =
            propertyImageUrls.length > 0 ? propertyImageUrls : [fallbackThumbnail];

        return {
            id: entry.property.id,
            name: entry.property.name,
            slug: toSlug(entry.property.name),
            type: 'campur' as const,
            description: '',
            location: {
                address: entry.property.address,
                city: entry.property.city,
            },
            priceRange: { min: minPrice, max: maxPrice },
            images,
            thumbnail,
            roomTypes,
            facilities: [],
            highlights: [],
            totalRooms,
            availableRooms,
            isFeatured: false,
            whatsappNumber: '081234567890',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    });
}

function buildUnitTypeImageLookup(properties: PublicProperty[]): Map<string, string[]> {
    const lookup = new Map<string, string[]>();

    for (const property of properties) {
        for (const unitType of property.unitTypes ?? []) {
            const urls =
                unitType.unitTypeAttachments?.map((a) => a.url).filter(Boolean) ?? [];
            if (urls.length > 0) {
                lookup.set(`${property.id}:${unitType.id}`, urls);
            }
        }
    }

    return lookup;
}

function applyUnitTypeImages(
    results: SearchUnitTypeResult[],
    catalogProperties: PublicProperty[],
): SearchUnitTypeResult[] {
    const lookup = buildUnitTypeImageLookup(catalogProperties);
    let fallbackIndex = 0;

    return results.map((unitType) => {
        const lookupKey = `${unitType.propertyId}:${unitType.id}`;
        const urls =
            unitType.images.length > 0
                ? unitType.images
                : (lookup.get(lookupKey) ?? []);

        if (urls.length > 0) {
            return {
                ...unitType,
                images: urls,
                thumbnail: urls[0],
            };
        }

        const fallback =
            FALLBACK_THUMBNAILS[fallbackIndex % FALLBACK_THUMBNAILS.length];
        fallbackIndex += 1;

        return {
            ...unitType,
            images: [fallback],
            thumbnail: fallback,
        };
    });
}

function buildUnitTypesFromCatalog(properties: PublicProperty[]): SearchUnitTypeResult[] {
    const results: SearchUnitTypeResult[] = [];

    for (const property of properties) {
        for (const unitType of property.unitTypes ?? []) {
            const pricings = mapRoomTypePricings(unitType.pricings);
            const prices = pricings.map((p) => p.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
            const allUnits = unitType.units ?? [];
            const unitTypeImages =
                unitType.unitTypeAttachments?.map((a) => a.url).filter(Boolean) ?? [];

            results.push({
                id: unitType.id,
                propertyId: property.id,
                name: unitType.name,
                propertyName: property.name,
                address: property.address,
                city: property.city,
                images: unitTypeImages,
                thumbnail: unitTypeImages[0] ?? '',
                availableCount: allUnits.filter((u) => u.status === 'vacant').length,
                totalCount: allUnits.length,
                pricings,
                minPrice,
                whatsappNumber: '081234567890',
                size: unitType.size ?? undefined,
                description: unitType.description ?? undefined,
            });
        }
    }

    return results;
}

function mapSearchResultsToUnitTypes(units: PublicSearchUnit[]): SearchUnitTypeResult[] {
    const propertyMap = new Map<
        string,
        {
            property: PublicSearchUnit['property'];
            unitTypes: Map<
                string,
                { unitType: PublicSearchUnit['unitType']; units: PublicSearchUnit[] }
            >;
        }
    >();

    for (const item of units) {
        let entry = propertyMap.get(item.property.id);
        if (!entry) {
            entry = { property: item.property, unitTypes: new Map() };
            propertyMap.set(item.property.id, entry);
        }
        let unitTypeEntry = entry.unitTypes.get(item.unitType.id);
        if (!unitTypeEntry) {
            unitTypeEntry = { unitType: item.unitType, units: [] };
            entry.unitTypes.set(item.unitType.id, unitTypeEntry);
        }
        unitTypeEntry.units.push(item);
    }

    const results: SearchUnitTypeResult[] = [];

    for (const entry of propertyMap.values()) {
        for (const { unitType, units } of entry.unitTypes.values()) {
            const unitTypeImages =
                unitType.unitTypeAttachments?.map((a) => a.url).filter(Boolean) ?? [];
            const pricings = mapRoomTypePricings(unitType.pricings);
            const prices = pricings.map((p) => p.price);
            const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

            results.push({
                id: unitType.id,
                propertyId: entry.property.id,
                name: unitType.name,
                propertyName: entry.property.name,
                address: entry.property.address,
                city: entry.property.city,
                images: unitTypeImages,
                thumbnail: unitTypeImages[0] ?? '',
                availableCount: units.filter((u) => u.status === 'vacant').length,
                totalCount: units.length,
                pricings,
                minPrice,
                whatsappNumber: '081234567890',
                size: unitType.size ?? undefined,
                description: unitType.description ?? undefined,
            });
        }
    }

    return results;
}

function sortUnitTypes(
    unitTypes: SearchUnitTypeResult[],
    sortBy?: SearchFilters['sortBy'],
): SearchUnitTypeResult[] {
    const sorted = [...unitTypes];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.minPrice - b.minPrice);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.minPrice - a.minPrice);
    return sorted;
}

function sortKosts(kosts: Kost[], sortBy?: SearchFilters['sortBy']): Kost[] {
    const sorted = [...kosts];
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.priceRange.min - b.priceRange.min);
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.priceRange.max - a.priceRange.max);
    else if (sortBy === 'newest') sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    else if (sortBy === 'popular') sorted.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    return sorted;
}

function applyClientFilters(kosts: Kost[], filters: SearchFilters): Kost[] {
    const bathroomTypes = filters.bathroomType ?? [];
    if (bathroomTypes.length === 0) return kosts;

    return kosts.filter((kost) =>
        kost.roomTypes.some((room) => bathroomTypes.includes(room.bathroomType)),
    );
}

/**
 * Hook to search unit types via GET /public/search
 */
export function useSearchUnitTypes(filters: SearchFilters) {
    const propertiesQuery = useQuery({
        queryKey: publicKeys.properties.all(),
        queryFn: listPublicProperties,
        staleTime: 5 * 60 * 1000,
    });

    const data = useMemo(() => {
        const catalog = propertiesQuery.data?.data ?? [];
        const results = buildUnitTypesFromCatalog(catalog);
        const withImages = applyUnitTypeImages(results, catalog);
        return sortUnitTypes(withImages, filters.sortBy);
    }, [propertiesQuery.data, filters.sortBy]);

    const total = useMemo(
        () => data.reduce((sum, unitType) => sum + unitType.totalCount, 0),
        [data],
    );

    return {
        data,
        total,
        isLoading: propertiesQuery.isLoading,
        isFetching: propertiesQuery.isFetching,
        error: propertiesQuery.error as Error | null,
    };
}

/**
 * Hook to search kosts via GET /public/search
 */
export function useSearchKosts(filters: SearchFilters) {
    const apiParams = useMemo(() => searchFiltersToApiParams(filters), [filters]);

    const query = useQuery({
        queryKey: publicKeys.search.list(apiParams as Record<string, unknown>),
        queryFn: () => searchPublicUnits(apiParams),
    });

    const data = useMemo(() => {
        const units = query.data?.data ?? [];
        const mapped = mapSearchResultsToKosts(units);
        const clientFiltered = applyClientFilters(mapped, filters);
        return sortKosts(clientFiltered, filters.sortBy);
    }, [query.data, filters]);

    return {
        data,
        total: query.data?.meta?.total ?? query.data?.data?.length ?? 0,
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        error: query.error as Error | null,
    };
}

/**
 * Hook for immediate data without loading (for SSR/SSG)
 */
export function useKostsImmediate() {
    return [];
}

export function useFeaturedKostsImmediate() {
    return [];
}
