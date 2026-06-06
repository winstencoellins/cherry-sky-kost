/**
 * Image Gallery Component
 * Interactive image gallery with main hero and thumbnail grid
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Icon } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';

interface ImageGalleryProps {
    images: string[];
    alt?: string;
    variant?: 'default' | 'compact';
    backHref?: string;
    backLabel?: string;
}

export function ImageGallery({
    images,
    alt = 'Room image',
    variant = 'default',
    backHref,
    backLabel,
}: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const t = useTranslations();

    const visibleThumbnails = images.slice(1, variant === 'compact' ? 3 : 4);
    const remainingCount = Math.max(0, images.length - (variant === 'compact' ? 4 : 4));

    const isCompact = variant === 'compact';

    return (
        <>
            <div className={cn('space-y-4', isCompact && 'space-y-3')}>
                {backHref && backLabel && (
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#51443c] transition-colors hover:text-[#6f4627] dark:text-slate-400 dark:hover:text-primary"
                    >
                        <Icon name="arrow_back" size={18} />
                        {backLabel}
                    </Link>
                )}

                {/* Main Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className={cn(
                        'relative w-full cursor-pointer overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-700 group',
                        isCompact
                            ? 'aspect-[16/9] max-h-48 sm:max-h-56 md:max-h-64'
                            : 'aspect-video',
                    )}
                    onClick={() => setShowAllPhotos(true)}
                    whileHover={isCompact ? undefined : { scale: 1.02 }}
                >
                    <img
                        src={images[selectedIndex] || '/placeholder-room.jpg'}
                        alt={`${alt} ${selectedIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 hover:bg-black/70 transition-colors">
                        <Icon name="photo_library" size={14} />
                        <span>{t('roomDetail.viewAllPhotos', { count: images.length })}</span>
                    </div>
                </motion.div>

                {/* Thumbnails */}
                {images.length > 1 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className={cn(
                        'grid gap-2',
                        isCompact ? 'grid-cols-3 sm:grid-cols-4' : 'grid-cols-4 gap-4',
                    )}
                >
                    {visibleThumbnails.map((image, index) => {
                        const actualIndex = index + 1;
                        return (
                            <motion.div
                                key={actualIndex}
                                className={cn(
                                    'relative cursor-pointer overflow-hidden rounded-lg bg-slate-200 dark:bg-slate-700',
                                    isCompact ? 'aspect-[4/3] max-h-16 sm:max-h-20' : 'aspect-[4/3]',
                                    selectedIndex === actualIndex && 'ring-2 ring-primary',
                                )}
                                onClick={() => setSelectedIndex(actualIndex)}
                                whileHover={isCompact ? undefined : { scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <img
                                    src={image}
                                    alt={`${alt} ${actualIndex + 1}`}
                                    className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                />
                            </motion.div>
                        );
                    })}
                    {remainingCount > 0 && (
                        <div
                            className={cn(
                                'flex cursor-pointer items-center justify-center rounded-lg bg-slate-100 transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700',
                                isCompact ? 'aspect-[4/3] max-h-16 sm:max-h-20' : 'aspect-[4/3]',
                            )}
                            onClick={() => setShowAllPhotos(true)}
                        >
                            <span className={cn(
                                'font-semibold text-slate-600 dark:text-slate-300',
                                isCompact ? 'text-xs' : 'text-sm',
                            )}>
                                {t('roomDetail.morePhotos', { count: remainingCount })}
                            </span>
                        </div>
                    )}
                </motion.div>
                )}
            </div>

            {/* Full Screen Gallery Modal */}
            <AnimatePresence>
                {showAllPhotos && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
                        onClick={() => setShowAllPhotos(false)}
                    >
                        <div className="relative h-full w-full flex items-center justify-center p-4">
                            <button
                                className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors z-10"
                                onClick={() => setShowAllPhotos(false)}
                            >
                                <Icon name="close" size={24} />
                            </button>
                            <div className="max-w-6xl w-full">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {images.map((image, index) => (
                                        <motion.img
                                            key={index}
                                            src={image}
                                            alt={`${alt} ${index + 1}`}
                                            className="w-full aspect-video object-cover rounded-lg"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
