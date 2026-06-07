/**
 * Footer Component
 * Site footer with links and social
 */

'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Icon } from '@/components/shared/Icon';

const CONTACT_EMAIL = 'info@cherryskykost.com';

export function Footer() {
    const t = useTranslations();
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        { label: t('nav.about'), href: '/about' },
        { label: t('nav.search'), href: '/search-kosts' },
        { label: t('nav.contact'), href: '/contact' },
        { label: t('footer.termsConditions'), href: '/terms' },
        { label: t('footer.privacyPolicy'), href: '/privacy' },
    ];

    const socialLinks = [
        { icon: 'public', href: '/', label: t('footer.website'), external: false },
        {
            icon: 'alternate_email',
            href: `mailto:${CONTACT_EMAIL}`,
            label: t('footer.email'),
            external: true,
        },
    ];

    return (
        <footer className="relative w-full overflow-hidden bg-[#f3f0eb] px-6 pt-16 pb-10 text-[#1a1c1a] lg:px-10">
            <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[#f5e4d4]/80 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full bg-[#e3e2e0]/80 blur-[100px]" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="flex flex-col gap-6 lg:col-span-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl border border-[#e3e2e0] bg-white/90 p-2.5">
                                <Icon name="apartment" className="text-[#6f4627]" size={28} />
                            </div>
                            <h3 className="text-2xl font-semibold tracking-tight">
                                {t('common.brand.fullName')}
                            </h3>
                        </div>
                        <p className="max-w-sm text-sm leading-relaxed text-[#51443c]">
                            {t('footer.tagline')}
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social) =>
                                social.external ? (
                                    <a
                                        key={social.icon}
                                        href={social.href}
                                        className="flex items-center justify-center rounded-full border border-[#e3e2e0] bg-white/90 p-2.5 text-[#51443c] transition-all hover:border-[#d0b59b] hover:text-[#6f4627] hover:shadow-sm"
                                        aria-label={social.label}
                                    >
                                        <Icon name={social.icon} size={20} />
                                    </a>
                                ) : (
                                    <Link
                                        key={social.icon}
                                        href={social.href}
                                        className="flex items-center justify-center rounded-full border border-[#e3e2e0] bg-white/90 p-2.5 text-[#51443c] transition-all hover:border-[#d0b59b] hover:text-[#6f4627] hover:shadow-sm"
                                        aria-label={social.label}
                                    >
                                        <Icon name={social.icon} size={20} />
                                    </Link>
                                ),
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-5 lg:col-start-6">
                        <h4 className="mb-4 text-lg font-semibold text-[#1a1c1a]">
                            {t('footer.quickLinks')}
                        </h4>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                            {footerLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#83746b] transition-colors hover:text-[#6f4627]"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 border-t border-[#e3e2e0] pt-6 text-sm text-[#83746b] md:flex-row">
                    <p>{t('footer.copyright', { year: currentYear })}</p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <Icon name="location_on" size={16} />
                            {t('footer.location')}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
