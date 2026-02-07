/**
 * About Page - Cherry Sky Kost
 * Information about the company, mission, values, and achievements
 */

'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { AboutHero } from '@/components/sections/AboutHero';
import { AboutMission } from '@/components/sections/AboutMission';
import { AboutValues } from '@/components/sections/AboutValues';
import { AboutStats } from '@/components/sections/AboutStats';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';

export default function AboutPage() {
    const t = useTranslations('about');
    const locale = useLocale();

    const handleViewProperties = () => {
        window.location.href = `/${locale}/#properties`;
    };

    return (
        <AppLayout>
            {/* Hero Section */}
            <AboutHero />

            {/* Mission & Vision Section */}
            <AboutMission />

            {/* Core Values Section */}
            <AboutValues />

            {/* Stats/Achievement Section */}
            <AboutStats />

            {/* CTA Section */}
            <section className="w-full py-20 px-6 lg:px-10 bg-white dark:bg-slate-900">
                <div className="max-w-[800px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                            {t('cta.title')}
                        </h2>
                        
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                            {t('cta.subtitle')}
                        </p>

                        <div className="pt-4">
                            <Button
                                onClick={handleViewProperties}
                                size="lg"
                                className="bg-[#137fec] hover:bg-blue-600 text-white font-bold px-8 h-12 rounded-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
                            >
                                <Icon name="home" size={20} className="mr-2" />
                                {t('cta.button')}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </AppLayout>
    );
}
