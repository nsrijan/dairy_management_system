'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { getAllTenants, deleteTenant, changeTenantStatus } from '../tenantService';
import { Tenant, ModuleType } from '../types';
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
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

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
    const [searchQuery, setSearchQuery] = useState('');

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

    const getModuleBadgeColor = (moduleType: string) => {
        switch (moduleType) {
            case ModuleType.DAIRY:
                return 'bg-blue-100 text-blue-800 border-0';
            case ModuleType.POTTERY:
                return 'bg-amber-100 text-amber-800 border-0';
            case ModuleType.GARMENTS:
                return 'bg-purple-100 text-purple-800 border-0';
            default:
                return 'bg-gray-100 text-gray-800 border-0';
        }
    };

    const filteredTenants = tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.moduleType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && tenants.length === 0) {
        return <div className="flex justify-center p-8">Loading tenants...</div>;
    }

    return (
        <Card className="bg-white border rounded-md shadow-none overflow-hidden">
            <CardHeader className="pb-3 flex flex-row items-center justify-between border-b pt-4 px-6">
                <CardTitle className="text-lg font-semibold">Tenant Organizations</CardTitle>
                <Button onClick={() => router.push('/admin/tenants/new')} size="sm" className="h-9 text-sm bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Add Tenant
                </Button>
            </CardHeader>
            <CardContent className="p-6">
                {error && (
                    <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
                        {error}
                    </div>
                )}

                <div className="flex items-center mb-4 relative">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        className="pl-9 h-9 border rounded-md"
                        placeholder="Search tenants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="border rounded-md overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50 border-b">
                            <TableRow>
                                <TableHead className="py-3 px-4 text-xs uppercase font-semibold text-gray-600">Name</TableHead>
                                <TableHead className="py-3 px-4 text-xs uppercase font-semibold text-gray-600">Subdomain</TableHead>
                                <TableHead className="py-3 px-4 text-xs uppercase font-semibold text-gray-600">Module</TableHead>
                                <TableHead className="py-3 px-4 text-xs uppercase font-semibold text-gray-600">Status</TableHead>
                                <TableHead className="py-3 px-4 text-xs uppercase font-semibold text-gray-600">Created</TableHead>
                                <TableHead className="py-3 px-4 text-xs uppercase font-semibold text-gray-600 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTenants.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        {searchQuery ? 'No tenants match your search' : 'No tenants found'}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredTenants.map((tenant) => (
                                    <TableRow key={tenant.id} className="hover:bg-gray-50 border-b">
                                        <TableCell className="font-medium py-3 px-4">{tenant.name}</TableCell>
                                        <TableCell className="py-3 px-4">{tenant.subdomain}</TableCell>
                                        <TableCell className="py-3 px-4">
                                            <Badge className={`font-normal py-1 px-2 rounded ${getModuleBadgeColor(tenant.moduleType)}`}>
                                                {tenant.moduleType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={tenant.active}
                                                    onCheckedChange={(checked) => handleStatusChange(tenant.id, checked)}
                                                    disabled={actionInProgress}
                                                    className="data-[state=checked]:bg-green-500"
                                                />
                                                <span className={tenant.active ? 'text-green-600 text-sm' : 'text-gray-400 text-sm'}>
                                                    {tenant.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm py-3 px-4">
                                            {tenant.createdAt ? new Date(tenant.createdAt).toLocaleDateString() : 'N/A'}
                                        </TableCell>
                                        <TableCell className="text-right py-3 px-4">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(tenant.id)}
                                                    disabled={actionInProgress}
                                                    className="h-8 w-8 rounded-full hover:bg-gray-100"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteClick(tenant.id)}
                                                    disabled={actionInProgress}
                                                    className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                    <div className="flex justify-end items-center gap-2 mt-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0 || actionInProgress}
                            className="h-8 border rounded"
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground px-2">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1 || actionInProgress}
                            className="h-8 border rounded"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </CardContent>

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
        </Card>
    );
} 