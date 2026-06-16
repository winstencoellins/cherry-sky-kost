/**
 * Terms & Conditions Page - Cherry Sky Living
 * Displays company terms and conditions with full i18n support
 */

'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { TermsHero } from '@/components/sections/TermsHero';
import { TermsContent } from '@/components/sections/TermsContent';

export default function TermsPage() {
    return (
        <AppLayout>
            {/* Hero Section */}
            <TermsHero />

            {/* Terms Content Section */}
            <TermsContent />

            {/* Footer */}
            <Footer />
        </AppLayout>
    );
}
