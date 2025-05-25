import { useAuth } from '@/app/providers';
import { Domain, DomainRole, isDomainRole } from '@/constants/domains';
import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface DomainProtectedRouteProps {
    children: ReactNode;
    domain: Domain;
    requiredRoles?: DomainRole[];
    redirectTo?: string;
}

export function DomainProtectedRoute({
    children,
    domain,
    requiredRoles,
    redirectTo = '/login',
}: DomainProtectedRouteProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push(redirectTo);
            } else if (user && !isDomainRole(user.role, domain)) {
                // If user doesn't belong to this domain, redirect to their appropriate dashboard
                router.push(getDashboardByRole(user.role));
            } else if (user && requiredRoles && !requiredRoles.includes(user.role as DomainRole)) {
                // If user belongs to domain but doesn't have required role
                router.push(getDashboardByRole(user.role));
            }
        }
    }, [isLoading, isAuthenticated, user, domain, requiredRoles, router, redirectTo]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb] dark:border-blue-400"></div>
            </div>
        );
    }

    if (!isAuthenticated ||
        (user && !isDomainRole(user.role, domain)) ||
        (user && requiredRoles && !requiredRoles.includes(user.role as DomainRole))) {
        return null;
    }

    return <>{children}</>;
}

// Helper function to determine dashboard based on role
function getDashboardByRole(role: string): string {
    if (role.includes('DAIRY_')) return '/dairy/dashboard';
    if (role.includes('POULTRY_')) return '/poultry/dashboard';
    if (role.includes('SYSTEM_')) return '/admin';
    return '/dashboard';
} 