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
        <section className="relative flex min-h-[500px] w-full items-center justify-center overflow-hidden bg-[#faf9f6] md:min-h-[600px]">
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#3b2311]/85 via-[#6f4627]/65 to-[#faf9f6]/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a130f] via-transparent to-transparent opacity-90" />
            </motion.div>

            {/* Decorative Gradients */}
            <div className="pointer-events-none absolute top-0 right-0 h-[420px] w-[420px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#f5e4d4]/70 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[380px] w-[380px] translate-y-1/3 -translate-x-1/3 rounded-full bg-[#e3e2e0]/70 blur-[100px]" />

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#faf9f6]/80 md:flex"
            >
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Icon name="keyboard_arrow_down" size={24} />
                </motion.div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex w-full max-w-4xl flex-col items-start gap-8 px-6 lg:px-10">
                {/* Accent Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 rounded-full bg-[#6f4627] shadow-[0_0_16px_rgba(111,70,39,0.45)]"
                />

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#faf9f6]/90 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#6f4627] backdrop-blur-sm"
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
                        className="text-5xl font-bold leading-[1.1] tracking-tight text-[#faf9f6] drop-shadow-md md:text-6xl lg:text-7xl"
                    >
                        {t('title')}
                    </motion.h1>
                </div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="max-w-2xl border-l-2 border-[#e3e2e0] pl-6 text-lg font-light leading-relaxed text-[#f5f2ee] md:text-xl"
                >
                    {t('description')}
                </motion.p>
            </div>
        </section>
    );
}
