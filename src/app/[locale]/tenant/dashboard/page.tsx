/**
 * Tenant Dashboard Page
 * Main dashboard for tenant users to manage bookings and account
 */

'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';

export default function TenantDashboardPage() {
    const t = useTranslations();

    const menuItems = [
        {
            icon: 'calendar_today',
            title: t('auth.dashboard.myBookings'),
            description: 'View and manage your bookings',
            href: '/tenant/bookings',
            color: 'from-blue-500/10 to-blue-500/5',
        },
        {
            icon: 'payment',
            title: t('auth.dashboard.myPayments'),
            description: 'Payment history and invoices',
            href: '/tenant/payments',
            color: 'from-green-500/10 to-green-500/5',
        },
        {
            icon: 'person',
            title: t('auth.dashboard.myProfile'),
            description: 'Update your profile information',
            href: '/tenant/profile',
            color: 'from-purple-500/10 to-purple-500/5',
        },
        {
            icon: 'build',
            title: t('auth.dashboard.maintenance'),
            description: 'Submit and track maintenance requests',
            href: '/tenant/maintenance',
            color: 'from-orange-500/10 to-orange-500/5',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                {t('auth.dashboard.welcome', { name: 'John Doe' })}
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                {new Date().toLocaleDateString(undefined, { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/tenant/profile" className="p-2">
                                <Icon name="account_circle" size={32} className="text-slate-600 dark:text-slate-400" />
                            </Link>
                            <button 
                                onClick={() => {
                                    // TODO: Implement logout
                                    console.log('Logout');
                                }}
                                className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                                {t('auth.dashboard.logout')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0 }}
                        className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Active Bookings</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">2</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <Icon name="calendar_today" size={24} className="text-blue-500" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Outstanding Balance</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">Rp 500K</p>
                            </div>
                            <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                                <Icon name="payment" size={24} className="text-red-500" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Maintenance Requests</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">1</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                <Icon name="build" size={24} className="text-orange-500" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Account Status</p>
                                <p className="text-3xl font-bold text-green-500 mt-2">Active</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                                <Icon name="check_circle" size={24} className="text-green-500" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Menu Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Quick Access</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {menuItems.map((item, idx) => (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.4 + idx * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    className={`block h-full p-6 rounded-lg border border-slate-200 dark:border-slate-800 bg-gradient-to-br ${item.color} hover:border-slate-900 dark:hover:border-white transition-all group`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <Icon name={item.icon} size={24} className="text-slate-900 dark:text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {item.description}
                                    </p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    className="mt-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6"
                >
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 last:pb-0 last:border-0">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Icon name="event" size={20} className="text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Booking confirmed for Room 305</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">2 days ago</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 last:pb-0 last:border-0">
                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                                <Icon name="paid" size={20} className="text-green-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Payment received - Rp 1.5M</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400">5 days ago</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
