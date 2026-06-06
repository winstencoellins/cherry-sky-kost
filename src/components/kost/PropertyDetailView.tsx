/**
 * Property Detail View
 * Shows property overview and a list of unit types for a kost property
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/shared/Icon';
import { ImageGallery } from '@/components/kost/ImageGallery';
import { RoomTypeCard } from '@/components/kost/RoomTypeCard';
import type { Kost } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/format';

interface PropertyDetailViewProps {
    kost: Kost;
}

export function PropertyDetailView({ kost }: PropertyDetailViewProps) {
    const t = useTranslations();
    const isAlmostFull = kost.availableRooms > 0 && kost.availableRooms <= 3;

    return (
        <AppLayout>
            <div className="bg-[#faf9f6] pt-16">
                <div className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-10">
                    <div className="flex flex-col gap-8">
                        <ImageGallery
                            images={kost.images}
                            alt={kost.name}
                            variant="compact"
                            backHref="/"
                            backLabel={t('roomDetail.backToHome')}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="flex flex-wrap gap-3">
                                {kost.isFeatured && (
                                    <Badge className="px-3 py-1 bg-[#e7edf3] dark:bg-slate-700 text-slate-900 dark:text-slate-200">
                                        <Icon name="star" size={16} className="mr-1.5" filled />
                                        {t('property.flagship')}
                                    </Badge>
                                )}
                                {kost.availableRooms > 0 && (
                                    <Badge className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                        <Icon name="key" size={16} className="mr-1.5" />
                                        {t('propertyDetail.availableRooms', {
                                            available: kost.availableRooms,
                                            total: kost.totalRooms,
                                        })}
                                    </Badge>
                                )}
                                {isAlmostFull && (
                                    <Badge className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                        <Icon name="schedule" size={14} className="mr-1.5" />
                                        {t('status.almostFull')}
                                    </Badge>
                                )}
                            </div>

                            <div>
                                <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                    {kost.name}
                                </h1>
                                <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                                    <Icon name="location_on" size={20} className="mt-0.5 shrink-0 text-primary" />
                                    <p className="text-base font-medium">
                                        {kost.location.address}
                                        {kost.location.city ? `, ${kost.location.city}` : ''}
                                    </p>
                                </div>
                            </div>

                            {kost.priceRange.min > 0 && (
                                <p className="text-lg text-slate-700 dark:text-slate-300">
                                    <span className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                                        {t('pricing.startingFrom')}{' '}
                                    </span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {formatCurrency(kost.priceRange.min)}
                                    </span>
                                    <span className="text-sm text-slate-500">{t('pricing.perMonth')}</span>
                                </p>
                            )}
                        </motion.div>

                        <hr className="border-slate-200 dark:border-slate-800" />

                        <section className="flex flex-col gap-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {t('propertyDetail.unitTypes')}
                                </h2>
                                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                    {t('propertyDetail.unitTypesDescription')}
                                </p>
                            </div>

                            {kost.roomTypes.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {kost.roomTypes.map((roomType, index) => (
                                        <RoomTypeCard
                                            key={roomType.id}
                                            roomType={roomType}
                                            kostName={kost.name}
                                            kostId={kost.id}
                                            whatsappNumber={kost.whatsappNumber}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center dark:border-slate-800 dark:bg-slate-900">
                                    <Icon
                                        name="meeting_room"
                                        size={48}
                                        className="mx-auto mb-4 text-slate-300 dark:text-slate-700"
                                    />
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {t('propertyDetail.noUnitTypes')}
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>
            <Footer />
        </AppLayout>
    );
}
