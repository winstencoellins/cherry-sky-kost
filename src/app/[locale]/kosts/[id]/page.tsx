/**
 * Room Detail Page
 * Displays comprehensive information about a specific room in a kost property
 */

'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Icon } from '@/components/shared/Icon';
import { Badge } from '@/components/ui/badge';
import { ImageGallery } from '@/components/kost/ImageGallery';
import { RoomDetailSidebar } from '@/components/kost/RoomDetailSidebar';
import { FacilityList } from '@/components/kost/FacilityList';
import { cn } from '@/lib/utils';
import { useKost } from '@/lib/hooks/use-kost-data';

export default function RoomDetailPage() {
    const t = useTranslations();
    const locale = useLocale();
    const params = useParams();
    const roomId = params.id as string;

    // Extract kost ID and room type ID from the room ID
    // Format: kostId--roomTypeId (using double dash as separator)
    const separatorIndex = roomId?.indexOf('--');
    const kostId = separatorIndex > 0 ? roomId.substring(0, separatorIndex) : roomId;
    const roomTypeId = separatorIndex > 0 ? roomId.substring(separatorIndex + 2) : '';

    const { data: kost, isLoading } = useKost(kostId);

    if (isLoading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-[#137fec] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">{t('common.loading')}</p>
                    </div>
                </div>
            </AppLayout>
        );
    }

    if (!kost) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <Icon name="error" size={64} className="text-slate-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            {locale === 'id' ? 'Kamar tidak ditemukan' : 'Room not found'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            {locale === 'id'
                                ? 'Kamar yang Anda cari tidak tersedia'
                                : 'The room you are looking for is not available'}
                        </p>
                        <Link
                            href={`/${locale}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#137fec] text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <Icon name="home" size={20} />
                            {t('roomDetail.backToHome')}
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    const roomType = kost.roomTypes.find((rt) => rt.id === roomTypeId) || kost.roomTypes[0];
    const isAvailable = roomType.status === 'available' && roomType.availableCount > 0;

    return (
        <AppLayout>
            {/* Header Toolbar */}
            <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#15202b]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <Link
                            href={`/${locale}`}
                            className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#137fec] dark:hover:text-[#137fec] transition-colors"
                        >
                            <Icon name="arrow_back" size={20} />
                            <span className="hidden sm:inline font-medium">{t('roomDetail.backToHome')}</span>
                        </Link>
                        <div className="flex gap-2">
                            <button
                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                title={t('roomDetail.share')}
                            >
                                <Icon name="share" size={24} />
                            </button>
                            <button
                                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                title={t('roomDetail.save')}
                            >
                                <Icon name="favorite_border" size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-background-light dark:bg-background-dark min-h-screen pb-24 md:pb-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Column: Details */}
                        <div className="flex-1 p-6 lg:p-8 space-y-8">
                            {/* Image Gallery */}
                            <ImageGallery images={roomType.images} alt={roomType.name} />

                            {/* Header Info */}
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
                                    <h1 className="text-slate-900 dark:text-white tracking-tight text-3xl sm:text-4xl font-bold leading-tight mb-2">
                                        {roomType.name} - {kost.name}
                                    </h1>
                                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                                        <Icon name="location_on" size={20} className="mr-1 text-[#137fec]" />
                                        <p className="text-base font-medium">{kost.location.address}</p>
                                    </div>
                                </div>
                            </motion.div>

                            <hr className="border-slate-200 dark:border-slate-800" />

                            {/* Room Details */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                    {t('roomDetail.roomDetails')}
                                </h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {roomType.size && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.25, duration: 0.4 }}
                                            className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#137fec]/10">
                                                <Icon name="square_foot" size={20} className="text-[#137fec]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{t('roomDetail.size')}</p>
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
                                        className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#137fec]/10">
                                            <Icon name="people" size={20} className="text-[#137fec]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{t('roomDetail.capacity')}</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {roomType.capacity}
                                            </p>
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.35, duration: 0.4 }}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#137fec]/10">
                                            <Icon name="door_front" size={20} className="text-[#137fec]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Kamar Mandi</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {t(`bathroom.${roomType.bathroomType}`)}
                                            </p>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* Description */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                            >
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    {t('roomDetail.aboutPlace')}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                                    {roomType.description || kost.description}
                                </p>
                                {kost.location.nearbyLandmark && (
                                    <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                        <div className="flex items-center gap-2">
                                            <Icon name="school" size={20} className="text-[#137fec]" />
                                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                                {kost.location.nearbyLandmark}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>

                            {/* Amenities */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                            >
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                                    {t('facilities.title')}
                                </h3>
                                <FacilityList facilities={kost.facilities} showCategory />
                            </motion.div>

                            {/* Room Availability */}
                            {roomType.availableCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
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
                                            <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${(roomType.availableCount / roomType.totalCount) * 100}%`,
                                                    }}
                                                    transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                                                    className="bg-[#137fec] h-2.5 rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Right Column: Sticky Sidebar */}
                        <RoomDetailSidebar
                            price={roomType.price}
                            whatsappNumber={kost.whatsappNumber}
                            roomName={roomType.name}
                            propertyName={kost.name}
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
