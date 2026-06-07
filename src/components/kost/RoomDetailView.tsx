/**
 * Room Detail View
 * Displays comprehensive information about a specific unit type
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/shared/Icon';
import { Badge } from '@/components/ui/badge';
import { ImageGallery } from '@/components/kost/ImageGallery';
import { RoomDetailSidebar } from '@/components/kost/RoomDetailSidebar';
import { RoomTypeCard } from '@/components/kost/RoomTypeCard';
import { KostBreadcrumb, useKostBreadcrumbs } from '@/components/kost/KostBreadcrumb';
import type { Kost } from '@/lib/types';
import { sortRoomTypesForDisplay } from '@/lib/utils/kost-display';

interface RoomDetailViewProps {
    kost: Kost;
    roomTypeId: string;
}

export function RoomDetailView({ kost, roomTypeId }: RoomDetailViewProps) {
    const t = useTranslations();
    const crumbs = useKostBreadcrumbs();

    const roomType = kost.roomTypes.find((rt) => rt.id === roomTypeId);
    if (!roomType) {
        return (
            <AppLayout>
                <div className="flex min-h-screen items-center justify-center bg-[#faf9f6] pt-16">
                    <div className="text-center">
                        <Icon name="error" size={64} className="mx-auto mb-4 text-[#83746b]" />
                        <h2 className="mb-2 text-2xl font-bold text-[#1a1c1a]">
                            {t('propertyDetail.unitTypeNotFound')}
                        </h2>
                        <Link
                            href={`/kosts/${kost.id}`}
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#6f4627] px-6 py-3 text-white transition-colors hover:bg-[#5a3820]"
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
    const otherRoomTypes = sortRoomTypesForDisplay(
        kost.roomTypes.filter((rt) => rt.id !== roomTypeId),
    );

    const breadcrumbItems = [
        crumbs.home,
        crumbs.search,
        crumbs.property(kost.name, kost.id),
        crumbs.unitType(roomType.name),
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-[#faf9f6] pb-24 pt-16 md:pb-8">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex-1 space-y-8 p-6 lg:p-8">
                            <ImageGallery
                                images={roomType.images}
                                alt={roomType.name}
                                header={<KostBreadcrumb items={breadcrumbItems} className="mb-1" />}
                            />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                                className="space-y-4"
                            >
                                <div className="flex flex-wrap gap-2">
                                    {kost.isFeatured && (
                                        <Badge className="border border-[#e8dfd6] bg-[#f5e4d4] px-3 py-1 text-[#6f4627]">
                                            <Icon name="verified" size={16} className="mr-1.5" />
                                            {t('roomDetail.verified')}
                                        </Badge>
                                    )}
                                    {isAvailable && (
                                        <Badge className="border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                                            <Icon name="key" size={16} className="mr-1.5" />
                                            {t('status.available')}
                                        </Badge>
                                    )}
                                    {!isAvailable && roomType.waitlistEnabled && (
                                        <Badge className="border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
                                            <Icon name="schedule" size={16} className="mr-1.5" />
                                            {t('status.waitlist')}
                                        </Badge>
                                    )}
                                </div>
                                <div>
                                    <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight text-[#1a1c1a] sm:text-4xl">
                                        {roomType.name}
                                    </h1>
                                    <p className="mb-1 text-base font-medium text-[#83746b]">{kost.name}</p>
                                    <div className="flex items-center text-[#83746b]">
                                        <Icon name="location_on" size={20} className="mr-1 text-[#6f4627]" />
                                        <p className="text-base font-medium">
                                            {kost.location.address}
                                            {kost.location.city ? `, ${kost.location.city}` : ''}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <hr className="border-[#e8dfd6]" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <h3 className="mb-4 text-xl font-bold text-[#1a1c1a]">
                                    {t('roomDetail.roomDetails')}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 sm:max-w-md">
                                    {roomType.size != null && (
                                        <div className="flex items-center gap-3 rounded-xl border border-[#e8dfd6] bg-white p-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5e4d4]">
                                                <Icon name="square_foot" size={20} className="text-[#6f4627]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#83746b]">{t('roomDetail.size')}</p>
                                                <p className="font-semibold text-[#1a1c1a]">{roomType.size} m²</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 rounded-xl border border-[#e8dfd6] bg-white p-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5e4d4]">
                                            <Icon name="people" size={20} className="text-[#6f4627]" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#83746b]">{t('roomDetail.capacity')}</p>
                                            <p className="font-semibold text-[#1a1c1a]">{roomType.capacity}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {roomType.description && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <h3 className="mb-3 text-xl font-bold text-[#1a1c1a]">
                                        {t('roomDetail.aboutPlace')}
                                    </h3>
                                    <p className="text-base leading-relaxed text-[#51443c]">
                                        {roomType.description}
                                    </p>
                                    {kost.location.nearbyLandmark && (
                                        <div className="mt-4 rounded-xl border border-[#e8dfd6] bg-[#f5e4d4]/40 p-4">
                                            <div className="flex items-center gap-2">
                                                <Icon name="school" size={20} className="text-[#6f4627]" />
                                                <p className="text-sm font-medium text-[#1a1c1a]">
                                                    {kost.location.nearbyLandmark}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {roomType.availableCount > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className="rounded-xl border border-[#e8dfd6] bg-white p-6"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <h4 className="mb-1 font-semibold text-[#1a1c1a]">
                                                {t('roomDetail.availability')}
                                            </h4>
                                            <p className="text-sm text-[#83746b]">
                                                {t('roomDetail.availableRooms', {
                                                    available: roomType.availableCount,
                                                    total: roomType.totalCount,
                                                })}
                                            </p>
                                        </div>
                                        <div className="h-2.5 w-32 rounded-full bg-[#f0e6dc]">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${(roomType.availableCount / roomType.totalCount) * 100}%`,
                                                }}
                                                transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                                                className="h-2.5 rounded-full bg-[#6f4627]"
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {otherRoomTypes.length > 0 && (
                                <motion.section
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                    className="space-y-5 border-t border-[#e8dfd6] pt-8"
                                >
                                    <div>
                                        <h3 className="text-xl font-bold text-[#1a1c1a]">
                                            {t('propertyDetail.otherRoomTypes')}
                                        </h3>
                                        <p className="mt-1 text-sm text-[#83746b]">
                                            {t('propertyDetail.otherRoomTypesDescription')}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {otherRoomTypes.map((other, index) => (
                                            <RoomTypeCard
                                                key={other.id}
                                                roomType={other}
                                                kostName={kost.name}
                                                kostId={kost.id}
                                                whatsappNumber={kost.whatsappNumber}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                </motion.section>
                            )}
                        </div>

                        <RoomDetailSidebar
                            pricings={roomType.pricings ?? []}
                            fallbackPrice={roomType.price}
                            whatsappNumber={kost.whatsappNumber}
                            roomName={roomType.name}
                            propertyName={kost.name}
                            availableCount={roomType.availableCount}
                            totalCount={roomType.totalCount}
                        />
                    </div>
                </div>
            </div>
            <Footer />
        </AppLayout>
    );
}
