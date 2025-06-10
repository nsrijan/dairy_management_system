'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/app/providers';
import { createTenant, getTenantById, updateTenant } from '../services/tenantService';
import { ModuleType } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save } from 'lucide-react';

// Define schema for tenant form with explicit moduleType type
const tenantSchema = z.object({
    name: z
        .string()
        .min(3, 'Name must be at least 3 characters')
        .max(100, 'Name cannot exceed 100 characters'),
    subdomain: z
        .string()
        .min(3, 'Subdomain must be at least 3 characters')
        .max(63, 'Subdomain cannot exceed 63 characters')
        .regex(/^[a-z0-9]([a-z0-9-]+[a-z0-9])?$/, 'Subdomain must contain only lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen'),
    moduleType: z.nativeEnum(ModuleType),
    active: z.boolean(),
    currency: z.string().min(1, 'Currency is required'),
    timezone: z.string().min(1, 'Timezone is required')
});

type TenantFormData = z.infer<typeof tenantSchema>;

interface TenantFormProps {
    tenantId?: string; // Optional tenant ID for edit mode
    onSuccess?: () => void; // Optional callback for after successful submission
}

export default function TenantForm({ tenantId, onSuccess }: TenantFormProps) {
    const { token } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isDirty }
    } = useForm<TenantFormData>({
        resolver: zodResolver(tenantSchema),
        defaultValues: {
            name: '',
            subdomain: '',
            moduleType: ModuleType.DAIRY,
            active: true,
            currency: 'INR',
            timezone: 'Asia/Kolkata'
        }
    });

    const active = watch('active');
    const selectedModule = watch('moduleType');
    const selectedCurrency = watch('currency');
    const selectedTimezone = watch('timezone');

    // Load tenant data if in edit mode
    useEffect(() => {
        if (tenantId && token) {
            setIsEdit(true);
            setInitialLoading(true);

            getTenantById(token, tenantId)
                .then(tenant => {
                    setValue('name', tenant.name, { shouldDirty: false });
                    setValue('subdomain', tenant.subdomain, { shouldDirty: false });
                    setValue('moduleType', tenant.moduleType, { shouldDirty: false });
                    setValue('active', tenant.active, { shouldDirty: false });
                    setValue('currency', tenant.currency, { shouldDirty: false });
                    setValue('timezone', tenant.timezone, { shouldDirty: false });
                })
                .catch(err => {
                    setError(err.message || 'Failed to load tenant data');
                    console.error('Error loading tenant:', err);
                })
                .finally(() => {
                    setInitialLoading(false);
                });
        }
    }, [tenantId, token, setValue]);

    // Auto-select currency and timezone based on module type
    useEffect(() => {
        if (!isEdit) {
            if (selectedModule === ModuleType.DAIRY) {
                setValue('currency', 'INR', { shouldDirty: true });
                setValue('timezone', 'Asia/Kolkata', { shouldDirty: true });
            } else if (selectedModule === ModuleType.POTTERY) {
                setValue('currency', 'USD', { shouldDirty: true });
                setValue('timezone', 'America/New_York', { shouldDirty: true });
            } else if (selectedModule === ModuleType.GARMENTS) {
                setValue('currency', 'NPR', { shouldDirty: true });
                setValue('timezone', 'Asia/Kathmandu', { shouldDirty: true });
            }
        }
    }, [selectedModule, isEdit, setValue]);

    const onSubmit = async (data: TenantFormData) => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            if (isEdit && tenantId) {
                await updateTenant(token, tenantId, data);
            } else {
                await createTenant(token, data);
            }

            if (onSuccess) {
                onSuccess();
            } else {
                // Navigate back to tenant list
                router.push('/admin/tenants');
                router.refresh();
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save tenant');
            console.error('Error saving tenant:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (initialLoading) {
        return (
            <div className="flex justify-center items-center p-8 h-64">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 mb-3"></div>
                    <div className="text-gray-500 dark:text-gray-400">Loading tenant data...</div>
                </div>
            </div>
        );
    }

    const getModuleIcon = (type: ModuleType) => {
        switch (type) {
            case ModuleType.DAIRY:
                return <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mr-2" />;
            case ModuleType.POTTERY:
                return <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mr-2" />;
            case ModuleType.GARMENTS:
                return <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 mr-2" />;
            default:
                return null;
        }
    };

    return (
        <Card className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md overflow-hidden bg-white dark:bg-gray-800">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/80 border-b border-gray-200 dark:border-gray-700 pt-5 pb-4 px-6">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">{isEdit ? 'Edit Tenant' : 'Create New Tenant'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <CardContent className="space-y-5 p-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4 rounded-lg border border-red-200 dark:border-red-800 shadow-sm">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Enter tenant name"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subdomain">Subdomain</Label>
                        <Input
                            id="subdomain"
                            {...register('subdomain')}
                            placeholder="Enter subdomain"
                            className={errors.subdomain ? 'border-red-500' : ''}
                        />
                        {errors.subdomain && (
                            <p className="text-sm text-red-500">{errors.subdomain.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Module Type</Label>
                        <Select
                            value={selectedModule}
                            onValueChange={(value) => setValue('moduleType', value as ModuleType)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select module type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(ModuleType).map((type) => (
                                    <SelectItem key={type} value={type} className="flex items-center">
                                        <div className="flex items-center">
                                            {getModuleIcon(type)}
                                            {type}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Currency</Label>
                        <Select
                            value={selectedCurrency}
                            onValueChange={(value) => setValue('currency', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                                <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                <SelectItem value="NPR">Nepalese Rupee (NPR)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Timezone</Label>
                        <Select
                            value={selectedTimezone}
                            onValueChange={(value) => setValue('timezone', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Asia/Kolkata">India (Asia/Kolkata)</SelectItem>
                                <SelectItem value="America/New_York">US Eastern (America/New_York)</SelectItem>
                                <SelectItem value="Asia/Kathmandu">Nepal (Asia/Kathmandu)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active"
                            checked={active}
                            onCheckedChange={(checked) => setValue('active', checked)}
                        />
                        <Label htmlFor="active">Active</Label>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="flex items-center"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || !isDirty}
                        className="flex items-center"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
} 