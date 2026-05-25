/**
 * Terms Content Section Component
 * Displays all terms and conditions sections
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

interface TermsSection {
    key: string;
    title: string;
    content: string;
    items?: string[];
}

export function TermsContent() {
    const t = useTranslations('terms');
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const sections: TermsSection[] = [
        {
            key: 'introduction',
            title: t('sections.introduction.title'),
            content: t('sections.introduction.content'),
        },
        {
            key: 'userResponsibilities',
            title: t('sections.userResponsibilities.title'),
            content: t('sections.userResponsibilities.content'),
            items: [
                t('sections.userResponsibilities.items.0'),
                t('sections.userResponsibilities.items.1'),
                t('sections.userResponsibilities.items.2'),
                t('sections.userResponsibilities.items.3'),
                t('sections.userResponsibilities.items.4'),
            ],
        },
        {
            key: 'bookingPolicy',
            title: t('sections.bookingPolicy.title'),
            content: t('sections.bookingPolicy.content'),
        },
        {
            key: 'paymentTerms',
            title: t('sections.paymentTerms.title'),
            content: t('sections.paymentTerms.content'),
        },
        {
            key: 'liability',
            title: t('sections.liability.title'),
            content: t('sections.liability.content'),
        },
        {
            key: 'privacy',
            title: t('sections.privacy.title'),
            content: t('sections.privacy.content'),
        },
        {
            key: 'intellectualProperty',
            title: t('sections.intellectualProperty.title'),
            content: t('sections.intellectualProperty.content'),
        },
        {
            key: 'modifications',
            title: t('sections.modifications.title'),
            content: t('sections.modifications.content'),
        },
        {
            key: 'termination',
            title: t('sections.termination.title'),
            content: t('sections.termination.content'),
        },
        {
            key: 'disclaimer',
            title: t('sections.disclaimer.title'),
            content: t('sections.disclaimer.content'),
        },
        {
            key: 'contact',
            title: t('sections.contact.title'),
            content: t('sections.contact.content'),
            items: [
                t('sections.contact.items.0'),
                t('sections.contact.items.1'),
                t('sections.contact.items.2'),
            ],
        },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    return (
        <section className="w-full py-24 px-6 lg:px-10 bg-white dark:bg-slate-900">
            <div className="max-w-3xl mx-auto">
                {/* Table of Contents */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 p-6 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-2xl"
                >
                    <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Icon name="list" size={20} />
                        Table of Contents
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        {sections.map((section, index) => (
                            <a
                                key={section.key}
                                href={`#section-${index}`}
                                className="text-sm text-primary hover:text-primary/90 dark:hover:text-primary/80 font-medium transition-colors flex items-center gap-2"
                            >
                                <Icon name="arrow_forward" size={14} />
                                {section.title}
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* Sections */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="space-y-4"
                >
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.key}
                            id={`section-${index}`}
                            variants={item}
                            className="group"
                        >
                            <button
                                onClick={() =>
                                    setExpandedSection(
                                        expandedSection === section.key ? null : section.key
                                    )
                                }
                                className="w-full text-left p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                        {section.title}
                                    </h3>
                                    <Icon
                                        name={
                                            expandedSection === section.key
                                                ? 'expand_less'
                                                : 'expand_more'
                                        }
                                        size={24}
                                        className="text-primary flex-shrink-0 transition-transform"
                                    />
                                </div>
                            </button>

                            {/* Expandable Content */}
                            <motion.div
                                initial={false}
                                animate={{
                                    height:
                                        expandedSection === section.key ? 'auto' : 0,
                                    opacity: expandedSection === section.key ? 1 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-x border-b border-slate-200 dark:border-slate-700 space-y-4">
                                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {section.content}
                                    </p>

                                    {section.items && section.items.length > 0 && (
                                        <ul className="space-y-3 mt-4">
                                            {section.items.map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400"
                                                >
                                                    <Icon
                                                        name="check_circle"
                                                        size={18}
                                                        className="text-emerald-500 flex-shrink-0 mt-0.5"
                                                    />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Last Updated */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 p-6 text-center bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        <strong>📅 {t('lastUpdated')}</strong>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        Please review these terms periodically for updates
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
