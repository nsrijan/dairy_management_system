import { useAuth } from '@/app/providers';
import { Role, hasAnyRole, hasPermissionLevel } from '@/constants/roles';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: Role[];
    requiredPermissionLevel?: Role;
    redirectTo?: string;
}

export function ProtectedRoute({
    children,
    requiredRoles,
    requiredPermissionLevel,
    redirectTo = '/login',
}: ProtectedRouteProps) {
    const router = useRouter();
    const { isAuthenticated, user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push(redirectTo);
            } else if (user && requiredRoles && !hasAnyRole(user.role, requiredRoles)) {
                router.push('/dashboard');
            } else if (user && requiredPermissionLevel && !hasPermissionLevel(user.role, requiredPermissionLevel)) {
                router.push('/dashboard');
            }
        }
    }, [isLoading, isAuthenticated, user, requiredRoles, requiredPermissionLevel, router, redirectTo]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2563eb] dark:border-blue-400"></div>
            </div>
        );
    }

    if (!isAuthenticated ||
        (requiredRoles && !hasAnyRole(user?.role, requiredRoles)) ||
        (requiredPermissionLevel && !hasPermissionLevel(user?.role, requiredPermissionLevel))) {
        return null;
    }

    return <>{children}</>;
} 