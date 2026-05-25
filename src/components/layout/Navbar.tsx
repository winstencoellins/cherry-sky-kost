/**
 * Navbar Component
 * Responsive navigation with mobile and desktop variants
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { cn } from '@/lib/utils';

interface NavbarProps {
    onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
    const t = useTranslations();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        // Check on mount as well in case the user reloads midway down the page
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Helper to determine text color based on background state
    // If transparent (at top), text is white. If white (scrolled), text is slate-900.
    const getTextColor = (base: string = 'text-slate-900') => {
        return isScrolled ? base : 'text-slate-900 xl:text-white';
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
                isScrolled
                    ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800/50"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300",
                            isScrolled
                                ? "bg-slate-900 dark:bg-white"
                                : "bg-white/95 backdrop-blur-sm"
                        )}>
                            <Icon name="apartment" size={20} className={cn(isScrolled ? "text-white dark:text-slate-900" : "text-slate-900")} />
                        </div>
                        <span className={cn(
                            "font-bold text-lg tracking-tight transition-colors",
                            isScrolled ? "text-slate-900 dark:text-white" : "text-white drop-shadow-lg"
                        )}>
                            Cherry Sky
                        </span>
                    </Link>

                    {/* Center: Desktop Navigation - Minimal */}
                    <div className="hidden md:flex items-center gap-1">
                        {[
                            { href: '/', label: t('nav.home') },
                            { href: '/about', label: t('nav.about') },
                            { href: '/search-kosts', label: t('nav.search') },
                            { href: '/contact', label: t('nav.contact') },
                        ].map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300",
                                    isScrolled
                                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                                        : "text-white/90 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Language Switcher - Desktop */}
                        <div className="hidden sm:block">
                            <LanguageSwitcher variant="navbar" />
                        </div>

                        <button
                            onClick={onMenuClick}
                            className={cn(
                                "md:hidden p-2 rounded-lg transition-all",
                                isScrolled
                                    ? "hover:bg-slate-100 dark:hover:bg-slate-800"
                                    : "hover:bg-white/10"
                            )}
                            aria-label="Menu"
                        >
                            <Icon name="menu" size={22} className={cn(isScrolled ? "text-slate-900 dark:text-white" : "text-white")} />
                        </button>

                        <Button
                            className={cn(
                                "hidden sm:flex h-9 px-5 text-sm font-semibold rounded-lg transition-all duration-300",
                                isScrolled
                                    ? "bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900"
                                    : "bg-white hover:bg-white/90 text-slate-900 shadow-lg"
                            )}
                        >
                            {t('hero.scheduleVisit')}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar Expansion */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a]"
                    >
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-100 dark:bg-slate-800/50 rounded-2xl border border-transparent focus-within:border-primary transition-colors">
                                <Icon name="search" size={20} className="text-slate-400" />
                                <input
                                    type="text"
                                    placeholder={t('search.placeholder')}
                                    className="flex-1 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                    autoFocus
                                />
                                <button onClick={() => setIsSearchOpen(false)}>
                                    <Icon name="close" size={20} className="text-slate-400" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
