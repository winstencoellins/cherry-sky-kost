/**
 * About Values Section Component
 * Displays core values in a card grid
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

export function AboutValues() {
    const t = useTranslations('about.values');

    const values = [
        {
            icon: 'verified',
            titleKey: 'quality.title',
            descKey: 'quality.description',
            color: 'blue',
        },
        {
            icon: 'verified_user',
            titleKey: 'trust.title',
            descKey: 'trust.description',
            color: 'emerald',
        },
        {
            icon: 'groups',
            titleKey: 'community.title',
            descKey: 'community.description',
            color: 'purple',
        },
        {
            icon: 'lightbulb',
            titleKey: 'innovation.title',
            descKey: 'innovation.description',
            color: 'amber',
        },
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; icon: string; shadow: string }> = {
            blue: {
                bg: 'from-[#137fec] to-[#0c5eb8]',
                icon: 'text-[#137fec]',
                shadow: 'shadow-blue-500/20',
            },
            emerald: {
                bg: 'from-emerald-500 to-emerald-700',
                icon: 'text-emerald-500',
                shadow: 'shadow-emerald-500/20',
            },
            purple: {
                bg: 'from-purple-500 to-purple-700',
                icon: 'text-purple-500',
                shadow: 'shadow-purple-500/20',
            },
            amber: {
                bg: 'from-[#d4af37] to-[#b8941f]',
                icon: 'text-[#d4af37]',
                shadow: 'shadow-yellow-500/20',
            },
        };
        return colors[color] || colors.blue;
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <section className="w-full py-24 px-6 lg:px-10 bg-[#f6f7f8] dark:bg-[#101922]">
            <div className="max-w-[1080px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#137fec]/10 border border-[#137fec]/20 text-[#137fec] dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <Icon name="star" size={14} filled />
                        <span>{t('subtitle')}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
                    >
                        {t('title')}
                    </motion.h2>
                </div>

                {/* Values Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {values.map((value, index) => {
                        const colors = getColorClasses(value.color);
                        return (
                            <motion.div
                                key={index}
                                variants={item}
                                className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Icon Container */}
                                <div className="relative mb-5">
                                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} text-white shadow-lg ${colors.shadow} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon name={value.icon} size={28} />
                                    </div>
                                    {/* Glow effect */}
                                    <div className={`absolute inset-0 w-14 h-14 rounded-xl bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    {t(value.titleKey)}
                                </h3>
                                
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                    {t(value.descKey)}
                                </p>

                                {/* Decorative corner */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-slate-50 dark:to-slate-700/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
