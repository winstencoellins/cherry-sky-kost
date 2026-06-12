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
    type PublicSearchUnitTypeResult,
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
    const unitTypes = property.unitTypes ?? [];
    const allPricings = unitTypes.flatMap((ut) => ut.pricings ?? []);
    const prices = allPricings.map((p) => p.price).filter((p) => Number.isFinite(p));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    const totalRooms = unitTypes.reduce((sum, ut) => sum + (ut.units?.length ?? 0), 0);
    const availableRooms = unitTypes.reduce(
        (sum, ut) => sum + (ut.units ?? []).filter((u) => u.status === 'vacant').length,
        0,
    );

    const propertyImageUrls =
        property.propertyAttachments?.map((a) => a.url).filter(Boolean) ?? [];

    const roomTypes = unitTypes.map((ut) => {
        const utPrices = (ut.pricings ?? []).map((p) => p.price).filter((p) => Number.isFinite(p));
        const price = utPrices.length > 0 ? Math.min(...utPrices) : minPrice;
        const totalCount = ut.units?.length ?? 0;
        const availableCount = (ut.units ?? []).filter((u) => u.status === 'vacant').length;
        const unitTypeImages =
            ut.unitTypeAttachments?.map((a) => a.url).filter(Boolean) ?? [];

        const roomPricings = mapRoomTypePricings(ut.pricings);

        const occupancies = (ut.units ?? [])
            .map((u) => u.maxOccupancy)
            .filter((n): n is number => n != null && n > 0);
        const minOcc = occupancies.length > 0 ? Math.min(...occupancies) : 1;
        const maxOcc = occupancies.length > 0 ? Math.max(...occupancies) : 1;
        const capacity =
            minOcc === maxOcc ? `${minOcc} orang` : `${minOcc}–${maxOcc} orang`;

        return {
            id: ut.id,
            name: ut.name,
            price,
            pricings: roomPricings.length > 0 ? roomPricings : undefined,
            bathroomType: 'bersama' as const,
            capacity,
            size: ut.size ?? undefined,
            availableCount,
            totalCount,
            status: availableCount > 0 ? ('available' as const) : ('full' as const),
            waitlistEnabled: false,
            images: unitTypeImages.length > 0 ? unitTypeImages : propertyImageUrls,
            description: ut.description?.trim() || undefined,
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
        const rows = query.data ?? [];
        return rows.map((p, idx) => mapPublicPropertyToKost(p, idx));
    }, [query.data]);

    return { data, isLoading: query.isPending, error: query.error as Error | null };
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
        const rows = query.data ?? [];
        return rows.slice(0, 2).map((p, idx) => mapPublicPropertyToKost(p, idx));
    }, [query.data]);

    return { data, isLoading: query.isPending, error: query.error as Error | null };
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
        const p = query.data;
        return p ? mapPublicPropertyToKost(p, 0) : null;
    }, [query.data]);

    return { data, isLoading: query.isPending, error: query.error as Error | null };
}

function mapSearchUnitTypeResults(rows: PublicSearchUnitTypeResult[]): SearchUnitTypeResult[] {
    return rows.map((row) => ({
        id: row.id,
        propertyId: row.propertyId,
        name: row.name,
        propertyName: row.propertyName,
        address: row.address,
        city: row.city,
        images: row.images,
        thumbnail: row.thumbnail,
        availableCount: row.availableCount,
        totalCount: row.totalCount,
        pricings: mapRoomTypePricings(row.pricings),
        minPrice: row.minPrice,
        whatsappNumber: '081234567890',
        size: row.size ?? undefined,
        description: row.description ?? undefined,
    }));
}

function withSearchFallbackImages(rows: SearchUnitTypeResult[]): SearchUnitTypeResult[] {
    let fallbackIndex = 0;

    return rows.map((row) => {
        if (row.thumbnail) return row;

        const fallback =
            FALLBACK_THUMBNAILS[fallbackIndex % FALLBACK_THUMBNAILS.length];
        fallbackIndex += 1;

        return {
            ...row,
            images: [fallback],
            thumbnail: fallback,
        };
    });
}

/**
 * Hook to search unit types via GET /public/search (server filters, sort, pagination).
 */
export function useSearchUnitTypes(filters: SearchFilters) {
    const apiParams = useMemo(() => searchFiltersToApiParams(filters), [filters]);

    const query = useQuery({
        queryKey: publicKeys.search.list(apiParams as Record<string, unknown>),
        queryFn: () => searchPublicUnits(apiParams),
        staleTime: 30_000,
    });

    const data = useMemo(() => {
        const rows = query.data?.data ?? [];
        return withSearchFallbackImages(mapSearchUnitTypeResults(rows));
    }, [query.data]);

    return {
        data,
        total: query.data?.meta?.total ?? 0,
        unitTotal: query.data?.meta?.unitTotal ?? 0,
        pagination: query.data?.meta?.pagination,
        isLoading: query.isPending,
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
