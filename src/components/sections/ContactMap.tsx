/**
 * Contact Map Section Component
 * Displays property locations on an embedded map
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

interface MapLocation {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
}

/** Stable embed URL — must not use Math.random() or other runtime values (hydration mismatch). */
const MEDAN_MAP_EMBED_URL =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.3280502394305!2d98.6767!3d3.195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30313339d7c0a50d%3A0xf8e2a1b0!2sMedan%2C%20North%20Sumatra!5e0!3m2!1sen!2sid!4v1700000000000';

export function ContactMap() {
    const t = useTranslations('contact.map');

    const locations: MapLocation[] = [
        {
            id: 'skykost',
            name: 'SKYKOST',
            address: 'Jl. Gaharu Gg. Amat Lama No. 12, Medan Area, Medan',
            latitude: 3.1955,
            longitude: 98.6722,
            phone: '+62 812-3456-7890',
        },
        {
            id: 'cherry-kost',
            name: 'CHERRY KOST',
            address: 'Jl. Setia Budi No. 45, Medan Maimun, Medan',
            latitude: 3.1945,
            longitude: 98.6812,
            phone: '+62 812-3456-7891',
        },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    const getMapsURL = (location: MapLocation) => {
        return `https://www.google.com/maps/search/${encodeURIComponent(
            location.latitude + ',' + location.longitude
        )}`;
    };

    return (
        <section className="w-full bg-[#faf9f6] py-16 px-6 lg:px-10">
            <div className="max-w-[1080px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e3e2e0] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#6f4627]"
                    >
                        <Icon name="map" size={14} />
                        <span>{t('subtitle')}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-4 text-2xl font-semibold tracking-tight text-[#1a1c1a] md:text-3xl"
                    >
                        {t('title')}
                    </motion.h2>
                </div>

                {/* Map & Location Cards */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Embedded Map */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="h-96 overflow-hidden rounded-2xl border border-[#e3e2e0] shadow-sm lg:col-span-2"
                    >
                        <iframe
                            src={MEDAN_MAP_EMBED_URL}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Cherry Sky Kost Locations"
                        />
                    </motion.div>

                    {/* Location Cards */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="flex flex-col gap-6"
                    >
                        {locations.map((location, index) => (
                            <motion.div
                                key={location.id}
                                variants={item}
                                className="group relative rounded-2xl border border-[#e3e2e0] bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d0b59b] hover:shadow-md"
                            >
                                {/* Location Number */}
                                <div className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#6f4627] text-xs font-bold text-white">
                                    {index + 1}
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    {/* Name */}
                                    <h3 className="pr-8 text-base font-semibold text-[#1a1c1a]">
                                        {location.name}
                                    </h3>

                                    {/* Address */}
                                    <div className="flex items-start gap-3">
                                        <Icon
                                            name="location_on"
                                            size={16}
                                            className="mt-1 flex-shrink-0 text-[#ba1a1a]"
                                        />
                                        <p className="text-sm leading-relaxed text-[#83746b]">
                                            {location.address}
                                        </p>
                                    </div>

                                    {/* Phone */}
                                    <a
                                        href={`tel:${location.phone}`}
                                        className="flex items-center gap-3 transition-colors hover:text-[#6f4627]"
                                    >
                                        <Icon name="call" size={16} className="flex-shrink-0 text-[#6f4627]" />
                                        <span className="text-sm text-[#83746b] transition-colors hover:text-[#1a1c1a]">
                                            {location.phone}
                                        </span>
                                    </a>

                                    {/* Coordinates */}
                                    <div className="flex items-center gap-2 rounded-lg bg-[#faf9f6] px-3 py-2 pt-2 text-xs text-[#83746b]">
                                        <Icon name="location_on" size={12} />
                                        <span>
                                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                                        </span>
                                    </div>

                                    {/* Directions Button */}
                                    <a
                                        href={getMapsURL(location)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#6f4627] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#805533]"
                                    >
                                        <Icon name="directions" size={16} />
                                        {t('directionsButton')}
                                    </a>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Additional Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 rounded-2xl border border-[#e3e2e0] bg-white/80 p-8 text-center shadow-sm"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Icon name="info" size={20} className="text-[#6f4627]" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Planning a Visit?
                        </h3>
                    </div>
                    <p className="mx-auto mb-4 max-w-2xl text-sm text-[#83746b]">
                        Feel free to visit our properties during business hours. Call ahead to schedule a tour and
                        ensure someone is available to show you around.
                    </p>
                    <a
                        href="tel:+6281234567890"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#6f4627] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#805533]"
                    >
                        <Icon name="call" size={18} />
                        Call to Schedule Tour
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
