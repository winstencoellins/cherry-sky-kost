/**
 * Amenities Section Component
 * Displays key amenities in a dark, navy background section
 * Matches the 'LuxeLiving' design style
 */

'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Icon } from '@/components/shared/Icon';

export function Amenities() {
    const t = useTranslations();

    const amenities = [
        {
            icon: 'wifi',
            title: 'High-Speed WiFi',
            description: 'Internet cepat gratis di setiap lantai dan kamar.',
        },
        {
            icon: 'ac_unit',
            title: 'Full AC',
            description: 'Setiap kamar dilengkapi AC untuk kenyamanan maksimal.',
        },
        {
            icon: 'security',
            title: 'Keamanan 24/7',
            description: 'CCTV 24 jam dan penjaga kost untuk keamanan Anda.',
        },
        {
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
        <section id="amenities" className="w-full bg-[#0f172a] relative overflow-hidden py-24 px-6 lg:px-10 text-white">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#d4af37]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 max-w-[1080px] mx-auto">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#d4af37] text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <Icon name="star" size={14} filled />
                        <span>Premium Living</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight"
                    >
                        Fasilitas Unggulan
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-slate-400 max-w-2xl mx-auto text-lg font-light leading-relaxed"
                    >
                        Nikmati kenyamanan hunian modern dengan fasilitas lengkap yang kami sediakan khusus untuk Anda.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {amenities.map((amenity, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -5 }}
                            className="group flex flex-col items-center gap-5 p-8 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300"
                        >
                            <div className="p-4 bg-[#d4af37]/10 group-hover:bg-[#d4af37]/20 rounded-2xl text-[#d4af37] transition-colors duration-300">
                                <Icon name={amenity.icon} size={32} className='!text-3xl' />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="font-bold text-lg">{amenity.title}</h3>
                                <p className="text-sm text-slate-400 font-light leading-relaxed">
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
