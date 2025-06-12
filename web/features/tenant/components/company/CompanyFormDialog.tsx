'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateCompany, useUpdateCompany } from '@/features/tenant/hooks/useCompanies';

const companySchema = z.object({
    name: z.string().min(1, 'Company name is required').max(100, 'Name too long'),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: 'create' | 'edit';
    company?: any;
}

export function CompanyFormDialog({ open, onOpenChange, mode, company }: CompanyFormDialogProps) {
    const createCompany = useCreateCompany();
    const updateCompany = useUpdateCompany();

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema) as any,
        defaultValues: {
            name: '',
            description: '',
            isActive: true,
        },
    });

    const isActive = watch('isActive');

    // Reset form when dialog opens/closes or company changes
    useEffect(() => {
        if (open && mode === 'edit' && company) {
            setValue('name', company.name);
            setValue('description', company.description || '');
            setValue('isActive', company.isActive);
        } else if (open && mode === 'create') {
            reset({
                name: '',
                description: '',
                isActive: true,
            });
        }
    }, [open, mode, company, setValue, reset]);

    const onSubmit = async (data: CompanyFormData) => {
        try {
            if (mode === 'create') {
                await createCompany.mutateAsync(data);
            } else {
                await updateCompany.mutateAsync({ id: company.id, data });
            }
            onOpenChange(false);
            reset();
        } catch (error) {
            // Error is handled by the mutation
        }
    };

    const isLoading = createCompany.isPending || updateCompany.isPending;
    const error = createCompany.error || updateCompany.error;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Add New Company' : 'Edit Company'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Create a new company for your organization.'
                            : 'Update the company information.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {error.message || 'An error occurred. Please try again.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Company Name *</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Enter company name"
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register('description')}
                            placeholder="Enter company description (optional)"
                            disabled={isLoading}
                            rows={3}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-600 dark:text-red-400">
                                {errors.description.message}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="isActive"
                            checked={isActive}
                            onCheckedChange={(checked) => setValue('isActive', checked)}
                            disabled={isLoading}
                        />
                        <Label htmlFor="isActive" className="text-sm font-medium">
                            Active Company
                        </Label>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : mode === 'create' ? 'Create Company' : 'Update Company'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 