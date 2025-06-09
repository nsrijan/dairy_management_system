'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { CreateTenantAdminRequest, TenantAdminResponse, createTenantAdmin, getTenantAdmins, updateTenantAdminStatus } from '../../services/tenantService';
import AdminFormDialog from './AdminFormDialog';
import AdminList from './AdminList';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AdminManagementProps {
    tenantId: string;
    token: string;
}

export default function AdminManagement({ tenantId, token }: AdminManagementProps) {
    const [admins, setAdmins] = useState<TenantAdminResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    // Load admins on component mount
    const loadAdmins = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getTenantAdmins(token, tenantId);
            setAdmins(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to load administrators';
            setError(message);
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    // Load admins when component mounts
    useEffect(() => {
        loadAdmins();
    }, [tenantId, token]); // Reload when tenantId or token changes

    // Handle admin creation
    const handleCreateAdmin = async (data: CreateTenantAdminRequest) => {
        try {
            setLoading(true);
            await createTenantAdmin(token, tenantId, data);
            toast({
                title: 'Success',
                description: 'Administrator created successfully',
            });
            await loadAdmins(); // Refresh the list
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to create administrator';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            throw error; // Re-throw to be handled by the form
        } finally {
            setLoading(false);
        }
    };

    // Handle status change
    const handleStatusChange = async (adminId: string, isActive: boolean) => {
        try {
            await updateTenantAdminStatus(token, tenantId, adminId, isActive);
            toast({
                title: 'Success',
                description: 'Administrator status updated successfully',
            });
            await loadAdmins(); // Refresh the list
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to update administrator status';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold">Administrator Management</h2>
                <AdminFormDialog
                    onSubmit={handleCreateAdmin}
                    isLoading={loading}
                    error={error}
                />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <AdminList
                admins={admins}
                onStatusChange={handleStatusChange}
                isLoading={loading}
            />
        </div>
    );
} 