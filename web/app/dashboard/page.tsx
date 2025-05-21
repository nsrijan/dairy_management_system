'use client';

import { useAuth } from '../providers';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is a tenant manager, redirect to admin section
    if (!isLoading && isAuthenticated && user &&
      (user.role === 'TENANT_MANAGER' || user.role === 'SUPER_ADMIN')) {
      router.push('/admin');
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Dashboard cards would go here */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-2">Welcome, {user?.name || 'User'}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is your dashboard. You'll see personalized content here based on your role.
          </p>
        </div>
      </div>
    </div>
  );
} 