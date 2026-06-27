/**
 * Kost Grid Component
 * Displays kost properties in a searchable, filterable grid
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/shared/Icon';
import type { Kost, SearchFilters } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/format';

interface KostGridProps {
    kosts: Kost[];
    filters: SearchFilters;
    isLoading?: boolean;
    error?: Error | null;
}

export function KostGrid({ kosts, isLoading, error }: KostGridProps) {
    const t = useTranslations();

    const filteredKosts = kosts;

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

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center justify-center px-6 py-20"
            >
                <div className="max-w-md text-center">
                    <Icon
                        name="error_outline"
                        size={64}
                        className="mx-auto mb-4 text-slate-300 dark:text-slate-700"
                    />
                    <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {t('common.error')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {error.message || t('search.tryDifferentFilters')}
                    </p>
                </div>
            </motion.div>
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
                        {t('search.noResults')}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {t('search.tryDifferentFilters')}
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
            {filteredKosts.map((kost) => (
                <motion.div
                    key={kost.id}
                    variants={item}
                    className="group"
                >
                    <Link href={`/kosts/${kost.id}`} className="block h-full">
                        <div className="relative h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
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

                                <div className="absolute bottom-4 left-4">
                                    <div className="px-3 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                                        {kost.availableRooms}/{kost.totalRooms} tersedia
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col gap-4">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                                        {kost.name}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-1 line-clamp-2">
                                        <Icon name="location_on" size={14} className="mt-0.5 shrink-0" />
                                        <span>
                                            {kost.location.address}
                                            {kost.location.city ? `, ${kost.location.city}` : ''}
                                        </span>
                                    </p>
                                </div>

                                {kost.roomTypes.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {kost.roomTypes.map((roomType) => (
                                            <Badge
                                                key={roomType.id}
                                                variant="secondary"
                                                className="px-2.5 py-0.5 text-xs font-medium"
                                            >
                                                {roomType.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {kost.description ? (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                        {kost.description}
                                    </p>
                                ) : null}

                                {kost.priceRange.min > 0 && (
                                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mb-1 uppercase font-semibold">
                                            {t('pricing.startingFrom')}
                                        </p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {formatCurrency(kost.priceRange.min)}
                                            <span className="text-xs text-slate-400 font-normal">
                                                {t('pricing.perMonth')}
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {kost.facilities.slice(0, 3).map((facility) => (
                                        <div
                                            key={facility.id}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg"
                                            title={facility.name}
                                        >
                                            <Icon name={facility.icon} size={14} className="text-primary" />
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

                                <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <span className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white">
                                        <Icon name="arrow_forward" size={14} />
                                        {t('cta.viewDetails')}
                                    </span>
                                </div>

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
