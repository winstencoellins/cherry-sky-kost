/**
 * Sidebar Component
 * Mobile drawer navigation menu
 */

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Icon } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';

interface SidebarProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface MenuItemProps {
    href: string;
    icon: string;
    label: string;
    onClick?: () => void;
}

function MenuItem({ href, icon, label, onClick }: MenuItemProps) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
        >
            <Icon
                name={icon}
                size={24}
                className="text-slate-600 dark:text-slate-400 group-hover:text-[#137fec]"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-[#137fec]">
                {label}
            </span>
        </Link>
    );
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
    const t = useTranslations();

    const handleClose = () => onOpenChange(false);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                <SheetHeader className="p-6 pb-4">
                    <SheetTitle className="flex items-center gap-2 text-left">
                        <div className="text-[#137fec]">
                            <Icon name="apartment" size={28} />
                        </div>
                        <span className="text-xl font-bold">Cherry Sky</span>
                    </SheetTitle>
                </SheetHeader>

                <div className="px-3 pb-6 overflow-y-auto h-[calc(100vh-80px)]">
                    {/* Main Navigation */}
                    <div className="space-y-1 mb-6">
                        <MenuItem
                            href="/"
                            icon="home"
                            label={t('nav.home')}
                            onClick={handleClose}
                        />
                        <MenuItem
                            href="/cari"
                            icon="search"
                            label={t('nav.search')}
                            onClick={handleClose}
                        />
                        <MenuItem
                            href="/favorit"
                            icon="favorite"
                            label={t('nav.favorites')}
                            onClick={handleClose}
                        />
                    </div>

                    <Separator className="my-4" />

                    {/* Filter Categories */}
                    <div className="mb-6">
                        <p className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Kategori
                        </p>
                        <div className="space-y-1">
                            <MenuItem
                                href="/cari?type=putra"
                                icon="man"
                                label="Kost Putra"
                                onClick={handleClose}
                            />
                            <MenuItem
                                href="/cari?type=putri"
                                icon="woman"
                                label="Kost Putri"
                                onClick={handleClose}
                            />
                            <MenuItem
                                href="/cari?type=campur"
                                icon="groups"
                                label="Kost Campur"
                                onClick={handleClose}
                            />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Quick Filters */}
                    <div className="mb-6">
                        <p className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Fasilitas
                        </p>
                        <div className="space-y-1">
                            <MenuItem
                                href="/cari?facility=wifi"
                                icon="wifi"
                                label="Wi-Fi"
                                onClick={handleClose}
                            />
                            <MenuItem
                                href="/cari?facility=ac"
                                icon="ac_unit"
                                label="AC"
                                onClick={handleClose}
                            />
                            <MenuItem
                                href="/cari?facility=laundry"
                                icon="local_laundry_service"
                                label="Laundry Gratis"
                                onClick={handleClose}
                            />
                        </div>
                    </div>

                    <Separator className="my-4" />

                    {/* Account Section */}
                    <div className="space-y-1">
                        <p className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Akun
                        </p>
                        <MenuItem
                            href="/akun"
                            icon="person"
                            label={t('nav.account')}
                            onClick={handleClose}
                        />
                        <MenuItem
                            href="/login"
                            icon="login"
                            label={t('nav.login')}
                            onClick={handleClose}
                        />
                    </div>

                    <Separator className="my-4" />

                    {/* Help & Info */}
                    <div className="space-y-1">
                        <MenuItem
                            href="/tentang"
                            icon="info"
                            label={t('nav.about')}
                            onClick={handleClose}
                        />
                        <MenuItem
                            href="#contact"
                            icon="call"
                            label={t('nav.contact')}
                            onClick={handleClose}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
