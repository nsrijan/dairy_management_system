'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { CompanyResponse } from '../../../types';

interface CompanyCardProps {
    company: CompanyResponse;
    onEdit: (company: CompanyResponse) => void;
    onDelete: (id: string) => void;
}

export function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
    return (
        <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-lg">
                        <Building2 className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{company.name}</h3>
                        {company.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {company.description}
                            </p>
                        )}
                    </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${company.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }`}>
                    {company.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(company)}
                >
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(company.id)}
                >
                    Delete
                </Button>
            </div>
        </Card>
    );
} 