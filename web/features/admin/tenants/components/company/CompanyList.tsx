'use client';

import { CompanyWithAdminCount } from '../../services/companyService';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

interface CompanyListProps {
    companies: CompanyWithAdminCount[];
    onStatusChange: (companyId: string, active: boolean) => Promise<void>;
    isLoading: boolean;
}

export function CompanyList({ companies, onStatusChange, isLoading }: CompanyListProps) {
    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                ))}
            </div>
        );
    }

    if (!companies?.length) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No companies found
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Admin Count</TableHead>
                    <TableHead>User Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {companies.map((company) => (
                    <TableRow key={company.companyId}>
                        <TableCell>{company.companyName}</TableCell>
                        <TableCell>{company.adminCount}</TableCell>
                        <TableCell>{company.userCount}</TableCell>
                        <TableCell>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`status-${company.companyId}`}
                                    checked={company.isActive}
                                    onCheckedChange={(checked) => onStatusChange(company.companyId, checked)}
                                />
                                <Label htmlFor={`status-${company.companyId}`}>
                                    {company.isActive ? 'Active' : 'Inactive'}
                                </Label>
                            </div>
                        </TableCell>
                        <TableCell>
                            {format(new Date(company.createdAt), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                            {format(new Date(company.updatedAt), 'MMM d, yyyy')}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}