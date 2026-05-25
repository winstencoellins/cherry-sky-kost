/**
 * Room Detail Sidebar Component
 * Sticky sidebar with pricing, agent info, and CTA buttons
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import { WhatsAppButton } from '@/components/shared/WhatsAppButton';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils/format';

interface RoomDetailSidebarProps {
    price: number;
    securityDeposit?: number;
    whatsappNumber: string;
    roomName: string;
    propertyName: string;
    agentName?: string;
    agentRole?: string;
    agentImage?: string;
    onFavorite?: () => void;
    isFavorite?: boolean;
}

export function RoomDetailSidebar({
    price,
    securityDeposit = 500000,
    whatsappNumber,
    roomName,
    propertyName,
    agentName = 'Customer Service',
    agentRole = 'Property Manager',
    agentImage,
    onFavorite,
    isFavorite = false,
}: RoomDetailSidebarProps) {
    const t = useTranslations();

    return (
        <div className="lg:w-100 shrink-0 border-l border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-6 lg:p-8">
            <div className="sticky top-24 space-y-6">
                {/* Price Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow"
                >
                    <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-3xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(price)}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">
                            {t('pricing.perMonth')}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
                        <Icon name="shield" size={18} />
                        <span>{t('roomDetail.deposit', { amount: formatCurrency(securityDeposit) })}</span>
                    </div>
                    <div className="space-y-3">
                        <WhatsAppButton
                            phoneNumber={whatsappNumber}
                            message={`Halo, saya tertarik dengan ${roomName} di ${propertyName}. Apakah masih tersedia?`}
                            className="w-full"
                            label={t('cta.bookNow')}
                        />
                        <button
                            className="w-full bg-white dark:bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white font-semibold py-3 px-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            onClick={onFavorite}
                        >
                            <Icon name={isFavorite ? 'favorite' : 'favorite_border'} size={20} filled={isFavorite} />
                            {isFavorite ? t('roomDetail.saved') : t('roomDetail.save')}
                        </button>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-4">
                        {t('roomDetail.notChargedYet')}
                    </p>
                </motion.div>

                {/* Agent Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
                >
                    <div className="relative">
                        <div
                            className={cn(
                                'w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700',
                                agentImage && 'bg-cover bg-center'
                            )}
                            style={agentImage ? { backgroundImage: `url(${agentImage})` } : undefined}
                        >
                            {!agentImage && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Icon name="person" size={24} className="text-slate-400" />
                                </div>
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">{agentName}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{agentRole}</p>
                    </div>
                    <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-primary transition-colors"
                    >
                        <Icon name="chat" size={20} />
                    </a>
                </motion.div>

                {/* Map Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 h-40 relative group cursor-pointer hover:shadow-md transition-shadow"
                >
                    <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Icon name="map" size={48} className="text-slate-400" />
                    </div>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-3 left-3 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md text-slate-800 dark:text-white flex items-center gap-1.5\">
                        <Icon name="map\" size={14} />
                        {t('roomDetail.viewOnMap')}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
