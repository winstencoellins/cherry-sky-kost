/**
 * App Layout Component
 * Wraps the entire application with navigation
 */

'use client';

import { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="relative flex min-h-screen w-full flex-col bg-[#faf9f6]">
            {/* Navbar */}
            <Navbar onMenuClick={() => setSidebarOpen(true)} />

            {/* Sidebar (Mobile) */}
            <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

            {/* Main Content */}
            <main className="flex-1 pb-28 md:pb-0">
                {children}
            </main>

            {/* Bottom Navigation (Mobile) */}
            <BottomNav />
        </div>
    );
}
