'use client';

import React, { ReactNode } from 'react';
import { Navigation } from './Navigation';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface DashboardLayoutProps {
    children: ReactNode;
    user: User;
    tenant?: string | null;
}

export function DashboardLayout({ children, user, tenant }: DashboardLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Dairy Management System
                            </h1>
                            {tenant && (
                                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    {tenant}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                                <p className="text-xs text-gray-400">
                                    {user.role.replace('ROLE_', '')}
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    // Handle logout
                                    document.cookie = 'auth_token=; path=/; max-age=0; samesite=strict';
                                    window.location.href = '/login';
                                }}
                                className="px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <Navigation user={user} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
} 