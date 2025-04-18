'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTheme, useAuth } from '../providers';

// Icons
import {
  LayoutDashboard, Users, Droplet, Package,
  ShoppingCart, BarChart2, Settings, ChevronDown,
  Bell, Search, Menu, X, ShoppingBag, Truck,
  Map, PieChart as PieChartIcon, ArrowDown, ArrowUp, Activity,
  Moon, Sun, Palette
} from 'lucide-react';

// UI Components
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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const changeAccentColor = (color: string) => {
    setAccentColor(color as 'teal' | 'blue' | 'purple' | 'rose');
  };

  const handleLogout = async () => {
    // Show some loading state if desired
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect even if there's an error
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb] dark:border-blue-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Map size={20} />, label: 'Milk Collection Branch', href: '/dashboard/mcb' },
    { icon: <Droplet size={20} />, label: 'Milk Collection', href: '/dashboard/collection' },
    { icon: <ShoppingBag size={20} />, label: 'Raw Materials', href: '/dashboard/materials' },
    { icon: <Activity size={20} />, label: 'Production', href: '/dashboard/production' },
    { icon: <Package size={20} />, label: 'Products', href: '/dashboard/products' },
    { icon: <PieChartIcon size={20} />, label: 'Inventory', href: '/dashboard/inventory' },
    { icon: <Truck size={20} />, label: 'Transfers', href: '/dashboard/transfers' },
    { icon: <Map size={20} />, label: 'Branches', href: '/dashboard/branches' },
    { icon: <ShoppingCart size={20} />, label: 'Sales', href: '/dashboard/sales' },
    { icon: <BarChart2 size={20} />, label: 'Reports', href: '/dashboard/reports' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/dashboard/settings' },
  ];

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
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:inset-auto lg:z-auto",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Logo */}
          <div className="h-16 flex items-center px-4 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-md bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center font-bold`}>
                DM
              </div>
              <span className="text-xl font-semibold text-gray-800 dark:text-white">DairyManager</span>
            </div>
            <Button variant="ghost" className="ml-auto lg:hidden" onClick={() => setMobileNavOpen(false)}>
              <X size={20} className="dark:text-gray-300" />
            </Button>
          </div>

          {/* Sidebar Links */}
          <div className="py-4 overflow-y-auto h-[calc(100%-4rem)]">
            <nav className="px-2 space-y-1">
              {sidebarItems.map((item, index) => (
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navbar */}
          <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 lg:px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden dark:text-gray-300"
            >
              <Menu size={20} />
            </Button>

            {/* Search */}
            <div className="ml-4 hidden md:flex relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <Input
                placeholder="Search..."
                className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:bg-white dark:focus:bg-gray-600 dark:text-gray-200"
              />
            </div>

            <div className="ml-auto flex items-center gap-4">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </Button>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative dark:text-gray-300">
                    <Bell size={20} />
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
                      <AvatarImage src="/avatar.png" alt={user?.name || 'User'} />
                      <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block font-medium text-sm">{user?.name || 'User'}</span>
                    <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
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

                  <DropdownMenuSeparator className="dark:bg-gray-700" />

                  {/* Theme Sub Menu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer dark:text-gray-200 dark:focus:bg-gray-700">
                      <Palette className="mr-2 h-4 w-4" />
                      <span>Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="bg-white dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuRadioGroup value={accentColor} onValueChange={changeAccentColor}>
                        {colorOptions.map((color) => (
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

                  <DropdownMenuSeparator className="dark:bg-gray-700" />

                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 dark:text-red-400 dark:focus:bg-gray-700"
                    onClick={handleLogout}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 