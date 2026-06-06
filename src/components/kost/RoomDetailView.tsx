/**
 * Room Detail View
 * Displays comprehensive information about a specific unit type
 */

'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/shared/Icon';
import { Badge } from '@/components/ui/badge';
import { ImageGallery } from '@/components/kost/ImageGallery';
import { RoomDetailSidebar } from '@/components/kost/RoomDetailSidebar';
import { FacilityList } from '@/components/kost/FacilityList';
import type { Kost } from '@/lib/types';

interface RoomDetailViewProps {
    kost: Kost;
    roomTypeId: string;
}

export function RoomDetailView({ kost, roomTypeId }: RoomDetailViewProps) {
    const t = useTranslations();
    const locale = useLocale();

    const roomType = kost.roomTypes.find((rt) => rt.id === roomTypeId);
    if (!roomType) {
        return (
            <AppLayout>
                <div className="flex min-h-screen items-center justify-center bg-[#faf9f6] pt-16">
                    <div className="text-center">
                        <Icon name="error" size={64} className="mx-auto mb-4 text-[#83746b]" />
                        <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
                            {t('propertyDetail.unitTypeNotFound')}
                        </h2>
                        <Link
                            href={`/${locale}/kosts/${kost.id}`}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90"
                        >
                            <Icon name="arrow_back" size={20} />
                            {t('propertyDetail.backToProperty')}
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const isAvailable = roomType.status === 'available' && roomType.availableCount > 0;

    return (
        <AppLayout>
            <div className="min-h-screen bg-[#faf9f6] pb-24 pt-16 md:pb-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex-1 space-y-8 p-6 lg:p-8">
                            <ImageGallery
                                images={roomType.images}
                                alt={roomType.name}
                                backHref={`/kosts/${kost.id}`}
                                backLabel={t('propertyDetail.backToProperty')}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="space-y-4"
                            >
                                <div className="flex flex-wrap gap-3">
                                    {kost.isFeatured && (
                                        <Badge className="px-3 py-1 bg-[#e7edf3] dark:bg-slate-700 text-slate-900 dark:text-slate-200">
                                            <Icon name="verified" size={16} className="mr-1.5" />
                                            {t('roomDetail.verified')}
                                        </Badge>
                                    )}
                                    {isAvailable && (
                                        <Badge className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                            <Icon name="key" size={16} className="mr-1.5" />
                                            {t('status.available')}
                                        </Badge>
                                    )}
                                    {!isAvailable && roomType.waitlistEnabled && (
                                        <Badge className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                            <Icon name="schedule" size={16} className="mr-1.5" />
                                            {t('status.waitlist')}
                                        </Badge>
                                    )}
                                </div>
                                <div>
                                    <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                        {roomType.name} - {kost.name}
                                    </h1>
                                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                                        <Icon name="location_on" size={20} className="mr-1 text-primary" />
                                        <p className="text-base font-medium">{kost.location.address}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <hr className="border-slate-200 dark:border-slate-800" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                                    {t('roomDetail.roomDetails')}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                    {roomType.size && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25, duration: 0.4 }}
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                <Icon name="square_foot" size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {t('roomDetail.size')}
                                                </p>
                                                <p className="font-semibold text-slate-900 dark:text-white">
                                                    {roomType.size} m²
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <Icon name="people" size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {t('roomDetail.capacity')}
                                            </p>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {roomType.capacity}
                                            </p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35, duration: 0.4 }}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                            <Icon name="door_front" size={20} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Kamar Mandi
                                            </p>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {t(`bathroom.${roomType.bathroomType}`)}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                                    {t('roomDetail.aboutPlace')}
                                </h3>
                                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
                                    {roomType.description || kost.description}
                                </p>
                                {kost.location.nearbyLandmark && (
                                    <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                                        <div className="flex items-center gap-2">
                                            <Icon name="school" size={20} className="text-primary" />
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                {kost.location.nearbyLandmark}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <h3 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">
                                    {t('facilities.title')}
                                </h3>
                                <FacilityList facilities={kost.facilities} showCategory />
                            </motion.div>

                            {roomType.availableCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="rounded-xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="mb-1 font-semibold text-slate-900 dark:text-white">
                                                {t('roomDetail.availability')}
                                            </h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                                {t('roomDetail.availableRooms', {
                                                    available: roomType.availableCount,
                                                    total: roomType.totalCount,
                                                })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="h-2.5 w-32 rounded-full bg-slate-200 dark:bg-slate-700">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${(roomType.availableCount / roomType.totalCount) * 100}%`,
                                                    }}
                                                    transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                                                    className="h-2.5 rounded-full bg-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <RoomDetailSidebar
                            price={roomType.price}
                            whatsappNumber={kost.whatsappNumber}
                            roomName={roomType.name}
                            propertyName={kost.name}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </AppLayout>
    );
}
