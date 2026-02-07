/**
 * Contact Form Component
 * Handles contact form submission via WhatsApp or Email
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
}

export function ContactForm() {
    const t = useTranslations('contact.form');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = t('required');
        if (!formData.email.trim()) {
            newErrors.email = t('required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('invalidEmail');
        }
        if (!formData.phone.trim()) newErrors.phone = t('required');
        if (!formData.subject.trim()) newErrors.subject = t('required');
        if (!formData.message.trim()) newErrors.message = t('required');

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSendViaWhatsApp = () => {
        if (!validateForm()) return;

        const whatsappMessage = `
Hello, I'd like to inquire about Cherry Sky Kost.

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}

Message:
${formData.message}
        `.trim();

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/6281234567890?text=${encodedMessage}`;

        window.open(whatsappURL, '_blank');
        handleSuccess();
    };

    const handleSendViaEmail = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Build mailto link
            const mailtoLink = `mailto:info@cherryskykost.com?subject=${encodeURIComponent(
                formData.subject
            )}&body=${encodeURIComponent(
                `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`
            )}`;

            window.location.href = mailtoLink;
            handleSuccess();
        } catch (error) {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccess = () => {
        setSubmitStatus('success');
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: '',
        });
        setTimeout(() => setSubmitStatus('idle'), 3000);
    };

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

    return (
        <section className="w-full py-24 px-6 lg:px-10 bg-[#f6f7f8] dark:bg-[#101922]">
            <div className="max-w-[1080px] mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#137fec]/10 border border-[#137fec]/20 text-[#137fec] dark:text-blue-400 text-xs font-bold tracking-widest uppercase mb-6"
                    >
                        <Icon name="mail" size={14} />
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

                {/* Form Container */}
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl"
                    >
                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* Name & Email Row */}
                            <motion.div variants={item} className="grid sm:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        {t('name')}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder={t('namePlaceholder')}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#137fec] ${
                                            errors.name
                                                ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                        } text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        {t('email')}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder={t('emailPlaceholder')}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#137fec] ${
                                            errors.email
                                                ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                        } text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Phone & Subject Row */}
                            <motion.div variants={item} className="grid sm:grid-cols-2 gap-6">
                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        {t('phone')}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder={t('phonePlaceholder')}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#137fec] ${
                                            errors.phone
                                                ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                        } text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                        {t('subject')}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        placeholder={t('subjectPlaceholder')}
                                        className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#137fec] ${
                                            errors.subject
                                                ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                        } text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                                    />
                                    {errors.subject && (
                                        <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Message */}
                            <motion.div variants={item}>
                                <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                    {t('message')}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder={t('messagePlaceholder')}
                                    rows={5}
                                    className={`w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#137fec] resize-none ${
                                        errors.message
                                            ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                                    } text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400`}
                                />
                                {errors.message && (
                                    <p className="text-xs text-red-500 mt-1">{errors.message}</p>
                                )}
                            </motion.div>

                            {/* Status Message */}
                            {submitStatus === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3"
                                >
                                    <Icon name="check_circle" size={20} className="text-emerald-600 dark:text-emerald-400" />
                                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                        {t('sent')}
                                    </p>
                                </motion.div>
                            )}

                            {submitStatus === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
                                >
                                    <Icon name="error" size={20} className="text-red-600 dark:text-red-400" />
                                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                                        {t('error')}
                                    </p>
                                </motion.div>
                            )}

                            {/* Action Buttons */}
                            <motion.div
                                variants={item}
                                className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800"
                            >
                                <Button
                                    onClick={handleSendViaWhatsApp}
                                    disabled={isSubmitting}
                                    className="bg-[#25D366] hover:bg-[#1fb855] text-white font-semibold flex items-center justify-center gap-2"
                                >
                                    <Icon name="chat" size={18} />
                                    {t('sendViaWhatsApp')}
                                </Button>
                                <Button
                                    onClick={handleSendViaEmail}
                                    disabled={isSubmitting}
                                    className="bg-[#137fec] hover:bg-blue-600 text-white font-semibold flex items-center justify-center gap-2"
                                >
                                    <Icon name="mail" size={18} />
                                    {t('sendViaEmail')}
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
