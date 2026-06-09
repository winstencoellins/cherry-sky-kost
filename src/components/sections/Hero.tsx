/**
 * Hero Component
 * Main hero section with CTA
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';

export function Hero() {
    const t = useTranslations();

    return (
        <section className="relative flex h-[500px] w-full items-center justify-center overflow-hidden bg-[#faf9f6] md:h-[600px] lg:h-[700px]">
            {/* Background Image */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=1080&fit=crop")',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#3b2311]/85 via-[#6f4627]/65 to-[#faf9f6]/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a130f] via-transparent to-transparent opacity-90" />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#faf9f6]/80 md:flex"
            >
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                    {t('hero.scroll')}
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Icon name="keyboard_arrow_down" size={24} />
                </motion.div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 flex w-full max-w-7xl flex-col items-start gap-8 px-6 lg:px-10">
                {/* Accent Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 rounded-full bg-[#6f4627] shadow-[0_0_16px_rgba(111,70,39,0.45)]"
                />

                {/* Title */}
                <div className='overflow-visible'>
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 50 }}
                        className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-[#faf9f6] drop-shadow-md md:text-6xl lg:text-7xl"
                    >
                        {t('hero.title')}
                        <span className="mt-2 block bg-gradient-to-r from-[#ffedd5] via-[#f5e4d4] to-[#e3c9aa] bg-clip-text text-transparent drop-shadow-lg">
                            {t('hero.location')}
                        </span>
                    </motion.h1>
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="max-w-xl border-l-2 border-[#e3e2e0] pl-6 text-lg font-light leading-relaxed text-[#f5f2ee] md:text-xl"
                >
                    {t('hero.subtitle')}
                </motion.p>


                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-4 flex flex-col gap-4 sm:flex-row"
                >
                    <Button
                        size="lg"
                        className="h-12 rounded-xl bg-[#6f4627] px-8 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#805533] focus-visible:ring-[#8b5e3c]/40"
                        onClick={() => {
                            document.getElementById('properties')?.scrollIntoView({
                                behavior: 'smooth',
                            });
                        }}
                    >
                        <Icon name="apartment" size={20} className="mr-2" />
                        {t('hero.cta')}
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="h-12 rounded-xl border-[#e3e2e0] bg-[#faf9f6]/90 px-8 text-sm font-semibold text-[#1a1c1a] shadow-sm transition-all hover:bg-white hover:text-[#6f4627] hover:shadow-md focus-visible:ring-[#8b5e3c]/25"
                        onClick={() => {
                            document.getElementById('contact')?.scrollIntoView({
                                behavior: 'smooth',
                            });
                        }}
                    >
                        {t('hero.learnMore')}
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
