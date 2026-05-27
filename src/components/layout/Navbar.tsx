/**
 * Navbar Component
 * Responsive navigation with mobile and desktop variants
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';

interface NavbarProps {
    onMenuClick?: () => void;
}

function isKostDetailPath(pathname: string) {
    return /\/kosts\/[^/]+/.test(pathname);
}

/** Pages with a full-width dark hero behind the navbar. */
function hasHeroOverlay(pathname: string) {
    return (
        /^\/(en|id)\/?$/.test(pathname) ||
        /^\/(en|id)\/(about|contact|search-kosts)\/?$/.test(pathname)
    );
}

export function Navbar({ onMenuClick }: NavbarProps) {
    const t = useTranslations();
    const pathname = usePathname() ?? '';
    const [isScrolled, setIsScrolled] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const isKostDetail = isKostDetailPath(pathname);
    const isSolid = isScrolled || !hasHeroOverlay(pathname);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClass = cn(
        'rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300',
        isSolid
            ? 'text-[#83746b] hover:bg-white/70 hover:text-[#1a1c1a]'
            : 'text-[#faf9f6]/90 hover:bg-white/10 hover:text-[#faf9f6]',
    );

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
                isSolid
                    ? 'border-b border-[#e3e2e0] bg-[#faf9f6]/95 backdrop-blur-xl'
                    : 'bg-transparent',
            )}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-3">
                    {/* Left: back (detail) + logo */}
                    <div className="flex min-w-0 items-center gap-2">
                        {isKostDetail && (
                            <Link
                                href="/"
                                className={cn(
                                    'flex shrink-0 items-center justify-center rounded-xl p-2 transition-colors',
                                    isSolid
                                        ? 'text-[#51443c] hover:bg-white/70'
                                        : 'text-[#faf9f6] hover:bg-white/10',
                                )}
                                aria-label={t('roomDetail.backToHome')}
                            >
                                <Icon name="arrow_back" size={22} />
                            </Link>
                        )}
                        <Link href="/" className="group flex min-w-0 items-center gap-2">
                            <div
                                className={cn(
                                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300',
                                    isSolid
                                        ? 'bg-[#6f4627]'
                                        : 'border border-white/30 bg-[#faf9f6]/90 backdrop-blur-sm',
                                )}
                            >
                                <Icon
                                    name="apartment"
                                    size={20}
                                    className={cn(isSolid ? 'text-white' : 'text-[#1a1c1a]')}
                                />
                            </div>
                            <span
                                className={cn(
                                    'truncate text-lg font-bold tracking-tight transition-colors',
                                    isSolid ? 'text-[#1a1c1a]' : 'text-[#faf9f6] drop-shadow-lg',
                                )}
                            >
                                Cherry Sky
                            </span>
                        </Link>
                    </div>

                    {/* Center: desktop nav (hidden on detail to save space) */}
                    {!isKostDetail && (
                        <div className="hidden items-center gap-1 md:flex">
                            {[
                                { href: '/', label: t('nav.home') },
                                { href: '/about', label: t('nav.about') },
                                { href: '/search-kosts', label: t('nav.search') },
                                { href: '/contact', label: t('nav.contact') },
                            ].map((link) => (
                                <Link key={link.href} href={link.href} className={navLinkClass}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right: actions */}
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <LanguageSwitcher variant="navbar" isSolid={isSolid} />

                        <button
                            type="button"
                            onClick={onMenuClick}
                            className={cn(
                                'rounded-xl p-2 transition-all md:hidden',
                                isSolid ? 'hover:bg-white/70' : 'hover:bg-white/10',
                            )}
                            aria-label="Menu"
                        >
                            <Icon
                                name="menu"
                                size={22}
                                className={cn(isSolid ? 'text-[#1a1c1a]' : 'text-[#faf9f6]')}
                            />
                        </button>

                        {!isKostDetail && (
                            <Button
                                className={cn(
                                    'hidden h-9 rounded-xl px-5 text-sm font-semibold transition-all sm:flex',
                                    isSolid
                                        ? 'bg-[#6f4627] text-white hover:bg-[#805533]'
                                        : 'bg-[#faf9f6] text-[#1a1c1a] shadow-lg hover:bg-white',
                                )}
                            >
                                {t('hero.scheduleVisit')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-[#e3e2e0] bg-[#faf9f6]"
                    >
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex items-center gap-3 rounded-2xl border border-[#e3e2e0] bg-white/80 px-4 py-3 transition-colors focus-within:border-[#8b5e3c]/60 focus-within:ring-2 focus-within:ring-[#8b5e3c]/15">
                                <Icon name="search" size={20} className="text-[#b0a29a]" />
                                <input
                                    type="text"
                                    placeholder={t('search.placeholder')}
                                    className="flex-1 border-none bg-transparent text-[#1a1c1a] outline-none placeholder:text-[#b0a29a]"
                                />
                                <button type="button" onClick={() => setIsSearchOpen(false)}>
                                    <Icon name="close" size={20} className="text-[#b0a29a]" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
