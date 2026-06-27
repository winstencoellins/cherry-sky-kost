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
        <section className="relative flex min-h-[450px] w-full items-center justify-center overflow-hidden bg-[#faf9f6] md:min-h-[550px]">
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#3b2311]/85 via-[#6f4627]/65 to-[#faf9f6]/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a130f] via-transparent to-transparent opacity-90" />
            </motion.div>

            {/* Decorative Gradients */}
            <div className="pointer-events-none absolute top-0 right-0 h-[420px] w-[420px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#f5e4d4]/70 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[380px] w-[380px] translate-y-1/3 -translate-x-1/3 rounded-full bg-[#e3e2e0]/70 blur-[100px]" />

            {/* Content */}
            <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-8 px-6 text-center lg:px-10">
                {/* Accent Line */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 rounded-full bg-[#6f4627] shadow-[0_0_16px_rgba(111,70,39,0.45)]"
                />

                {/* Title */}
                <div className="overflow-visible">
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 50 }}
                        className="text-4xl font-bold leading-[1.1] tracking-tight text-[#faf9f6] drop-shadow-md md:text-5xl lg:text-6xl"
                    >
                        {t('title')}
                    </motion.h1>
                </div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg font-light text-[#f5f2ee] md:text-xl"
                >
                    {t('subtitle')}
                </motion.p>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="max-w-2xl border-l-2 border-[#e3e2e0] pl-6 text-base font-light leading-relaxed text-[#f5f2ee] md:text-lg"
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
                        href="https://wa.me/628116359119"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#1fb855]"
                        aria-label="Chat via WhatsApp"
                    >
                        <Icon name="chat" size={24} />
                    </a>
                    <a
                        href="tel:+628116359119"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#6f4627] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#805533]"
                        aria-label="Call us"
                    >
                        <Icon name="call" size={24} />
                    </a>
                    <a
                        href="mailto:info@cherryskykost.com"
                        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#faf9f6]/90 text-[#6f4627] shadow-lg transition-all hover:scale-110 hover:bg-white"
                        aria-label="Email us"
                    >
                        <Icon name="mail" size={24} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
