/**
 * Language Switcher Component
 * Interactive language switcher with flag emojis and smooth animations
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
    variant?: 'navbar' | 'sidebar';
}

interface Language {
    code: string;
    name: string;
    flag: string;
}

export function LanguageSwitcher({ variant = 'navbar' }: LanguageSwitcherProps) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages: Language[] = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    ];

    const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

    const handleLanguageChange = (langCode: string) => {
        if (langCode !== locale) {
            // Remove the current locale from the pathname
            const pathWithoutLocale = pathname.replace(`/${locale}`, '');
            // Navigate to the new locale
            router.push(`/${langCode}${pathWithoutLocale || '/'}`);
        }
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    return (
        <div ref={dropdownRef} className="relative">
            {/* Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg font-medium transition-all duration-300',
                    variant === 'navbar'
                        ? 'text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800/30 bg-slate-100/30'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm'
                )}
            >
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="text-xs font-bold uppercase">{currentLanguage.code}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-0.5"
                >
                    <Icon name="expand_more" size={16} />
                </motion.div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={cn(
                            'absolute top-full right-0 mt-2 rounded-xl border backdrop-blur-md shadow-lg p-2 w-48 z-50',
                            variant === 'navbar'
                                ? 'bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-700'
                                : 'bg-white/90 dark:bg-slate-800/90 border-slate-100 dark:border-slate-700'
                        )}
                    >
                        <div className="space-y-1">
                            {languages.map((language, index) => {
                                const isActive = language.code === locale;

                                return (
                                    <motion.button
                                        key={language.code}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleLanguageChange(language.code)}
                                        className={cn(
                                            'w-full px-4 py-3 rounded-lg flex items-center gap-3 text-sm font-medium transition-all duration-200',
                                            isActive
                                                ? 'bg-primary text-white shadow-md'
                                                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                                        )}
                                    >
                                        <span className="text-lg">{language.flag}</span>
                                        <span className="text-xs font-bold uppercase">{language.code}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeLanguage"
                                                className="ml-auto"
                                            >
                                                <Icon name="check" size={18} />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Divider and Info */}
                        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1">
                                {variant === 'navbar' ? 'Switch your preferred language' : 'Change language'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
