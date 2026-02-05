/**
 * Bottom Navigation Component
 * Mobile bottom navigation bar with primary actions
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Icon } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';
import { generateWhatsAppURL } from '@/lib/utils/format';
import { motion } from 'framer-motion';
interface BottomNavItemProps {
    href: string;
    icon: string;
    label: string;
    isActive: boolean;
    isExternal?: boolean;
}

function BottomNavItem({ href, icon, label, isActive, isExternal }: BottomNavItemProps) {
    const content = (
        <div className="relative flex flex-col items-center justify-center w-full h-full gap-1">
            <div className={cn(
                "p-1.5 rounded-xl transition-all duration-300 relative",
                isActive ? "bg-[#137fec]/10 -translate-y-1" : ""
            )}>
                <Icon
                    name={icon}
                    size={24}
                    filled={isActive}
                    className={cn(
                        'transition-all duration-300',
                        isActive ? 'text-[#137fec] scale-110' : 'text-slate-400 dark:text-slate-500'
                    )}
                />

                {/* Notification/Active Dot */}
                {isActive && (
                    <motion.div
                        layoutId="activeDot"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#137fec] rounded-full"
                    />
                )}
            </div>

            <span
                className={cn(
                    'text-[10px] font-medium transition-colors',
                    isActive
                        ? 'text-[#137fec]'
                        : 'text-slate-500 dark:text-slate-500'
                )}
            >
                {label}
            </span>
        </div>
    );

    const containerInfo = "flex-1 h-full py-2 select-none active:scale-95 transition-transform";

    if (isExternal) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={containerInfo}
            >
                {content}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className={containerInfo}
        >
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
            href: '/favorit',
            icon: 'favorite',
            label: t('nav.favorites'),
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
            <div className="bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-xl border border-white/20 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-2xl h-16 px-2 flex items-center justify-between">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

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
