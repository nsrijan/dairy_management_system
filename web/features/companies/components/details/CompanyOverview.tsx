'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, MapPin, Calendar, User, CheckCircle, XCircle, Edit, Settings } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Company } from '../../types';

interface CompanyOverviewProps {
    company: Company;
}

export function CompanyOverview({ company }: CompanyOverviewProps) {
    // Calculate days active
    const daysActive = Math.floor(
        (new Date().getTime() - new Date(company.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        {/* Company Logo/Avatar */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <Building2 className="h-8 w-8 text-white" />
                        </div>

                        {/* Company Information */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {company.name}
                                </h1>
                                {company.isActive ? (
                                    <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 flex items-center gap-1">
                                        <CheckCircle className="h-3 w-3" />
                                        Active
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 flex items-center gap-1">
                                        <XCircle className="h-3 w-3" />
                                        Inactive
                                    </Badge>
                                )}
                            </div>

                            {company.description && (
                                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                                    {company.description}
                                </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatDistanceToNow(new Date(company.createdAt), { addSuffix: true })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-blue-500" />
                                    <span className="text-gray-600 dark:text-gray-400">Owner:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {company.createdBy || 'System Admin'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-blue-500" />
                                    <span className="text-gray-600 dark:text-gray-400">Industry:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        Dairy & Food Processing
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Company
                        </Button>
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                    </div>
                </div>

                {/* Additional Info Row */}
                <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-800">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Company ID</p>
                            <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded border">
                                {company.id}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Tenant ID</p>
                            <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded border">
                                {company.tenantId}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Days Active</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {daysActive} days
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 mb-1">Last Updated</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                                {formatDistanceToNow(new Date(company.updatedAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 