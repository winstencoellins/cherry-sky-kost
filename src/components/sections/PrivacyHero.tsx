/**
 * Privacy Policy Hero Section
 * Hero section for privacy policy page with background and animations
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

export function PrivacyHero() {
    const t = useTranslations('privacy.hero');

    return (
        <section className="relative w-full py-32 px-6 lg:px-10 bg-gradient-to-b from-[#0f172a] via-slate-900 to-white dark:to-slate-900 overflow-hidden min-h-[500px] flex items-center justify-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ y: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute -top-40 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"
                />
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-40 left-0 w-[400px] h-[400px] bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none"
                />
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto text-center relative z-10">
                {/* Icon Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center justify-center mb-8"
                >
                    <div className="p-4 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-sm">
                        <Icon name="privacy_tip" size={40} className="text-primary" />
                    </div>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
                >
                    {t('title')}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg lg:text-2xl text-blue-200 mb-6 font-semibold"
                >
                    {t('subtitle')}
                </motion.p>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
                >
                    {t('description')}
                </motion.p>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="h-1 w-24 bg-gradient-to-r from-primary to-[#d4af37] rounded-full mx-auto mt-8"
                />
            </div>
        </section>
    );
}
