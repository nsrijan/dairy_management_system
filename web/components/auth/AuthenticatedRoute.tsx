'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/providers';
import { useEffect, ReactNode } from 'react';

export interface AuthenticatedRouteProps {
    children: ReactNode;
    redirectTo?: string;
}

export function AuthenticatedRoute({
    children,
    redirectTo = '/login',
}: AuthenticatedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push(redirectTo);
        }
    }, [isLoading, isAuthenticated, router, redirectTo]);

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

    return <>{children}</>;
} 