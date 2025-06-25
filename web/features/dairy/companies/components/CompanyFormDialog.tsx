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

const companySchema = z.object({
    name: z.string().min(1, 'Company name is required').max(100, 'Name too long'),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: CompanyFormData) => Promise<void>;
    isLoading?: boolean;
    title: string;
    description: string;
    initialData?: Partial<CompanyFormData>;
}

export function CompanyFormDialog({
    open,
    onOpenChange,
    onSubmit,
    isLoading = false,
    title,
    description,
    initialData
}: CompanyFormDialogProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: '',
            description: '',
            isActive: true,
        },
    });

    const isActive = watch('isActive');

    // Reset form when dialog opens/closes or initialData changes
    useEffect(() => {
        if (open) {
            if (initialData) {
                setValue('name', initialData.name || '');
                setValue('description', initialData.description || '');
                setValue('isActive', initialData.isActive ?? true);
            } else {
                reset({
                    name: '',
                    description: '',
                    isActive: true,
                });
            }
        }
    }, [open, initialData, setValue, reset]);

    const handleFormSubmit = async (data: CompanyFormData) => {
        try {
            await onSubmit(data);
        } catch (error) {
            // Error handling is done by parent component
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
                            {isLoading ? 'Saving...' : initialData ? 'Update Company' : 'Create Company'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 