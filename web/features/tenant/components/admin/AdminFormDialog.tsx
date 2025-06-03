'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/modal';
import AdminForm from './AdminForm';
import { CreateTenantAdminRequest } from '../../types';

interface AdminFormDialogProps {
    onSubmit: (data: CreateTenantAdminRequest) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export default function AdminFormDialog({ onSubmit, isLoading, error }: AdminFormDialogProps) {
    const [open, setOpen] = useState(false);

    const handleSubmit = async (data: CreateTenantAdminRequest) => {
        try {
            await onSubmit(data);
            setOpen(false); // Close dialog on successful submission
        } catch (error) {
            // Keep dialog open on error
            throw error;
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add New Administrator
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Add New Administrator</DialogTitle>
                </DialogHeader>
                <AdminForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    error={error}
                />
            </DialogContent>
        </Dialog>
    );
} 