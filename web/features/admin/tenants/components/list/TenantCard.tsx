'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TenantResponse } from '../../types';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useDeleteTenant } from '../../hooks/useTenantQueries';
import { useAuth } from '@/app/providers';
import { useToast } from '@/components/ui/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TenantOnboardingDialog } from '../onboarding/TenantOnboardingDialog';

interface TenantCardProps {
    tenant: TenantResponse;
}

const TenantCard = ({ tenant }: TenantCardProps) => {
    const router = useRouter();
    const { token } = useAuth();
    const { toast } = useToast();
    const deleteMutation = useDeleteTenant(token!);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

    const statusColors = {
        active: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-400'
    };

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync(tenant.id);
            toast({
                title: "Success",
                description: "Tenant deleted successfully",
            });
            setIsDeleteDialogOpen(false);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete tenant",
                variant: "destructive"
            });
        }
    };

    return (
        <>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 shadow-lg rounded-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            <Link href={`/admin/tenants/${tenant.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                {tenant.name}
                            </Link>
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tenant.subdomain}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tenant.active ? statusColors.active : statusColors.inactive}`}>
                        {tenant.active ? 'Active' : 'Inactive'}
                    </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Module Type</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{tenant.moduleType}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Created</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{new Date(tenant.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-primary hover:text-primary/80 hover:bg-primary/10"
                            onClick={() => setIsEditDialogOpen(true)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the tenant
                                        and all associated data.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <Link
                        href={`/admin/tenants/${tenant.id}`}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium transition-colors flex items-center gap-1"
                    >
                        View Details <span className="text-lg leading-none">→</span>
                    </Link>
                </div>
            </div>

            <TenantOnboardingDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                initialData={{
                    id: tenant.id,
                    companyId: tenant.companyId,
                    adminId: tenant.adminId,
                    tenant: {
                        name: tenant.name,
                        slug: tenant.subdomain,
                        moduleType: tenant.moduleType,
                    },
                    company: {
                        name: tenant.company?.name || '', // Use actual company name if available
                        description: tenant.company?.description || '', // Use actual company description if available
                    },
                    admin: {
                        firstName: tenant.admin?.firstName || '',
                        lastName: tenant.admin?.lastName || '',
                        email: tenant.admin?.email || '',
                        username: tenant.admin?.username || '',
                        // Password field should typically be empty for edit forms for security reasons.
                        // The dialog's initialData.admin.password is optional.
                        password: '',
                    },
                }}
            />
        </>
    );
};

export default TenantCard; 