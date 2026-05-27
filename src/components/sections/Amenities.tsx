/**
 * Amenities Section Component
 * Displays key amenities in a dark, navy background section
 * Matches the 'LuxeLiving' design style
 */

'use client';

import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

export function Amenities() {
    const amenities = [
        {
            id: 'wifi',
            icon: 'wifi',
            title: 'High-Speed WiFi',
            description: 'Internet cepat gratis di setiap lantai dan kamar.',
        },
        {
            id: 'ac',
            icon: 'ac_unit',
            title: 'Full AC',
            description: 'Setiap kamar dilengkapi AC untuk kenyamanan maksimal.',
        },
        {
            id: 'security',
            icon: 'security',
            title: 'Keamanan 24/7',
            description: 'CCTV 24 jam dan penjaga kost untuk keamanan Anda.',
        },
        {
            id: 'parking',
            icon: 'local_parking',
            title: 'Parkir Luas',
            description: 'Area parkir aman untuk motor dan mobil penghuni.',
        },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section
            id="amenities"
            className="relative w-full overflow-hidden bg-[#faf9f6] py-20 px-6 text-[#1a1c1a] lg:px-10"
        >
            {/* Background Gradients */}
            <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] -translate-y-1/2 translate-x-1/3 rounded-full bg-[#f5e4d4]/70 blur-[120px]" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-[380px] w-[380px] translate-y-1/3 -translate-x-1/3 rounded-full bg-[#e3e2e0]/70 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-[1080px]">
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e3e2e0] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#6f4627]"
                    >
                        <Icon name="star" size={14} filled />
                        <span>Premium Living</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="mb-4 text-3xl font-semibold tracking-tight text-[#1a1c1a] lg:text-4xl"
                    >
                        Fasilitas Unggulan
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mx-auto max-w-2xl text-base font-normal leading-relaxed text-[#51443c]"
                    >
                        Nikmati kenyamanan hunian modern dengan fasilitas lengkap yang kami sediakan
                        khusus untuk Anda.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid gap-5 sm:grid-cols-2 md:grid-cols-4"
                >
                    {amenities.map((amenity) => (
                        <motion.div
                            key={amenity.id}
                            variants={item}
                            whileHover={{ y: -5 }}
                            className="group flex flex-col items-center gap-5 rounded-2xl border border-[#e3e2e0] bg-white/90 p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d0b59b] hover:shadow-md"
                        >
                            <div className="rounded-2xl bg-[#f5e4d4]/60 p-3 text-[#6f4627] transition-colors duration-300 group-hover:bg-[#f0d8bf]">
                                <Icon name={amenity.icon} size={32} className="!text-3xl" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-base font-semibold text-[#1a1c1a]">
                                    {amenity.title}
                                </h3>
                                <p className="text-sm font-normal leading-relaxed text-[#83746b]">
                                    {amenity.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
