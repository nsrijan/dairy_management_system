'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Search, Bell, Sun, Moon, User, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export interface UserData {
    name?: string;
    avatar?: string;
    role?: string;
}

export interface AppHeaderProps {
    user?: UserData;
    onToggleSidebar?: () => void;
    onToggleTheme?: () => void;
    onLogout?: () => void;
    theme?: 'light' | 'dark';
    title?: string;
    tenantName?: string;
    showSearch?: boolean;
    notificationCount?: number;
    className?: string;
}

export function AppHeader({
    user,
    onToggleSidebar,
    onToggleTheme,
    onLogout,
    theme = 'light',
    title,
    tenantName,
    showSearch = true,
    notificationCount = 0,
    className,
}: AppHeaderProps) {
    return (
        <header className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-10 ${className}`}>
            <div className="flex items-center">
                {/* Mobile Sidebar Toggle */}
                {onToggleSidebar && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden mr-2 dark:text-gray-300"
                        onClick={onToggleSidebar}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                )}

                {/* Title and Tenant */}
                <div className="flex items-center space-x-2">
                    {title && (
                        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {title}
                        </h1>
                    )}
                    {tenantName && (
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                            {tenantName}
                        </Badge>
                    )}
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {/* Search */}
                {showSearch && (
                    <div className="relative hidden md:block">
                        <Search className="h-4 w-4 absolute top-3 left-3 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2 h-10 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                )}

                {/* Theme Toggle */}
                {onToggleTheme && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleTheme}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                )}

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                            <Bell className="h-5 w-5" />
                            {notificationCount > 0 && (
                                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold">
                                    {notificationCount}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                        <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-200">
                            Notifications
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />
                        <div className="max-h-80 overflow-y-auto space-y-1">
                            <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <p className="font-medium text-sm text-gray-900 dark:text-white">Low Stock Alert</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Milk bottles - 15 units left</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</p>
                            </div>
                            <div className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <p className="font-medium text-sm text-gray-900 dark:text-white">Production Update</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Batch #2024-001 completed</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                            </div>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                {user && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 px-2 transition-colors">
                                <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                                    <AvatarImage src={user.avatar || "/avatar-placeholder.png"} alt="Avatar" />
                                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                                        {user.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="ml-2 hidden md:block">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.name || 'User'}</p>
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg">
                            <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-200">
                                My Account
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />
                            <DropdownMenuItem className="rounded-md px-2 py-1.5 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <User className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                <Link href="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-md px-2 py-1.5 cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <Settings className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
                                <Link href="/settings">Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-1 bg-gray-200 dark:bg-gray-700" />
                            {onLogout && (
                                <DropdownMenuItem
                                    className="rounded-md px-2 py-1.5 cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    onClick={onLogout}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Log out
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </header>
    );
}
