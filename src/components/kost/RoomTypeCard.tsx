/**
 * Room Type Card Component
 * Displays individual room type with pricing and availability
 */

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import type { RoomTypeCardProps } from '@/lib/types';
import {
    formatCurrency,
    formatAvailability,
    generateInquiryMessage,
} from '@/lib/utils/format';
import { cn } from '@/lib/utils';

export function RoomTypeCard({
    roomType,
    kostName,
    kostId,
    whatsappNumber,
    onBookClick,
    index = 0,
}: RoomTypeCardProps & { index?: number; kostId?: string }) {
    const t = useTranslations();
    const locale = useLocale();
    const isAvailable = roomType.status === 'available' && roomType.availableCount > 0;
    const isAlmostFull = isAvailable && roomType.availableCount <= 2;

    const bathroomText =
        roomType.bathroomType === 'dalam'
            ? t('bathroom.inside')
            : roomType.bathroomType === 'luar'
                ? t('bathroom.outside')
                : t('bathroom.shared');

    const whatsappMessage = generateInquiryMessage(kostName, roomType.name);
    const detailUrl = kostId ? `/${locale}/kosts/${kostId}--${roomType.id}` : '#';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="h-full"
        >
            <Link href={detailUrl} className="block h-full">
                <div className={cn(
                    "group relative h-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden transition-all duration-500 cursor-pointer",
                    "hover:shadow-xl hover:-translate-y-1 border border-slate-100 dark:border-slate-800",
                    !isAvailable && "opacity-70"
                )}>
                    {/* Image Section */}
                    <div className="relative aspect-16/10 w-full overflow-hidden">
                        {roomType.images && roomType.images[0] ? (
                            <Image
                                src={roomType.images[0]}
                                alt={roomType.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-300">
                                <Icon name="image" size={48} />
                            </div>
                        )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                        {isAvailable ? (
                            isAlmostFull ? (
                                <span className="px-2.5 py-1 text-[10px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-lg">
                                    {roomType.availableCount} tersisa
                                </span>
                            ) : (
                                <span className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50/90 dark:bg-emerald-500/20 dark:text-emerald-300 rounded-full backdrop-blur-sm">
                                    Tersedia
                                </span>
                            )
                        ) : (
                            <span className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-slate-200/90 dark:bg-slate-700/50 dark:text-slate-400 rounded-full backdrop-blur-sm">
                                Penuh
                            </span>
                        )}
                    </div>
                </div>

                {/* Content Section - Compact */}
                <div className="flex flex-col flex-1 p-4 gap-3">
                    <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                            {roomType.name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Icon name="bathroom" size={14} />
                        <span>{bathroomText}</span>
                        <span className="w-0.5 h-0.5 bg-slate-300 rounded-full" />
                        <Icon name="group" size={14} />
                        <span>{roomType.capacity} orang</span>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3">
                        <div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(roomType.price)}
                                <span className="text-xs text-slate-400 font-normal ml-1">/bln</span>
                            </p>
                        </div>

                        <div onClick={(e) => e.preventDefault()}>
                            {isAvailable ? (
                                <WhatsAppButton
                                    phoneNumber={whatsappNumber}
                                    message={whatsappMessage}
                                    variant="compact"
                                    className="h-9 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all hover:shadow-lg hover:shadow-primary/30"
                                    label={t('cta.bookNow')}
                                />
                            ) : (
                                <Button disabled size="sm" className="rounded-xl h-9 bg-slate-100 text-slate-400 text-xs">
                                    Penuh
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
        </motion.div>
    );
}
