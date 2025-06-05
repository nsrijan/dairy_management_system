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
import { createTenant, createTenantAdmin } from '../../services/tenantService';
import { createCompany } from '../../services/companyService';
import { useToast } from '@/components/ui/use-toast';
import { ModuleType } from '../../types';

type OnboardingStep = 'basic-info' | 'modules' | 'company' | 'admin-user';

interface TenantOnboardingDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TenantOnboardingDialog({ isOpen, onClose }: TenantOnboardingDialogProps) {
    const { token } = useAuth();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState<OnboardingStep>('basic-info');
    const [formData, setFormData] = useState({
        // Basic Info
        tenantName: '',
        domainSlug: '',
        currency: 'USD',
        timezone: 'UTC',
        // Modules
        selectedModules: [] as ModuleType[],
        // Company
        company: {
            name: '',
            description: '',
            address: '',
            phone: '',
            email: '',
        },
        // Admin User
        adminUser: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
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
                        description: "You must be logged in to create a tenant",
                        variant: "destructive"
                    });
                    return;
                }

                setIsSubmitting(true);

                // 1. Create Tenant
                const tenant = await createTenant(token, {
                    name: formData.tenantName,
                    slug: formData.domainSlug,
                    currency: formData.currency,
                    timezone: formData.timezone,
                    moduleType: formData.selectedModules[0] || ModuleType.DAIRY,
                    isActive: true
                });

                // 2. Create Company
                const company = await createCompany(token, tenant.id, {
                    name: formData.company.name,
                    description: formData.company.description,
                    isActive: true
                });

                // 3. Create Admin User
                await createTenantAdmin(token, tenant.id, {
                    firstName: formData.adminUser.firstName,
                    lastName: formData.adminUser.lastName,
                    email: formData.adminUser.email,
                    password: formData.adminUser.password,
                    username: formData.adminUser.email
                });

                toast({
                    title: "Success",
                    description: "Tenant setup completed successfully",
                    variant: "default"
                });

                onClose();
            } catch (error: any) {
                console.error('Error during tenant setup:', error);
                toast({
                    title: "Error",
                    description: error.message || "Failed to complete tenant setup",
                    variant: "destructive"
                });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const updateBasicInfo = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateModules = (moduleId: ModuleType) => {
        setFormData(prev => ({
            ...prev,
            selectedModules: prev.selectedModules.includes(moduleId)
                ? prev.selectedModules.filter(id => id !== moduleId)
                : [...prev.selectedModules, moduleId],
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

                <Tabs value={currentStep} className="w-full flex flex-col flex-1 min-h-0">
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
                                    'cursor-default select-none'
                                )}
                                disabled
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

                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-900">Currency</label>
                                                <select
                                                    value={formData.currency}
                                                    onChange={(e) => updateBasicInfo('currency', e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                >
                                                    <option value="USD">USD - US Dollar</option>
                                                    <option value="EUR">EUR - Euro</option>
                                                    <option value="GBP">GBP - British Pound</option>
                                                    <option value="JPY">JPY - Japanese Yen</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-gray-900">Timezone</label>
                                                <select
                                                    value={formData.timezone}
                                                    onChange={(e) => updateBasicInfo('timezone', e.target.value)}
                                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                >
                                                    <option value="UTC">UTC</option>
                                                    <option value="America/New_York">America/New_York</option>
                                                    <option value="Europe/London">Europe/London</option>
                                                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                                                </select>
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
                            disabled={currentStepIndex === 1 || isSubmitting}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleNextStep}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            {isSubmitting ? (
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