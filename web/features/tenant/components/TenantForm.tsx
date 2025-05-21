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
    active: z.boolean()
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
            active: true
        }
    });

    const active = watch('active');
    const selectedModule = watch('moduleType');

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
        return <div className="flex justify-center p-8">Loading tenant data...</div>;
    }

    const getModuleIcon = (type: ModuleType) => {
        switch (type) {
            case ModuleType.DAIRY:
                return <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />;
            case ModuleType.POTTERY:
                return <div className="w-3 h-3 rounded-full bg-amber-500 mr-2" />;
            case ModuleType.GARMENTS:
                return <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />;
            default:
                return null;
        }
    };

    return (
        <Card className="bg-white border rounded-md shadow-none overflow-hidden max-w-md mx-auto">
            <CardHeader className="pb-4 border-b pt-4 px-6">
                <CardTitle className="text-lg font-semibold">{isEdit ? 'Edit Tenant' : 'Create New Tenant'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit as any)}>
                <CardContent className="space-y-4 p-6">
                    {error && (
                        <Alert variant="destructive" className="mb-4 border border-red-200">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Tenant Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="name"
                            placeholder="Enter tenant name"
                            {...register('name')}
                            disabled={loading}
                            className="h-9 border rounded-md w-full"
                        />
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subdomain" className="text-sm font-medium text-gray-700">
                            Subdomain <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="subdomain"
                            placeholder="tenant-subdomain"
                            {...register('subdomain')}
                            disabled={loading || isEdit}
                            className="h-9 border rounded-md w-full"
                        />
                        {errors.subdomain && (
                            <p className="text-xs text-red-500 mt-1">{errors.subdomain.message}</p>
                        )}
                        {isEdit && (
                            <p className="text-xs text-amber-600 mt-1">Subdomain cannot be changed after creation</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="moduleType" className="text-sm font-medium text-gray-700">
                            Business Module <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            onValueChange={(value) => setValue('moduleType', value as ModuleType, { shouldDirty: true })}
                            defaultValue={selectedModule}
                            disabled={loading}
                        >
                            <SelectTrigger className="h-9 border rounded-md w-full bg-white">
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
                            <SelectContent>
                                <SelectItem value={ModuleType.DAIRY} className="flex items-center">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                                        Dairy Management
                                    </div>
                                </SelectItem>
                                <SelectItem value={ModuleType.POTTERY}>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
                                        Pottery Management
                                    </div>
                                </SelectItem>
                                <SelectItem value={ModuleType.GARMENTS}>
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full bg-purple-500 mr-2" />
                                        Garments Management
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.moduleType && (
                            <p className="text-xs text-red-500 mt-1">{errors.moduleType.message}</p>
                        )}
                    </div>

                    {isEdit && (
                        <div className="flex items-center space-x-2 pt-2">
                            <Switch
                                id="active"
                                checked={active}
                                onCheckedChange={(checked) => setValue('active', checked, { shouldDirty: true })}
                                disabled={loading}
                                className="data-[state=checked]:bg-green-500"
                            />
                            <Label htmlFor="active" className="cursor-pointer text-sm text-gray-700">
                                Tenant is {active ? 'active' : 'inactive'}
                            </Label>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between pt-4 border-t px-6 py-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="h-9 border rounded-md"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || (isEdit && !isDirty)}
                        className="h-9 bg-primary hover:bg-primary/90"
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