/**
 * React hooks for fetching kost data
 * Simulates API calls with loading states for skeleton UI testing
 */

'use client';

import { useState, useEffect } from 'react';
import type { Kost, SearchFilters } from '../types';
import { allKosts, getFeaturedKosts, getKostById } from '../data/mock-kost';

const LOADING_DELAY = 800; // ms - simulate network delay

/**
 * Simulate async data fetching
 */
function simulateFetch<T>(data: T, delay: number = LOADING_DELAY): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(data), delay);
    });
}

/**
 * Hook to fetch all kosts
 */
export function useKosts() {
    const [data, setData] = useState<Kost[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoading(true);
        simulateFetch(allKosts)
            .then((kosts) => {
                setData(kosts);
                setError(null);
            })
            .catch((err) => setError(err))
            .finally(() => setIsLoading(false));
    }, []);

    return { data, isLoading, error };
}

/**
 * Hook to fetch featured kosts
 */
export function useFeaturedKosts() {
    const [data, setData] = useState<Kost[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoading(true);
        simulateFetch(getFeaturedKosts())
            .then((kosts) => {
                setData(kosts);
                setError(null);
            })
            .catch((err) => setError(err))
            .finally(() => setIsLoading(false));
    }, []);

    return { data, isLoading, error };
}

/**
 * Hook to fetch a single kost by ID
 */
export function useKost(id: string) {
    const [data, setData] = useState<Kost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoading(true);
        const kost = getKostById(id);

        simulateFetch(kost || null)
            .then((result) => {
                setData(result);
                setError(null);
            })
            .catch((err) => setError(err))
            .finally(() => setIsLoading(false));
    }, [id]);

    return { data, isLoading, error };
}

/**
 * Hook to search kosts with filters
 */
export function useSearchKosts(filters: SearchFilters) {
    const [data, setData] = useState<Kost[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoading(true);

        // Simulate filtering logic
        const filteredKosts = allKosts.filter((kost) => {
            // Location filter
            if (filters.location) {
                const locationMatch =
                    kost.location.address.toLowerCase().includes(filters.location.toLowerCase()) ||
                    kost.location.city.toLowerCase().includes(filters.location.toLowerCase()) ||
                    kost.location.nearbyLandmark?.toLowerCase().includes(filters.location.toLowerCase());

                if (!locationMatch) return false;
            }

            // Price filter
            if (filters.priceMin !== undefined && kost.priceRange.min < filters.priceMin) {
                return false;
            }
            if (filters.priceMax !== undefined && kost.priceRange.max > filters.priceMax) {
                return false;
            }

            // Bathroom type filter
            if (filters.bathroomType && filters.bathroomType.length > 0) {
                const hasMatchingRoomType = kost.roomTypes.some((room) =>
                    filters.bathroomType!.includes(room.bathroomType)
                );
                if (!hasMatchingRoomType) return false;
            }

            // Facilities filter
            if (filters.facilities && filters.facilities.length > 0) {
                const kostFacilityIds = kost.facilities.map((f) => f.id);
                const hasAllFacilities = filters.facilities.every((facilityId) =>
                    kostFacilityIds.includes(facilityId)
                );
                if (!hasAllFacilities) return false;
            }

            // Availability filter
            if (filters.availability === 'available' && kost.availableRooms === 0) {
                return false;
            }

            return true;
        });

        // Apply sorting
        let sortedKosts = [...filteredKosts];
        if (filters.sortBy === 'price-asc') {
            sortedKosts.sort((a, b) => a.priceRange.min - b.priceRange.min);
        } else if (filters.sortBy === 'price-desc') {
            sortedKosts.sort((a, b) => b.priceRange.max - a.priceRange.max);
        } else if (filters.sortBy === 'newest') {
            sortedKosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        } else if (filters.sortBy === 'popular') {
            sortedKosts.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
        }

        simulateFetch(sortedKosts)
            .then((kosts) => {
                setData(kosts);
                setError(null);
            })
            .catch((err) => setError(err))
            .finally(() => setIsLoading(false));
    }, [filters]);

    return { data, isLoading, error };
}

/**
 * Hook for immediate data without loading (for SSR/SSG)
 */
export function useKostsImmediate() {
    return allKosts;
}

export function useFeaturedKostsImmediate() {
    return getFeaturedKosts();
}
