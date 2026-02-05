/**
 * Search Page - Cari Kost
 * Property search with filters (placeholder)
 */

'use client';

import { useTranslations } from 'next-intl';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/shared/Icon';

export default function SearchPage() {
  const t = useTranslations();

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-20">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <Icon 
              name="search" 
              size={64} 
              className="text-slate-300 dark:text-slate-700 mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('search.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Halaman pencarian akan segera tersedia. Untuk sementara, lihat properti kami di halaman utama.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#137fec] hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors"
          >
            <Icon name="home" size={20} />
            Kembali ke Beranda
          </a>
        </div>
      </div>
      <Footer />
    </AppLayout>
  );
}
