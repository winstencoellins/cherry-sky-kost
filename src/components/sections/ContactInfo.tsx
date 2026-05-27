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
            id: 'address',
            icon: 'location_on',
            title: t('address'),
            items: [
                'SKYKOST: Jl. Gaharu Gg. Amat Lama No. 12, Medan',
                'CHERRY KOST: Jl. Setia Budi No. 45, Medan',
            ],
            link: 'https://maps.google.com',
        },
        {
            id: 'phone',
            icon: 'call',
            title: t('phone'),
            items: ['+62 812-3456-7890', '+62 812-3456-7891'],
            link: 'tel:+6281234567890',
        },
        {
            id: 'email',
            icon: 'mail',
            title: t('email'),
            items: ['info@cherryskykost.com', 'support@cherryskykost.com'],
            link: 'mailto:info@cherryskykost.com',
        },
        {
            id: 'hours',
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
        <section className="w-full bg-[#faf9f6] py-16 px-6 lg:px-10">
            <div className="max-w-[1080px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e3e2e0] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#6f4627]"
                    >
                        <Icon name="info" size={14} />
                        <span>{t('subtitle')}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-4 text-2xl font-semibold tracking-tight text-[#1a1c1a] md:text-3xl"
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
                    {contactDetails.map((detail) => (
                        <motion.div
                            key={detail.id}
                            variants={item}
                            className="group"
                        >
                            <a
                                href={detail.link || '#'}
                                className="relative block rounded-2xl border border-[#e3e2e0] bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d0b59b] hover:shadow-md"
                            >
                                {/* Icon Container */}
                                <div className="relative mb-5">
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#f5e4d4]/60 text-[#6f4627] shadow-sm transition-transform duration-300 group-hover:scale-110">
                                        <Icon name={detail.icon} size={28} />
                                    </div>
                                    {/* Glow effect */}
                                    <div className="absolute inset-0 h-14 w-14 rounded-xl bg-[#f5e4d4] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
                                </div>

                                {/* Content */}
                                <h3 className="mb-4 text-base font-semibold text-[#1a1c1a]">
                                    {detail.title}
                                </h3>

                                <div className="space-y-2">
                                    {detail.items.map((item) => (
                                        <p
                                            key={item}
                                            className="text-sm leading-relaxed text-[#83746b]"
                                        >
                                            {item}
                                        </p>
                                    ))}
                                </div>

                                {/* Arrow Icon */}
                                {detail.link && (
                                    <div className="mt-4 flex items-center justify-between border-t border-[#e3e2e0] pt-4">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6f4627]">
                                            {detail.icon === 'location_on' ? 'View Map' : 'Contact'}
                                        </span>
                                        <Icon
                                            name="arrow_forward"
                                            size={16}
                                            className="text-[#6f4627] transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                )}

                                {/* Decorative corner */}
                                <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-transparent to-[#f5e4d4]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
