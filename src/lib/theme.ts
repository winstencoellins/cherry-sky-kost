/**
 * Theme Configuration for Cherry Sky Kost
 * Defines color palette, semantic tokens, and design constants
 */

export const colors = {
    // Brand Colors (from original HTML template)
    primary: '#137fec',
    gold: '#d4af37',
    navy: '#0f172a',
    backgroundLight: '#f6f7f8',
    backgroundDark: '#101922',

    // Semantic Colors for Kost Features
    whatsapp: '#25D366',

    // Status Colors
    status: {
        available: '#10b981', // green-500
        rented: '#64748b', // slate-500
        waitlist: '#f59e0b', // amber-500
        reserved: '#3b82f6', // blue-500
    },

    // Facility Category Colors
    facility: {
        room: '#8b5cf6', // violet-500
        building: '#06b6d4', // cyan-500
        service: '#ec4899', // pink-500
        security: '#f97316', // orange-500
    },
} as const;

export const spacing = {
    // Mobile Navigation Heights
    mobileNavbar: '56px',
    bottomNav: '64px',

    // Safe area insets for mobile devices
    safeAreaTop: 'env(safe-area-inset-top)',
    safeAreaBottom: 'env(safe-area-inset-bottom)',

    // Content padding to avoid bottom nav overlap
    mobileContentPadding: '5rem', // 80px (64px bottom nav + 16px extra)
} as const;

export const zIndex = {
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modalBackdrop: 40,
    modal: 50,
    popover: 60,
    tooltip: 70,
    navbar: 100,
    sidebar: 110,
    bottomNav: 90,
} as const;

export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

export const typography = {
    fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
    },

    // Font sizes for responsive design
    fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem',    // 48px
    },
} as const;

export const borderRadius = {
    DEFAULT: '0.25rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
} as const;

export const animation = {
    duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
    },

    timing: {
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
    },
} as const;

// Export type for theme usage in components
export type Theme = typeof colors & typeof spacing & typeof zIndex;
