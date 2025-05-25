'use client';

import { resolveDashboard } from '../registry';

interface DashboardShellProps {
    domain: string;
    role: string;
    user: any; // Will type properly with user interface
}

export function DashboardShell({ domain, role, user }: DashboardShellProps) {
    // Resolve the appropriate dashboard component based on domain and role
    const DashboardComponent = resolveDashboard(domain, role);

    return (
        <div className="dashboard-container">
            {/* Common header could go here */}
            <DashboardComponent user={user} />
            {/* Common footer could go here */}
        </div>
    );
} 