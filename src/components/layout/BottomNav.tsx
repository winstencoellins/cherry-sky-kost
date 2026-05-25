/**
 * Bottom Navigation Component
 * Mobile bottom navigation bar with primary actions
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

import { Icon } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';
import { generateWhatsAppURL } from '@/lib/utils/format';

interface BottomNavItemProps {
    href: string;
    icon: string;
    label: string;
    isActive: boolean;
    isExternal?: boolean;
}

function BottomNavItem({ href, icon, label, isActive, isExternal }: BottomNavItemProps) {
    const content = (
        <div className="relative flex flex-col items-center justify-center w-full h-full">
            <div
                className={cn(
                    'p-2 rounded-xl transition-all duration-300 relative',
                    isActive ? 'bg-primary/10 -translate-y-0.5' : ''
                )}
            >
                <Icon
                    name={icon}
                    size={22}
                    filled={isActive}
                    className={cn(
                        'transition-all duration-300',
                        isActive
                            ? 'text-primary scale-110'
                            : 'text-slate-400 dark:text-slate-500'
                    )}
                />

                {/* Active indicator dot */}
                {isActive && (
                    <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                )}
            </div>

            <span
                className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                )}
            >
                {label}
            </span>
        </div>
    );

    const containerClassName = 'flex-1 h-full py-1.5 select-none active:scale-95 transition-transform';

    if (isExternal) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={containerClassName}
            >
                {content}
            </a>
        );
    }

    return (
        <Link href={href} className={containerClassName}>
            {content}
        </Link>
    );
}

export function BottomNav() {
    const pathname = usePathname();
    const t = useTranslations();

    // WhatsApp number (you can make this dynamic from settings)
    const whatsappURL = generateWhatsAppURL(
        '081234567890',
        'Halo, saya ingin menanyakan informasi tentang kost'
    );

    const navItems = [
        {
            href: '/',
            icon: 'home',
            label: t('nav.home'),
        },
        {
            href: '/cari',
            icon: 'search',
            label: t('nav.search'),
        },
        {
            href: whatsappURL,
            icon: 'chat',
            label: t('nav.contact'),
            isExternal: true, // WA links are external
        },
        {
            href: '/akun',
            icon: 'person',
            label: t('nav.account'),
        },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
            <div className="bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl h-[68px] px-1 flex items-center justify-around gap-0.5">
                {navItems.map((item) => {
                    // Handle locale-based routing - check if pathname ends with the href or matches exactly
                    const cleanPathname = pathname?.split('?')[0]; // Remove query params
                    const isActive =
                        cleanPathname === item.href ||
                        cleanPathname?.endsWith(item.href) ||
                        (item.href !== '/' && cleanPathname?.startsWith(item.href));

                    return (
                        <BottomNavItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={isActive}
                            isExternal={item.isExternal}
                        />
                    );
                })}
            </div>
        </div>
    );
}
