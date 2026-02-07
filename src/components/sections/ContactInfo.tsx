/**
 * Contact Info Section Component
 * Displays contact information and details
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

interface ContactDetail {
    icon: string;
    title: string;
    items: string[];
    link?: string;
}

export function ContactInfo() {
    const t = useTranslations('contact.info');

    const contactDetails: ContactDetail[] = [
        {
            icon: 'location_on',
            title: t('address'),
            items: [
                'SKYKOST: Jl. Gaharu Gg. Amat Lama No. 12, Medan',
                'CHERRY KOST: Jl. Setia Budi No. 45, Medan',
            ],
            link: 'https://maps.google.com',
        },
        {
            icon: 'call',
            title: t('phone'),
            items: ['+62 812-3456-7890', '+62 812-3456-7891'],
            link: 'tel:+6281234567890',
        },
        {
            icon: 'mail',
            title: t('email'),
            items: ['info@cherryskykost.com', 'support@cherryskykost.com'],
            link: 'mailto:info@cherryskykost.com',
        },
        {
            icon: 'schedule',
            title: t('hours'),
            items: [t('weekdaysHours'), t('saturdayHours'), t('weekendClosed')],
        },
    ];

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
        <section className="w-full py-24 px-6 lg:px-10 bg-white dark:bg-slate-900">
            <div className="max-w-[1080px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#137fec]/10 border border-[#137fec]/20 text-[#137fec] dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <Icon name="info" size={14} />
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

                {/* Contact Details Grid */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {contactDetails.map((detail, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="group"
                        >
                            <a
                                href={detail.link || '#'}
                                className="block bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Icon Container */}
                                <div className="relative mb-5">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#137fec] to-blue-700 text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                                        <Icon name={detail.icon} size={28} />
                                    </div>
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 w-14 h-14 rounded-xl bg-gradient-to-br from-[#137fec] to-blue-700 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                                    {detail.title}
                                </h3>

                                <div className="space-y-2">
                                    {detail.items.map((item, idx) => (
                                        <p
                                            key={idx}
                                            className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                                        >
                                            {item}
                                        </p>
                                    ))}
                                </div>

                                {/* Arrow Icon */}
                                {detail.link && (
                                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-[#137fec] dark:text-blue-400 uppercase tracking-wider">
                                            {detail.icon === 'location_on' ? 'View Map' : 'Contact'}
                                        </span>
                                        <Icon name="arrow_forward" size={16} className="text-[#137fec] group-hover:translate-x-1 transition-transform" />
                                    </div>
                                )}

                                {/* Decorative corner */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-[#137fec]/5 dark:to-[#137fec]/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
