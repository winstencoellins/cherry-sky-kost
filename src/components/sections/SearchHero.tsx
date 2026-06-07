/**
 * Search Hero Section Component
 * Hero section for the search/cari kost page
 */

'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import { Button } from '@/components/ui/button';

interface SearchHeroProps {
    searchQuery?: string;
    onSearchSubmit?: (value: string) => void;
}

export function SearchHero({
    searchQuery = '',
    onSearchSubmit,
}: SearchHeroProps) {
    const t = useTranslations('search');
    const [query, setQuery] = useState(searchQuery);

    useEffect(() => {
        setQuery(searchQuery);
    }, [searchQuery]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSearchSubmit?.(query.trim());
    };

    return (
        <section className="relative flex h-[400px] w-full items-center justify-center overflow-hidden bg-[#faf9f6] md:h-[500px]">
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
                        backgroundImage: 'url("https://images.unsplash.com/photo-1521333573892-e44906baee46?w=1920&h=1080&fit=crop")',
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
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 80 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="h-1 rounded-full bg-[#6f4627] shadow-[0_0_16px_rgba(111,70,39,0.45)]"
                />

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

                <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    onSubmit={handleSubmit}
                    className="flex w-full max-w-xl flex-col gap-3 sm:flex-row"
                >
                    <div className="relative flex-1">
                        <Icon
                            name="search"
                            size={20}
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#83746b]"
                        />
                        <input
                            type="search"
                            name="q"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('placeholder')}
                            enterKeyHint="search"
                            autoComplete="off"
                            className="w-full rounded-xl border border-white/20 bg-white/95 py-3 pl-12 pr-4 text-base text-[#1a1c1a] shadow-lg placeholder:text-[#83746b]/70 focus:border-[#6f4627] focus:outline-none focus:ring-2 focus:ring-[#6f4627]/25"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="lg"
                        className="h-12 shrink-0 rounded-xl bg-[#6f4627] px-8 text-sm font-semibold text-white shadow-lg transition-all hover:scale-105 hover:bg-[#805533] focus-visible:ring-[#8b5e3c]/40"
                    >
                        <Icon name="search" size={20} className="mr-2" />
                        {t('apply')}
                    </Button>
                </motion.form>
            </div>
        </section>
    );
}
