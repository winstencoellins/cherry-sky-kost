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

            // Ease out cubic
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

export function AboutStats() {
    const t = useTranslations('about.stats');

    const stats = [
        {
            icon: 'groups',
            value: 500,
            suffix: '+',
            label: t('happyResidents'),
            color: 'blue',
        },
        {
            icon: 'home',
            value: 3,
            suffix: '+',
            label: t('properties'),
            color: 'purple',
        },
        {
            icon: 'verified',
            value: 5,
            suffix: '+',
            label: t('yearsExperience'),
            color: 'emerald',
        },
        {
            icon: 'thumb_up',
            value: 98,
            suffix: '%',
            label: t('satisfactionRate'),
            color: 'amber',
        },
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; glow: string; text: string }> = {
            blue: {
                bg: 'bg-[#137fec]',
                glow: 'shadow-blue-500/30',
                text: 'text-[#137fec]',
            },
            purple: {
                bg: 'bg-purple-500',
                glow: 'shadow-purple-500/30',
                text: 'text-purple-500',
            },
            emerald: {
                bg: 'bg-emerald-500',
                glow: 'shadow-emerald-500/30',
                text: 'text-emerald-500',
            },
            amber: {
                bg: 'bg-[#d4af37]',
                glow: 'shadow-yellow-500/30',
                text: 'text-[#d4af37]',
            },
        };
        return colors[color] || colors.blue;
    };

    return (
        <section className="w-full bg-[#0f172a] relative overflow-hidden py-24 px-6 lg:px-10 text-white">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#137fec]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#d4af37]/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-[1080px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#d4af37] text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <Icon name="star" size={14} filled />
                        <span>{t('subtitle')}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold mb-4 tracking-tight"
                    >
                        {t('title')}
                    </motion.h2>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => {
                        const colors = getColorClasses(stat.color);
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                className="relative group text-center"
                            >
                                {/* Icon */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                                    className="inline-flex items-center justify-center mb-4"
                                >
                                    <div className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center shadow-lg ${colors.glow} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon name={stat.icon} size={32} />
                                    </div>
                                </motion.div>

                                {/* Value */}
                                <div className="text-4xl lg:text-5xl font-bold mb-2">
                                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                                </div>

                                {/* Label */}
                                <p className="text-slate-400 text-sm lg:text-base font-medium">
                                    {stat.label}
                                </p>

                                {/* Glow effect on hover */}
                                <div className={`absolute inset-0 -z-10 ${colors.bg} opacity-0 group-hover:opacity-10 blur-2xl rounded-full transition-opacity duration-300`} />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
