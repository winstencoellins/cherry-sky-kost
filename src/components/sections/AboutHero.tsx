/**
 * About Hero Section Component
 * Hero section for the about page with title and introductory content
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

export function AboutHero() {
    const t = useTranslations('about.hero');

    return (
        <div className="relative w-full min-h-[500px] md:min-h-[600px] flex items-center justify-center bg-[#0f172a] overflow-hidden">
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
                        backgroundImage: 'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop")',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/70 to-[#0f172a]/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />
            </motion.div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#137fec]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px]" />

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 text-white/50"
            >
                <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Icon name="keyboard_arrow_down" size={24} />
                </motion.div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl w-full px-6 lg:px-10 flex flex-col items-start gap-8">
                {/* Accent Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 bg-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.5)] rounded-full"
                />

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#d4af37] text-xs font-bold tracking-widest uppercase backdrop-blur-sm"
                >
                    <Icon name="info" size={16} />
                    <span>{t('subtitle')}</span>
                </motion.div>

                {/* Title */}
                <div className="overflow-visible">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 50 }}
                        className="text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
                    >
                        {t('title')}
                    </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-slate-300 text-lg md:text-xl font-light max-w-2xl leading-relaxed border-l-2 border-[#137fec] pl-6"
                >
                    {t('description')}
                </motion.p>
            </div>
        </div>
    );
}
