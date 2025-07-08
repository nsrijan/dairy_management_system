'use client';

import { AdminDashboard } from '@/features/admin/components';
import { useAuth } from '@/app/providers';

export default function AdminPage() {
    const { user } = useAuth();
    return <AdminDashboard user={user || undefined} />;
} 