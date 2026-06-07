'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Icon } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';

export interface KostBreadcrumbItem {
    label: string;
    href?: string;
}

interface KostBreadcrumbProps {
    items: KostBreadcrumbItem[];
    className?: string;
}

export function KostBreadcrumb({ items, className }: KostBreadcrumbProps) {
    return (
        <nav
            aria-label="Breadcrumb"
            className={cn('flex flex-wrap items-center gap-1.5 text-sm', className)}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
                        {index > 0 && (
                            <Icon
                                name="chevron_right"
                                size={16}
                                className="shrink-0 text-[#b0a29a]"
                            />
                        )}
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="font-medium text-[#83746b] transition-colors hover:text-[#6f4627]"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span
                                className={cn(
                                    'font-medium',
                                    isLast ? 'text-[#1a1c1a]' : 'text-[#83746b]',
                                )}
                                aria-current={isLast ? 'page' : undefined}
                            >
                                {item.label}
                            </span>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

export function useKostBreadcrumbs() {
    const t = useTranslations('propertyDetail');

    return {
        home: { label: t('breadcrumbHome'), href: '/' },
        search: { label: t('breadcrumbSearch'), href: '/search-kosts' },
        property: (name: string, id: string) => ({
            label: name,
            href: `/kosts/${id}`,
        }),
        unitType: (name: string) => ({ label: name }),
    };
}
