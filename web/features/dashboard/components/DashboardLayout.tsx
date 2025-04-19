'use client';

import { ReactNode } from 'react';
import { AppLayout } from '@/components/layout';
import {
    LayoutDashboard, Users, Droplet, Package,
    ShoppingCart, BarChart2, Settings,
    Map, PieChart as PieChartIcon, Activity, ShoppingBag, Truck
} from 'lucide-react';

export interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
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

    const logo = (
        <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center font-bold">
                DM
            </div>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">DairyManager</span>
        </div>
    );

    return (
        <AppLayout sidebarItems={sidebarItems} logo={logo}>
            {children}
        </AppLayout>
    );
} 