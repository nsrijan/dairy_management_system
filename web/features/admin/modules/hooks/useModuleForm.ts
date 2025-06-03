import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
            active: true,
            features: [{ name: '' }]
        }
    });

    const { register, handleSubmit, reset, control, watch, setValue, formState: { isSubmitting } } = form;

    const { fields, append } = useFieldArray({
        control,
        name: "features"
    });

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
            reset({
                id: module.id,
                name: module.name,
                code: module.code,
                description: module.description,
                active: module.active,
                features: module.features.map(f => ({ name: f.name }))
            });
        }
    }, [module, mode, reset]);

    const onSubmit = async (data: ModuleFormData) => {
        try {
            if (mode === 'create') {
                await moduleService.createModule(token, data);
                toast({
                    title: "Success",
                    description: "Module created successfully"
                });
            } else {
                await moduleService.updateModule(token, data);
                toast({
                    title: "Success",
                    description: "Module updated successfully"
                });
            }
            onSuccess(data);
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
        fields,
        append,
        isSubmitting,
        register,
        onSubmit: handleSubmit(onSubmit),
        watch,
        setValue
    };
}; 