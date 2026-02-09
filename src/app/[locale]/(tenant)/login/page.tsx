/**
 * Tenant Login Page
 * Authentication page for tenant users
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';
import type { LoginCredentials } from '@/lib/types';

export default function TenantLoginPage() {
    const t = useTranslations();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState<LoginCredentials>({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginCredentials> = {};

        if (!formData.email) {
            newErrors.email = t('auth.login.errors.invalidEmail');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('auth.login.errors.invalidEmail');
        }

        if (!formData.password) {
            newErrors.password = t('auth.login.errors.passwordTooShort');
        } else if (formData.password.length < 6) {
            newErrors.password = t('auth.login.errors.passwordTooShort');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // TODO: Implement actual authentication API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate successful login
            router.push('/tenant/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ email: t('auth.login.errors.invalidCredentials') });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof LoginCredentials, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-12">
            {/* Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/5 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative w-full max-w-md"
            >
                {/* Logo / Back Button */}
                <div className="mb-8 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group"
                    >
                        <Icon name="arrow_back" size={20} className="transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium">{t('nav.home')}</span>
                    </Link>
                </div>

                {/* Login Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center">
                                <Icon name="apartment" size={24} className="text-white dark:text-slate-900" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {t('auth.login.title')}
                            </h1>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400">
                            {t('auth.login.subtitle')}
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                {t('auth.login.email')}
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="mail" size={20} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`w-full pl-11 pr-4 py-3 rounded-lg border ${errors.email
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white focus:ring-slate-900/10 dark:focus:ring-white/10'
                                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all`}
                                    placeholder={t('auth.login.emailPlaceholder')}
                                    disabled={isLoading}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <Icon name="error" size={16} />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                {t('auth.login.password')}
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="lock" size={20} />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => handleChange('password', e.target.value)}
                                    className={`w-full pl-11 pr-12 py-3 rounded-lg border ${errors.password
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                            : 'border-slate-300 dark:border-slate-700 focus:border-slate-900 dark:focus:border-white focus:ring-slate-900/10 dark:focus:ring-white/10'
                                        } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all`}
                                    placeholder={t('auth.login.passwordPlaceholder')}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                    disabled={isLoading}
                                >
                                    <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={20} />
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <Icon name="error" size={16} />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-slate-900 dark:focus:ring-white"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {t('auth.login.rememberMe')}
                                </span>
                            </label>
                            <Link
                                href="/tenant/forgot-password"
                                className="text-sm text-slate-900 dark:text-white font-medium hover:underline"
                            >
                                {t('auth.login.forgotPassword')}
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-slate-900/30 dark:border-t-slate-900 rounded-full animate-spin" />
                                    {t('auth.login.loggingIn')}
                                </span>
                            ) : (
                                t('auth.login.loginButton')
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400">
                                {t('auth.login.noAccount')}
                            </span>
                        </div>
                    </div>

                    {/* Register Link */}
                    <Link
                        href="/tenant/register"
                        className="block w-full h-12 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white text-slate-900 dark:text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                        <Icon name="person_add" size={20} />
                        {t('auth.login.registerLink')}
                    </Link>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                    {t('auth.register.termsAgree')}{' '}
                    <Link href="/terms" className="text-slate-900 dark:text-white font-medium hover:underline">
                        {t('auth.register.termsLink')}
                    </Link>
                    {' '}{t('auth.register.and')}{' '}
                    <Link href="/privacy" className="text-slate-900 dark:text-white font-medium hover:underline">
                        {t('auth.register.privacyLink')}
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
