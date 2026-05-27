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
        } catch (_error) {
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
                        <Icon name="mail" size={14} />
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

                {/* Form Container */}
                <div className="max-w-2xl mx-auto">
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="rounded-2xl border border-[#e3e2e0] bg-white/90 p-8 shadow-sm"
                    >
                        {/* Form Fields */}
                        <div className="space-y-6">
                            {/* Name & Email Row */}
                            <motion.div variants={item} className="grid sm:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="contact-name"
                                        className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
                                    >
                                        {t('name')}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder={t('namePlaceholder')}
                                        className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:border-[#8b5e3c]/60 focus:ring-2 focus:ring-[#8b5e3c]/15 ${
                                            errors.name
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-[#e3e2e0] bg-white'
                                        } text-[#1a1c1a] placeholder:text-[#b0a29a]`}
                                    />
                                    {errors.name && (
                                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="contact-email"
                                        className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
                                    >
                                        {t('email')}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder={t('emailPlaceholder')}
                                        className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:border-[#8b5e3c]/60 focus:ring-2 focus:ring-[#8b5e3c]/15 ${
                                            errors.email
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-[#e3e2e0] bg-white'
                                        } text-[#1a1c1a] placeholder:text-[#b0a29a]`}
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
                                    <label
                                        htmlFor="contact-phone"
                                        className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
                                    >
                                        {t('phone')}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="contact-phone"
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder={t('phonePlaceholder')}
                                        className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:border-[#8b5e3c]/60 focus:ring-2 focus:ring-[#8b5e3c]/15 ${
                                            errors.phone
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-[#e3e2e0] bg-white'
                                        } text-[#1a1c1a] placeholder:text-[#b0a29a]`}
                                    />
                                    {errors.phone && (
                                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Subject */}
                                <div>
                                    <label
                                        htmlFor="contact-subject"
                                        className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
                                    >
                                        {t('subject')}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="contact-subject"
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        placeholder={t('subjectPlaceholder')}
                                        className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:border-[#8b5e3c]/60 focus:ring-2 focus:ring-[#8b5e3c]/15 ${
                                            errors.subject
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-[#e3e2e0] bg-white'
                                        } text-[#1a1c1a] placeholder:text-[#b0a29a]`}
                                    />
                                    {errors.subject && (
                                        <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
                                    )}
                                </div>
                            </motion.div>

                            {/* Message */}
                            <motion.div variants={item}>
                                <label
                                    htmlFor="contact-message"
                                    className="block text-sm font-semibold text-slate-900 dark:text-white mb-2"
                                >
                                    {t('message')}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder={t('messagePlaceholder')}
                                    rows={5}
                                    className={`w-full resize-none rounded-xl border px-4 py-3 transition-colors focus:outline-none focus:border-[#8b5e3c]/60 focus:ring-2 focus:ring-[#8b5e3c]/15 ${
                                        errors.message
                                            ? 'border-red-500 bg-red-50'
                                            : 'border-[#e3e2e0] bg-white'
                                    } text-[#1a1c1a] placeholder:text-[#b0a29a]`}
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
                                className="grid gap-4 border-t border-[#e3e2e0] pt-6 sm:grid-cols-2"
                            >
                                <Button
                                    onClick={handleSendViaWhatsApp}
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] font-semibold text-white hover:bg-[#1fb855]"
                                >
                                    <Icon name="chat" size={18} />
                                    {t('sendViaWhatsApp')}
                                </Button>
                                <Button
                                    onClick={handleSendViaEmail}
                                    disabled={isSubmitting}
                                    className="flex items-center justify-center gap-2 rounded-xl bg-[#6f4627] font-semibold text-white hover:bg-[#805533]"
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
