'use client';

import { TenantAdminResponse } from '../../services/tenantService';
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

interface AdminListProps {
    admins: TenantAdminResponse[];
    onStatusChange: (adminId: string, isActive: boolean) => Promise<void>;
    isLoading: boolean;
}

export default function AdminList({ admins, onStatusChange, isLoading }: AdminListProps) {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-3"></div>
                    <div className="text-gray-500 dark:text-gray-400">Loading administrators...</div>
                </div>
            </div>
        );
    }

    if (admins.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No administrators found
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {admins.map((admin) => (
                    <TableRow key={admin.id}>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id={`status-${admin.id}`}
                                    checked={admin.active}
                                    onCheckedChange={(checked) => onStatusChange(admin.id, checked)}
                                />
                                <Label htmlFor={`status-${admin.id}`}>
                                    {admin.active ? 'Active' : 'Inactive'}
                                </Label>
                            </div>
                        </TableCell>
                        <TableCell>
                            {format(new Date(admin.createdAt), 'MMM d, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                            {format(new Date(admin.updatedAt), 'MMM d, yyyy HH:mm')}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
} 