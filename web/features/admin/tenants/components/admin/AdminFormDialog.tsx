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
import { CreateTenantAdminRequest } from '../../services/tenantService';
import { UserPlus } from 'lucide-react';

const adminSchema = z.object({
    email: z.string().email('Invalid email address'),
});

interface AdminFormDialogProps {
    onSubmit: (data: CreateTenantAdminRequest) => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export default function AdminFormDialog({ onSubmit, isLoading, error }: AdminFormDialogProps) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTenantAdminRequest>({
        resolver: zodResolver(adminSchema),
    });

    const handleFormSubmit = async (data: CreateTenantAdminRequest) => {
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
                    <UserPlus className="h-4 w-4" />
                    Add Administrator
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Administrator</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="Enter administrator email"
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">{errors.email.message}</p>
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
                            {isLoading ? 'Adding...' : 'Add Administrator'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 