'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Building2, Save, X, CheckCircle, XCircle } from 'lucide-react';
import { useCreateCompany, useUpdateCompany } from '../hooks/useCompanies';
import { Company } from '../types';

const companySchema = z.object({
    name: z.string().min(1, 'Company name is required').max(100, 'Name too long'),
    description: z.string().optional(),
    isActive: z.boolean(),
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
    const form = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: '',
            description: '',
            isActive: true,
        },
    });

    const { handleSubmit, reset, setValue, watch, control } = form;

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
            <DialogContent className="sm:max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl">
                <DialogHeader className="pb-6 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                {title}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600 dark:text-gray-400 mt-1">
                                {description}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 pt-6">
                        {/* Company Name Field */}
                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Name *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter company name"
                                            disabled={isLoading}
                                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description Field */}
                        <FormField
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Enter company description (optional)"
                                            disabled={isLoading}
                                            rows={3}
                                            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 resize-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Active Status Toggle */}
                        <FormField
                            control={control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Company Status</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {field.value ? 'Company is currently active and operational' : 'Company is inactive and won\'t appear in lists'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        disabled={isLoading}
                                                        className="data-[state=checked]:bg-green-500"
                                                    />
                                                    <div className="flex items-center gap-1">
                                                        {field.value ? (
                                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                                        ) : (
                                                            <XCircle className="h-4 w-4 text-gray-400" />
                                                        )}
                                                        <span className={`text-sm font-medium ${field.value
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                            }`}>
                                                            {field.value ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isLoading}
                                className="px-6 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Saving...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        {initialData ? <CheckCircle className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                                        {initialData ? 'Update Company' : 'Create Company'}
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 