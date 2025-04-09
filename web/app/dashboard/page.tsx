'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useTheme } from '../providers';

// Icons
import { 
  LayoutDashboard, Users, Droplet, Package, 
  ShoppingCart, BarChart2, Settings, ChevronDown, 
  Bell, Search, Menu, X, ShoppingBag, Truck, 
  Map, PieChart as PieChartIcon, ArrowDown, ArrowUp, Activity, 
  Moon, Sun, Palette, MoreHorizontal, Download, FileText
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

// Chart Components
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, PieChart, Pie, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
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
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const changeAccentColor = (color: string) => {
    setAccentColor(color as 'teal' | 'blue' | 'purple' | 'rose');
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb] dark:border-blue-400"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Users size={20} />, label: 'Farmers', href: '/dashboard/farmers' },
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
                    item.href === '/dashboard' 
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
                      <AvatarImage src="/avatar.png" alt={session.user.name} />
                      <AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block font-medium text-sm">{session.user.name}</span>
                    <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 dark:border-gray-700">
                  <DropdownMenuLabel className="dark:text-gray-200">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  
                  {/* Color Scheme Selector */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="dark:text-gray-200 dark:focus:bg-gray-700">
                      <Palette className="mr-2 h-4 w-4" />
                      <span>Color Theme</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48 bg-white dark:bg-gray-800 dark:border-gray-700">
                      <DropdownMenuRadioGroup value={accentColor} onValueChange={changeAccentColor}>
                        {colorOptions.map((color) => (
                          <DropdownMenuRadioItem 
                            key={color.value} 
                            value={color.value}
                            className="dark:text-gray-200 dark:focus:bg-gray-700"
                          >
                            <div className="flex items-center gap-2">
                              <div className={`h-4 w-4 rounded-full ${color.bgClass}`} />
                              {color.label}
                            </div>
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                  
                  <DropdownMenuItem className="dark:text-gray-200 dark:focus:bg-gray-700">
                    <Link href="/dashboard/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="dark:text-gray-200 dark:focus:bg-gray-700">
                    <Link href="/dashboard/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-700" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400 dark:focus:bg-gray-700">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Dashboard Content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-[#f8fafc] dark:bg-gray-900">
            <div className="mx-auto max-w-screen-2xl space-y-6">
              {/* Page Title */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {session.user.name}</p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Today's Milk Collection */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Collection</CardTitle>
                    <Droplet className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">1,250 L</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">from 45 farmers</p>
                      </div>
                      <div className="flex items-center text-teal-600 dark:text-teal-400 text-xs font-medium">
                        <ArrowUp size={14} />
                        <span>12%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Production Summary */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Production</CardTitle>
                    <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">28 Batches</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 products</p>
                      </div>
                      <div className="flex items-center text-blue-600 dark:text-blue-400 text-xs font-medium">
                        <ArrowUp size={14} />
                        <span>8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sales Summary */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Today's Sales</CardTitle>
                    <ShoppingCart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">$4,850</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">120 orders</p>
                      </div>
                      <div className="flex items-center text-purple-600 dark:text-purple-400 text-xs font-medium">
                        <ArrowUp size={14} />
                        <span>15%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Low Stock Alerts */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/30 dark:to-rose-800/30">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Low Stock Alerts</CardTitle>
                    <Package className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">3 Items</div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Needs attention</p>
                      </div>
                      <Badge variant="destructive" className="text-xs h-5">Urgent</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts and Tables */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Daily Milk Collection Chart */}
                <Card className="col-span-1 lg:col-span-2 border-none shadow-sm">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-gray-800 dark:text-white">Daily Milk Collection</CardTitle>
                      <Select
                        className="text-xs"
                        defaultValue="week"
                        options={[
                          { value: 'week', label: 'Last 7 Days' },
                          { value: 'month', label: 'Last 30 Days' },
                        ]}
                      />
                    </div>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Milk collected in liters over the last 7 days
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[300px] w-full bg-teal-50 dark:bg-teal-900/20 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {/* Placeholder for actual chart */}
                      Daily Collection Chart
                    </div>
                  </CardContent>
                </Card>

                {/* Top Selling Products */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-800 dark:text-white">Top Selling Products</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Best performing products this week
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-4">
                      {[
                        { name: 'Full Cream Milk', sales: '540 units', revenue: '$1,240', trend: 'up' },
                        { name: 'Greek Yogurt', sales: '320 units', revenue: '$960', trend: 'up' },
                        { name: 'Cottage Cheese', sales: '220 units', revenue: '$660', trend: 'down' },
                        { name: 'Butter', sales: '185 units', revenue: '$555', trend: 'up' },
                      ].map((product, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div>
                            <p className="font-medium text-gray-800 dark:text-white">{product.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>{product.sales}</span>
                              <span>•</span>
                              <span>{product.revenue}</span>
                            </div>
                          </div>
                          <div>
                            {product.trend === 'up' ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900 dark:text-green-400">
                                <ArrowUp size={12} className="mr-1" />
                                Up
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:text-red-400">
                                <ArrowDown size={12} className="mr-1" />
                                Down
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Reports */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Transfers */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-800 dark:text-white">Today's Transfers</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Movement between branches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-3">
                      {[
                        { from: 'Central Warehouse', to: 'Branch #5', items: '250L Milk, 100kg Cheese', status: 'In Transit' },
                        { from: 'Branch #3', to: 'Branch #2', items: '50kg Yogurt, 25kg Butter', status: 'Delivered' },
                      ].map((transfer, i) => (
                        <div key={i} className="rounded-md border border-gray-100 dark:border-gray-700 p-3">
                          <div className="flex justify-between">
                            <p className="text-sm font-medium text-gray-800 dark:text-white">{transfer.from} → {transfer.to}</p>
                            <Badge 
                              className={
                                transfer.status === 'Delivered' 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900 dark:text-green-400'
                                  : 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-400'
                              }
                            >
                              {transfer.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{transfer.items}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Raw Material Usage */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-800 dark:text-white">Raw Material Usage</CardTitle>
                    <CardDescription className="text-gray-500 dark:text-gray-400">
                      Weekly consumption rates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="h-[180px] w-full bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                      {/* Placeholder for actual chart */}
                      Raw Material Usage Chart
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Links & Calendar */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="p-4">
                    <CardTitle className="text-gray-800 dark:text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Add Collection', icon: <Droplet size={16} />, color: 'bg-blue-100 text-blue-700' },
                        { label: 'New Production', icon: <Activity size={16} />, color: 'bg-green-100 text-green-700' },
                        { label: 'Record Sale', icon: <ShoppingCart size={16} />, color: 'bg-purple-100 text-purple-700' },
                        { label: 'Add Transfer', icon: <Truck size={16} />, color: 'bg-amber-100 text-amber-700' },
                      ].map((action, i) => (
                        <Button 
                          key={i}
                          variant="outline"
                          className={`justify-start gap-2 ${action.color} border-none`}
                        >
                          {action.icon}
                          <span>{action.label}</span>
                        </Button>
                      ))}
                    </div>
                    {/* Mini Calendar Placeholder */}
                    <div className="mt-4 border border-gray-200 rounded-md p-3">
                      <p className="text-sm font-medium mb-2">Today's Schedule</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <span>09:00 AM - Farmer Meeting</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          <span>02:30 PM - Quality Inspection</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                {/* Weekly Collection Trend */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Weekly Collection Trend</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> View Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[240px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={[
                            { day: 'Mon', value: 900 },
                            { day: 'Tue', value: 1200 },
                            { day: 'Wed', value: 1100 },
                            { day: 'Thu', value: 1300 },
                            { day: 'Fri', value: 1150 },
                            { day: 'Sat', value: 1000 },
                            { day: 'Sun', value: 800 },
                          ]}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="day" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            tickFormatter={(value: number) => `${value}L`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: 'none',
                              borderRadius: '0.375rem',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                            itemStyle={{ color: '#f3f4f6' }}
                            formatter={(value: number) => [`${value}L`, 'Collection']}
                            labelFormatter={(label: string) => `${label}`}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="hsl(173, 80%, 40%)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)" 
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Product Distribution */}
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Product Distribution</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> View Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[240px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Milk', value: 40, fill: "hsl(173, 80%, 40%)" },
                              { name: 'Yogurt', value: 25, fill: "hsl(172, 66%, 50%)" },
                              { name: 'Cheese', value: 15, fill: "hsl(175, 84%, 32%)" },
                              { name: 'Butter', value: 12, fill: "hsl(171, 77%, 64%)" },
                              { name: 'Other', value: 8, fill: '#64748b' },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            dataKey="value"
                            label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: 'none',
                              borderRadius: '0.375rem',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                            itemStyle={{ color: '#f3f4f6' }}
                            formatter={(value: number) => [`${value}%`, 'Percentage']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Monitoring Chart */}
              <div className="mt-4">
                <Card className="bg-white dark:bg-gray-800 overflow-hidden border-none shadow-sm">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">Monthly Revenue</CardTitle>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" /> View Report
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { month: 'Jan', revenue: 12500 },
                            { month: 'Feb', revenue: 14000 },
                            { month: 'Mar', revenue: 15600 },
                            { month: 'Apr', revenue: 13200 },
                            { month: 'May', revenue: 16800 },
                            { month: 'Jun', revenue: 17500 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            tickFormatter={(value: number) => `$${value / 1000}K`}
                          />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: '#1f2937', 
                              border: 'none',
                              borderRadius: '0.375rem',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                            }}
                            itemStyle={{ color: '#f3f4f6' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                            labelFormatter={(label: string) => `${label}`}
                          />
                          <Bar dataKey="revenue" fill="hsl(173, 80%, 40%)" radius={[4, 4, 0, 0]}>
                            {/* Add color gradient to bars based on value */}
                            {
                              [
                                { month: 'Jan', revenue: 12500 },
                                { month: 'Feb', revenue: 14000 },
                                { month: 'Mar', revenue: 15600 },
                                { month: 'Apr', revenue: 13200 },
                                { month: 'May', revenue: 16800 },
                                { month: 'Jun', revenue: 17500 },
                              ].map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.revenue > 15000 ? "hsl(175, 84%, 32%)" : "hsl(173, 80%, 40%)"} 
                                />
                              ))
                            }
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Simple Select Component (placeholder for a real select component)
function Select({ 
  options, 
  defaultValue, 
  className 
}: { 
  options: Array<{value: string, label: string}>, 
  defaultValue: string, 
  className?: string 
}) {
  return (
    <select className={`border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 ${className}`}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
} 