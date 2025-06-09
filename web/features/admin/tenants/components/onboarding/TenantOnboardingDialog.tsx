'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModulesStep } from './steps/ModulesStep';
import { CompanyStep } from './steps/CompanyStep';
import { AdminUserStep } from './steps/AdminUserStep';
import { useAuth } from '@/app/providers';
import { useToast } from '@/components/ui/use-toast';
import { ModuleType } from '../../types';
import { useCreateTenant, useUpdateTenant, useUpdateCompany, useUpdateAdmin, useCreateAdmin } from '../../hooks/useTenantQueries';

type OnboardingStep = 'basic-info' | 'modules' | 'company' | 'admin-user';

interface TenantOnboardingDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        id?: string;
        companyId?: string;
        adminId?: string;
        tenant?: {
            name: string;
            slug: string;
            moduleType: ModuleType;
        };
        company?: {
            name: string;
            description: string;
        };
        admin?: {
            firstName: string;
            lastName: string;
            email: string;
            username: string;
            password: string;
        };
    };
}

export function TenantOnboardingDialog({ isOpen, onClose, initialData }: TenantOnboardingDialogProps) {
    const { token } = useAuth();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('basic-info');
    const createTenantMutation = useCreateTenant(token!);
    const updateTenantMutation = useUpdateTenant(token!);
    const updateCompanyMutation = useUpdateCompany(token!, initialData?.id || '');
    const updateAdminMutation = useUpdateAdmin(token!, initialData?.id || '');
    const createAdminMutation = useCreateAdmin(token!, initialData?.id || '');
    const isEditMode = !!initialData?.id;
    const [formData, setFormData] = useState({
        // Basic Info
        tenantName: initialData?.tenant?.name || '',
        domainSlug: initialData?.tenant?.slug || '',
        // Modules
        selectedModules: initialData?.tenant?.moduleType ? [initialData.tenant.moduleType] : [] as ModuleType[],
        // Company
        company: {
            name: initialData?.company?.name || '',
            description: initialData?.company?.description || '',
            address: '',
            phone: '',
            email: '',
        },
        // Admin User
        adminUser: {
            firstName: initialData?.admin?.firstName || '',
            lastName: initialData?.admin?.lastName || '',
            email: initialData?.admin?.email || '',
            username: initialData?.admin?.username || '',
            password: initialData?.admin?.password || '',
            confirmPassword: initialData?.admin?.password || '',
        },
    });

    const steps: OnboardingStep[] = ['basic-info', 'modules', 'company', 'admin-user'];
    const currentStepIndex = steps.indexOf(currentStep) + 1;

    const handleNextStep = async () => {
        const nextIndex = steps.indexOf(currentStep) + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex]);
        } else {
            // Handle form submission
            try {
                if (!token) {
                    toast({
                        title: "Error",
                        description: "You must be logged in to manage tenants",
                        variant: "destructive"
                    });
                    return;
                }

                if (isEditMode && initialData?.id) {
                    // Update existing tenant
                    await updateTenantMutation.mutateAsync({
                        id: initialData.id,
                        tenant: {
                            name: formData.tenantName,
                            subdomain: formData.domainSlug,
                            moduleType: formData.selectedModules[0] || ModuleType.DAIRY,
                            active: true,
                        }
                    });

                    // Update company if it exists
                    if (initialData.companyId) {
                        await updateCompanyMutation.mutateAsync({
                            companyId: initialData.companyId,
                            company: {
                                name: formData.company.name,
                                description: formData.company.description,
                                active: true
                            }
                        });
                    }

                    // Update or create admin
                    if (initialData.adminId) {
                        await updateAdminMutation.mutateAsync({
                            adminId: initialData.adminId,
                            admin: {
                                active: true
                            }
                        });
                    } else if (formData.adminUser.email) {
                        // Create new admin if email is provided
                        await createAdminMutation.mutateAsync({
                            email: formData.adminUser.email,
                            firstName: formData.adminUser.firstName,
                            lastName: formData.adminUser.lastName,
                            password: formData.adminUser.password,
                            username: formData.adminUser.username
                        });
                    }

                    toast({
                        title: "Success",
                        description: "Tenant updated successfully",
                        variant: "default"
                    });
                } else {
                    // Create new tenant
                    await createTenantMutation.mutateAsync({
                        tenant: {
                            name: formData.tenantName,
                            slug: formData.domainSlug,
                            moduleType: formData.selectedModules[0] || ModuleType.DAIRY,
                            isActive: true,
                            currency: 'INR',
                            timezone: 'Asia/Kolkata'
                        },
                        company: {
                            name: formData.company.name,
                            description: formData.company.description,
                            isActive: true
                        },
                        admin: {
                            email: formData.adminUser.email,
                            firstName: formData.adminUser.firstName,
                            lastName: formData.adminUser.lastName,
                            password: formData.adminUser.password,
                            username: formData.adminUser.username
                        }
                    });

                    toast({
                        title: "Success",
                        description: "Tenant setup completed successfully",
                        variant: "default"
                    });
                }

                onClose();
            } catch (error: any) {
                console.error('Error during tenant operation:', error);
                toast({
                    title: "Error",
                    description: error.message || `Failed to ${isEditMode ? 'update' : 'create'} tenant`,
                    variant: "destructive"
                });
            }
        }
    };

    const updateBasicInfo = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateModules = (moduleId: string) => {
        setFormData(prev => ({
            ...prev,
            selectedModules: prev.selectedModules.length === 1 && prev.selectedModules[0] === (moduleId as ModuleType)
                ? []
                : [moduleId as ModuleType],
        }));
    };

    const updateCompanyData = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            company: { ...prev.company, [field]: value },
        }));
    };

    const updateUserData = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            adminUser: { ...prev.adminUser, [field]: value },
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-0 gap-0 shadow-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm flex flex-col">
                <DialogHeader className="px-6 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <DialogTitle className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Tenant Onboarding</DialogTitle>
                            <DialogDescription className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                                Step {currentStepIndex} of 4: Complete tenant setup with all required information.
                            </DialogDescription>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={onClose}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </DialogHeader>

                <Tabs value={currentStep} onValueChange={(value) => setCurrentStep(value as OnboardingStep)} className="w-full flex flex-col flex-1 min-h-0">
                    <TabsList className="w-full flex border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 px-6 flex-shrink-0">
                        {steps.map((step) => (
                            <TabsTrigger
                                key={step}
                                value={step}
                                className={cn(
                                    'flex-1 py-3 px-3 text-sm font-medium border-b-2 rounded-none transition-all duration-200',
                                    currentStep === step
                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600',
                                )}
                            >
                                {step.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex-1 overflow-y-auto">
                        <div className="px-6 py-4 bg-white/50 dark:bg-gray-900/50">
                            {currentStep === 'basic-info' && (
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-base font-medium mb-4">Tenant Information</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-900">
                                                    Tenant Name <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    placeholder="e.g., Acme Dairy Corp"
                                                    value={formData.tenantName}
                                                    onChange={(e) => updateBasicInfo('tenantName', e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-900">
                                                    Domain Slug <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    placeholder="acme-dairy"
                                                    value={formData.domainSlug}
                                                    onChange={(e) => updateBasicInfo('domainSlug', e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                />
                                                <p className="text-sm text-gray-500">
                                                    Will be accessible at: {formData.domainSlug || 'slug'}.dms.com
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 'modules' && (
                                <ModulesStep
                                    selectedModules={formData.selectedModules}
                                    onModuleChange={updateModules}
                                />
                            )}

                            {currentStep === 'company' && (
                                <CompanyStep
                                    companyData={formData.company}
                                    onCompanyDataChange={updateCompanyData}
                                />
                            )}

                            {currentStep === 'admin-user' && (
                                <AdminUserStep
                                    userData={formData.adminUser}
                                    onUserDataChange={updateUserData}
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between px-6 py-3 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 flex-shrink-0">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                const prevIndex = steps.indexOf(currentStep) - 1;
                                if (prevIndex >= 0) {
                                    setCurrentStep(steps[prevIndex]);
                                }
                            }}
                            disabled={currentStepIndex === 1 || createTenantMutation.isPending}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNextStep}
                            disabled={createTenantMutation.isPending}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {createTenantMutation.isPending ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    {currentStepIndex === steps.length ? 'Setting up...' : 'Processing...'}
                                </span>
                            ) : (
                                currentStepIndex === steps.length ? 'Complete Setup' : 'Next Step'
                            )}
                        </Button>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
} 