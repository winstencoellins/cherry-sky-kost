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
            <section className="w-full bg-[#faf9f6] py-16 px-6 lg:px-10">
                <div className="max-w-[800px] mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6 rounded-2xl border border-[#e3e2e0] bg-white/80 p-8 shadow-sm"
                    >
                        <h2 className="text-2xl font-semibold tracking-tight text-[#1a1c1a] md:text-3xl">
                            {t('cta.title')}
                        </h2>
                        
                        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#83746b]">
                            {t('cta.subtitle')}
                        </p>

                        <div className="pt-4">
                            <Button
                                onClick={handleViewProperties}
                                size="lg"
                                className="h-12 rounded-xl bg-[#6f4627] px-8 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#805533] focus-visible:ring-[#8b5e3c]/40"
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
