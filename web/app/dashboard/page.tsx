'use client';

import { useAuth } from '../providers';
import { DashboardLayout, DashboardContent } from '@/features/dashboard/components';
import { AuthenticatedRoute } from '@/components/auth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <AuthenticatedRoute>
      <DashboardLayout>
        <DashboardContent userName={user?.name || ''} />
      </DashboardLayout>
    </AuthenticatedRoute>
  );
} 