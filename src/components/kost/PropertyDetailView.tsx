/**
 * Property Detail View
 * Shows property overview and recommended room types for a kost property
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
import { KostBreadcrumb, useKostBreadcrumbs } from '@/components/kost/KostBreadcrumb';
import type { Kost } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/format';
import { sortRoomTypesForDisplay } from '@/lib/utils/kost-display';

interface PropertyDetailViewProps {
    kost: Kost;
}

export function PropertyDetailView({ kost }: PropertyDetailViewProps) {
    const t = useTranslations();
    const crumbs = useKostBreadcrumbs();
    const isAlmostFull = kost.availableRooms > 0 && kost.availableRooms <= 3;
    const sortedRoomTypes = sortRoomTypesForDisplay(kost.roomTypes);

    const breadcrumbItems = [
        crumbs.home,
        crumbs.search,
        crumbs.property(kost.name, kost.id),
    ];

    return (
        <AppLayout>
            <div className="bg-[#faf9f6] pt-16">
                <div className="mx-auto w-full max-w-[1080px] px-6 py-8 lg:px-10">
                    <div className="flex flex-col gap-8">
                        <ImageGallery
                            images={kost.images}
                            alt={kost.name}
                            variant="compact"
                            header={<KostBreadcrumb items={breadcrumbItems} className="mb-1" />}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="flex flex-wrap gap-2">
                                {kost.isFeatured && (
                                    <Badge className="border border-[#e8dfd6] bg-[#f5e4d4] px-3 py-1 text-[#6f4627]">
                                        <Icon name="star" size={16} className="mr-1.5" filled />
                                        {t('property.flagship')}
                                    </Badge>
                                )}
                                {kost.availableRooms > 0 && (
                                    <Badge className="border border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                                        <Icon name="key" size={16} className="mr-1.5" />
                                        {t('propertyDetail.availableRooms', {
                                            available: kost.availableRooms,
                                            total: kost.totalRooms,
                                        })}
                                    </Badge>
                                )}
                                {isAlmostFull && (
                                    <Badge className="border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
                                        <Icon name="schedule" size={14} className="mr-1.5" />
                                        {t('status.almostFull')}
                                    </Badge>
                                )}
                            </div>

                            <div>
                                <h1 className="mb-2 text-3xl font-bold tracking-tight text-[#1a1c1a] sm:text-4xl">
                                    {kost.name}
                                </h1>
                                <div className="flex items-start gap-2 text-[#83746b]">
                                    <Icon name="location_on" size={20} className="mt-0.5 shrink-0 text-[#6f4627]" />
                                    <p className="text-base font-medium">
                                        {kost.location.address}
                                        {kost.location.city ? `, ${kost.location.city}` : ''}
                                    </p>
                                </div>
                            </div>

                            {kost.priceRange.min > 0 && (
                                <p className="text-lg text-[#51443c]">
                                    <span className="text-sm font-semibold uppercase tracking-wide text-[#83746b]">
                                        {t('pricing.startingFrom')}{' '}
                                    </span>
                                    <span className="font-bold text-[#1a1c1a]">
                                        {formatCurrency(kost.priceRange.min)}
                                    </span>
                                </p>
                            )}
                        </motion.div>

                        {kost.description && (
                            <>
                                <hr className="border-[#e8dfd6]" />
                                <section>
                                    <h2 className="mb-3 text-xl font-bold text-[#1a1c1a]">
                                        {t('propertyDetail.aboutProperty')}
                                    </h2>
                                    <p className="text-base leading-relaxed text-[#51443c]">
                                        {kost.description}
                                    </p>
                                </section>
                            </>
                        )}

                        <hr className="border-[#e8dfd6]" />

                        <section className="flex flex-col gap-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[#1a1c1a]">
                                    {t('propertyDetail.unitTypes')}
                                </h2>
                                <p className="mt-1 text-sm text-[#83746b]">
                                    {t('propertyDetail.unitTypesDescription')}
                                </p>
                            </div>

                            {sortedRoomTypes.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {sortedRoomTypes.map((roomType, index) => (
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
                                <div className="rounded-2xl border border-[#e8dfd6] bg-white px-6 py-12 text-center">
                                    <Icon
                                        name="meeting_room"
                                        size={48}
                                        className="mx-auto mb-4 text-[#d4c4b4]"
                                    />
                                    <p className="text-sm text-[#83746b]">
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
