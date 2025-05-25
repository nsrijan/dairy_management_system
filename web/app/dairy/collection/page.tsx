'use client';

import { DomainProtectedRoute } from '@/components/auth/DomainProtectedRoute';
import { Domains, DomainRoles } from '@/constants/domains';
import { useAuth } from '@/app/providers';

export default function MilkCollectionPage() {
    const { user } = useAuth();

    return (
        <DomainProtectedRoute
            domain={Domains.DAIRY}
            requiredRoles={[
                DomainRoles[Domains.DAIRY].COLLECTOR,
                DomainRoles[Domains.DAIRY].ADMIN,
                DomainRoles[Domains.DAIRY].MANAGER
            ]}
        >
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Milk Collection Dashboard</h1>
                {/* Add your milk collection dashboard content here */}
                <div className="grid gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Today's Collection</h2>
                        {/* Add collection stats */}
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                        <h2 className="text-lg font-semibold mb-2">Recent Collections</h2>
                        {/* Add collection list */}
                    </div>
                </div>
            </div>
        </DomainProtectedRoute>
    );
} 