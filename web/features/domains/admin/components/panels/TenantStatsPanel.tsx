'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TenantStatsPanelProps {
    stats: {
        totalTenants: number;
        activeTenants: number;
        tenantsByModule: {
            DAIRY: number;
            POTTERY: number;
            GARMENTS: number;
        };
    };
}

export function TenantStatsPanel({ stats }: TenantStatsPanelProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tenant Distribution</CardTitle>
                <CardDescription>Active tenants by module type</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Module distribution */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.tenantsByModule.DAIRY}</div>
                            <div className="text-xs text-blue-800 dark:text-blue-300">Dairy</div>
                        </div>
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.tenantsByModule.POTTERY}</div>
                            <div className="text-xs text-amber-800 dark:text-amber-300">Pottery</div>
                        </div>
                        <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.tenantsByModule.GARMENTS}</div>
                            <div className="text-xs text-purple-800 dark:text-purple-300">Garments</div>
                        </div>
                    </div>

                    {/* Recent tenants */}
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Tenants</h4>
                        <div className="space-y-2">
                            {[
                                { name: "Green Valley Farms", module: "DAIRY", date: "May 18, 2023" },
                                { name: "Artistic Creations", module: "POTTERY", date: "May 15, 2023" },
                                { name: "FashionWorks", module: "GARMENTS", date: "May 10, 2023" },
                            ].map((tenant, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                    <div>
                                        <div className="font-medium text-gray-800 dark:text-gray-200">{tenant.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">Added on {tenant.date}</div>
                                    </div>
                                    <Badge
                                        className={`
                        ${tenant.module === 'DAIRY'
                                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                : tenant.module === 'POTTERY'
                                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                            }
                        border-0 rounded-full
                      `}
                                    >
                                        {tenant.module.charAt(0) + tenant.module.slice(1).toLowerCase()}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 