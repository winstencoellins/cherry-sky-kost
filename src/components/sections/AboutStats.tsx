/**
 * About Stats Section Component
 * Displays achievement statistics with animated counters
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Icon } from '@/components/shared/Icon';

function AnimatedCounter({ end, suffix = '', duration = 2 }: { end: number; suffix?: string; duration?: number }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / (duration * 1000), 1);

            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOutCubic * end));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    return (
        <div ref={ref} className="tabular-nums">
            {count}{suffix}
        </div>
    );
}

type StatAccent = 'primary' | 'tertiary' | 'success' | 'gold';

const accentStyles: Record<StatAccent, { icon: string; glow: string; value: string }> = {
    primary: {
        icon: 'bg-gradient-to-br from-[#6f4627] to-[#8b5e3c] shadow-[0_8px_24px_rgba(111,70,39,0.35)]',
        glow: 'bg-[#6f4627]',
        value: 'text-[#f4bb92]',
    },
    tertiary: {
        icon: 'bg-gradient-to-br from-[#415167] to-[#596980] shadow-[0_8px_24px_rgba(65,81,103,0.35)]',
        glow: 'bg-[#415167]',
        value: 'text-[#b7c8e1]',
    },
    success: {
        icon: 'bg-gradient-to-br from-[#047857] to-[#059669] shadow-[0_8px_24px_rgba(4,120,87,0.35)]',
        glow: 'bg-[#047857]',
        value: 'text-[#6ee7b7]',
    },
    gold: {
        icon: 'bg-gradient-to-br from-[#d4af37] to-[#b8941f] shadow-[0_8px_24px_rgba(212,175,55,0.35)]',
        glow: 'bg-[#d4af37]',
        value: 'text-[#f4bb92]',
    },
};

export function AboutStats() {
    const t = useTranslations('about.stats');

    const stats: { icon: string; value: number; suffix: string; label: string; accent: StatAccent }[] = [
        {
            icon: 'groups',
            value: 500,
            suffix: '+',
            label: t('happyResidents'),
            accent: 'primary',
        },
        {
            icon: 'home',
            value: 3,
            suffix: '+',
            label: t('properties'),
            accent: 'tertiary',
        },
        {
            icon: 'verified',
            value: 5,
            suffix: '+',
            label: t('yearsExperience'),
            accent: 'success',
        },
        {
            icon: 'thumb_up',
            value: 98,
            suffix: '%',
            label: t('satisfactionRate'),
            accent: 'gold',
        },
    ];

    return (
        <section className="relative w-full overflow-hidden bg-[#2f312f] py-24 px-6 text-[#f2f1ee] lg:px-10">
            {/* Warm ambient background */}
            <div className="pointer-events-none absolute top-0 right-0 h-[520px] w-[520px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#6f4627]/20 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[420px] w-[420px] translate-y-1/3 -translate-x-1/3 rounded-full bg-[#f5e4d4]/10 blur-[100px]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8b5e3c]/40 to-transparent" />

            <div className="relative z-10 mx-auto max-w-[1080px]">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#8b5e3c]/30 bg-[#6f4627]/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#f4bb92]"
                    >
                        <Icon name="star" size={14} filled />
                        <span>{t('subtitle')}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-4 text-3xl font-bold tracking-tight text-[#faf9f6] lg:text-5xl"
                    >
                        {t('title')}
                    </motion.h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
                    {stats.map((stat, index) => {
                        const accent = accentStyles[stat.accent];
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="group relative rounded-2xl border border-[#474746] bg-[#3d3f3d]/60 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#8b5e3c]/40 hover:bg-[#3d3f3d]/80"
                            >
                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                                    className="mb-4 inline-flex items-center justify-center"
                                >
                                    <div
                                        className={`flex h-14 w-14 items-center justify-center rounded-xl text-white transition-transform duration-300 group-hover:scale-110 ${accent.icon}`}
                                    >
                                        <Icon name={stat.icon} size={28} />
                                    </div>
                                </motion.div>

                                {/* Value */}
                                <div className={`mb-2 text-3xl font-bold lg:text-4xl ${accent.value}`}>
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>

                                {/* Label */}
                                <p className="text-sm font-medium text-[#c8c6c5] lg:text-base">
                                    {stat.label}
                                </p>

                                {/* Hover glow */}
                                <div
                                    className={`absolute inset-0 -z-10 rounded-2xl opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-15 ${accent.glow}`}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
