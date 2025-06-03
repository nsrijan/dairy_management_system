'use client';

import { FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Module, ModuleFormData } from '../types';
import { X } from 'lucide-react';
import { useModuleForm } from '../hooks/useModuleForm';

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
        fields,
        append,
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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] bg-white p-0">
                <DialogHeader className="p-5 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <DialogTitle className="text-base font-medium leading-none">
                                {mode === 'create' ? 'Create New Module' : 'Edit Module'}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground mt-1.5">
                                Fill in the details for the business module.
                            </DialogDescription>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-purple-100"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-5">
                    <form id="module-form" onSubmit={form.handleSubmit(onSuccess)} className="space-y-4">
                        <div className="grid gap-3">
                            <div className="grid gap-1.5">
                                <label className="text-sm font-medium">Name</label>
                                <Input
                                    placeholder="e.g., Dairy Management"
                                    {...register('name', { required: true })}
                                    className="h-8 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <label className="text-sm font-medium">Code</label>
                                <Input
                                    placeholder="dairy-management"
                                    {...register('code', { required: true })}
                                    readOnly
                                    className="h-8 bg-gray-50 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <label className="text-sm font-medium">Description</label>
                                <Textarea
                                    placeholder="Brief description of the module"
                                    {...register('description', { required: true })}
                                    className="resize-none min-h-[60px] focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-1.5">
                                <label className="text-sm font-medium">Active</label>
                                <Switch
                                    checked={watch('active')}
                                    onCheckedChange={(checked) => setValue('active', checked)}
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <label className="text-sm font-medium">Features</label>
                                <div className="space-y-1.5">
                                    {fields.map((field, index) => (
                                        <Input
                                            key={field.id}
                                            placeholder="Feature name"
                                            {...register(`features.${index}.name`)}
                                            className="h-8 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                                        />
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => append({ name: '' })}
                                        className="w-full h-8 flex items-center justify-center gap-2 text-sm border border-dashed border-gray-300 rounded-md hover:border-gray-400 text-gray-600 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                                    >
                                        <span>+</span>
                                        Add Feature
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t">
                    <Button
                        type="submit"
                        form="module-form"
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white h-8 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Module' : 'Update Module'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 