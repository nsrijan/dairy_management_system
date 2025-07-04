'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/app/providers';
import { AppHeader } from './AppHeader';
import { AppSidebar, SidebarItem } from './AppSidebar';
import { cn } from '@/lib/utils';
import { getSidebarNavItems, getDisplayRole, getTenantName } from '@/features/navigation/getNavItems';

export interface AppLayoutProps {
    children: ReactNode;
    sidebarItems?: SidebarItem[];
    logo?: ReactNode;
    title?: string;
    tenantName?: string;
    showSearch?: boolean;
}

export function AppLayout({
    children,
    sidebarItems,
    logo,
    title,
    tenantName,
    showSearch = true
}: AppLayoutProps) {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [notificationCount] = useState(2); // Mock notification count

    // Adjust sidebar based on screen size
    useEffect(() => {
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

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme as 'light' | 'dark');
        } else {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setTheme(isDark ? 'dark' : 'light');
        }
    }, []);

    // Apply theme changes
    useEffect(() => {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    const handleLogout = async () => {
        if (logout) {
            await logout();
        }
    };

    // Get sidebar items - use provided ones or generate based on role
    const navigationItems = sidebarItems || (user?.role ? getSidebarNavItems(getDisplayRole(user.role) || '') : []);

    return (
        <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${theme === 'dark' ? 'dark' : ''}`}>
            {/* Sidebar */}
            <AppSidebar
                items={navigationItems}
                logo={logo}
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                user={{
                    name: user?.name,
                    role: getDisplayRole(user?.role),
                }}
            />

            {/* Main Content */}
            <main className={cn(
                "flex-1 transition-all duration-300",
                sidebarOpen ? "ml-64" : "ml-20"
            )}>
                {/* Header */}
                <AppHeader
                    user={{
                        name: user?.name,
                        role: getDisplayRole(user?.role),
                    }}
                    onToggleSidebar={toggleSidebar}
                    onToggleTheme={toggleTheme}
                    onLogout={handleLogout}
                    theme={theme}
                    title={title}
                    tenantName={tenantName}
                    showSearch={showSearch}
                    notificationCount={notificationCount}
                />

                {/* Page Content */}
                <div className="bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)]">
                    {children}
                </div>
            </main>
        </div>
    );
} 