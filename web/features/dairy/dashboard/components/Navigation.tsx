'use client';

import React from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface NavigationProps {
    user: User;
}

export function Navigation({ user }: NavigationProps) {
    // Get the primary role for navigation logic
    const primaryRole = user.role?.replace('ROLE_', '') || '';

    const getNavigationItems = () => {
        const commonItems = [
            { name: 'Dashboard', href: '/dairy/dashboard', current: true },
        ];

        switch (primaryRole) {
            case 'TENANT_ADMIN':
            case 'DAIRY_ADMIN':
                return [
                    ...commonItems,
                    { name: 'User Management', href: '/dairy/users', current: false },
                    { name: 'System Settings', href: '/dairy/settings', current: false },
                    { name: 'Reports', href: '/dairy/reports', current: false },
                    { name: 'Analytics', href: '/dairy/analytics', current: false },
                ];

            case 'DAIRY_FARMER':
                return [
                    ...commonItems,
                    { name: 'Livestock', href: '/dairy/livestock', current: false },
                    { name: 'Milk Production', href: '/dairy/production', current: false },
                    { name: 'Feed Management', href: '/dairy/feed', current: false },
                    { name: 'Health Records', href: '/dairy/health', current: false },
                ];

            case 'DAIRY_PRODUCTION_MANAGER':
                return [
                    ...commonItems,
                    { name: 'Production Metrics', href: '/dairy/production-metrics', current: false },
                    { name: 'Quality Control', href: '/dairy/quality', current: false },
                    { name: 'Inventory', href: '/dairy/inventory', current: false },
                    { name: 'Processing', href: '/dairy/processing', current: false },
                ];

            case 'DAIRY_DELIVERY_STAFF':
                return [
                    ...commonItems,
                    { name: 'Delivery Routes', href: '/dairy/routes', current: false },
                    { name: 'Delivery Status', href: '/dairy/deliveries', current: false },
                    { name: 'Customer Info', href: '/dairy/customers', current: false },
                    { name: 'Vehicle Management', href: '/dairy/vehicles', current: false },
                ];

            default:
                return commonItems;
        }
    };

    const navigationItems = getNavigationItems();

    return (
        <nav className="bg-gray-100 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex space-x-8">
                    {navigationItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${item.current
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {item.name}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
} 