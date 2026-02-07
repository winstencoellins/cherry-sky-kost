/**
 * Privacy Content Section Component
 * Displays all privacy policy sections with expandable accordion
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

interface PrivacySection {
    key: string;
    title: string;
    content: string;
    items?: string[];
}

export function PrivacyContent() {
    const t = useTranslations('privacy');
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const sections: PrivacySection[] = [
        {
            key: 'introduction',
            title: t('sections.introduction.title'),
            content: t('sections.introduction.content'),
        },
        {
            key: 'informationCollection',
            title: t('sections.informationCollection.title'),
            content: t('sections.informationCollection.content'),
            items: [
                t('sections.informationCollection.items.0'),
                t('sections.informationCollection.items.1'),
                t('sections.informationCollection.items.2'),
                t('sections.informationCollection.items.3'),
                t('sections.informationCollection.items.4'),
                t('sections.informationCollection.items.5'),
                t('sections.informationCollection.items.6'),
            ],
        },
        {
            key: 'useOfInformation',
            title: t('sections.useOfInformation.title'),
            content: t('sections.useOfInformation.content'),
            items: [
                t('sections.useOfInformation.items.0'),
                t('sections.useOfInformation.items.1'),
                t('sections.useOfInformation.items.2'),
                t('sections.useOfInformation.items.3'),
                t('sections.useOfInformation.items.4'),
                t('sections.useOfInformation.items.5'),
                t('sections.useOfInformation.items.6'),
                t('sections.useOfInformation.items.7'),
            ],
        },
        {
            key: 'dataSecurity',
            title: t('sections.dataSecurity.title'),
            content: t('sections.dataSecurity.content'),
        },
        {
            key: 'dataRetention',
            title: t('sections.dataRetention.title'),
            content: t('sections.dataRetention.content'),
        },
        {
            key: 'userRights',
            title: t('sections.userRights.title'),
            content: t('sections.userRights.content'),
            items: [
                t('sections.userRights.items.0'),
                t('sections.userRights.items.1'),
                t('sections.userRights.items.2'),
                t('sections.userRights.items.3'),
                t('sections.userRights.items.4'),
                t('sections.userRights.items.5'),
                t('sections.userRights.items.6'),
            ],
        },
        {
            key: 'thirdPartyServices',
            title: t('sections.thirdPartyServices.title'),
            content: t('sections.thirdPartyServices.content'),
        },
        {
            key: 'cookies',
            title: t('sections.cookies.title'),
            content: t('sections.cookies.content'),
        },
        {
            key: 'childrenPrivacy',
            title: t('sections.childrenPrivacy.title'),
            content: t('sections.childrenPrivacy.content'),
        },
        {
            key: 'internationaltransfer',
            title: t('sections.internationaltransfer.title'),
            content: t('sections.internationaltransfer.content'),
        },
        {
            key: 'policyUpdates',
            title: t('sections.policyUpdates.title'),
            content: t('sections.policyUpdates.content'),
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
                    className="mb-16 p-6 bg-[#137fec]/5 dark:bg-[#137fec]/10 border border-[#137fec]/20 rounded-2xl"
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
                                className="text-sm text-[#137fec] hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors flex items-center gap-2"
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
                                className="w-full text-left p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-[#137fec]/50 transition-all duration-300"
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
                                        className="text-[#137fec] flex-shrink-0 transition-transform"
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

                {/* Important Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 p-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl"
                >
                    <div className="flex items-start gap-4">
                        <Icon
                            name="info"
                            size={24}
                            className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1"
                        />
                        <div>
                            <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2">
                                Important Notice
                            </h3>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                                We may update this Privacy Policy periodically. Your continued use of our services
                                following notifications of changes constitutes your acceptance of the updated policy.
                                We recommend reviewing this policy regularly.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Last Updated */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-8 p-6 text-center bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700"
                >
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        <strong>📅 {t('lastUpdated')}</strong>
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        For data subject access requests or privacy concerns, contact our privacy team
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
