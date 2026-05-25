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
        <footer className="w-full bg-[#0f172a] text-white pt-20 pb-10 px-6 lg:px-10 overflow-hidden relative">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#d4af37]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl">
                                <Icon name="apartment" className="text-primary" size={28} />
                            </div>
                            <h3 className="font-bold text-2xl tracking-tight">Cherry Sky Kost</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            {t('footer.tagline')}
                        </p>
                        <div className="flex gap-4">
                            {footerLinks.social.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:text-primary transition-all"
                                    aria-label={social.label}
                                >
                                    <Icon name={social.icon} size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="lg:col-span-5 lg:col-start-6">
                        <h4 className="font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="grid grid-cols-2 gap-x-8 gap-y-4">
                            {footerLinks.main.map((link, index) => (
                                <li key={`link-${index}`}>
                                    <Link href={link.href} className="text-slate-400 hover:text-primary text-sm transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-lg mb-6">Newsletter</h4>
                        <p className="text-slate-400 text-sm mb-4">
                            Get the latest kost info and exclusive offers.
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Your Email"
                                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            />
                            <button className="p-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white transition-colors">
                                <Icon name="arrow_forward" size={20} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">
                        © {currentYear} Cherry Sky Kost. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-sm text-slate-400">
                            <Icon name="location_on" size={16} />
                            Medan, Indonesia
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
