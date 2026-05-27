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
import type { SearchFilters as SearchFiltersState, BathroomType } from '@/lib/types';

interface SearchFiltersProps {
    filters: SearchFiltersState;
    onFiltersChange: (filters: SearchFiltersState) => void;
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
            className="sticky top-24 z-40 rounded-2xl border border-[#e3e2e0] bg-white/90 p-6 shadow-sm"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2 text-base font-semibold text-[#1a1c1a]">
                    <Icon name="tune" size={20} />
                    Filter Pencarian
                </h3>
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="rounded-xl p-2 transition-colors hover:bg-[#faf9f6] md:hidden"
                >
                    <Icon name={isExpanded ? 'expand_less' : 'expand_more'} size={20} />
                </button>
            </div>

            {isExpanded && (
                <>
                    {/* Location / keyword */}
                    <div className="mb-8 border-b border-[#e3e2e0] pb-8">
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#51443c]">
                            <Icon name="location_on" size={16} />
                            {t('search.location')}
                        </h4>
                        <input
                            type="search"
                            value={filters.location ?? ''}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    location: e.target.value || undefined,
                                })
                            }
                            placeholder={t('search.placeholder')}
                            className="w-full rounded-lg border border-[#e3e2e0] bg-[#faf9f6] px-3 py-2.5 text-sm text-[#1a1c1a] placeholder:text-[#83746b]/60 focus:border-[#6f4627] focus:outline-none focus:ring-2 focus:ring-[#6f4627]/25"
                        />
                    </div>

                    {/* Rent duration (maps to durationDays on API) */}
                    <div className="mb-8 border-b border-[#e3e2e0] pb-8">
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#51443c]">
                            <Icon name="calendar_month" size={16} />
                            {t('search.durationLabel')}
                        </h4>
                        <select
                            value={filters.durationDays?.toString() ?? ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                onFiltersChange({
                                    ...filters,
                                    durationDays: value ? Number(value) : undefined,
                                });
                            }}
                            className="w-full rounded-lg border border-[#e3e2e0] bg-[#faf9f6] px-3 py-2.5 text-sm text-[#1a1c1a] focus:border-[#6f4627] focus:outline-none focus:ring-2 focus:ring-[#6f4627]/25"
                        >
                            <option value="">{t('search.durationAny')}</option>
                            <option value="7">{t('search.duration7')}</option>
                            <option value="12">{t('search.duration12')}</option>
                            <option value="30">{t('search.duration30')}</option>
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="mb-8 border-b border-[#e3e2e0] pb-8">
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#51443c]">
                            <Icon name="local_offer" size={16} />
                            Rentang Harga
                        </h4>
                        <div className="space-y-4">
                            <Slider
                                value={[filters.priceMin || 500000, filters.priceMax || 2500000]}
                                min={500000}
                                max={5000000}
                                step={100000}
                                onValueChange={handlePriceChange}
                                className="w-full"
                            />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#83746b]">
                                    Rp {((filters.priceMin || 500000) / 1000000).toFixed(1)}M
                                </span>
                                <span className="text-[#83746b]">
                                    Rp {((filters.priceMax || 2500000) / 1000000).toFixed(1)}M+
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bathroom Type */}
                    <div className="mb-8 border-b border-[#e3e2e0] pb-8">
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#51443c]">
                            <Icon name="bathroom" size={16} />
                            Tipe Kamar Mandi
                        </h4>
                        <div className="space-y-3">
                            {bathroomOptions.map((option) => (
                                <label
                                    key={option.id}
                                    htmlFor={`bathroom-${option.id}`}
                                    className="flex items-center gap-3 cursor-pointer group"
                                >
                                    <Checkbox
                                        id={`bathroom-${option.id}`}
                                        checked={filters.bathroomType?.includes(option.id) ?? false}
                                        onCheckedChange={() => handleBathroomToggle(option.id)}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-sm text-[#83746b] transition-colors group-hover:text-[#1a1c1a]">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Sort By */}
                    <div className="mb-6 border-b border-[#e3e2e0] pb-6">
                        <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#51443c]">
                            <Icon name="sort" size={16} />
                            Urutkan
                        </h4>
                        <div className="space-y-2">
                            {sortOptions.map((option) => (
                                <button
                                    type="button"
                                    key={option.id}
                                    onClick={() => handleSortChange(option.id)}
                                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        filters.sortBy === option.id
                                            ? 'bg-[#6f4627] text-white'
                                            : 'bg-[#faf9f6] text-[#51443c] hover:bg-white'
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
                            className="flex-1 rounded-xl border-[#e3e2e0] bg-white/80 text-[#1a1c1a] hover:bg-white hover:text-[#6f4627]"
                        >
                            <Icon name="restart_alt" size={16} className="mr-2" />
                            Reset
                        </Button>
                        <Button className="flex-1 rounded-xl bg-[#6f4627] text-white hover:bg-[#805533]">
                            <Icon name="search" size={16} className="mr-2" />
                            Cari
                        </Button>
                    </div>
                </>
            )}
        </motion.div>
    );
}
