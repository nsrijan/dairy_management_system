'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Droplets } from 'lucide-react';
import { ReactNode } from 'react';

export interface SidebarItem {
    icon: ReactNode;
    label: string;
    href: string;
    badge?: string;
}

export interface AppSidebarProps {
    items: SidebarItem[];
    logo?: ReactNode;
    isOpen?: boolean;
    onToggle?: () => void;
    user?: {
        name?: string;
        avatar?: string;
        role?: string;
    };
    className?: string;
}

export function AppSidebar({
    items,
    logo,
    isOpen = true,
    onToggle,
    user,
    className,
}: AppSidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300",
                isOpen ? "w-64" : "w-20",
                className
            )}
        >
            {/* Sidebar Header */}
            <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-teal-600">
                <div className={cn("flex items-center", isOpen ? "justify-between w-full" : "justify-center")}>
                    {isOpen && (
                        <div className="flex items-center">
                            {logo || (
                                <>
                                    <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-blue-600 font-bold text-xl mr-2">
                                        <Droplets className="h-5 w-5" />
                                    </div>
                                    <span className="text-white font-bold text-lg">Dairy Management</span>
                                </>
                            )}
                        </div>
                    )}
                    {!isOpen && (
                        <div className="w-10 h-10 rounded-md bg-white flex items-center justify-center text-blue-600 font-bold text-xl">
                            <Droplets className="h-6 w-6" />
                        </div>
                    )}
                    {onToggle && isOpen && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-blue-700"
                            onClick={onToggle}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Sidebar Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                    {items.map((item, index) => {
                        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                        return (
                            <li key={index}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center py-2 px-3 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60",
                                        !isOpen && "justify-center px-0"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center",
                                        isActive ? "text-blue-600 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"
                                    )}>
                                        {item.icon}
                                    </div>

                                    {isOpen && (
                                        <div className="flex flex-1 items-center justify-between ml-3">
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Sidebar Footer */}
            {user && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    {isOpen ? (
                        <div className="flex items-center">
                            <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
                                <AvatarImage src={user.avatar || "/avatar-placeholder.png"} alt="Avatar" />
                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                    {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.name || 'User'}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-800">
                                <AvatarImage src={user.avatar || "/avatar-placeholder.png"} alt="Avatar" />
                                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                    {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    )}
                </div>
            )}
        </aside>
    );
}
