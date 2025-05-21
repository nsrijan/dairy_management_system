'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { getAllTenants, deleteTenant, changeTenantStatus } from '../tenantService';
import { Tenant } from '../types';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';

export default function TenantsList() {
    const { token } = useAuth();
    const router = useRouter();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tenantToDelete, setTenantToDelete] = useState<string | null>(null);
    const [actionInProgress, setActionInProgress] = useState(false);

    useEffect(() => {
        loadTenants();
    }, [token, currentPage]);

    const loadTenants = async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getAllTenants(token, currentPage);
            setTenants(response.tenants);
            setTotalPages(response.totalPages);
        } catch (err: any) {
            setError(err.message || 'Failed to load tenants');
            console.error('Error loading tenants:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (tenantId: string, newStatus: boolean) => {
        if (!token) return;

        setActionInProgress(true);

        try {
            await changeTenantStatus(token, tenantId, newStatus);

            // Update local state to reflect the change
            setTenants(tenants.map(tenant =>
                tenant.id === tenantId ? { ...tenant, active: newStatus } : tenant
            ));
        } catch (err: any) {
            setError(err.message || 'Failed to update tenant status');
            console.error('Error updating tenant status:', err);
        } finally {
            setActionInProgress(false);
        }
    };

    const handleEdit = (tenantId: string) => {
        router.push(`/admin/tenants/edit/${tenantId}`);
    };

    const handleDeleteClick = (tenantId: string) => {
        setTenantToDelete(tenantId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!token || !tenantToDelete) return;

        setActionInProgress(true);

        try {
            await deleteTenant(token, tenantToDelete);

            // Remove from local state
            setTenants(tenants.filter(tenant => tenant.id !== tenantToDelete));
            setDeleteDialogOpen(false);
            setTenantToDelete(null);
        } catch (err: any) {
            setError(err.message || 'Failed to delete tenant');
            console.error('Error deleting tenant:', err);
        } finally {
            setActionInProgress(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading && tenants.length === 0) {
        return <div className="flex justify-center p-8">Loading tenants...</div>;
    }

    if (error && tenants.length === 0) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                Error: {error}
                <Button
                    variant="outline"
                    className="ml-4"
                    onClick={loadTenants}
                >
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Subdomain</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                            <TableCell className="font-medium">{tenant.name}</TableCell>
                            <TableCell>{tenant.subdomain}</TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        checked={tenant.active}
                                        onCheckedChange={(checked) => handleStatusChange(tenant.id, checked)}
                                        disabled={actionInProgress}
                                    />
                                    <span className={tenant.active ? 'text-green-600' : 'text-gray-400'}>
                                        {tenant.active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell>
                                {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell>
                                <div className="flex space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(tenant.id)}
                                        disabled={actionInProgress}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteClick(tenant.id)}
                                        disabled={actionInProgress}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex justify-end space-x-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0 || actionInProgress}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-3">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1 || actionInProgress}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* Delete confirmation dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tenant
                            and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionInProgress}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={actionInProgress}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {actionInProgress ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 