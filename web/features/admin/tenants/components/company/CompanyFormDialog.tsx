'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Company } from '../../services/companyService';
import { Building2 } from 'lucide-react';

const companySchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    registrationNumber: z.string().min(1, 'Registration number is required'),
    address: z.string().min(1, 'Address is required'),
    active: z.boolean().default(true),
});

type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyFormDialogProps {
    onSubmit: (data: CompanyFormData) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export function CompanyFormDialog({ onSubmit, isLoading, error }: CompanyFormDialogProps) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CompanyFormData>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            active: true,
        },
    });

    const handleFormSubmit = async (data: CompanyFormData) => {
        try {
            await onSubmit(data);
            setOpen(false);
            reset();
        } catch (error) {
            // Error is handled by the parent component
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Add Company
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Company</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Company Name</Label>
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Enter company name"
                            className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input
                            id="registrationNumber"
                            {...register('registrationNumber')}
                            placeholder="Enter registration number"
                            className={errors.registrationNumber ? 'border-red-500' : ''}
                        />
                        {errors.registrationNumber && (
                            <p className="text-sm text-red-500">{errors.registrationNumber.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            {...register('address')}
                            placeholder="Enter company address"
                            className={errors.address ? 'border-red-500' : ''}
                        />
                        {errors.address && (
                            <p className="text-sm text-red-500">{errors.address.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Company'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 