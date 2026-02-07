/**
 * Search Filters Component
 * Filters for searching and filtering kost properties
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Icon } from '@/components/shared/Icon';
import type { SearchFilters, BathroomType } from '@/lib/types';

interface SearchFiltersProps {
    filters: SearchFilters;
    onFiltersChange: (filters: SearchFilters) => void;
    onReset?: () => void;
}

export function SearchFilters({ filters, onFiltersChange, onReset }: SearchFiltersProps) {
    const t = useTranslations();
    const [isExpanded, setIsExpanded] = useState(true);

    const handlePriceChange = (values: number[]) => {
        onFiltersChange({
            ...filters,
            priceMin: values[0],
            priceMax: values[1],
        });
    };

    const handleBathroomToggle = (type: BathroomType) => {
        const current = filters.bathroomType || [];
        const updated = current.includes(type)
            ? current.filter((t) => t !== type)
            : [...current, type];
        onFiltersChange({
            ...filters,
            bathroomType: updated.length > 0 ? updated : undefined,
        });
    };

    const handleSortChange = (sortBy: 'price-asc' | 'price-desc' | 'newest' | 'popular') => {
        onFiltersChange({
            ...filters,
            sortBy,
        });
    };

    const bathroomOptions: Array<{ id: BathroomType; label: string }> = [
        { id: 'dalam', label: t('bathroom.inside') },
        { id: 'luar', label: t('bathroom.outside') },
        { id: 'bersama', label: t('bathroom.shared') },
    ];

    const sortOptions = [
        { id: 'price-asc', label: 'Harga: Terendah' },
        { id: 'price-desc', label: 'Harga: Tertinggi' },
        { id: 'newest', label: 'Terbaru' },
        { id: 'popular', label: 'Paling Populer' },
    ] as const;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 sticky top-24 z-40"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Icon name="tune" size={20} />
                    Filter Pencarian
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size={20} />
                </button>
            </div>

            {isExpanded && (
                <>
                    {/* Price Range */}
                    <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                            <Icon name="local_offer" size={16} />
                            Rentang Harga
                        </h4>
                        <div className="space-y-4">
                            <Slider
                                defaultValue={[filters.priceMin || 500000, filters.priceMax || 2500000]}
                                min={500000}
                                max={2500000}
                                step={100000}
                                onValueChange={handlePriceChange}
                                className="w-full"
                            />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-600 dark:text-slate-400">
                                    Rp {((filters.priceMin || 500000) / 1000000).toFixed(1)}M
                                </span>
                                <span className="text-slate-600 dark:text-slate-400">
                                    Rp {((filters.priceMax || 2500000) / 1000000).toFixed(1)}M
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bathroom Type */}
                    <div className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                            <Icon name="bathroom" size={16} />
                            Tipe Kamar Mandi
                        </h4>
                        <div className="space-y-3">
                            {bathroomOptions.map((option) => (
                                <label
                                    key={option.id}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <Checkbox
                                        checked={filters.bathroomType?.includes(option.id) ?? false}
                                        onCheckedChange={() => handleBathroomToggle(option.id)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                            <Icon name="sort" size={16} />
                            Urutkan
                        </h4>
                        <div className="space-y-2">
                            {sortOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSortChange(option.id)}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        filters.sortBy === option.id
                                            ? 'bg-[#137fec] text-white'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={onReset}
                            variant="outline"
                            className="flex-1 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                        >
                            <Icon name="restart_alt" size={16} className="mr-2" />
                            Reset
                        </Button>
                        <Button className="flex-1 bg-[#137fec] hover:bg-blue-600 text-white">
                            <Icon name="search" size={16} className="mr-2" />
                            Cari
                        </Button>
                    </div>
                </>
            )}
        </motion.div>
    );
}
