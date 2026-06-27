/**
 * Unit Type Search Grid
 * Displays search results as individual unit type cards with pricing
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import { WhatsAppInquiryDialog } from '@/components/kost/WhatsAppInquiryDialog';
import type { SearchUnitTypeResult } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/format';

interface UnitTypeSearchGridProps {
    unitTypes: SearchUnitTypeResult[];
    isLoading?: boolean;
}

function getDurationLabel(
    durationDays: number,
    t: ReturnType<typeof useTranslations>,
): string {
    const known: Record<number, string> = {
        7: t('search.duration7'),
        12: t('search.duration12'),
        30: t('search.duration30'),
    };
    return known[durationDays] ?? t('search.durationDaysCount', { days: durationDays });
}

export function UnitTypeSearchGrid({ unitTypes, isLoading }: UnitTypeSearchGridProps) {
    const t = useTranslations();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-80 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800"
                    />
                ))}
            </div>
        );
    }

    if (unitTypes.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center justify-center px-6 py-20"
            >
                <div className="max-w-md text-center">
                    <Icon
                        name="search_off"
                        size={64}
                        className="mx-auto mb-4 text-slate-300 dark:text-slate-700"
                    />
                    <h3 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {t('search.noResults')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
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
            transition: { staggerChildren: 0.1 },
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
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
            {unitTypes.map((unitType) => {
                const detailUrl = `/kosts/${unitType.propertyId}--${unitType.id}`;
                const pricingRows =
                    unitType.pricings.length > 0
                        ? unitType.pricings
                        : unitType.minPrice > 0
                          ? [
                                {
                                    id: unitType.id,
                                    durationDays: 30,
                                    price: unitType.minPrice,
                                },
                            ]
                          : [];

                return (
                    <motion.div key={`${unitType.propertyId}-${unitType.id}`} variants={item} className="group">
                        <div className="relative h-full overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                            <Link href={detailUrl} className="block">
                                <div className="relative h-56 w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                                    {unitType.thumbnail ? (
                                        <Image
                                            src={unitType.thumbnail}
                                            alt={unitType.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <Icon name="image" size={48} className="text-slate-300" />
                                        </div>
                                    )}

                                    {unitType.availableCount > 0 && (
                                        <div className="absolute bottom-4 left-4">
                                            <div className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                                                {t('search.unitsAvailable', {
                                                    count: unitType.availableCount,
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4 p-5 pb-0">
                                    <div>
                                        <h3 className="mb-1 line-clamp-1 text-xl font-bold text-slate-900 dark:text-white">
                                            {unitType.name}
                                        </h3>
                                        <p className="flex items-start gap-1 text-sm text-slate-600 dark:text-slate-400">
                                            <Icon name="apartment" size={14} className="mt-0.5 shrink-0" />
                                            <span className="line-clamp-1">
                                                {unitType.propertyName}
                                                {unitType.city ? ` · ${unitType.city}` : ''}
                                            </span>
                                        </p>
                                    </div>

                                    {pricingRows.length > 0 ? (
                                        <ul className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                            {pricingRows.map((pricing) => (
                                                <li
                                                    key={pricing.id}
                                                    className="flex items-center justify-between gap-3 text-sm"
                                                >
                                                    <span className="text-slate-600 dark:text-slate-400">
                                                        {getDurationLabel(pricing.durationDays, t)}
                                                    </span>
                                                    <span className="shrink-0 font-semibold text-slate-900 dark:text-white">
                                                        {formatCurrency(pricing.price)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {t('search.noPricing')}
                                        </p>
                                    )}
                                </div>
                            </Link>

                            <div className="grid grid-cols-2 gap-3 border-t border-slate-200 p-5 pt-4 dark:border-slate-800">
                                {unitType.availableCount > 0 ? (
                                    <WhatsAppInquiryDialog
                                        phoneNumber={unitType.whatsappNumber}
                                        propertyName={unitType.propertyName}
                                        roomName={unitType.name}
                                        pricings={unitType.pricings}
                                        fallbackPrice={unitType.minPrice}
                                        variant="compact"
                                        className="h-full w-full justify-center rounded-lg px-3 py-2 text-xs font-semibold"
                                    />
                                ) : (
                                    <span className="flex items-center justify-center rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                        {t('status.full')}
                                    </span>
                                )}
                                <Link
                                    href={detailUrl}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90"
                                >
                                    <Icon name="arrow_forward" size={14} />
                                    {t('cta.viewDetails')}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
