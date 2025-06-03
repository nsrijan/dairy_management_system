import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Module, ModuleFormData } from '../types';
import { moduleService } from '../services/moduleService';
import { useToast } from '@/components/ui/use-toast';

interface UseModuleFormProps {
    token: string;
    module?: Module;
    mode: 'create' | 'edit';
    onSuccess: (data: ModuleFormData) => void;
    onClose: () => void;
}

export const useModuleForm = ({ token, module, mode, onSuccess, onClose }: UseModuleFormProps) => {
    const { toast } = useToast();
    const form = useForm<ModuleFormData>({
        defaultValues: {
            name: '',
            code: '',
            description: '',
            icon: 'building',
            features: [{ id: undefined, name: 'ALL', code: 'ALL' }]
        }
    });

    const { register, handleSubmit, reset, control, watch, setValue, formState: { isSubmitting } } = form;

    // Auto-generate code from name
    const name = watch('name');
    useEffect(() => {
        const code = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        setValue('code', code);
    }, [name, setValue]);

    // Initialize form with module data in edit mode
    useEffect(() => {
        if (module && mode === 'edit') {
            // Preserve the ID of the existing ALL feature if it exists
            const existingAllFeature = module.features.find(f => f.name === 'ALL' && f.code === 'ALL');

            reset({
                id: module.id,
                name: module.name,
                code: module.code,
                description: module.description,
                icon: module.icon,
                features: existingAllFeature
                    ? [existingAllFeature]
                    : [{ id: undefined, name: 'ALL', code: 'ALL' }]
            }, {
                keepDefaultValues: false
            });
        }
    }, [module, mode, reset]);

    const onSubmit = async (data: ModuleFormData) => {
        try {
            // Preserve feature ID if editing
            const existingFeatureId = module?.features.find(f => f.name === 'ALL' && f.code === 'ALL')?.id;

            const submitData = {
                ...data,
                features: [{
                    id: existingFeatureId,
                    name: 'ALL',
                    code: 'ALL',
                    moduleId: module?.id
                }]
            };

            if (mode === 'create') {
                await moduleService.createModule(token, submitData);
                toast({
                    title: "Success",
                    description: "Module created successfully"
                });
            } else if (module?.id) {
                await moduleService.updateModule(token, module.id, submitData);
                toast({
                    title: "Success",
                    description: "Module updated successfully"
                });
            }
            onSuccess(submitData);
            onClose();
            reset();
        } catch (error) {
            console.error('Failed to submit module:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : 'Failed to submit module',
                variant: "destructive"
            });
        }
    };

    return {
        form,
        isSubmitting,
        register,
        onSubmit: handleSubmit(onSubmit),
        watch,
        setValue
    };
}; 