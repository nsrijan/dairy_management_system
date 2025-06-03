'use client';

import { FC, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModuleCard } from './ModuleCard';
import { ModuleFormDialog } from './ModuleFormDialog';
import { moduleService } from '../services/moduleService';
import { Module, ModuleFormData } from '../types';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Dummy data for modules
const DUMMY_MODULES = [
    {
        id: 1,
        icon: '📦',
        name: 'Dairy Management',
        category: 'dairy',
        description: 'Complete dairy farm and milk processing management system',
        features: [
            { name: 'Milk Collection' },
            { name: 'Farmer Management' },
            { name: 'Production Planning' },
            { name: '1', isMore: true }
        ],
        isActive: true,
        createdDate: '6/2/2025'
    },
    {
        id: 2,
        icon: '🏺',
        name: 'Pottery & Ceramics',
        category: 'pottery',
        description: 'Pottery production and craft management system',
        features: [
            { name: 'Product Design' },
            { name: 'Kiln Management' },
            { name: 'Inventory Control' },
            { name: '1', isMore: true }
        ],
        isActive: true,
        createdDate: '6/2/2025'
    },
    {
        id: 3,
        icon: '👕',
        name: 'Garment Manufacturing',
        category: 'garments',
        description: 'Textile and garment production management',
        features: [
            { name: 'Design Management' },
            { name: 'Production Planning' },
            { name: 'Quality Assurance' },
            { name: '1', isMore: true }
        ],
        isActive: true,
        createdDate: '6/2/2025'
    },
    {
        id: 4,
        icon: '🚛',
        name: 'Transport & Logistics',
        category: 'transport',
        description: 'Bus and transport fleet management system',
        features: [
            { name: 'Fleet Management' },
            { name: 'Route Planning' },
            { name: 'Driver Management' },
            { name: '1', isMore: true }
        ],
        isActive: false,
        createdDate: '6/2/2025'
    }
];

export interface ModuleManagementProps {
    token: string;
}

export const ModuleManagement: FC<ModuleManagementProps> = ({ token }) => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [formOpen, setFormOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
    const { toast } = useToast();

    const fetchModules = async () => {
        try {
            const response = await moduleService.getAllModules(token);
            setModules(response.content || []);
        } catch (error) {
            console.error('Error fetching modules:', error);
            setModules([]);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch modules"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchModules();
    }, []);

    const handleCreateModule = () => {
        setFormMode('create');
        setSelectedModule(null);
        setFormOpen(true);
    };

    const handleEditModule = (module: Module) => {
        setSelectedModule(module);
        setFormMode('edit');
        setFormOpen(true);
    };

    const handleDeleteModule = (id: number) => {
        const module = modules.find(m => m.id === id);
        if (module) {
            setSelectedModule(module);
            setDeleteDialogOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!selectedModule) return;

        try {
            await moduleService.deleteModule(token, selectedModule.id);
            setModules(modules.filter(m => m.id !== selectedModule.id));
            toast({
                title: "Success",
                description: "Module deleted successfully"
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete module"
            });
        } finally {
            setDeleteDialogOpen(false);
            setSelectedModule(null);
        }
    };

    const handleToggleStatus = async (id: number, active: boolean) => {
        try {
            const updatedModule = await moduleService.updateModule(token, id, { active });
            setModules(modules.map(m => m.id === id ? updatedModule : m));
            toast({
                title: "Success",
                description: `Module ${active ? 'activated' : 'deactivated'} successfully`
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update module status"
            });
        }
    };

    const handleFormSuccess = async (data: ModuleFormData) => {
        try {
            // Ensure features array is initialized
            const moduleData = {
                ...data,
                features: data.features || []
            };

            if (formMode === 'create') {
                const newModule = await moduleService.createModule(token, moduleData);
                setModules([...modules, newModule]);
                toast({
                    title: "Success",
                    description: "Module created successfully"
                });
            } else if (selectedModule) {
                const updatedModule = await moduleService.updateModule(token, selectedModule.id, moduleData);
                setModules(modules.map(m => m.id === selectedModule.id ? updatedModule : m));
                toast({
                    title: "Success",
                    description: "Module updated successfully"
                });
            }
            setFormOpen(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: formMode === 'create' ? 'Failed to create module' : 'Failed to update module'
            });
        }
    };

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Module Management</h1>
                    <p className="text-gray-500">Manage business modules available for tenant onboarding.</p>
                </div>
                <Button
                    onClick={handleCreateModule}
                    className="bg-purple-500 hover:bg-purple-600 text-white gap-2"
                >
                    <span>+</span>
                    Create Module
                </Button>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {modules.map((module) => (
                    <ModuleCard
                        key={module.id}
                        module={module}
                        onEdit={handleEditModule}
                        onDelete={handleDeleteModule}
                        onToggleStatus={handleToggleStatus}
                    />
                ))}
                {modules.length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                        No modules found
                    </div>
                )}
            </div>

            <ModuleFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSuccess={handleFormSuccess}
                module={selectedModule ?? undefined}
                mode={formMode}
                token={token}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the module &quot;{selectedModule?.name}&quot;.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}; 