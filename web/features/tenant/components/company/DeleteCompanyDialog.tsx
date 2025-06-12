'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDeleteCompany } from '@/features/tenant/hooks/useCompanies';

interface DeleteCompanyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    company?: any;
}

export function DeleteCompanyDialog({ open, onOpenChange, company }: DeleteCompanyDialogProps) {
    const deleteCompany = useDeleteCompany();

    const handleDelete = async () => {
        if (!company) return;

        try {
            await deleteCompany.mutateAsync(company.id);
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Company</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete "{company?.name}"? This action cannot be undone.
                        All data associated with this company will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {deleteCompany.error && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {deleteCompany.error.message || 'Failed to delete company. Please try again.'}
                        </AlertDescription>
                    </Alert>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteCompany.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteCompany.isPending}
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                        {deleteCompany.isPending ? 'Deleting...' : 'Delete Company'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 