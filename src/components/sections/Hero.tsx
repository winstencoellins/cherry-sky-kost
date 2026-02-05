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
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center bg-[#0f172a] overflow-hidden">
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/90 via-[#0f172a]/60 to-[#0f172a]/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 text-white/50"
            >
                <span className="text-xs uppercase tracking-[0.2em]">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Icon name="keyboard_arrow_down" size={24} />
                </motion.div>
            </motion.div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl w-full px-6 lg:px-10 flex flex-col items-start gap-8">
                {/* Accent Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 bg-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.5)] rounded-full"
                />

                {/* Title */}
                <div className='overflow-visible'>
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 50 }}
                        className="text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight max-w-4xl"
                    >
                        {t('hero.title')}
                        <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 drop-shadow-lg">
                            di Medan
                        </span>
                    </motion.h1>
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-slate-300 text-lg md:text-xl font-light max-w-xl leading-relaxed border-l-2 border-[#137fec] pl-6"
                >
                    {t('hero.subtitle')}
                </motion.p>


                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 mt-4"
                >
                    <Button
                        size="lg"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 h-12 rounded-lg transition-all hover:scale-105 shadow-lg"
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
                        className="bg-white hover:bg-slate-100 border-white text-slate-900 font-medium px-8 h-12 rounded-lg transition-all shadow-lg"
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
        </div>
    );
}
