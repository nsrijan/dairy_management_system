'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompanyResponse } from '../../../types';
import { useEffect } from 'react';

const formSchema = z.object({
    name: z.string().min(2, 'Company name must be at least 2 characters').max(100, 'Company name cannot exceed 100 characters'),
    description: z.string().optional(),
    isActive: z.boolean(),
});

interface CompanyFormProps {
    company?: CompanyResponse | null;
    onSubmit: (data: z.infer<typeof formSchema>) => Promise<void>;
    onCancel: () => void;
}

export function CompanyForm({ company, onSubmit, onCancel }: CompanyFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            isActive: true,
        },
    });

    useEffect(() => {
        if (company) {
            form.reset({
                name: company.name,
                description: company.description || '',
                isActive: company.isActive,
            });
        }
    }, [company, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg min-w-[500px]">
                <div className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    {company ? 'Edit Company' : 'Add New Company'}
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-200">Company Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter company name" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-200">Description</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter company description" className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                            </FormControl>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-700 dark:text-gray-200">Status</FormLabel>
                            <Select
                                onValueChange={(value) => field.onChange(value === 'true')}
                                defaultValue={field.value ? 'true' : 'false'}
                            >
                                <FormControl>
                                    <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white dark:bg-gray-700">
                                    <SelectItem value="true">Active</SelectItem>
                                    <SelectItem value="false">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-red-500" />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="bg-white hover:bg-gray-100 text-gray-700 border-gray-300"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {company ? 'Update' : 'Create'} Company
                    </Button>
                </div>
            </form>
        </Form>
    );
} 