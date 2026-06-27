/**
 * Room Type Card Component
 * Displays individual room type with backend pricing, description, and availability
 */

'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import { WhatsAppInquiryDialog } from '@/components/kost/WhatsAppInquiryDialog';
import type { RoomTypeCardProps } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/format';
import { getDurationLabel } from '@/lib/utils/kost-display';
import { cn } from '@/lib/utils';

export function RoomTypeCard({
    roomType,
    kostName,
    kostId,
    whatsappNumber,
    index = 0,
}: RoomTypeCardProps & { index?: number; kostId?: string }) {
    const t = useTranslations();
    const isAvailable = roomType.status === 'available' && roomType.availableCount > 0;

    const detailHref = kostId ? `/kosts/${kostId}--${roomType.id}` : null;

    const pricingRows =
        roomType.pricings && roomType.pricings.length > 0
            ? roomType.pricings
            : roomType.price > 0
              ? [{ id: roomType.id, durationDays: 30, price: roomType.price }]
              : [];

    const cardContent = (
        <>
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#f5e4d4]">
                {roomType.images?.[0] ? (
                    <Image
                        src={roomType.images[0]}
                        alt={roomType.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Icon name="image" size={48} className="text-[#c4b5a8]" />
                    </div>
                )}

                {isAvailable ? (
                    <div className="absolute bottom-3 left-3">
                        <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                            {t('propertyDetail.availableRooms', {
                                available: roomType.availableCount,
                                total: roomType.totalCount,
                            })}
                        </span>
                    </div>
                ) : (
                    <div className="absolute bottom-3 left-3">
                        <span className="rounded-full bg-[#83746b] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                            {t('status.full')}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5 pb-0">
                <div>
                    <h3 className="mb-1 line-clamp-1 text-lg font-bold text-[#1a1c1a] transition-colors group-hover:text-[#6f4627]">
                        {roomType.name}
                    </h3>
                    {roomType.description && (
                        <p className="line-clamp-2 text-sm leading-relaxed text-[#83746b]">
                            {roomType.description}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-[#83746b]">
                    {roomType.size != null && (
                        <span className="inline-flex items-center gap-1">
                            <Icon name="square_foot" size={14} />
                            {roomType.size} m²
                        </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                        <Icon name="group" size={14} />
                        {roomType.capacity}
                    </span>
                </div>

                {pricingRows.length > 0 ? (
                    <ul className="space-y-1.5 rounded-xl border border-[#f0e6dc] bg-[#faf9f6] p-3">
                        {pricingRows.map((pricing) => (
                            <li
                                key={`${pricing.id}-${pricing.durationDays}`}
                                className="flex items-center justify-between gap-3 text-sm"
                            >
                                <span className="text-[#83746b]">
                                    {getDurationLabel(pricing.durationDays, t)}
                                </span>
                                <span className="shrink-0 font-semibold text-[#1a1c1a]">
                                    {formatCurrency(pricing.price)}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-xs text-[#83746b]">{t('search.noPricing')}</p>
                )}
            </div>
        </>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="h-full"
        >
            <div
                className={cn(
                    'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8dfd6] bg-white transition-all duration-300',
                    'hover:-translate-y-1 hover:border-[#d4c4b4] hover:shadow-lg',
                    !isAvailable && 'opacity-80',
                )}
            >
                {detailHref ? (
                    <Link href={detailHref} className="block">
                        {cardContent}
                    </Link>
                ) : (
                    <div>{cardContent}</div>
                )}

                <div className="mt-auto grid grid-cols-2 gap-2 border-t border-[#f0e6dc] p-5 pt-4">
                    {detailHref ? (
                        <Link
                            href={detailHref}
                            className="flex items-center justify-center gap-1.5 rounded-lg bg-[#6f4627] px-3 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#5a3820]"
                        >
                            <Icon name="visibility" size={14} />
                            {t('cta.viewDetails')}
                        </Link>
                    ) : (
                        <span className="flex items-center justify-center gap-1.5 rounded-lg bg-[#6f4627] px-3 py-2.5 text-xs font-semibold text-white">
                            <Icon name="visibility" size={14} />
                            {t('cta.viewDetails')}
                        </span>
                    )}
                    {isAvailable ? (
                        <WhatsAppInquiryDialog
                            phoneNumber={whatsappNumber}
                            propertyName={kostName}
                            roomName={roomType.name}
                            pricings={roomType.pricings ?? []}
                            fallbackPrice={roomType.price}
                            variant="compact"
                            className="h-full w-full justify-center rounded-lg px-3 py-2.5 text-xs font-semibold"
                        />
                    ) : (
                        <span className="flex h-full items-center justify-center rounded-lg bg-[#f0e6dc] px-3 py-2.5 text-xs font-semibold text-[#83746b]">
                            {t('status.full')}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
