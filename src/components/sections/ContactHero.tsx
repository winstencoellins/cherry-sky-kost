/**
 * Contact Hero Section Component
 * Hero section for the contact page
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

export function ContactHero() {
    const t = useTranslations('contact.hero');

    return (
        <div className="relative w-full min-h-[450px] md:min-h-[550px] flex items-center justify-center bg-[#0f172a] overflow-hidden">
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
                        backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop")',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/70 to-[#0f172a]/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />
            </motion.div>

            {/* Decorative Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#137fec]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d4af37]/10 rounded-full blur-[120px]" />

            {/* Content */}
            <div className="relative z-10 max-w-4xl w-full px-6 lg:px-10 flex flex-col items-center gap-8 text-center">
                {/* Accent Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 bg-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.5)] rounded-full"
                />

                {/* Title */}
                <div className="overflow-visible">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 50 }}
                        className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
                    >
                        {t('title')}
                    </motion.h1>
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-slate-300 text-lg md:text-xl font-light"
                >
                    {t('subtitle')}
                </motion.p>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-slate-300 text-base md:text-lg font-light max-w-2xl leading-relaxed border-l-2 border-[#137fec] pl-6"
                >
                    {t('description')}
                </motion.p>

                {/* Contact Methods Icons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                    className="flex items-center justify-center gap-6 pt-4"
                >
                    <a
                        href="https://wa.me/6281234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1fb855] text-white transition-all hover:scale-110 shadow-lg"
                        aria-label="Chat via WhatsApp"
                    >
                        <Icon name="chat" size={24} />
                    </a>
                    <a
                        href="tel:+6281234567890"
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#137fec] hover:bg-blue-600 text-white transition-all hover:scale-110 shadow-lg"
                        aria-label="Call us"
                    >
                        <Icon name="call" size={24} />
                    </a>
                    <a
                        href="mailto:info@cherryskykost.com"
                        className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#d4af37] hover:bg-yellow-500 text-white transition-all hover:scale-110 shadow-lg"
                        aria-label="Email us"
                    >
                        <Icon name="mail" size={24} />
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
