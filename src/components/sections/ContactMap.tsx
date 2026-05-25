/**
 * Contact Map Section Component
 * Displays property locations on an embedded map
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';
import { Button } from '@/components/ui/button';

interface MapLocation {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string;
}

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
        <section className="w-full py-24 px-6 lg:px-10 bg-white dark:bg-slate-900">
            <div className="max-w-[1080px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary dark:text-primary/80 text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <Icon name="map" size={14} />
                        <span>{t('subtitle')}</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight"
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
                        className="lg:col-span-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-96 shadow-xl"
                    >
                        <iframe
                            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.3280502394305!2d98.66400!3d3.1955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30313339d7c0a50d%3A0x${Math.random().toString(16).substr(2, 8)}!2sMedan!5e0!3m2!1sen!2sid!4v1234567890`}
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
                                className="group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                {/* Location Number */}
                                <div className="absolute top-4 right-4 inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-bold">
                                    {index + 1}
                                </div>

                                {/* Content */}
                                <div className="space-y-3">
                                    {/* Name */}
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white pr-8">
                                        {location.name}
                                    </h3>

                                    {/* Address */}
                                    <div className="flex items-start gap-3">
                                        <Icon name="location_on" size={16} className="text-red-500 flex-shrink-0 mt-1" />
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {location.address}
                                        </p>
                                    </div>

                                    {/* Phone */}
                                    <a
                                        href={`tel:${location.phone}`}
                                        className="flex items-center gap-3 hover:text-primary transition-colors"
                                    >
                                        <Icon name="call" size={16} className="text-primary flex-shrink-0" />
                                        <span className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                            {location.phone}
                                        </span>
                                    </a>

                                    {/* Coordinates */}
                                    <div className="flex items-center gap-2 pt-2 text-xs text-slate-500 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg">
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
                                        className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-lg transition-colors mt-4"
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
                    className="mt-16 p-8 bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl border border-primary/20 text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Icon name="info" size={20} className="text-primary" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            Planning a Visit?
                        </h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-2xl mx-auto">
                        Feel free to visit our properties during business hours. Call ahead to schedule a tour and
                        ensure someone is available to show you around.
                    </p>
                    <a
                        href="tel:+6281234567890"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
                    >
                        <Icon name="call" size={18} />
                        Call to Schedule Tour
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
