'use client';

import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export interface UserData {
    name?: string;
    avatar?: string;
}

export interface ThemeOption {
    value: string;
    label: string;
    bgClass: string;
}

export interface AppHeaderProps {
    user: UserData;
    onToggleSidebar?: () => void;
    onToggleTheme?: () => void;
    onChangeAccentColor?: (color: string) => void;
    onLogout?: () => void;
    theme?: 'light' | 'dark';
    accentColor?: string;
    themeOptions?: ThemeOption[];
    showSearch?: boolean;
}

export function AppHeader({
    user,
    onToggleSidebar,
    onToggleTheme,
    onChangeAccentColor,
    onLogout,
    theme = 'light',
    accentColor = 'teal',
    themeOptions = [],
    showSearch = true,
}: AppHeaderProps) {
    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 lg:px-6">
            {onToggleSidebar && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleSidebar}
                    className="lg:hidden dark:text-gray-300"
                >
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
                    >
                        <line x1="4" x2="20" y1="12" y2="12" />
                        <line x1="4" x2="20" y1="6" y2="6" />
                        <line x1="4" x2="20" y1="18" y2="18" />
                    </svg>
                </Button>
            )}

            {/* Search */}
            {showSearch && (
                <div className="ml-4 hidden md:flex relative flex-1 max-w-md">
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
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        style={{ width: '18px', height: '18px' }}
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <Input
                        placeholder="Search..."
                        className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 dark:text-gray-200"
                    />
                </div>
            )}

            <div className="ml-auto flex items-center gap-4">
                {/* Theme Toggle */}
                {onToggleTheme && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleTheme}
                        className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {theme === 'dark' ? (
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
                                style={{ width: '20px', height: '20px' }}
                            >
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2" />
                                <path d="M12 20v2" />
                                <path d="m4.93 4.93 1.41 1.41" />
                                <path d="m17.66 17.66 1.41 1.41" />
                                <path d="M2 12h2" />
                                <path d="M20 12h2" />
                                <path d="m6.34 17.66-1.41 1.41" />
                                <path d="m19.07 4.93-1.41 1.41" />
                            </svg>
                        ) : (
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
                                style={{ width: '20px', height: '20px' }}
                            >
                                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                            </svg>
                        )}
                    </Button>
                )}

                {/* Notifications */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative dark:text-gray-300">
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
                                style={{ width: '20px', height: '20px' }}
                            >
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-gray-800 dark:border-gray-700">
                        <DropdownMenuLabel className="dark:text-gray-200">Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator className="dark:bg-gray-700" />
                        <div className="max-h-96 overflow-y-auto">
                            <DropdownMenuItem className="cursor-pointer p-4 dark:text-gray-200 dark:focus:bg-gray-700">
                                <div>
                                    <p className="font-medium">Low Stock Alert</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Milk powder is running low</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">10 minutes ago</p>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer p-4 dark:text-gray-200 dark:focus:bg-gray-700">
                                <div>
                                    <p className="font-medium">New Collection Entry</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Farmer #123 added 50L</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">1 hour ago</p>
                                </div>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 dark:text-gray-300">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar || "/avatar.png"} alt={user?.name || 'User'} />
                                <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline-block font-medium text-sm">{user?.name || 'User'}</span>
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
                                className="text-gray-500 dark:text-gray-400"
                                style={{ width: '16px', height: '16px' }}
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 dark:border-gray-700">
                        <DropdownMenuLabel className="dark:text-gray-200">My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator className="dark:bg-gray-700" />
                        <DropdownMenuItem className="cursor-pointer dark:text-gray-200 dark:focus:bg-gray-700">
                            <Link href="/dashboard/profile" className="flex w-full">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer dark:text-gray-200 dark:focus:bg-gray-700">
                            <Link href="/dashboard/settings" className="flex w-full">Settings</Link>
                        </DropdownMenuItem>

                        {onChangeAccentColor && themeOptions.length > 0 && (
                            <>
                                <DropdownMenuSeparator className="dark:bg-gray-700" />
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="cursor-pointer dark:text-gray-200 dark:focus:bg-gray-700">
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
                                            className="mr-2"
                                            style={{ width: '16px', height: '16px' }}
                                        >
                                            <circle cx="19.5" cy="12.5" r="2.5" />
                                            <circle cx="12.5" cy="19.5" r="2.5" />
                                            <circle cx="4.5" cy="12.5" r="2.5" />
                                            <circle cx="12.5" cy="4.5" r="2.5" />
                                        </svg>
                                        <span>Theme</span>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="bg-white dark:bg-gray-800 dark:border-gray-700">
                                        <DropdownMenuRadioGroup value={accentColor} onValueChange={onChangeAccentColor}>
                                            {themeOptions.map((color) => (
                                                <DropdownMenuRadioItem
                                                    key={color.value}
                                                    value={color.value}
                                                    className="cursor-pointer flex items-center dark:text-gray-200 dark:focus:bg-gray-700"
                                                >
                                                    <div className={`mr-2 h-4 w-4 rounded-full ${color.bgClass}`} />
                                                    {color.label}
                                                </DropdownMenuRadioItem>
                                            ))}
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuSubContent>
                                </DropdownMenuSub>
                            </>
                        )}

                        {onLogout && (
                            <>
                                <DropdownMenuSeparator className="dark:bg-gray-700" />
                                <DropdownMenuItem
                                    className="cursor-pointer text-red-600 dark:text-red-400 dark:focus:bg-gray-700"
                                    onClick={onLogout}
                                >
                                    Log out
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
