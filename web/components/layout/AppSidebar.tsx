'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

export interface SidebarItem {
    icon: ReactNode;
    label: string;
    href: string;
}

export interface AppSidebarProps {
    items: SidebarItem[];
    logo?: ReactNode;
    isOpen?: boolean;
    isMobile?: boolean;
    onClose?: () => void;
}

export function AppSidebar({
    items,
    logo,
    isOpen = true,
    isMobile = false,
    onClose,
}: AppSidebarProps) {
    const pathname = usePathname();

    return (
        <div
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
                isOpen || !isMobile ? "translate-x-0" : "-translate-x-full"
            )}
        >
            {/* Logo Section */}
            <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-700">
                {logo || (
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center font-bold">
                            DM
                        </div>
                        <span className="text-xl font-semibold text-gray-800 dark:text-white">DairyManager</span>
                    </div>
                )}

                {isMobile && (
                    <Button variant="ghost" className="ml-auto lg:hidden" onClick={onClose}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="dark:text-gray-300"
                        >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </Button>
                )}
            </div>

            {/* Sidebar Links */}
            <div className="py-4 overflow-y-auto h-[calc(100%-4rem)]">
                <nav className="px-2 space-y-1">
                    {items.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400"
                                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/50"
                            )}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
