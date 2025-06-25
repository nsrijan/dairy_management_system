'use client';

import { Building2, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { type Company } from '../hooks/useCompanies';

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
        <div className="grid gap-4">
            {companies.map((company) => (
                <Card key={company.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                                        {company.name}
                                    </h3>
                                    <Badge
                                        variant={company.isActive ? "default" : "secondary"}
                                        className={`flex items-center gap-1 ${company.isActive
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                            }`}
                                    >
                                        {company.isActive ? (
                                            <CheckCircle className="h-3 w-3" />
                                        ) : (
                                            <XCircle className="h-3 w-3" />
                                        )}
                                        {company.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>

                                {company.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {company.description}
                                    </p>
                                )}

                                <div className="text-xs text-gray-500 dark:text-gray-500">
                                    Created {formatDistanceToNow(new Date(company.createdAt), { addSuffix: true })}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(company)}
                                className="h-8 w-8 p-0"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(company)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
} 