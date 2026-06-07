/**
 * Contact Info Section Component
 * Displays contact information and details
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

interface ContactDetail {
    id: string;
    icon: string;
    title: string;
    items: string[];
    link?: string;
    cta?: string;
}

export function ContactInfo() {
    const t = useTranslations('contact.info');

    const contactDetails: ContactDetail[] = [
        {
            id: 'address',
            icon: 'location_on',
            title: t('address'),
            items: [t('addressSkykost'), t('addressCherry')],
            link: 'https://maps.google.com',
            cta: t('viewMap'),
        },
        {
            id: 'phone',
            icon: 'call',
            title: t('phone'),
            items: [t('phonePrimary'), t('phoneSecondary')],
            link: 'tel:+6281234567890',
            cta: t('contactCta'),
        },
        {
            id: 'email',
            icon: 'mail',
            title: t('email'),
            items: [t('emailPrimary'), t('emailSecondary')],
            link: 'mailto:info@cherryskykost.com',
            cta: t('contactCta'),
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
                                <div className="relative mb-5">
                                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#f5e4d4]/60 text-[#6f4627] shadow-sm transition-transform duration-300 group-hover:scale-110">
                                        <Icon name={detail.icon} size={28} />
                                    </div>
                                    <div className="absolute inset-0 h-14 w-14 rounded-xl bg-[#f5e4d4] opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-40" />
                                </div>

                                <h3 className="mb-4 text-base font-semibold text-[#1a1c1a]">
                                    {detail.title}
                                </h3>

                                <div className="space-y-2">
                                    {detail.items.map((line) => (
                                        <p
                                            key={line}
                                            className="text-sm leading-relaxed text-[#83746b]"
                                        >
                                            {line}
                                        </p>
                                    ))}
                                </div>

                                {detail.link && detail.cta && (
                                    <div className="mt-4 flex items-center justify-between border-t border-[#e3e2e0] pt-4">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6f4627]">
                                            {detail.cta}
                                        </span>
                                        <Icon
                                            name="arrow_forward"
                                            size={16}
                                            className="text-[#6f4627] transition-transform group-hover:translate-x-1"
                                        />
                                    </div>
                                )}

                                <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full bg-gradient-to-br from-transparent to-[#f5e4d4]/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
