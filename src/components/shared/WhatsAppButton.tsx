/**
 * WhatsApp Button Component
 * Generates WhatsApp link with pre-filled message
 */

'use client';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/shared/Icon';
import { generateWhatsAppURL } from '@/lib/utils/format';
import type { WhatsAppButtonProps } from '@/lib/types';
import { cn } from '@/lib/utils';

export function WhatsAppButton({
    phoneNumber,
    message,
    variant = 'default',
    className,
    label,
}: WhatsAppButtonProps) {
    const whatsappURL = generateWhatsAppURL(phoneNumber, message);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleClick}
                className={cn(
                    'inline-flex items-center justify-center rounded-full w-12 h-12 bg-[#25D366] hover:bg-[#1fb855] text-white transition-colors shadow-lg',
                    className
                )}
                aria-label="Contact via WhatsApp"
                type="button"
            >
                <Icon name="chat" size={24} />
            </button>
        );
    }

    if (variant === 'compact') {
        return (
            <button
                onClick={handleClick}
                className={cn(
                    'inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] hover:bg-[#1fb855] text-white text-sm font-medium rounded-lg transition-colors',
                    className
                )}
                type="button"
            >
                <Icon name="chat" size={18} />
                <span>WhatsApp</span>
            </button>
        );
    }

    return (
        <Button
            onClick={handleClick}
            className={cn(
                'bg-[#25D366] hover:bg-[#1fb855] text-white font-semibold',
                className
            )}
        >
            <Icon name="chat" size={20} className="mr-2" />
            { label }
        </Button>
    );
}
