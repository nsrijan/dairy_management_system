'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/providers';
import { getAllTenants, deleteTenant, changeTenantStatus } from '../tenantService';
import { Tenant, ModuleType } from '../types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, Search, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Tenant card component
interface TenantCardProps {
    tenant: Tenant;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

function TenantCard({ tenant, onEdit, onDelete }: TenantCardProps) {
    const getLogoColor = (moduleType: string) => {
        switch (moduleType) {
            case ModuleType.DAIRY:
                return 'bg-gradient-to-br from-blue-400 to-blue-600';
            case ModuleType.POTTERY:
                return 'bg-gradient-to-br from-amber-400 to-amber-600';
            case ModuleType.GARMENTS:
                return 'bg-gradient-to-br from-purple-400 to-purple-600';
            default:
                return 'bg-gradient-to-br from-gray-400 to-gray-600';
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <Card className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200 dark:bg-gray-800">
            <CardContent className="p-0">
                <div className="flex items-start p-5">
                    <div className={`w-16 h-16 rounded-md flex items-center justify-center mr-4 text-white text-xl font-bold ${getLogoColor(tenant.moduleType)}`}>
                        {tenant.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{tenant.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>{tenant.subdomain}.dms.com</span>
                            <button className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" title="Copy domain">
                                <Copy className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 px-5 py-3">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
                            <div className="text-sm font-medium dark:text-gray-300">{formatDate(tenant.createdAt)}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Currency</div>
                            <div className="text-sm font-medium dark:text-gray-300">
                                {tenant.moduleType === ModuleType.DAIRY ? 'INR' :
                                    tenant.moduleType === ModuleType.POTTERY ? 'USD' : 'NPR'}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Timezone</div>
                            <div className="text-sm font-medium dark:text-gray-300">
                                {tenant.moduleType === ModuleType.DAIRY ? 'Asia/Kolkata' :
                                    tenant.moduleType === ModuleType.POTTERY ? 'America/New_York' : 'Asia/Kathmandu'}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                            <div className={`text-sm font-medium ${tenant.active ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {tenant.active ? 'Active' : 'Inactive'}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(tenant.id)}
                        className="text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(tenant.id)}
                        className="text-red-600 dark:text-red-400 border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// Main component
export default function TenantsList() {
    const { token } = useAuth();
    const router = useRouter();
    const [tenants, setTenants] = useState<Tenant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tenantToDelete, setTenantToDelete] = useState<string | null>(null);
    const [actionInProgress, setActionInProgress] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadTenants();
    }, [token]);

    const loadTenants = async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getAllTenants(token);
            setTenants(response.tenants);
        } catch (err: any) {
            setError(err.message || 'Failed to load tenants');
            console.error('Error loading tenants:', err);
        } finally {
            setLoading(false);
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

    const filteredTenants = tenants.filter(tenant =>
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.moduleType.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && tenants.length === 0) {
        return (
            <div className="flex justify-center items-center p-8 h-64">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-3"></div>
                    <div className="text-gray-500 dark:text-gray-400">Loading tenants...</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm border border-red-200 dark:border-red-800 shadow-sm">
                    {error}
                </div>
            )}

            <div className="mb-6">
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        className="pl-9 h-10 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:placeholder:text-gray-500"
                        placeholder="Search tenants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {filteredTenants.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-800/60 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700 shadow-sm">
                    <p className="text-gray-500 dark:text-gray-400">
                        {searchQuery ? 'No tenants match your search' : 'No tenants found'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTenants.map((tenant) => (
                        <TenantCard
                            key={tenant.id}
                            tenant={tenant}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {/* Delete confirmation dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-lg">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="dark:text-gray-100">Delete Tenant</AlertDialogTitle>
                        <AlertDialogDescription className="dark:text-gray-400">
                            Are you sure you want to delete this tenant? This action cannot be undone and will permanently remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={actionInProgress} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={actionInProgress}
                            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-600"
                        >
                            {actionInProgress ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
} 