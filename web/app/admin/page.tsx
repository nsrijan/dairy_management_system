'use client';

import { AdminDashboard } from '@/features/domains/admin/components';
import { useAuth } from '@/app/providers';

export default function AdminPage() {
    const { user } = useAuth();
    return <AdminDashboard user={user} />;
} 