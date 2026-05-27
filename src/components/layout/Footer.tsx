/**
 * Footer Component
 * Site footer with links and newsletter
 */

'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';

export function Footer() {
    const t = useTranslations();
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        main: [
            { label: 'About', href: '/about' },
            { label: 'Search Kost', href: '/search-kosts' },
            { label: 'Contact', href: '/contact' },
            { label: 'Terms & Conditions', href: '/terms' },
            { label: 'Privacy Policy', href: '/privacy' },
        ],
        social: [
            { icon: 'public', href: '#', label: 'Website' },
            { icon: 'alternate_email', href: '#', label: 'Email' },
        ]
    };

    return (
        <footer className="relative w-full overflow-hidden bg-[#f3f0eb] px-6 pt-16 pb-10 text-[#1a1c1a] lg:px-10">
            {/* Ambient Background */}
            <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] rounded-full bg-[#f5e4d4]/80 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[360px] w-[360px] rounded-full bg-[#e3e2e0]/80 blur-[100px]" />

            <div className="relative mx-auto max-w-7xl">
                <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    {/* Brand Column */}
                    <div className="flex flex-col gap-6 lg:col-span-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-xl border border-[#e3e2e0] bg-white/90 p-2.5">
                                <Icon name="apartment" className="text-[#6f4627]" size={28} />
                            </div>
                            <h3 className="text-2xl font-semibold tracking-tight">
                                Cherry Sky Kost
                            </h3>
                        </div>
                        <p className="max-w-sm text-sm leading-relaxed text-[#51443c]">
                            {t('footer.tagline')}
                        </p>
                        <div className="flex gap-4">
                            {footerLinks.social.map((social) => (
                                <a
                                    key={social.icon}
                                    href={social.href}
                                    className="rounded-full border border-[#e3e2e0] bg-white/90 p-2.5 text-[#51443c] transition-all hover:border-[#d0b59b] hover:text-[#6f4627] hover:shadow-sm"
                                    aria-label={social.label}
                                >
                                    <Icon name={social.icon} size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="lg:col-span-5 lg:col-start-6">
                        <h4 className="mb-4 text-lg font-semibold text-[#1a1c1a]">
                            Quick Links
                        </h4>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                            {footerLinks.main.map((link) => (
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

                    {/* Newsletter Column */}
                    <div className="lg:col-span-3">
                        <h4 className="mb-4 text-lg font-semibold text-[#1a1c1a]">
                            Newsletter
                        </h4>
                        <p className="mb-4 text-sm text-[#83746b]">
                            Get the latest kost info and exclusive offers.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="flex-1 rounded-xl border border-[#e3e2e0] bg-white/90 px-4 py-2.5 text-sm text-[#1a1c1a] placeholder:text-[#b0a29a] transition-all focus:outline-none focus:border-[#8b5e3c]/60 focus:ring-1 focus:ring-[#8b5e3c]/40"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="h-10 w-10 rounded-xl bg-[#6f4627] text-white transition-colors hover:bg-[#805533]"
                                aria-label="Subscribe to newsletter"
                            >
                                <Icon name="arrow_forward" size={20} />
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 border-t border-[#e3e2e0] pt-6 text-sm text-[#83746b] md:flex-row">
                    <p>
                        © {currentYear} Cherry Sky Kost. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                            <Icon name="location_on" size={16} />
                            Medan, Indonesia
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
