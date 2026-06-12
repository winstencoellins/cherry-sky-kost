/**
 * Homepage - Cherry Sky Kost
 * Main landing page with hero, property listings, and facilities
 */

'use client';

import { useTranslations } from 'next-intl';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Amenities } from '@/components/sections/Amenities';
import { KostGrid } from '@/components/kost/KostGrid';
import { DEFAULT_SEARCH_FILTERS } from '@/lib/api/public/search-contract';
import { useKosts } from '@/lib/hooks/use-kost-data';

export default function HomePage() {
  const t = useTranslations('home.properties');
  const { data: kosts, isLoading, error } = useKosts();

  return (
    <AppLayout>
      {/* Hero Section */}
      <Hero />

      {/* Properties Section */}
      <section
        id="properties"
        aria-labelledby="featured-properties-heading"
        className="flex w-full flex-col items-center bg-[#faf9f6] px-6 py-20 lg:px-10"
      >
        <div className="flex w-full max-w-[1080px] flex-col gap-10">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#83746b]">
              {t('eyebrow')}
            </p>
            <h2
              id="featured-properties-heading"
              className="text-2xl font-semibold tracking-tight text-[#1a1c1a] md:text-3xl"
            >
              {t('title')}
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-[#83746b]">
              {t('description')}
            </p>
          </div>

          <KostGrid
            kosts={kosts ?? []}
            filters={DEFAULT_SEARCH_FILTERS}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </section>

      {/* Amenities Section */}
      <Amenities />

      {/* Contact Section */}
      <div id="contact">
        <Footer />
      </div>
    </AppLayout>
  );
}

