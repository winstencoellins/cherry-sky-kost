/**
 * Material Symbols Icon Component
 * Wrapper for Google Material Symbols icons
 */

import { cn } from '@/lib/utils';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
    name: string;
    filled?: boolean;
    weight?: number;
    size?: number;
}

export function Icon({
    name,
    filled = false,
    weight = 400,
    size = 24,
    className,
    ...props
}: IconProps) {
    return (
        <span
            className={cn('material-symbols-outlined select-none', className)}
            style={{
                fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
                fontSize: `${size}px`,
            }}
            {...props}
        >
            {name}
        </span>
    );
}
