/**
 * Kost Grid Component
 * Displays kost properties in a searchable, filterable grid
 */

'use client';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import type { Kost, SearchFilters } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/format';

interface KostGridProps {
    kosts: Kost[];
    filters: SearchFilters;
    isLoading?: boolean;
}

export function KostGrid({ kosts, filters, isLoading }: KostGridProps) {
    const t = useTranslations();
    const locale = useLocale();

    // Apply filters and sorting
    const filteredKosts = useMemo(() => {
        let result = [...kosts];

        // Filter by price range
        if (filters.priceMin || filters.priceMax) {
            result = result.filter(
                (kost) =>
                    kost.priceRange.min >= (filters.priceMin || 0) &&
                    kost.priceRange.min <= (filters.priceMax || Infinity)
            );
        }

        // Filter by bathroom type
        if (filters.bathroomType && filters.bathroomType.length > 0) {
            result = result.filter((kost) =>
                kost.roomTypes.some((room) =>
                    filters.bathroomType?.includes(room.bathroomType)
                )
            );
        }

        // Sort
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-asc':
                    result.sort((a, b) => a.priceRange.min - b.priceRange.min);
                    break;
                case 'price-desc':
                    result.sort((a, b) => b.priceRange.min - a.priceRange.min);
                    break;
                case 'newest':
                    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    break;
                case 'popular':
                    result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
                    break;
            }
        }

        return result;
    }, [kosts, filters]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-slate-200 dark:bg-slate-800 rounded-2xl h-80 animate-pulse"
                    />
                ))}
            </div>
        );
    }

    if (filteredKosts.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-20 px-6"
            >
                <div className="text-center max-w-md">
                    <Icon
                        name="search_off"
                        size={64}
                        className="text-slate-300 dark:text-slate-700 mx-auto mb-4"
                    />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Tidak ada hasil
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Coba sesuaikan filter Anda untuk menemukan kost yang sempurna.
                    </p>
                </div>
            </motion.div>
        );
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
            {filteredKosts.map((kost, index) => (
                <motion.div
                    key={kost.id}
                    variants={item}
                    className="group"
                >
                    <Link href={`/${locale}/kosts/${kost.slug}`} className="block h-full">
                        <div className="relative h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            {/* Image Section */}
                            <div className="relative h-64 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                                {kost.thumbnail ? (
                                    <Image
                                        src={kost.thumbnail}
                                        alt={kost.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Icon name="image" size={48} className="text-slate-300" />
                                    </div>
                                )}

                                {/* Badge */}
                                <div className="absolute top-4 right-4">
                                    {kost.isFeatured && (
                                        <div className="px-3 py-1 bg-gradient-to-r from-[#d4af37] to-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
                                            <Icon name="star" size={12} className="inline mr-1" />
                                            Featured
                                        </div>
                                    )}
                                </div>

                                {/* Available Rooms Badge */}
                                <div className="absolute bottom-4 left-4">
                                    <div className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                                        {kost.availableRooms}/{kost.totalRooms} tersedia
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-5 flex flex-col gap-4">
                                {/* Title & Location */}
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                                        {kost.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1 line-clamp-1">
                                        <Icon name="location_on" size={14} />
                                        {kost.location.district}, {kost.location.city}
                                    </p>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                    {kost.description}
                                </p>

                                {/* Price Range */}
                                <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-1 uppercase font-semibold">
                                        Mulai dari
                                    </p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(kost.priceRange.min)}
                                        <span className="text-xs text-slate-400 font-normal">/bulan</span>
                                    </p>
                                </div>

                                {/* Facilities Preview */}
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {kost.facilities.slice(0, 3).map((facility) => (
                                        <div
                                            key={facility.id}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
                                            title={facility.name}
                                        >
                                            <Icon name={facility.icon} size={14} className="text-[#137fec]" />
                                            <span className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
                                                {facility.name}
                                            </span>
                                        </div>
                                    ))}
                                    {kost.facilities.length > 3 && (
                                        <div className="inline-flex items-center px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs text-slate-600 dark:text-slate-400">
                                            +{kost.facilities.length - 3} lebih
                                        </div>
                                    )}
                                </div>

                                {/* CTAs */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            window.open(`https://wa.me/${kost.whatsappNumber}?text=Halo, saya tertarik dengan ${kost.name}`, '_blank');
                                        }}
                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-[#25D366] hover:bg-[#1fb855] text-white text-xs font-semibold rounded-lg transition-colors"
                                    >
                                        <Icon name="chat" size={14} />
                                        WhatsApp
                                    </button>
                                    <button
                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-[#137fec] hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
                                    >
                                        <Icon name="arrow_forward" size={14} />
                                        Detail
                                    </button>
                                </div>

                                {/* Rating */}
                                {kost.rating && (
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1">
                                            <Icon name="star" size={14} filled className="text-yellow-400" />
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {kost.rating}
                                            </span>
                                            <span className="text-slate-500 dark:text-slate-400">
                                                ({kost.reviewCount} reviews)
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
