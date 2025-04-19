'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useTheme, useAuth } from '@/app/providers';
import { AppHeader } from './AppHeader';
import { AppSidebar, SidebarItem } from './AppSidebar';

export interface AppLayoutProps {
    children: ReactNode;
    sidebarItems: SidebarItem[];
    logo?: ReactNode;
}

export function AppLayout({ children, sidebarItems, logo }: AppLayoutProps) {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const { theme, accentColor, setTheme, setAccentColor } = useTheme();

    // Theme colors
    const colorOptions = [
        { value: 'teal', label: 'Teal', bgClass: 'bg-teal-600 dark:bg-teal-500' },
        { value: 'blue', label: 'Blue', bgClass: 'bg-blue-600 dark:bg-blue-500' },
        { value: 'purple', label: 'Purple', bgClass: 'bg-purple-600 dark:bg-purple-500' },
        { value: 'rose', label: 'Rose', bgClass: 'bg-rose-600 dark:bg-rose-500' },
    ];

    useEffect(() => {
        // Adjust sidebar based on screen size
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const changeAccentColor = (color: string) => {
        setAccentColor(color as 'teal' | 'blue' | 'purple' | 'rose');
    };

    const handleLogout = async () => {
        if (logout) {
            await logout();
        }
    };

    return (
        <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
            <div className="flex h-screen bg-[#f8fafc] dark:bg-gray-900 w-full">
                {/* Mobile Sidebar Overlay */}
                {mobileNavOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                        onClick={() => setMobileNavOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <AppSidebar
                    items={sidebarItems}
                    logo={logo}
                    isOpen={mobileNavOpen}
                    isMobile={true}
                    onClose={() => setMobileNavOpen(false)}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Navbar */}
                    <AppHeader
                        user={{ name: user?.name }}
                        onToggleSidebar={() => setMobileNavOpen(true)}
                        onToggleTheme={toggleTheme}
                        onChangeAccentColor={changeAccentColor}
                        onLogout={handleLogout}
                        theme={theme as 'light' | 'dark'}
                        accentColor={accentColor}
                        themeOptions={colorOptions}
                    />

                    {/* Page Content */}
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
} 