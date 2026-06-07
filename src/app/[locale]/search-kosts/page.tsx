/**
 * Search Kost Page - Cari Kost
 * Search and filter unit types via GET /public/search
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { SearchHero } from '@/components/sections/SearchHero';
import { SearchFilters } from '@/components/sections/SearchFilters';
import { UnitTypeSearchGrid } from '@/components/kost/UnitTypeSearchGrid';
import { SearchPagination } from '@/components/kost/SearchPagination';
import {
    createDefaultSearchFilters,
    createResetSearchFilters,
} from '@/lib/api/public/search-contract';
import { useSearchUnitTypes } from '@/lib/hooks/use-kost-data';
import type { SearchFilters as SearchFiltersType } from '@/lib/types';

export default function SearchKostsPage() {
    const t = useTranslations('search');
    const [filters, setFilters] = useState<SearchFiltersType>(createDefaultSearchFilters);
    const [queryFilters, setQueryFilters] = useState<SearchFiltersType>(createDefaultSearchFilters);
    const [heroResetKey, setHeroResetKey] = useState(0);
    const {
        data: unitTypes,
        total,
        unitTotal,
        pagination,
        isLoading,
        isFetching,
        error,
    } = useSearchUnitTypes(queryFilters);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = window.setTimeout(() => setQueryFilters(filters), 400);
        return () => window.clearTimeout(timer);
    }, [filters]);

    const commitFilters = (next: SearchFiltersType) => {
        setFilters(next);
        setQueryFilters(next);
    };

    const handleFiltersChange = (newFilters: SearchFiltersType) => {
        setFilters(newFilters);
    };

    const handleReset = () => {
        const reset = createResetSearchFilters();
        commitFilters(reset);
        setHeroResetKey((k) => k + 1);
    };

    const handlePageChange = (page: number) => {
        commitFilters({ ...filters, page });
    };

    const handleHeroSearch = (location: string) => {
        commitFilters({
            ...filters,
            location: location || undefined,
            page: 1,
        });
        filterRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const resultCount = unitTypes?.length ?? 0;

    return (
        <AppLayout>
            <SearchHero
                key={heroResetKey}
                searchQuery={filters.location ?? ''}
                onSearchSubmit={handleHeroSearch}
            />

            <section className="w-full bg-[#faf9f6] py-12 px-6 lg:px-10">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 space-y-2">
                        <p className="text-sm text-[#83746b]">
                            {t('unitTypeResultsCount', {
                                count: resultCount,
                                total,
                                units: unitTotal,
                            })}
                            {isFetching && !isLoading ? (
                                <span className="ml-2 text-[#6f4627]">{t('updating')}</span>
                            ) : null}
                        </p>
                        {error ? (
                            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                                {t('loadError')}
                            </p>
                        ) : null}
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                        <div ref={filterRef} className="lg:col-span-1">
                            <SearchFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                onReset={handleReset}
                            />
                        </div>

                        <div className="lg:col-span-3">
                            <UnitTypeSearchGrid
                                unitTypes={unitTypes ?? []}
                                isLoading={isLoading}
                            />
                            {pagination ? (
                                <SearchPagination
                                    pagination={pagination}
                                    onPageChange={handlePageChange}
                                />
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </AppLayout>
    );
}
