/**
 * Search Hero Section Component
 * Hero section for the search/cari kost page
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import { Button } from '@/components/ui/button';

interface SearchHeroProps {
    onFilterFocus?: () => void;
}

export function SearchHero({ onFilterFocus }: SearchHeroProps) {
    const t = useTranslations('search');

    return (
        <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center bg-[#0f172a] overflow-hidden">
            {/* Background Image */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1521333573892-e44906baee46?w=1920&h=1080&fit=crop")',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/70 to-[#0f172a]/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />
            </motion.div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px]" />

            {/* Content */}
            <div className="relative z-10 max-w-4xl w-full px-6 lg:px-10 flex flex-col items-center gap-8 text-center">
                {/* Accent Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 bg-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.5)] rounded-full"
                />

                {/* Title */}
                <div className="overflow-visible">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 50 }}
                        className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
                    >
                        {t('title')}
                    </motion.h1>
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-slate-300 text-lg md:text-xl font-light max-w-2xl leading-relaxed"
                >
                    {t('placeholder')}
                </motion.p>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="pt-4"
                >
                    <Button
                        onClick={onFilterFocus}
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-12 rounded-lg transition-all hover:scale-105 shadow-lg shadow-primary/30"
                    >
                        <Icon name="search" size={20} className="mr-2" />
                        {t('title')}
                    </Button>
                </motion.div>
            </div>
        </div>
    );
}
