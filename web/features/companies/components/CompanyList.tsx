'use client';

import { Building2, Edit, Trash2, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { type Company } from '../types';

interface CompanyListProps {
    companies: Company[];
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
}

export function CompanyList({ companies, onEdit, onDelete }: CompanyListProps) {
    if (companies.length === 0) {
        return (
            <div className="text-center py-12">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No companies found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Get started by creating your first company.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {companies.map((company) => (
                <Card key={company.id} className="p-4 hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center shadow-lg">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                        {company.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={company.isActive}
                                            className="data-[state=checked]:bg-green-500"
                                            disabled
                                        />
                                        <span className={`text-sm font-medium ${company.isActive
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {company.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>

                                {company.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                        {company.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span>Created {formatDistanceToNow(new Date(company.createdAt), { addSuffix: true })}</span>
                                    </div>
                                    {company.isActive && (
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="h-3 w-3 text-green-500" />
                                            <span className="text-green-600 dark:text-green-400">Online</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                className="h-9 px-3 text-gray-600 border-gray-300 hover:bg-green-50 hover:text-green-600 hover:border-green-300 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-all duration-200"
                            >
                                <Link href={`/companies/${company.id}`}>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View Details
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(company)}
                                className="h-9 px-3 text-gray-600 border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-all duration-200"
                            >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(company)}
                                className="h-9 px-3 text-gray-600 border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all duration-200"
                            >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
} 