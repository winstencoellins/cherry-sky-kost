/**
 * Privacy Policy Page - Cherry Sky Kost
 * Comprehensive privacy policy with full i18n support
 */

'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { PrivacyHero } from '@/components/sections/PrivacyHero';
import { PrivacyContent } from '@/components/sections/PrivacyContent';

export default function PrivacyPage() {
    return (
        <AppLayout>
            {/* Hero Section */}
            <PrivacyHero />

            {/* Privacy Content Section */}
            <PrivacyContent />

            {/* Footer */}
            <Footer />
        </AppLayout>
    );
}
