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
      <section
        id="properties"
        aria-labelledby="featured-properties-heading"
        className="flex w-full flex-col items-center bg-[#faf9f6] px-6 py-20 lg:px-10"
      >
        <div className="flex w-full max-w-[1080px] flex-col gap-10">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#83746b]">
              Properti Pilihan
            </p>
            <h2
              id="featured-properties-heading"
              className="text-2xl font-semibold tracking-tight text-[#1a1c1a] md:text-3xl"
            >
              Kamar Kost Pilihan di Medan
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-[#83746b]">
              Telusuri kamar kost yang sudah kami kurasi dengan lokasi strategis dan fasilitas
              lengkap.
            </p>
          </div>

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
            <div className="py-12 text-center">
              <p className="text-sm text-[#83746b]">
                {t('search.noResults')}
              </p>
            </div>
          )}
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

