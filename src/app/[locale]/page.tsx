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
import { KostSection } from '@/components/kost/KostSection';
import { KostSectionSkeleton } from '@/components/kost/SkeletonLoaders';
import { useFeaturedKosts } from '@/lib/hooks/use-kost-data';

export default function HomePage() {
  const t = useTranslations();
  const { data: kosts, isLoading } = useFeaturedKosts();

  return (
    <AppLayout>
      {/* Hero Section */}
      <Hero />

      {/* Properties Section */}
      <div
        id="properties"
        className="flex flex-col items-center w-full py-20 px-6 lg:px-10 bg-[#f6f7f8] dark:bg-[#101922]"
      >
        <div className="max-w-[1080px] w-full flex flex-col gap-24">
          {isLoading ? (
            <>
              <KostSectionSkeleton />
              <KostSectionSkeleton />
            </>
          ) : kosts && kosts.length > 0 ? (
            kosts.map((kost) => (
              <KostSection key={kost.id} kost={kost} showFacilities={true} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">
                {t('search.noResults')}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Amenities Section */}
      <Amenities />

      {/* Contact Section */}
      <div id="contact">
        <Footer />
      </div>
    </AppLayout>
  );
}

