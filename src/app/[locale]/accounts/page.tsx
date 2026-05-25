/**
 * Account Page - Akun
 * User account and profile (placeholder)
 */

'use client';

import { useTranslations } from 'next-intl';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/shared/Icon';

export default function AccountPage() {
  const t = useTranslations();

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-20">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <Icon 
              name="person" 
              size={64} 
              className="text-slate-300 dark:text-slate-700 mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('nav.account')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Fitur akun akan segera tersedia. Login untuk mengelola profil dan booking Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
            >
              <Icon name="login" size={20} />
              {t('nav.login')}
            </a>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-lg transition-colors"
            >
              <Icon name="home" size={20} />
              Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </AppLayout>
  );
}
