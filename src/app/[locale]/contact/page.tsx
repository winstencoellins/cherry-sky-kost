/**
 * Contact Page - Cherry Sky Living
 * Complete contact page with hero, form, info, and map
 */

'use client';

import { useTranslations } from 'next-intl';
import { AppLayout } from '@/components/layout/AppLayout';
import { Footer } from '@/components/layout/Footer';
import { ContactHero } from '@/components/sections/ContactHero';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { ContactForm } from '@/components/sections/ContactForm';
import { ContactMap } from '@/components/sections/ContactMap';

export default function ContactPage() {
    const t = useTranslations();

    return (
        <AppLayout>
            {/* Hero Section */}
            <ContactHero />

            {/* Contact Info Section */}
            <ContactInfo />

            {/* Contact Form Section */}
            <ContactForm />

            {/* Map Section */}
            <ContactMap />

            {/* Footer */}
            <Footer />
        </AppLayout>
    );
}
