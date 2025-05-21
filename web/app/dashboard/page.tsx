'use client';

import { useAuth } from '../providers';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Available dashboards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Welcome, {user?.name || 'User'}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Select a dashboard to view:
          </p>
          <div className="space-y-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => router.push('/dashboard/farmer')}
            >
              Dairy Farmer Dashboard
            </Button>
            <Button
              className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              disabled
            >
              Supplier Dashboard (Coming Soon)
            </Button>
            <Button
              className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              disabled
            >
              Pottery Artisan Dashboard (Coming Soon)
            </Button>
          </div>
        </div>

        {/* For admin users, show admin dashboard link */}
        {(user?.role === 'TENANT_MANAGER' || user?.role === 'SUPER_ADMIN') && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Admin Access</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You have administrative privileges:
            </p>
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => router.push('/admin')}
            >
              Go to Admin Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 