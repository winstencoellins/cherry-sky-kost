/**
 * Search Kost Page - Cari Kost
 * Search and filter properties with modern UI
 */

'use client';

import { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { SearchHero } from '@/components/sections/SearchHero';
import { SearchFilters } from '@/components/sections/SearchFilters';
import { KostGrid } from '@/components/kost/KostGrid';
import type { SearchFilters as SearchFiltersType } from '@/lib/types';
import { useKosts } from '@/lib/hooks/use-kost-data';

const DEFAULT_FILTERS: SearchFiltersType = {
    priceMin: 500000,
    priceMax: 2500000,
};

export default function SearchKostsPage() {
    const t = useTranslations();
    const { data: kosts, isLoading } = useKosts();
    const [filters, setFilters] = useState<SearchFiltersType>(DEFAULT_FILTERS);
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
        setFilters(DEFAULT_FILTERS);
    };

    return (
        <AppLayout>
            {/* Hero Section */}
            <SearchHero onFilterFocus={handleFiltersFocus} />

            {/* Main Content */}
            <div className="w-full py-16 px-6 lg:px-10 bg-white dark:bg-slate-950">
                <div className="max-w-7xl mx-auto">
                    {/* Results Info */}
                    <div className="mb-8">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Menampilkan {kosts?.length || 0} properti kost
                        </p>
                    </div>

                    {/* Layout Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filters Sidebar */}
                        <div ref={filterRef} className="lg:col-span-1">
                            <SearchFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                onReset={handleResetFilters}
                            />
                        </div>

                        {/* Results Grid */}
                        <div className="lg:col-span-3">
                            {kosts && (
                                <KostGrid
                                    kosts={kosts}
                                    filters={filters}
                                    isLoading={isLoading}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </AppLayout>
    );
}
