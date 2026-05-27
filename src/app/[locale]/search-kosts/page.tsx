/**
 * Search Kost Page - Cari Kost
 * Search and filter properties via GET /public/search
 */

'use client';

import { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { SearchHero } from '@/components/sections/SearchHero';
import { SearchFilters } from '@/components/sections/SearchFilters';
import { KostGrid } from '@/components/kost/KostGrid';
import { DEFAULT_SEARCH_FILTERS } from '@/lib/api/public/search-contract';
import { useSearchKosts } from '@/lib/hooks/use-kost-data';
import type { SearchFilters as SearchFiltersType } from '@/lib/types';

export default function SearchKostsPage() {
    const t = useTranslations('search');
    const [filters, setFilters] = useState<SearchFiltersType>(DEFAULT_SEARCH_FILTERS);
    const { data: kosts, total, isLoading, isFetching, error } = useSearchKosts(filters);
    const filterRef = useRef<HTMLDivElement>(null);

    const handleFiltersFocus = () => {
        filterRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const handleFiltersChange = (newFilters: SearchFiltersType) => {
        setFilters(newFilters);
    };

    const handleResetFilters = () => {
        setFilters(DEFAULT_SEARCH_FILTERS);
    };

    const resultCount = kosts?.length ?? 0;

    return (
        <AppLayout>
            <SearchHero
                onFilterFocus={handleFiltersFocus}
                searchQuery={filters.location ?? ''}
                onSearchQueryChange={(location) =>
                    setFilters((prev) => ({ ...prev, location }))
                }
            />

            <section className="w-full bg-[#faf9f6] py-12 px-6 lg:px-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8 space-y-2">
                        <p className="text-sm text-[#83746b]">
                            {t('resultsCount', { count: resultCount, total })}
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

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div ref={filterRef} className="lg:col-span-1">
                            <SearchFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                onReset={handleResetFilters}
                            />
                        </div>

                        <div className="lg:col-span-3">
                            <KostGrid
                                kosts={kosts ?? []}
                                filters={filters}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </AppLayout>
    );
}
