/**
 * About Mission Section Component
 * Displays mission and vision statements
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

export function AboutMission() {
    const t = useTranslations('about.mission');

    return (
        <section className="w-full py-24 px-6 lg:px-10 bg-white dark:bg-slate-900">
            <div className="max-w-[1080px] mx-auto">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                    {/* Mission */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Icon Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30 mb-6"
                        >
                            <Icon name="flag" size={32} />
                        </motion.div>

                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            {t('title')}
                        </h2>
                        
                        <p className="text-sm text-primary dark:text-primary/80 font-semibold uppercase tracking-wider mb-4">
                            {t('subtitle')}
                        </p>

                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                            {t('description')}
                        </p>

                        {/* Decorative Element */}
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/5 dark:bg-primary/10 rounded-full blur-2xl" />
                    </motion.div>

                    {/* Vision */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Icon Badge */}
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#b8941f] text-white shadow-lg shadow-yellow-500/30 mb-6"
                        >
                            <Icon name="visibility" size={32} />
                        </motion.div>

                        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            {t('vision')}
                        </h2>
                        
                        <p className="text-sm text-[#d4af37] dark:text-yellow-400 font-semibold uppercase tracking-wider mb-4">
                            {t('subtitle')}
                        </p>

                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                            {t('visionDescription')}
                        </p>

                        {/* Decorative Element */}
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#d4af37]/5 dark:bg-[#d4af37]/10 rounded-full blur-2xl" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
