/**
 * Favorites Page - Favorit
 * Saved properties (placeholder)
 */

'use client';

import { useTranslations } from 'next-intl';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { Icon } from '@/components/shared/Icon';

export default function FavoritesPage() {
  const t = useTranslations();

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 py-20">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <Icon 
              name="favorite" 
              size={64} 
              className="text-slate-300 dark:text-slate-700 mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('nav.favorites')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Belum ada kost favorit. Simpan kost yang Anda sukai untuk melihatnya di sini.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
          >
            <Icon name="search" size={20} />
            Cari Kost
          </a>
        </div>
      </div>
      <Footer />
    </AppLayout>
  );
}
