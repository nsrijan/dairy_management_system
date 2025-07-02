'use client';

import { AlertTriangle } from 'lucide-react';
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

interface DeleteCompanyDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => Promise<void>;
    companyName: string;
    isLoading?: boolean;
}

export function DeleteCompanyDialog({
    open,
    onOpenChange,
    onConfirm,
    companyName,
    isLoading = false,
}: DeleteCompanyDialogProps) {
    const handleConfirm = async () => {
        try {
            await onConfirm();
        } catch (error) {
            // Error handling is done by parent component
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <AlertDialogTitle>Delete Company</AlertDialogTitle>
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogDescription className="text-base">
                    Are you sure you want to delete <span className="font-semibold">"{companyName}"</span>?
                    This action cannot be undone and will permanently remove the company and all associated data.
                </AlertDialogDescription>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                        {isLoading ? 'Deleting...' : 'Delete Company'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 