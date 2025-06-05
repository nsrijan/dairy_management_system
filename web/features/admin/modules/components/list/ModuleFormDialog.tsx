'use client';

import { FC } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Module, ModuleFormData } from '@/features/admin/modules/types';
import { X } from 'lucide-react';
import { useModuleForm } from '@/features/admin/modules/hooks/useModuleForm';
import { toast } from '@/components/ui/use-toast';
import { moduleService } from '@/features/admin/modules/services/moduleService';
import { Switch } from '@/components/ui/switch';

interface ModuleFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSuccess: (data: ModuleFormData) => void;
    module?: Module;
    mode: 'create' | 'edit';
    token: string;
}

export const ModuleFormDialog: FC<ModuleFormDialogProps> = ({
    open,
    onClose,
    onSuccess,
    module,
    mode,
    token
}) => {
    const {
        form,
        isSubmitting,
        register,
        watch,
        setValue
    } = useModuleForm({
        module,
        mode,
        onSuccess,
        onClose,
        token
    });

    const handleSubmit = async (data: ModuleFormData) => {
        try {
            const cleanedData = moduleService.cleanModuleData(data);

            // Only set default ALL feature for new modules
            if (mode === 'create') {
                cleanedData.features = [{ name: 'ALL', code: 'ALL' }];
            }

            await onSuccess(cleanedData);
            onClose();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to submit form"
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-white p-0">
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {mode === 'create' ? 'Create New Module' : 'Edit Module'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {mode === 'create'
                                    ? 'Fill in the details for the new business module.'
                                    : 'Update the module details.'}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-md p-1 hover:bg-gray-100"
                        >
                            <X className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    <form id="module-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                        <div className="space-y-5">
                            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
                                <label htmlFor="name" className="text-sm font-medium text-right text-gray-700">
                                    Name
                                </label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Dairy Management"
                                    {...register('name', { required: true })}
                                    className="border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                                />
                            </div>

                            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
                                <label htmlFor="slug" className="text-sm font-medium text-right text-gray-700">
                                    Slug
                                </label>
                                <Input
                                    id="slug"
                                    value={watch('code')}
                                    readOnly
                                    className="bg-gray-50 border-gray-300"
                                />
                            </div>

                            <div className="grid grid-cols-[100px_1fr] items-start gap-3">
                                <label htmlFor="description" className="text-sm font-medium text-right text-gray-700 pt-2">
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of the module"
                                    {...register('description', { required: true })}
                                    className="min-h-[80px] border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                                />
                            </div>

                            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
                                <label htmlFor="icon" className="text-sm font-medium text-right text-gray-700">
                                    Icon
                                </label>
                                <Select
                                    value={watch('icon')}
                                    onValueChange={(value) => setValue('icon', value)}
                                >
                                    <SelectTrigger className="border-gray-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-400">
                                        <SelectValue placeholder="Select an icon" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="building">Building</SelectItem>
                                        <SelectItem value="office">Office</SelectItem>
                                        <SelectItem value="home">Home</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-[100px_1fr] items-center gap-3">
                                <label htmlFor="active" className="text-sm font-medium text-right text-gray-700">
                                    Status
                                </label>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="active"
                                        checked={watch('active')}
                                        onCheckedChange={(checked) => setValue('active', checked)}
                                    />
                                    <label htmlFor="active" className="text-sm text-gray-600">
                                        {watch('active') ? 'Active' : 'Inactive'}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                                disabled={isSubmitting}
                            >
                                {mode === 'create' ? 'Create Module' : 'Update Module'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 