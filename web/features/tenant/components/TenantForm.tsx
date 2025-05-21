'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/app/providers';
import { createTenant, getTenantById, updateTenant } from '../tenantService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

// Define schema for tenant form
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
    active: z.boolean().optional().default(true)
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
            active: true
        }
    });

    const active = watch('active');

    // Load tenant data if in edit mode
    useEffect(() => {
        if (tenantId && token) {
            setIsEdit(true);
            setInitialLoading(true);

            getTenantById(token, tenantId)
                .then(tenant => {
                    setValue('name', tenant.name, { shouldDirty: false });
                    setValue('subdomain', tenant.subdomain, { shouldDirty: false });
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

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle>{isEdit ? 'Edit Tenant' : 'Create New Tenant'}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Tenant Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            placeholder="Enter tenant name"
                            {...register('name')}
                            disabled={loading}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subdomain">Subdomain <span className="text-red-500">*</span></Label>
                        <Input
                            id="subdomain"
                            placeholder="tenant-subdomain"
                            {...register('subdomain')}
                            disabled={loading || isEdit} // Prevent subdomain editing as it can break routing
                        />
                        {errors.subdomain && (
                            <p className="text-sm text-red-500">{errors.subdomain.message}</p>
                        )}
                        {isEdit && (
                            <p className="text-xs text-amber-600">Subdomain cannot be changed after creation</p>
                        )}
                    </div>

                    {isEdit && (
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="active"
                                checked={active}
                                onCheckedChange={(checked) => setValue('active', checked, { shouldDirty: true })}
                                disabled={loading}
                            />
                            <Label htmlFor="active" className="cursor-pointer">
                                Tenant is {active ? 'active' : 'inactive'}
                            </Label>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading || (isEdit && !isDirty)}
                    >
                        {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Tenant'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
} 