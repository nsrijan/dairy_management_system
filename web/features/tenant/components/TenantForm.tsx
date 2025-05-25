'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/app/providers';
import { createTenant, getTenantById, updateTenant } from '../tenantService';
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

                    // Set default values for new fields based on module type
                    if (tenant.moduleType === ModuleType.DAIRY) {
                        setValue('currency', 'INR', { shouldDirty: false });
                        setValue('timezone', 'Asia/Kolkata', { shouldDirty: false });
                    } else if (tenant.moduleType === ModuleType.POTTERY) {
                        setValue('currency', 'USD', { shouldDirty: false });
                        setValue('timezone', 'America/New_York', { shouldDirty: false });
                    } else {
                        setValue('currency', 'NPR', { shouldDirty: false });
                        setValue('timezone', 'Asia/Kathmandu', { shouldDirty: false });
                    }
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
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tenant Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter tenant name"
                            {...register('name')}
                            disabled={loading}
                            className="h-10 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subdomain" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Subdomain <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="subdomain"
                            placeholder="tenant-subdomain"
                            {...register('subdomain')}
                            disabled={loading || isEdit}
                            className="h-10 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-gray-300 dark:focus-visible:ring-gray-600"
                        />
                        {errors.subdomain && (
                            <p className="text-xs text-red-500 mt-1">{errors.subdomain.message}</p>
                        )}
                        {isEdit && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Subdomain cannot be changed after creation</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="moduleType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Business Module <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            onValueChange={(value) => setValue('moduleType', value as ModuleType, { shouldDirty: true })}
                            defaultValue={selectedModule}
                            disabled={loading}
                        >
                            <SelectTrigger className="h-10 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
                                {selectedModule && (
                                    <div className="flex items-center">
                                        {getModuleIcon(selectedModule)}
                                        <SelectValue placeholder="Select business module" />
                                    </div>
                                )}
                                {!selectedModule && (
                                    <SelectValue placeholder="Select business module" />
                                )}
                            </SelectTrigger>
                            <SelectContent className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md dark:bg-gray-800">
                                <SelectItem value={ModuleType.DAIRY} className="flex items-center">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 mr-2" />
                                        Dairy Management
                                    </div>
                                </SelectItem>
                                <SelectItem value={ModuleType.POTTERY}>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mr-2" />
                                        Pottery Management
                                    </div>
                                </SelectItem>
                                <SelectItem value={ModuleType.GARMENTS}>
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 mr-2" />
                                        Garments Management
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.moduleType && (
                            <p className="text-xs text-red-500 mt-1">{errors.moduleType.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="currency" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Currency <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('currency', value, { shouldDirty: true })}
                                value={selectedCurrency}
                                disabled={loading}
                            >
                                <SelectTrigger className="h-10 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                                <SelectContent className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md dark:bg-gray-800">
                                    <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                                    <SelectItem value="USD">US Dollar ($)</SelectItem>
                                    <SelectItem value="NPR">Nepalese Rupee (रू)</SelectItem>
                                    <SelectItem value="EUR">Euro (€)</SelectItem>
                                    <SelectItem value="GBP">British Pound (£)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.currency && (
                                <p className="text-xs text-red-500 mt-1">{errors.currency.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="timezone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Timezone <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                onValueChange={(value) => setValue('timezone', value, { shouldDirty: true })}
                                value={selectedTimezone}
                                disabled={loading}
                            >
                                <SelectTrigger className="h-10 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
                                    <SelectValue placeholder="Select timezone" />
                                </SelectTrigger>
                                <SelectContent className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md dark:bg-gray-800">
                                    <SelectItem value="Asia/Kolkata">India (UTC+5:30)</SelectItem>
                                    <SelectItem value="Asia/Kathmandu">Nepal (UTC+5:45)</SelectItem>
                                    <SelectItem value="America/New_York">Eastern US (UTC-5/4)</SelectItem>
                                    <SelectItem value="Europe/London">UK (UTC+0/1)</SelectItem>
                                    <SelectItem value="Asia/Singapore">Singapore (UTC+8)</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.timezone && (
                                <p className="text-xs text-red-500 mt-1">{errors.timezone.message}</p>
                            )}
                        </div>
                    </div>

                    {isEdit && (
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                id="active"
                                checked={active}
                                onCheckedChange={(checked) => setValue('active', checked, { shouldDirty: true })}
                                disabled={loading}
                                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-green-400 data-[state=checked]:to-green-500"
                            />
                            <Label htmlFor="active" className="cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                                Tenant is {active ? 'active' : 'inactive'}
                            </Label>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="h-10 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || (isEdit && !isDirty)}
                        className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {isEdit ? 'Save Changes' : 'Create Tenant'}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
} 